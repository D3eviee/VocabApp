'use server'
import { db } from "@/server/db";
import { deckItems } from "@/server/schema";
import { eq, asc } from "drizzle-orm";

export async function getDeckItems(deckId: string) {
  return await db.select()
    .from(deckItems)
    .where(eq(deckItems.deckId, deckId))
    .orderBy(asc(deckItems.order));
}

// 2. AKTUALIZACJA KARTY
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

// 3. TWORZENIE NOWEJ KARTY (Czysty Draft)
export async function createCardAction(deckId: string) {
  try {
    const [newCard] = await db
      .insert(deckItems)
      .values({
        deckId: deckId,
        front: "New Word",
        
        // Inicjalizujemy puste tablice dla JSONB
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


export async function deleteCardAction(id: string | undefined) {
  if (!id) return { success: false, error: "No ID provided" };

  try {
    await db
      .delete(deckItems)
      .where(eq(deckItems.id, id));

    return { success: true };
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { success: false, error: "Failed to delete card" };
  }
}