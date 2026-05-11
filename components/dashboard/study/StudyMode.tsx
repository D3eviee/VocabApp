"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDeckItems, getDueDeckItems } from '@/app/actions/queries';
import SessionEndView from './SessionEndView';
import SessionEmptyView from './SessionEmptyView';
import StudyModeHeader from './StudyModeHeader';
import FlashcardView from './FlashcardView';
import StudyModeControls from './StudyModeControls';

export default function StudyMode({ deckId }: { deckId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items-due', deckId],
    queryFn: async () => getDueDeckItems(deckId)
  });

  // EMPTY VIEW
  if (cards.length === 0) return (<SessionEmptyView deckId={deckId}/>)
  // FINISH VIEW
  if (isFinished) return (<SessionEndView/>)

  const currentCard = cards[currentIndex];
 
  return (
    <div className='min-h-dvh md:min-h-full bg-[#F2F2F2] flex flex-col md:py-6'>
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col bg-white md:rounded-3xl md:border border-gray-200 md:shadow-sm overflow-hidden">
        
        <StudyModeHeader cardsCount={cards.length} currentIndex={currentIndex}/>
      
        {/* STUDY AREA */}
        <main className="flex-1 w-full px-4 md:px-8 flex flex-col items-center pb-6">
          <div className='flex-1 w-full relative flex items-center justify-center py-6 md:py-10 max-h-[70vh] md:max-h-none'>
            <FlashcardView 
              currentCard={currentCard} 
              isFlipped={isFlipped} 
              setIsFlipped={setIsFlipped}
            />
          </div>

          <div className="w-full shrink-0">
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
        </main>
      </div>
    </div>
  );
}