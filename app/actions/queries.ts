'use server'
import { db } from "@/server/db";
import { deckItems } from "@/server/schema";
import { eq, asc } from "drizzle-orm";
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