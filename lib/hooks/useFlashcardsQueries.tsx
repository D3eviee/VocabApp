import { updateCardAction, getCardsForFlashcardDeckAction, createFlashcardAction  } from '@/app/actions/flashcards';
import { FlashcardDraft } from '@/store/use-editor-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFlashcardQueries = (deckId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['flashcards-items', deckId];
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  // GET FLASCARDS
  const deckQuery = useQuery({
    queryKey,
    queryFn: () => getCardsForFlashcardDeckAction(deckId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  
  // CREATE CARD
  const createCard = useMutation({
    mutationFn: () => createFlashcardAction(deckId),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  // UPDATE CARD
  const updateCard = useMutation({
    mutationFn: ({ id, data }: { id: string, data: FlashcardDraft }) => updateCardAction(id, data),
    onSuccess: (result) => { if (result?.success) invalidate(); }
  });

  return { deckQuery, createCard, updateCard };
};