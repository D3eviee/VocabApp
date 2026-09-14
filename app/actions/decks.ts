"use server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { decks } from "@/server/schema";
import { revalidatePath } from "next/cache";
import { eq, and,} from "drizzle-orm";

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