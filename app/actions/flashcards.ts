'use server'
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { eq, desc, and, ne, lte} from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { CreateDeckState } from "@/lib/types";
import { verifyLimits } from "@/lib/subscription";
import { revalidatePath } from "next/cache";
import { createDeckRecord } from "@/lib/data/decks";

// CREATES NEW FLASHCARDS DECK
export async function createFlashcardsDeckAction(_prevState: CreateDeckState, formData: FormData ): Promise<CreateDeckState> {
  const titleRaw = formData.get("title")?.toString() || "";
  const title = titleRaw.trim().replace(/\s+/g, " ");
  if (!title) return { success: false, error: "Title is required." };

  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "User is unauthorized" };

    // LIMIT VERIFICATION (PAYWALL)
    const canCreate = await verifyLimits(user.id, "classic");
    if (!canCreate) {
      return { 
        success: false, 
        error: "Limit reached. Upgrade to pro plan.",
        requiresUpgrade: true, // FLAG FOR FRONTEND
      };
    }
    
    const newDeck = await createDeckRecord(title, user.id, "classic")
    if (!newDeck || !newDeck.id) return { success: false, error: "Failed to create deck. Please try again later." };

    revalidatePath("/dashboard/decks");
    return { success: true, deckId: newDeck.id };
  }catch (error) {
    console.error("[CREATE_DECK_ERROR]", error);

    return { 
      success: false, 
      error: "An unexpected error occurred.", 
      title 
    }
  }
}

// GET FLASHCARD DECK ITEMS FOR EDIT MODE
export async function getCardsForFlashcardDeckAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error( "Unauthorized. Please login." );

    const cards = await db
      .select()
      .from(deckItems)
      .where(eq(deckItems.deckId, deckId))
      .orderBy(desc(deckItems.createdAt));

    return cards; 
  } catch (error) {
    console.error("Failed to fetch flashcards:", error);
    throw new Error("Failed to load flashcards. Please try again later.");
  }
}

// GET ITEMS FOR STUDY SESSION
export async function getDueDeckItemsAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error( "Unauthorized. Please login." );
    
    const today = new Date();
    
    return await db
      .select({
        id: deckItems.id,
        front: deckItems.front,
        variation: deckItems.variations,
        partOfSpeech: deckItems.partOfSpeech,
        meanings: deckItems.meanings,
      })
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
    console.error("Failed to fetch due cards:", error)
    throw new Error("Failed to load cards. Please check your connection.");
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