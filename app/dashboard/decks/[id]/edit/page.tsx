import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import DeckEditor from "@/components/dashboard/DeckEditor";
import { getCardsForFlashcardDeckAction } from '@/app/actions/flashcards';

type Params = Promise<{ id: string }>;

export default async function DeckPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['flashcards-items', id],
    queryFn: () => getCardsForFlashcardDeckAction(id),
    staleTime: Infinity,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
      <DeckEditor deckId={id} />
    </HydrationBoundary>
  );
}