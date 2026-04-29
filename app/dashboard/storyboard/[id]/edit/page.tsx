import { eq, asc } from "drizzle-orm";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { deckItems } from "@/server/schema";
import { db } from "@/server/db";
import StoryboardEditor from "@/components/dashboard/storytelling/StoryboardEditor";

type Params = Promise<{ id: string }>;

export default async function StoryboardEditPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['story-items', id],
    queryFn: async () => {
      const items = await db.select()
        .from(deckItems)
        .where(eq(deckItems.deckId, id))
        .orderBy(asc(deckItems.order));

      return items;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
      <StoryboardEditor storyboardId={id} />
    </HydrationBoundary>
  );
}