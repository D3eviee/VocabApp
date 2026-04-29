"use server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/server/db";
import { decks } from "@/server/schema";
import { revalidatePath } from "next/cache";

export type CreateDeckState = {
  error?: string;
  success?: boolean;
  deckId?: string;
} | null;

export async function createDeckAction(prevState: CreateDeckState, formData: FormData): Promise<CreateDeckState> {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    if (!title || title.length < 2) return { error: "Title is too short" };
    
    let createdDeckId: string | undefined;
    
    try {
        const [newDeck] = await db
            .insert(decks)
            .values({ title, userId: user.id, type: "classic"})
            .returning({ id: decks.id });
            
        createdDeckId = newDeck.id;
        revalidatePath("/dashboard");
    }catch (error) {
        console.error("Database error:", error);
        return { error: "Failed to create deck in database" };
    }
    if (createdDeckId) return { success: true, deckId: createdDeckId };
    return { error: "Something went wrong" };
}

export async function createRoadMapAction(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    if (!title || title.length < 2) return { error: "Title is too short" };
    
    try {
        const [newDeck] = await db
            .insert(decks)
            .values({ title, userId: user.id, type: "storytelling" }) 
            .returning({ id: decks.id });
            
        revalidatePath("/dashboard");
        // Zwracamy deckId
        return { success: true, deckId: newDeck.id }; 
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Failed to create roadmap in database" };
    }
}