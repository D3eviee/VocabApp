'use server'
import { db } from "@/server/db";
import { deckItems, decks, users } from "@/server/schema";
import { eq, lte, sql, and, ne} from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// CALCULATING USER PERSONAL STATS
export async function getUserStats() {
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
          ne(deckItems.partOfSpeech, "draft"),
          lte(deckItems.dueDate, today) 
        )
      );
    const dueToday = Number(dueResult?.count) || 0;

    // 2. RETENTION RATE
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

    // CURRENT STREAK 
    let currentStreak = user.streak || 0;

    if (user.lastStudyDate && currentStreak > 0) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      const lastStudy = new Date(user.lastStudyDate);
      lastStudy.setHours(0, 0, 0, 0);
      
      const diffTime = todayDate.getTime() - lastStudy.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      
    
      if (diffDays > 1) {
        currentStreak = 0; 
        await db.update(users).set({ streak: 0 }).where(eq(users.id, user.id));
      }
    } else if (!user.lastStudyDate) currentStreak = 0;
    
    return { currentStreak, dueToday, retentionRate };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { currentStreak: 0, dueToday: 0, retentionRate: 0 };
  }
}

export async function updateProfile(formData: { name: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!formData.name || formData.name.length < 3) {
      return { success: false, error: "Name is too short" };
    }

    await db
      .update(users)
      .set({ firstName: formData.name })
      .where(eq(users.id, user.id));
      
    revalidatePath("/dashboard/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { success: false, error: "Failed to update profile" };
  }
}