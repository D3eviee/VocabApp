import { deleteDeckItemAction } from '@/app/actions/decks';
import { getStoryboardItems, createStoryboardItem, updateStoryboardItem, reorderStoryboardItems } from '@/app/actions/storyboard';
import { StoryboardDraft } from '@/store/use-storyboard-store';
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
  
  const addStoryboardItem = useMutation({
    mutationFn: () => createStoryboardItem(storyboardId),
    onSuccess: (result) => { if (result?.success) invalidate(); },
  });

  // UPDATE
  const updateItem = useMutation({
    mutationFn: ({ storyboardItem }: { storyboardItem:StoryboardDraft }) => updateStoryboardItem(storyboardItem),
    onSuccess: (result) => { if (result?.success) invalidate(); },
  });

  // DELETE
  const deleteStoryboardItem = useMutation({
    mutationFn: (itemId: string) => deleteDeckItemAction(storyboardId, itemId),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // 5. ZMIANA KOLEJNOŚCI (D&D)
  const reorderParts = useMutation({
    mutationFn: (newOrder: { id: string, order: number }[]) => reorderStoryboardItems(newOrder),
    onSuccess: () => invalidate()
  });

  return { storyQuery, addStoryboardItem, updateItem, deleteStoryboardItem, reorderParts };
};