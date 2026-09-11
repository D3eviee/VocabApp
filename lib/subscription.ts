// lib/subscription.ts
import { db } from "@/server/db";
import { users, decks, playgrounds } from "@/server/schema";
import { eq, count, and } from "drizzle-orm";

const MAX_FREE_FLASHCARDS_DECKS = 3;
const MAX_FREE_STORYBOARDS = 1;
const MAX_FREE_PLAYGROUNDS = 1;

// CHECKING WHETHER USES HAS SUB PLAN 
export const checkSubscription = async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { stripeCurrentPeriodEnd: true, stripePriceId: true },
  });

  if (!user || !user.stripeCurrentPeriodEnd) return false;

  // IS SUB DATE VALID
  const isValid = user.stripeCurrentPeriodEnd.getTime() > Date.now();
  return isValid;
};

// VERYFYING DECKS LIMITS
export const verifyLimits = async ( userId: string, type: "classic" | "storyboard" | "playground" ): Promise<boolean> => {
  try {
    // NO LIMIS FOR PRO PLAN
    const isPro = await checkSubscription(userId);
    if (isPro) return true; 

    // CHEKING LIMITS FOR DECKS BASED ON "DECKS" TABLE 
    if (type === "classic" || type === "storyboard") {
      // TO REFACTOR --> RENAME THIS COLUMN IN DB
      const dbType = type === "storyboard" ? "storytelling" : "classic";
      const limit = type === "classic" ? MAX_FREE_FLASHCARDS_DECKS : MAX_FREE_STORYBOARDS;

      const [result] = await db
        .select({ count: count() })
        .from(decks)
        .where(
          and(
            eq(decks.userId, userId),
            eq(decks.type, dbType) 
          )
        );

      return (result.count || 0) < limit;
    }

    // CHEKING LIMITS FOR PLAYGROUNDS 
    if (type === "playground") {
      const [result] = await db
        .select({ count: count() })
        .from(playgrounds)
        .where(eq(playgrounds.userId, userId));

      return (result.count || 0) < MAX_FREE_PLAYGROUNDS;
    }

    return false;
  } catch (error) {
    console.error(`[VERIFY_LIMITS_ERROR] type: ${type}`, error);
    return false; 
  }
}






// VERYFYING STORYBOARD-DECK LIMITS
export const verifyStoryboardLimit = async (userId: string) => {
  const isPro = await checkSubscription(userId);
  if (isPro) return true;

  const [result] = await db
    .select({ count: count() })
    .from(decks)
    .where(
        and(
            eq(decks.userId, userId),
            eq(decks.type, "storytelling")
        )
    );

  return (result.count || 0) < MAX_FREE_STORYBOARDS;
};