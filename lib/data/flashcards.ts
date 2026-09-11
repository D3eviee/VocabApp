import { db } from "@/server/db";
import { decks, deckItems } from "@/server/schema";
import { eq, desc, and } from "drizzle-orm";

interface CreateCardParams {
  deckId: string;
  front: string;
  back: string;
  partOfSpeech: string;
}

// GETTING USER FLASHCARD DECKS
export async function getUserFlashcardDecks(userId: string) {
  return await db
    .select({ id: decks.id, title: decks.title })
    .from(decks)
    .where(
      and(
        eq(decks.userId, userId),
        eq(decks.type, "classic")
      ))
    .orderBy(desc(decks.createdAt));
}

// INSERTS ALL NEW FLASHARDS IN ONE BATCH
export async function insertFlashcardsBatch(cards: CreateCardParams[]) {
  const cardsToInsert = cards.map((card, index) => ({
    deckId: card.deckId,
    front: card.front,
    meanings: [{ 
      id: crypto.randomUUID(), 
      back: card.back,
      examples: [] 
    }], 
    partOfSpeech: card.partOfSpeech,
    order: 0,
  }));

  return await db.insert(deckItems).values(cardsToInsert);
}