import { rateCardAction } from "@/app/actions/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudyModeControlsButton } from "./StudyModeControlsButton";

type StudyModeControlsProps = {
  deckId: string;
  currentIndex: number;
  cardsAmount: number;
  currentCard: any;
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  setIsFinished: (val: boolean) => void;
  setCurrentIndex: (value: React.SetStateAction<number>) => void;
}

const RATING_OPTIONS = [
  { type: 'again', label: 'Again', timeHint: '< 1 min' },
  { type: 'hard', label: 'Hard', timeHint: '1 day' },
  { type: 'good', label: 'Good', timeHint: '3 days' },
  { type: 'easy', label: 'Easy', timeHint: '5 days' },
] as const;

export const StudyModeControls = ({ 
  deckId, setCurrentIndex, setIsFlipped, isFlipped, 
  setIsFinished, currentIndex, currentCard, cardsAmount 
}: StudyModeControlsProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string, rating: 'again' | 'hard' | 'good' | 'easy' }) => rateCardAction(cardId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck-flashcards-items', deckId] });

      // Resetujemy obrót (Fiszka zniknie z ekranu i pojawi się nowa)
      setIsFlipped(false);

      // Przechodzimy dalej lub kończymy
      if (currentIndex < cardsAmount - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
        // Opcjonalnie: na sam koniec sesji możemy wreszcie odświeżyć due-items
        queryClient.invalidateQueries({ queryKey: ['deck-items-due', deckId] });
      }
    }
  });

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    mutation.mutate({ cardId: currentCard.id, rating });
  };

  return (
    <div className="w-full flex flex-row items-center justify-center py-1">
      {isFlipped &&
        <div className="flex flex-row justify-center gap-2 sm:gap-4 w-full">
          {RATING_OPTIONS.map((option) => (
            <StudyModeControlsButton
              key={option.type}
              type={option.type}
              label={option.label}
              timeHint={option.timeHint}
              disabled={mutation.isPending}
              onClick={() => handleRateCard(option.type)}
            />
          ))}
        </div>
    }
    </div>
  )
}