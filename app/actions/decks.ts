"use server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { revalidatePath } from "next/cache";
import { eq, and,} from "drizzle-orm";

export async function deleteDeckAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Logged in to delete a deck." };
    
    await db.delete(decks)
      .where(
        and(
          eq(decks.id, deckId),
          eq(decks.userId, user.id)
        )
      );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Problem occured while deleting deck:", error);
    return { success: false, error: "An unexpected error occurred while deleting." };
  }
}

export async function resetDeckProgressAction(deckId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

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