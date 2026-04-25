import { eq, asc } from "drizzle-orm";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { deckItems } from "@/server/schema";
import { db } from "@/server/db";
import DeckEditor from "@/components/dashboard/DeckEditor";

type Params = Promise<{ id: string }>;

export default async function DeckPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['deck-items', id],
    queryFn: async () => {
      const items = await db.select()
        .from(deckItems)
        .where(eq(deckItems.deckId, id))
        .orderBy(asc(deckItems.order));

        return items
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
      <DeckEditor deckId={id} />
    </HydrationBoundary>
  );
}