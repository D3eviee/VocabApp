import { rateCardAction } from "@/app/actions/queries";
import { Meaning, WordVariation } from "@/server/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/Button";
import { RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction } from "react"; // Zmień na poprawny import
import { StudyModeControlsButton } from "./StudyModeControlsButton";

type StudyModeControlsProps = {
  deckId: string;
  currentIndex: number;
  cardsAmount: number;
  currentCard: {
    id: string;
    deckId: string;
    order: number;
    front: string | null;
    back: string | null;
    partOfSpeech: string | null;
    meanings: Meaning[];
    dateLabel: string | null;
    title: string | null;
    description: string | null;
    variations: WordVariation[];
    dueDate: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
    createdAt: Date;
  };
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  setIsFinished: (val: boolean) => void;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

type RatingOption = {
  type: 'again' | 'hard' | 'good' | 'easy';
  label: string;
  timeHint: string;
};

const RATING_OPTIONS: RatingOption[] = [
  { type: 'again', label: 'Again', timeHint: '< 1 min' },
  { type: 'hard', label: 'Hard', timeHint: '1 day' },
  { type: 'good', label: 'Good', timeHint: '3 days' },
  { type: 'easy', label: 'Easy', timeHint: '5 days' },
];

const StudyModeControls = ({
  deckId, 
  setCurrentIndex, 
  setIsFlipped, 
  isFlipped, 
  setIsFinished, 
  currentIndex, 
  currentCard, 
  cardsAmount
}: StudyModeControlsProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string, rating: 'again' | 'hard' | 'good' | 'easy' }) => 
      rateCardAction(cardId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });

      setIsFlipped(false);
      if (currentIndex < cardsAmount - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }
  });

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => mutation.mutate({ cardId: currentCard.id, rating });

  return (
    <div className="mt-2 mb-8 flex items-center justify-center w-full max-w-2xl">
      {!isFlipped ? (
        <Button
          onClick={() => setIsFlipped(true)}
          variant="secondary" 
          className="px-8 py-4 rounded-2xl shadow-sm text-base w-full max-w-62.5"
        >
          <RotateCcw size={18} /> Show Answer
        </Button>
      ) : (
        <div className="flex flex-row justify-center gap-4 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
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
      )}
    </div>
  )
}

export default StudyModeControls;