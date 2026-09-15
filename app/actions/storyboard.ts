"use server";
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema"; 
import { eq, asc, sql, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth"; 
import { CreateDeckState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { verifyLimits } from "@/lib/subscription";
import { checkDeckOwnership, createDeckRecord } from "@/lib/data/decks";
import { StoryboardDraft } from "@/store/use-storyboard-store";

// CREATES NEW STORYBOARD DECK
export async function createStoryboardAction(_prevState: CreateDeckState, formData: FormData ): Promise<CreateDeckState> {
  const titleRaw = formData.get("title")?.toString() || "";
  const title = titleRaw.trim().replace(/\s+/g, " ");
  if (!title) return { success: false, error: "Title is required." };

  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "User is unauthorized" };

    // LIMIT VERIFICATION (PAYWALL)
    const canCreate = await verifyLimits(user.id, "storyboard");
    if (!canCreate) {
      return { 
        success: false, 
        error: "Limit reached. Upgrade to pro plan.",
        requiresUpgrade: true, // FLAG FOR FRONTEND
      };
    }
    
    const newStoryboard = await createDeckRecord(title, user.id, "storyboard")
    if (!newStoryboard || !newStoryboard.id) return { success: false, error: "Failed to create storyboard. Please try again later." };

    revalidatePath("/dashboard/decks");
    return { success: true, deckId: newStoryboard.id };
  }catch (error) {
    console.error("[CREATE_STORYBOARD_ERROR]", error);

    return { 
      success: false, 
      error: "An unexpected error occurred.", 
      title 
    }
  }
}

// GETTING ALL STORYBOARD DECK ITEMS
export async function getStoryboardItems(storyboardId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    
    return await db.select()
      .from(deckItems)
      .where(eq(deckItems.deckId, storyboardId))
      .orderBy(asc(deckItems.order));
      
  } catch (error) {
    console.error("Failed to fetch storyboard items:", error);
    return [];
  }
}

// CREATES NEW STORYBOARD ITEM
export async function createStoryboardItem(storyboardId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const isOwner = checkDeckOwnership(storyboardId, user.id)
    if (!isOwner) return { success: false, error: "Storyboard not found or access denied" };

    // GET THE HIHEST ORDER VALUE -> WE ADD NEW ITEM AS LAST
    const [highestOrderRecord] = await db
      .select({ maxOrder: sql<number>`coalesce(max(${deckItems.order}), -1)` })
      .from(deckItems)
      .where(eq(deckItems.deckId, storyboardId));
      
    const nextOrder = (highestOrderRecord?.maxOrder ?? -1) + 1;

    // SKELETION ITEM FOR DB 
    const [newItem] = await db.insert(deckItems).values({
      deckId: storyboardId,
      order: nextOrder,
      title: "New Event",
      dateLabel: "",
      description: "",
    }).returning();

    revalidatePath(`/dashboard/storyboards/${storyboardId}/edit`);
    return { success: true, id: newItem.id };
  } catch (error) {
    console.error("Create Storyboard Item Error:", error);
    return { success: false, error: "Failed to create item" };
  }
}

// UPADTES STORYBOARD ITEM
export async function updateStoryboardItem(storyboardItem:StoryboardDraft) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };
    if (!storyboardItem.id) return { success: false, error: "Missing ID" };

    const [existingItem] = await db
      .select({ deckId: deckItems.deckId })
      .from(deckItems)
      .innerJoin(decks, eq(deckItems.deckId, decks.id))
      .where(
        and(
          eq(deckItems.id, storyboardItem.id),
          eq(decks.userId, user.id) 
        )
      )
      .limit(1);

    if (!existingItem) return { success: false, error: "Item not found or access denied" };

    await db.update(deckItems)
      .set({
        title: storyboardItem.title,
        dateLabel: storyboardItem.dateLabel,
        description: storyboardItem.description,
      })
      .where(eq(deckItems.id, storyboardItem.id));

    revalidatePath(`/dashboard/storyboards/${existingItem.deckId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Update Storyboard Item Error:", error);
    return { success: false, error: "Failed to update item" };
  }
}

// CHANGES ORDER FIELD FOR STORYBOARD ITEM
export type ReorderPayload = { id: string; order: number }[];

export async function reorderStoryboardItems(newOrder: ReorderPayload) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };
    if (!newOrder || newOrder.length === 0) return { success: true };

    const [firstItemCheck] = await db.select({ deckId: deckItems.deckId })
      .from(deckItems)
      .innerJoin(decks, eq(deckItems.deckId, decks.id))
      .where(and(
         eq(deckItems.id, newOrder[0].id),
         eq(decks.userId, user.id)
      ))
      .limit(1);

    if (!firstItemCheck) return { success: false, error: "Access denied or item not found." };

    const validDeckId = firstItemCheck.deckId;

    const updateQueries = newOrder.map((item) =>
      db.update(deckItems)
        .set({ order: item.order })
        .where(
          and(
            eq(deckItems.id, item.id),
            eq(deckItems.deckId, validDeckId)
          )
        )
    );

     await db.batch(updateQueries as any);

    revalidatePath(`/dashboard/storyboards/${validDeckId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Reorder Storyboard Items Error:", error);
    return { success: false, error: "Failed to reorder items" };
  }
}