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