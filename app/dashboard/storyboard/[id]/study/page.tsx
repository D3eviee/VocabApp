import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { StoryboardStudyMode } from "@/components/dashboard/storytelling/StoryboardStudyMode";
import { getStoryboardItems } from '@/app/actions/storyboard'; 

type Params = Promise<{ id: string }>;

export default async function StudyPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['storyboard-items', id],
    queryFn: () => getStoryboardItems(id),
    staleTime: Infinity,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoryboardStudyMode storyboardId={id} />
    </HydrationBoundary>
  );
}