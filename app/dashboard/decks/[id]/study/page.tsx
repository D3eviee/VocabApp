import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import StudyMode from "@/components/dashboard/study/StudyMode";
import { getDueDeckItemsAction } from '@/app/actions/flashcards';

type Params = Promise<{ id: string }>;

export default async function StudyPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['flashcards-due', id],
    queryFn: () => getDueDeckItemsAction(id),
    staleTime: Infinity,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyMode deckId={id} />
    </HydrationBoundary>
  );
}