import "server-only";
import { db } from "@/server/db";
import { playgrounds, playgroundFlashcards } from "@/server/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function getPlaygroundById(playgroundId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const playground = await db.query.playgrounds.findFirst({
    where: and(
      eq(playgrounds.id, playgroundId),
      eq(playgrounds.userId, user.id)
    ),
  });
  return playground || null;
}

export async function getPlaygroundFlashcards(playgroundId: string) {
  const user = await getCurrentUser();
  if (!user) return [];

  const results = await db
    .select({
      flashcard: playgroundFlashcards, 
    })
    .from(playgroundFlashcards)
    .innerJoin(playgrounds, eq(playgroundFlashcards.playgroundId, playgrounds.id))
    .where(
      and(
        eq(playgroundFlashcards.playgroundId, playgroundId),
        eq(playgrounds.userId, user.id)
      )
    );

  return results.map(row => row.flashcard);
}