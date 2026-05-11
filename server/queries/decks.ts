import { getCurrentUser } from "@/lib/auth";
import { eq, desc, and, lte, count } from "drizzle-orm";
import { db } from "../db";
import { decks, deckItems } from "../schema";

export async function getUserDecks() {
  const user = await getCurrentUser();
  if (!user) return [];

  const today = new Date();

  return await db
    .select(
      {
        id: decks.id,
        title: decks.title,
        type: decks.type,
        dueCardsCount: count(deckItems.id) 
      }
    )
    .from(decks)
    .leftJoin(
      deckItems,
      and(
        eq(decks.id, deckItems.deckId), 
        lte(deckItems.dueDate, today)
      )
    )
    .where(eq(decks.userId, user.id))
    .groupBy(decks.id) 
    .orderBy(desc(decks.createdAt));
}
