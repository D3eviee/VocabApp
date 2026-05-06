'use server'
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { eq, lte, sql, and} from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// CALCULATING USER PERSONAL STATS
export async function getUserStatsAction() {
  try {
    const user = await getCurrentUser(); 
    if (!user) return { currentStreak: 0, dueToday: 0, retentionRate: 0 };

    const today = new Date();

    // HOW MANY CARDS TO REVIEW FOR TODAY
    const [dueResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(deckItems)
      .innerJoin(decks, eq(decks.id, deckItems.deckId))
      .where(
        and(
          eq(decks.userId, user.id),
          eq(decks.type, "classic"),
          lte(deckItems.dueDate, today) 
        )
      );
    const dueToday = Number(dueResult.count) || 0;

    // 3. RETENTION RATE
    const retentionData = await db
      .select({
        totalReviewed: sql<number>`count(case when ${deckItems.repetitions} > 0 then 1 end)`,
        remembered: sql<number>`count(case when ${deckItems.repetitions} > 0 and ${deckItems.interval} > 1 then 1 end)`
      })
      .from(deckItems)
      .innerJoin(decks, eq(decks.id, deckItems.deckId))
      .where(
        and(
          eq(decks.userId, user.id),
          eq(decks.type, "classic") 
        )
      );
    const totalRev = Number(retentionData[0]?.totalReviewed) || 0;
    const remembered = Number(retentionData[0]?.remembered) || 0;
    
    let retentionRate = 0;
    if (totalRev > 0) retentionRate = Math.round((remembered / totalRev) * 100);

    // 4. CURRENT STREAK
    const currentStreak = user.streak || 0;

    return {
      currentStreak,
      dueToday,
      retentionRate
    };

  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { currentStreak: 0, dueToday: 0, retentionRate: 0 };
  }
}