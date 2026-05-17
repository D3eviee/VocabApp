"use server";
import { db } from "@/server/db";
import { deckItems } from "@/server/schema"; 
import { eq, asc, max } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth"; 

// 1. POBIERANIE WSZYSTKICH ELEMENTÓW
export async function getStoryboardItems(storyboardId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    
    return await db.select()
      .from(deckItems)
      .where(eq(deckItems.deckId, storyboardId))
      .orderBy(asc(deckItems.order)); // Sortowanie po order jest tu kluczowe
      
  } catch (error) {
    console.error("Failed to fetch storyboard items:", error);
    return [];
  }
}

// 2. TWORZENIE NOWEGO WYDARZENIA
export async function createStoryboardItem(storyboardId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Najpierw sprawdzamy najwyższy 'order', żeby nowe wydarzenie spadło na sam dół listy
    const [highestOrderRecord] = await db
      .select({ maxOrder: max(deckItems.order) })
      .from(deckItems)
      .where(eq(deckItems.deckId, storyboardId));
      
    const nextOrder = (highestOrderRecord?.maxOrder ?? -1) + 1;

    // Tworzymy pusty wpis (szkielet)
    const [newItem] = await db.insert(deckItems).values({
      deckId: storyboardId,
      order: nextOrder,
      title: "New Event", // Domyślne wartości
      dateLabel: "",
      description: "",
      // Jeśli do odróżnienia fiszek od historii używasz partOfSpeech, możesz to tu ustawić:
      // partOfSpeech: "story_event" 
    }).returning();

    return { success: true, id: newItem.id };
  } catch (error) {
    console.error("Create Storyboard Item Error:", error);
    return { success: false, error: "Failed to create item" };
  }
}

// 3. AKTUALIZACJA WYDARZENIA
export async function updateStoryboardItem(id: string, data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!id) return { success: false, error: "Missing ID" };

    await db.update(deckItems)
      .set({
        title: data.title,
        dateLabel: data.dateLabel,
        description: data.description,
        // Dodaj tu inne pola, które edytujesz w formularzu
      })
      .where(eq(deckItems.id, id));

    return { success: true };
  } catch (error) {
    console.error("Update Storyboard Item Error:", error);
    return { success: false, error: "Failed to update item" };
  }
}

// 4. USUWANIE WYDARZENIA
export async function deleteStoryboardItem(id: string | undefined) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!id) return { success: false, error: "Missing ID" };

    await db.delete(deckItems)
      .where(eq(deckItems.id, id));

    return { success: true };
  } catch (error) {
    console.error("Delete Storyboard Item Error:", error);
    return { success: false, error: "Failed to delete item" };
  }
}

// 5. ZMIANA KOLEJNOŚCI (DRAG & DROP)
// Przyjmuje tablicę obiektów: [{ id: "uuid-1", order: 0 }, { id: "uuid-2", order: 1 }, ...]
export async function reorderStoryboardItems(newOrder: { id: string; order: number }[]) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!newOrder || newOrder.length === 0) return { success: true };

    // Drizzle ORM nie ma (jeszcze) natywnego, masowego "upsert/updateMany" dla różnych wartości,
    // więc musimy użyć Promise.all do wysłania równoległych zapytań aktualizujących.
    await Promise.all(
      newOrder.map((item) =>
        db.update(deckItems)
          .set({ order: item.order })
          .where(eq(deckItems.id, item.id))
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Reorder Storyboard Items Error:", error);
    return { success: false, error: "Failed to reorder items" };
  }
}