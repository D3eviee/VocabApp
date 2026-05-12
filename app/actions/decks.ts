"use server";
import { getCurrentUser } from "@/lib/auth";
import { CreateDeckState } from "@/lib/types";
import { db } from "@/server/db";
import { decks } from "@/server/schema";

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