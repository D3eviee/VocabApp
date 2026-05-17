import { getFlashcardDeckItems, createCardAction, updateCardAction, deleteCardAction  } from '@/app/actions/flashcards';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFlashcardQueries = (deckId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['flashcards-items', deckId];
  
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  // GET FLASCARDS
  const deckQuery = useQuery({
    queryKey,
    queryFn: () => getFlashcardDeckItems(deckId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  
  // CREATE CARD
  const createCard = useMutation({
    mutationFn: () => createCardAction(deckId),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // UPDATE CARD
  const updateCard = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateCardAction(id, data),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // 4. DELETE CARD
  const deleteCard = useMutation({
    mutationFn: (id: string) => deleteCardAction(id),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  return { deckQuery, createCard, updateCard, deleteCard };
};