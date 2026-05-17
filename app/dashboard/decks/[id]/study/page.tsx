import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import StudyMode from "@/components/dashboard/study/StudyMode";
import { getDeckTitleById, getDueDeckItems } from "@/app/actions/queries";

type Params = Promise<{ id: string }>;

export default async function StudyPage({ params }: { params: Params }) {
  const queryClient = new QueryClient();
  const { id } = await params;

  const [_, deck] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['deck-items-due', id],
      queryFn: () => getDueDeckItems(id),
    }),
    getDeckTitleById(id)
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyMode deckId={id} deckTitle={deck?.title || "Study"}/>
    </HydrationBoundary>
  );
}
