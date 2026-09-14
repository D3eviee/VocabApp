'use server'
import { db } from "@/server/db";
import { deckItems } from "@/server/schema";
import { eq, desc, and, ne, lte} from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { CreateDeckState } from "@/lib/types";
import { verifyLimits } from "@/lib/subscription";
import { revalidatePath } from "next/cache";
import { checkDeckOwnership, createDeckRecord } from "@/lib/data/decks";

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

// RESET USER DECK PROGESS 
export async function resetFlashcardsDeckProgressAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "User is unauthorized" };

    // CHECKING OWNERSHIP OF THE DECK
    const isOwner = await checkDeckOwnership(deckId, user.id);
    if (!isOwner) return { success: false, error: "Unauthorized deck access." };

    await db.update(deckItems)
      .set({
        dueDate: new Date(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0
      })
      .where(eq(deckItems.deckId, deckId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Reset Deck Progress Error:", error);
    return { success: false, error: "Failed to reset deck progress" };
  }
}

// CREATE NEW FLASHCARD -> FLASHCARD HAS DRAFT STATUS -> WE SAVE IT AUTOMATICALLY TO DB
export async function createFlashcardAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "User is unauthorized" };

    const isOwner = await checkDeckOwnership(deckId, user.id);
    if (!isOwner) return { success: false, error: "Unauthorized deck access." };

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
        partOfSpeech: "draft",
        order: 0,
      })
      .returning();

    revalidatePath(`/dashboard/decks/${deckId}/edit`);
    return { success: true, data: newCard };
  } catch (error) {
    console.error("Database Insert Error:", error);
    return { success: false, error: "Failed to create new card" };
  }
}

// ------- TODO -------- CARD DATA UPDATE
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