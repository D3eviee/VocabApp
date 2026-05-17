import { getStoryboardItems, createStoryboardItem, deleteStoryboardItem, reorderStoryboardItems, updateStoryboardItem } from '@/app/actions/storyboard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useStoryboardQueries = (storyboardId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['storyboard-items', storyboardId];
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const storyQuery = useQuery({
    queryKey,
    queryFn: () => getStoryboardItems(storyboardId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  
  const createPart = useMutation({
    mutationFn: () => createStoryboardItem(storyboardId),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // UPDATE
  const updatePart = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateStoryboardItem(id, data),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // DELETE
  const deletePart = useMutation({
    mutationFn: (id: string) => deleteStoryboardItem(id),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // 5. ZMIANA KOLEJNOŚCI (D&D)
  const reorderParts = useMutation({
    mutationFn: (newOrder: { id: string, order: number }[]) => reorderStoryboardItems(newOrder),
    onSuccess: () => invalidate()
  });

  return { storyQuery, createPart, updatePart, deletePart, reorderParts };
};