'use server'
import { db } from "@/server/db";
import { deckItems } from "@/server/schema";
import { eq, asc, lte, sql, desc} from "drizzle-orm";
import { addDays } from "date-fns";

export async function getDeckItems(deckId: string) {
  return await db.select()
    .from(deckItems)
    .where(eq(deckItems.deckId, deckId))
    .orderBy(asc(deckItems.order));
}

// 2. AKTUALIZACJA KARTY
export async function updateCardAction(id: string | undefined, data: any) {
  if(!id) return { success: false, error: "No ID provided" };

  try {
    const updated = await db
      .update(deckItems)
      .set({
        front: data.front,
        meanings: data.meanings, 
        variations: data.variations,
        partOfSpeech: data.partOfSpeech,
        title: data.title,
        description: data.description,
        dateLabel: data.dateLabel,
      })
      .where(eq(deckItems.id, id))
      .returning();

    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Database Update Error:", error);
    return { success: false, error: "Failed to update card" };
  }
}

// 3. TWORZENIE NOWEJ KARTY (Czysty Draft)
export async function createCardAction(deckId: string) {
  try {
    const [newCard] = await db
      .insert(deckItems)
      .values({
        deckId: deckId,
        front: "New Word",
        
        // Inicjalizujemy puste tablice dla JSONB
        meanings: [{ 
          id: crypto.randomUUID(), 
          back: "", 
          examples: [] 
        }], 
        variations: [],
        partOfSpeech: "noun",
        order: 0,
      })
      .returning();

    return { success: true, data: newCard };
  } catch (error) {
    console.error("Database Insert Error:", error);
    return { success: false, error: "Failed to create new card" };
  }
}


export async function deleteCardAction(id: string | undefined) {
  if (!id) return { success: false, error: "No ID provided" };

  try {
    await db
      .delete(deckItems)
      .where(eq(deckItems.id, id));

    return { success: true };
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { success: false, error: "Failed to delete card" };
  }
}

export async function rateCardAction(cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') {
  try {
    // 1. Pobierz aktualne statystyki karty
    const [card] = await db.select().from(deckItems).where(eq(deckItems.id, cardId));
    if (!card) return { success: false, error: "Card not found" };

    // Mapowanie oceny na wartość liczbową (q) algorytmu SM-2
    // again: 0, hard: 3, good: 4, easy: 5
    const q = { again: 0, hard: 3, good: 4, easy: 5 }[rating];
    
    let { interval, easeFactor, repetitions } = card;
    let newInterval: number;
    let newEaseFactor = easeFactor;
    let newRepetitions = repetitions;

    // 2. Logika SM-2
    if (q < 3) {
      // Jeśli "Again" - resetujemy postęp
      newRepetitions = 0;
      newInterval = 1; // Wraca do nauki na jutro (lub dziś)
    } else {
      // Jeśli odpowiedź poprawna
      if (newRepetitions === 0) {
        newInterval = 1;
      } else if (newRepetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      
      newRepetitions++;
      
      // Obliczanie nowego Ease Factor (współczynnika łatwości)
      newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (newEaseFactor < 1.3) newEaseFactor = 1.3;
    }

    // 3. Oblicz nową datę powtórki
    const newDueDate = addDays(new Date(), newInterval);

    // 4. Zapisz w bazie
    await db.update(deckItems)
      .set({
        interval: newInterval,
        easeFactor: newEaseFactor,
        repetitions: newRepetitions,
        dueDate: newDueDate
      })
      .where(eq(deckItems.id, cardId));

    return { success: true, nextDate: newDueDate };
  } catch (error) {
    console.error("SRS Update Error:", error);
    return { success: false };
  }
}

export async function getUserStatsAction() {
  const now = new Date();

  // 1. DUE TODAY (Karty do powtórki na dziś lub zaległe)
  // Szukamy kart, których dueDate jest równe lub mniejsze od obecnego czasu
  const dueTodayResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(deckItems)
    .where(lte(deckItems.dueDate, now));

  const dueToday = Number(dueTodayResult[0]?.count || 0);

  // 2. RETENTION RATE (Wskaźnik zapamiętywania)
  // Obliczamy to klasycznym dla SRS sposobem:
  // Karty zapamiętane (interval > 0) / Wszystkie przerobione karty (repetitions > 0)
  // Kiedy użytkownik wciska "Again" (zapomniał), interval zazwyczaj wraca do 0.
  const statsResult = await db
    .select({
      totalStudied: sql<number>`sum(case when ${deckItems.repetitions} > 0 then 1 else 0 end)`,
      remembered: sql<number>`sum(case when ${deckItems.repetitions} > 0 and ${deckItems.interval} > 0 then 1 else 0 end)`,
    })
    .from(deckItems);

  const totalStudied = Number(statsResult[0]?.totalStudied || 0);
  const remembered = Number(statsResult[0]?.remembered || 0);
  
  const retentionRate = totalStudied > 0 
    ? Math.round((remembered / totalStudied) * 100) 
    : 0;

  // 3. CURRENT STREAK
  // Na razie zwracamy mockowaną wartość, ponieważ brakuje nam tabeli z historią nauki.
  const currentStreak = 0;

  return {
    dueToday,
    retentionRate,
    currentStreak
  };
}
export async function createStorytelingCardAction(deckId: string) {
  if (!deckId) return { success: false, error: "Brak ID roadmapy" };

  try {
    const lastItem = await db
      .select({ order: deckItems.order })
      .from(deckItems)
      .where(eq(deckItems.deckId, deckId))
      .orderBy(desc(deckItems.order))
      .limit(1);

    const nextOrder = lastItem.length > 0 ? (lastItem[0].order ?? 0) + 1 : 0;

    const [newItem] = await db
      .insert(deckItems)
      .values({
        deckId,
        order: nextOrder,
        dateLabel: "",
        title: "",
        description: "",
      })
      .returning({ id: deckItems.id });

    return { success: true, id: newItem.id };
  } catch (error) {
    console.error("Create Item Error:", error);
    return { success: false, error: "Nie udało się utworzyć nowej części" };
  }
}

export async function reorderStoryPartsAction(items: { id: string; order: number }[]) {
  try {
    for (const item of items) {
      await db.update(deckItems)
        .set({ order: item.order })
        .where(eq(deckItems.id, item.id));
    }
    return { success: true };
  } catch (error) {
    console.error("Reorder Error:", error);
    return { success: false, error: "Nie udało się zapisać kolejności" };
  }
}