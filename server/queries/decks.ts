import { getCurrentUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { decks } from "../schema";

export async function getUserDecks() {
  const user = await getCurrentUser();
  if (!user) return [];

  return await db
    .select()
    .from(decks)
    .where(eq(decks.userId, user.id))
    .orderBy(desc(decks.createdAt));
}