import { db } from "@/server/db";
import { quotes } from "@/server/schema";
import { eq, isNull, sql } from "drizzle-orm";

export async function getDailyQuote() {
  const today = new Date().toISOString().split("T")[0];

  const todaysQuote = await db.query.quotes.findFirst({
    where: eq(quotes.lastDisplayedOn, today),
    columns: {
      id: true,
      quote: true,
      author: true,
      source: true,
    }
  });
  if (todaysQuote) return todaysQuote; 

  const unusedQuotes = await db
    .select({
      id: quotes.id,
      quote: quotes.quote,
      author: quotes.author,
      source: quotes.source,
    })
    .from(quotes)
    .where(isNull(quotes.lastDisplayedOn))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  let chosenQuote = unusedQuotes[0];

  if (!chosenQuote) {
    await db.update(quotes).set({ lastDisplayedOn: null });
    const anyRandom = await db
      .select({
        id: quotes.id,
        quote: quotes.quote,
        author: quotes.author,
        source: quotes.source,
      })
      .from(quotes)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    chosenQuote = anyRandom[0];
  }

  const [updatedQuote] = await db.update(quotes)
    .set({ lastDisplayedOn: today })
    .where(eq(quotes.id, chosenQuote.id))
    .returning();

  const quote = { quote:updatedQuote.quote, author:updatedQuote.author, source: updatedQuote.source }
  return quote;
}