import { db } from "@/server/db";
import { deckItems, decks, deckTypeEnum, reviewLogs, users } from "@/server/schema";
import { and, eq, gte, lte, ne, count, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function getUserStreak(userId: string): Promise<number> {
  const [userRecord] = await db
    .select({
      streak: users.streak,
      lastStudyDate: users.lastStudyDate,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!userRecord) return 0;

  const currentStreak = userRecord.streak ?? 0;
  if (currentStreak === 0 || !userRecord.lastStudyDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastStudy = new Date(userRecord.lastStudyDate);
  lastStudy.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastStudy.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  return diffDays > 1 ? 0 : currentStreak;
}

// RETENTION BASED ON LAST 30 DAYS
export async function getRetentionRate(userId: string): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [result] = await db
    .select({
      totalReviews: count(),
      correctReviews: sql<number>`count(*) filter (where ${reviewLogs.isCorrect} = true)`,
    })
    .from(reviewLogs)
    .where(
      and(
        eq(reviewLogs.userId, userId),
        gte(reviewLogs.reviewedAt, thirtyDaysAgo)
      )
    );

  const total = Number(result?.totalReviews ?? 0);
  const correct = Number(result?.correctReviews ?? 0);

  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

export async function getDueTodayCount(userId: string): Promise<number> {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [result] = await db
    .select({ count: count() })
    .from(deckItems)
    .innerJoin(decks, eq(decks.id, deckItems.deckId))
    .where(
      and(
        eq(decks.userId, userId),
        eq(decks.type, "classic"),
        ne(deckItems.partOfSpeech, "draft"),
        lte(deckItems.dueDate, endOfToday)
      )
    );

  return result?.count ?? 0;
}

export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const [streak, retentionRate, dueToday] = await Promise.all([
    getUserStreak(user.id),
    getRetentionRate(user.id),
    getDueTodayCount(user.id),
  ]);

  return { 
    streak, 
    retentionRate, 
    dueToday 
  };
}