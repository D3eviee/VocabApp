'use server'
import { db } from "@/server/db";
import { deckItems, decks, users } from "@/server/schema";
import { eq, asc, lte, sql, desc, and} from "drizzle-orm";
import { addDays, isToday, isYesterday } from "date-fns";
import { getCurrentUser } from "@/lib/auth";

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
    // 1. Pobierz aktualnego użytkownika i kartę
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const [card] = await db.select().from(deckItems).where(eq(deckItems.id, cardId));
    if (!card) return { success: false, error: "Card not found" };

    // --- LOGIKA ALGORYTMU SM-2 (Zostawiasz tak jak mieliśmy) ---
    const q = { again: 0, hard: 3, good: 4, easy: 5 }[rating];
    let { interval, easeFactor, repetitions } = card;
    let newInterval: number, newEaseFactor = easeFactor, newRepetitions = repetitions;

    if (q < 3) {
      newRepetitions = 0; newInterval = 1;
    } else {
      if (newRepetitions === 0) newInterval = 1;
      else if (newRepetitions === 1) newInterval = 6;
      else newInterval = Math.round(interval * easeFactor);
      
      newRepetitions++;
      newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (newEaseFactor < 1.3) newEaseFactor = 1.3;
    }
    const newDueDate = addDays(new Date(), newInterval);

    // Zapisz kartę w bazie...
    await db.update(deckItems)
      .set({ interval: newInterval, easeFactor: newEaseFactor, repetitions: newRepetitions, dueDate: newDueDate })
      .where(eq(deckItems.id, cardId));

    let newStreak = Number(users.streak) || 0;
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;

    if (!lastStudy) newStreak = 1;
    else if (isYesterday(lastStudy))  newStreak += 1;
    else if (!isToday(lastStudy)) newStreak = 1;
    // (Jeśli uczył się 'isToday', nie robimy nic – passa na dziś już jest zaliczona)

    // Aktualizujemy dane użytkownika
    if (!lastStudy || !isToday(lastStudy)) {
      await db.update(users)
        .set({ 
          streak: newStreak, 
          lastStudyDate: new Date() 
        })
        .where(eq(users.id, user.id));
    }

    return { success: true, nextDate: newDueDate };
  } catch (error) {
    console.error("SRS Update Error:", error);
    return { success: false };
  }
}

export async function getUserStatsAction() {
  try {
    const user = await getCurrentUser(); 
    if (!user) {
      return { currentStreak: 0, dueToday: 0, retentionRate: 0 };
    }

    const today = new Date();

    // 2. DUE TODAY: Tylko dla klasycznych fiszek (decks.type === 'classic')
    const [dueResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(deckItems)
      .innerJoin(decks, eq(decks.id, deckItems.deckId))
      .where(
        and(
          eq(decks.userId, user.id),
          eq(decks.type, "classic"), // <--- ODSĄCZAMY STORYBOARDY!
          lte(deckItems.dueDate, today) 
        )
      );

    const dueToday = Number(dueResult.count) || 0;

    // 3. RETENTION RATE: Tylko dla klasycznych fiszek
    const retentionData = await db
      .select({
        totalReviewed: sql<number>`count(case when ${deckItems.repetitions} > 0 then 1 end)`,
        remembered: sql<number>`count(case when ${deckItems.repetitions} > 0 and ${deckItems.interval} > 1 then 1 end)`
      })
      .from(deckItems)
      .innerJoin(decks, eq(decks.id, deckItems.deckId))
      .where(
        and(
          eq(decks.userId, user.id),
          eq(decks.type, "classic") 
        )
      );

    const totalRev = Number(retentionData[0]?.totalReviewed) || 0;
    const remembered = Number(retentionData[0]?.remembered) || 0;
    
    let retentionRate = 0;
    if (totalRev > 0) {
      retentionRate = Math.round((remembered / totalRev) * 100);
    }

    // 4. CURRENT STREAK (zostaje jak było)
    const currentStreak = user.streak || 0;

    return {
      currentStreak,
      dueToday,
      retentionRate
    };

  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { currentStreak: 0, dueToday: 0, retentionRate: 0 };
  }
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