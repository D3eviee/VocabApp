"use server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { revalidatePath } from "next/cache";
import { eq, and,} from "drizzle-orm";
import { checkDeckOwnership } from "@/lib/data/decks";

 // DELETES FLASHCARD OR STORYBOARD DECK
export async function deleteDeckAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "User is unauthorized" };

    const deleted = await db.delete(decks)
      .where(
        and(
          eq(decks.id, deckId),
          eq(decks.userId, user.id)
        )
      )
      .returning({ id: decks.id });

    if (deleted.length === 0) 
      return { success: false, error: "Deck not found or access denied." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Problem occurred while deleting deck:", error);
    return { success: false, error: "An unexpected error occurred while deleting." };
  }
}

// DELETES FLASHCARD OR STORYBOARD CARD
export async function deleteDeckItemAction(deckId: string, id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) return { success: false, error: "Unauthorized" };
    
    // CHECKING OWNERSHIP OF THE DECK
    const isOwner = await checkDeckOwnership(deckId, user.id);
    if (!isOwner) return { success: false, error: "Unauthorized deck access." };

    // Bezpieczne usunięcie fiszki
    const deleted = await db.delete(deckItems)
      .where(
        and(
          eq(deckItems.id, id),
          eq(deckItems.deckId, deckId),
        )
      )
      .returning({ id: deckItems.id });

    if (deleted.length === 0) return { success: false, error: "Item not found." };
    
    return { success: true };
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { success: false, error: "Failed to delete card" };
  }
}