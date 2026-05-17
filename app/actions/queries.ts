'use server'
import { db } from "@/server/db";
import { deckItems, users, decks } from "@/server/schema";
import { eq, lte, desc, and, ne} from "drizzle-orm";
import { addDays, isToday, isYesterday } from "date-fns";
import { getCurrentUser } from "@/lib/auth";

// GET FLASHCARD DECK ITEMS
export async function getFlashcardDeckItems(deckId: string) {
  try {
    // AUTH
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const items = await db.select()
      .from(deckItems)
      .where(
        and(
          eq(deckItems.deckId, deckId),
          ne(deckItems.partOfSpeech, "draft")
        )) 
      .orderBy(desc(deckItems.createdAt));

    return items;
  } catch (error) {
    console.error("Failed to fetch flashcards:", error);
    return [];
  }
}

// 2. CARD DATA UPDATE
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

// CREATE NEW CARD -> CARD WITH DRAFT STATUS -> USER HAVENT SAVED AFTER CREATING
export async function createCardAction(deckId: string) {
  try {
    const [newCard] = await db
      .insert(deckItems)
      .values({
        deckId: deckId,
        front: "New Word",
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

// DELETE ITEM FROM THE DECK
export async function deleteCardAction(id: string | undefined) {
  if (!id) return { success: false, error: "No ID provided" };

  try {
    // AUTH
    const user = await getCurrentUser();
    if (!user || !user.id) return { success: false, error: "Unauthorized" };

    // WE GET CART TO CHECK IS THIS USER'S CARD
    const [cardToVerify] = await db
      .select({ deckId: deckItems.deckId })
      .from(deckItems)
      .where(eq(deckItems.id, id));

    if (!cardToVerify) return { success: false, error: "Card not found" };

    const [deck] = await db
      .select({ id: decks.id })
      .from(decks)
      .where(
        and(
          eq(decks.id, cardToVerify.deckId),
          eq(decks.userId, user.id)
        )
      );

    if (!deck) return { success: false, error: "Forbidden: You don't own this card" };
    

    // DELETING
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