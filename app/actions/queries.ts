'use server'
import { db } from "@/server/db";
import { deckItems, users, decks } from "@/server/schema";
import { eq, lte, desc, and, ne} from "drizzle-orm";
import { addDays, isToday, isYesterday } from "date-fns";
import { getCurrentUser } from "@/lib/auth";

export async function rateCardAction(cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') {
  try {
    // GET USER
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };
    // GET CARD DATA -> interval/ease factor/repetitions
    const [card] = await db.select().from(deckItems).where(eq(deckItems.id, cardId));
    if (!card) return { success: false, error: "Card not found" };

    // SM-2 ALG IMPLEMENTATION 
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

    // SAVE CARD WITH UPDATED REPETITION DATA
    await db.update(deckItems)
      .set({ interval: newInterval, easeFactor: newEaseFactor, repetitions: newRepetitions, dueDate: newDueDate })
      .where(eq(deckItems.id, cardId));


    // SETTING USER STREAK
    let newStreak = Number(users.streak) || 0;
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    if (!lastStudy) newStreak = 1;
    else if (isYesterday(lastStudy)) newStreak += 1;
    else if (!isToday(lastStudy)) newStreak = 1;

    // UPDATE USER STREAK
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

// USED TO GET ITEMS FOR STUDYING IN STUDY MODE
export async function getDueDeckItems(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    
    const today = new Date();
    
    return await db.select()
      .from(deckItems)
      .where(
        and(
          eq(deckItems.deckId, deckId),
          lte(deckItems.dueDate, today),
          ne(deckItems.partOfSpeech, "draft")
        )
      )
      .orderBy(deckItems.order);
      
  } catch (error) {
    console.error("Failed to fetch due cards:", error);
    return [];
  }
}

// USED TO PRIVIDE TITLE FOR THE DECK IN STUDY MODE
export async function getDeckTitleById(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const [deck] = await db
      .select({ title: decks.title }) 
      .from(decks)
      .where(
        and(
          eq(decks.id, deckId),
        )
      );
      
    return deck || null;
  } catch (error) {
    return null;
  }
}