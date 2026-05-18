"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDueDeckItems } from '@/app/actions/queries';
import { SessionEndView } from './SessionEndView';
import { SessionEmptyView } from './SessionEmptyView';
import { StudyModeHeader } from '../StudyModeHeader';
import { FlashcardView } from './FlashcardView';
import { StudyModeControls } from './StudyModeControls';

export default function StudyMode({ deckId }: { deckId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items-due', deckId],
    queryFn: () => getDueDeckItems(deckId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (cards.length === 0) return <SessionEmptyView />;
  if (isFinished) return <SessionEndView />;

  const currentCard = cards[currentIndex];
  if (!currentCard) return null; 
 
  return (
    <div className='w-full h-full md:min-h-full flex flex-col'>
      <div className="relative flex-1 w-full bg-white mx-auto flex flex-col overflow-hidden">
        <StudyModeHeader/>

        <div className='flex-1 w-full min-h-0 md:w-120 mx-auto'>
          <FlashcardView 
            key={currentCard.id} 
            currentCard={currentCard} 
            isFlipped={isFlipped} 
            setIsFlipped={setIsFlipped}
          />
        </div>

        <div className="w-full shrink-0 px-4 md:pb-10">
          <StudyModeControls
            deckId={deckId}
            currentIndex={currentIndex}
            cardsAmount={cards.length}
            currentCard={currentCard}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            setIsFinished={setIsFinished}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      </div>
    </div>
  );
}