import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import StudyMode from "@/components/dashboard/study/StudyMode";
import { getDueDeckItems } from "@/app/actions/queries";

type Params = Promise<{ id: string }>;

export default async function StudyPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['deck-items-due', id],
    queryFn: async () => getDueDeckItems(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyMode deckId={id} />
    </HydrationBoundary>
  );
}
