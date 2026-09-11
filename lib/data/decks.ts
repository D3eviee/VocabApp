import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUser } from "../auth";

// CREATES RECORD FOR DECKS BASED ON "DECKS" TABLE
export async function createDeckRecord(title: string, userId: string, deckType: "classic" | "storyboard") {
    const type = deckType == "storyboard" ? "storytelling" : "classic" 
    const [deck] = await db
        .insert(decks)
        .values({ title, userId, type })
        .returning({ id: decks.id });
  
    return deck;
}

// SECURITY -> CHECKING THE OWNERSHIP OF THE DECK
export async function checkDeckOwnership(deckId: string, userId: string) {
  const [deck] = await db
    .select({ id: decks.id })
    .from(decks)
    .where(
      and(
        eq(decks.id, deckId),
        eq(decks.userId, userId)
      )
    );
  
  return !!deck;
}