import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { StoryboardEditor } from "@/components/dashboard/storytelling/StoryboardEditor";
import { getStoryboardItems } from '@/app/actions/storyboard';

type Params = Promise<{ id: string }>;

export default async function StoryboardEditPage({ params }: { params: Params }) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['storyboard-items', id], 
    queryFn: () => getStoryboardItems(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
      <StoryboardEditor storyboardId={id} />
    </HydrationBoundary>
  );
}