import { eq, asc } from "drizzle-orm";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { deckItems } from "@/server/schema";
import { db } from "@/server/db";
import StoryboardStudyMode from "@/components/dashboard/storytelling/StoryboardStudyMode";

type Params = Promise<{ id: string }>;

export default async function StudyPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['deck-items', id],
    queryFn: async () => {
      const items = await db.select()
        .from(deckItems)
        .where(eq(deckItems.deckId, id))
        .orderBy(asc(deckItems.order));
      return items;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryboardStudyMode storyboardId={id} />
    </HydrationBoundary>
  );
}