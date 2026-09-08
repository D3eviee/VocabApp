// lib/subscription.ts
import { db } from "@/server/db";
import { users, decks } from "@/server/schema";
import { eq, count, and } from "drizzle-orm";

const MAX_FREE_DECKS = 3;
const MAX_FREE_STORYBOARDS = 1;

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

// VERYFYING FLASCARDS-DECK LIMITS
export const verifyDeckLimit = async (userId: string) => {
  const isPro = await checkSubscription(userId);
  if (isPro) return true; // NO LIMIS FOR PRO PLAN

  const [result] = await db
    .select({ count: count() })
    .from(decks)
    .where(
         and(
            eq(decks.userId, userId),
            eq(decks.type, "classic")
        )
    )

  return (result.count || 0) < MAX_FREE_DECKS;
};

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