"use server";
import { getCurrentUser } from "@/lib/auth";
import { CreateDeckState } from "@/lib/types";
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function createDeckAction(_prevState: CreateDeckState, formData: FormData ): Promise<CreateDeckState> {
  const titleRaw = formData.get("title")?.toString() || "";
  const title = titleRaw.trim().replace(/\s+/g, " ");
  if (!title) return { success: false, error: "Title is required." };

  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be logged in.", title: titleRaw };
    const newFlashcardDeck = await db.insert(decks).values({ title, userId: user.id, type: "classic" }).returning({ id: decks.id });

    const newDeckId = newFlashcardDeck[0].id
    return { success: true, deckId: newDeckId };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred.", title: titleRaw };
  }
}

export async function createStoryboardAction( _prevState: CreateDeckState, formData: FormData): Promise<CreateDeckState> {
  const titleRaw = formData.get("title")?.toString() || "";
  const title = titleRaw.trim().replace(/\s+/g, " ");

  if (!title) return { success: false, error: "Title is required." };

  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be logged in.", title: titleRaw };
    const newStoryboard = await db.insert(decks).values({ title, userId: user.id, type: "storytelling" }).returning({ id: decks.id });

    const newDeckId = newStoryboard[0].id
    return { success: true, deckId: newDeckId };
  } catch (error) {
    console.error("Failed to create storyboard:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred while creating your storyboard.", 
      title: titleRaw,
    };
  }
}

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