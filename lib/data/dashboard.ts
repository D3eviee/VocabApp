import { eq, and, ne, lte, desc, sql } from 'drizzle-orm';
import { getCurrentUser } from '../auth';
import { db } from '@/server/db';
import { deckItems, decks, playgroundFlashcards, playgrounds } from '@/server/schema';

export const getUserDecks = async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return await db
    .select({
      id: decks.id,
      title: decks.title,
      type: decks.type,
      dueCardsCount: sql<number>`cast(count(${deckItems.id}) as integer)`,
    })
    .from(decks)
    .leftJoin(
      deckItems,
      and(
        eq(decks.id, deckItems.deckId),
        ne(deckItems.partOfSpeech, "draft"), 
        lte(deckItems.dueDate, endOfToday) 
      )
    )
    .where(eq(decks.userId, user.id))
    .groupBy(decks.id) 
    .orderBy(desc(decks.createdAt));
}


export const getUserPlaygrounds = async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  return await db
    .select({
      id: playgrounds.id,
      title: playgrounds.title,
      thumbnailUrl: playgrounds.thumbnailUrl,
    })
    .from(playgrounds)
    .leftJoin(
      playgroundFlashcards,
      eq(playgrounds.id, playgroundFlashcards.playgroundId)
    )
    .where(eq(playgrounds.userId, user.id))
    .groupBy(playgrounds.id)
    .orderBy(desc(playgrounds.createdAt));
};