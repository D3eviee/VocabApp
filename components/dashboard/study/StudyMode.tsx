"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDeckItems } from '@/app/actions/queries';
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
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  // EMPTY DECK
  if (cards.length === 0) return (<SessionEmptyView deckId={deckId}/>)
  // SESSION FINISHED
  if (isFinished) return (<SessionEndView/>)

  const currentCard = cards[currentIndex];
 
  return (
    <div className='h-full bg-[#F2F2F2]  md:h-[calc(100vh-56px)]'>
      <div className="max-w-5xl me-auto ms-auto flex flex-col items-center  bg-white rounded-3xl md:border md:shadow-2xs md:mt-12">
        <StudyModeHeader cardsCount={cards.length} currentIndex={currentIndex}/>
      
        {/* STUDY AREA */}
        <main className="h-full w-11/12 md:w-full flex flex-col items-center justify-center pt-10">
          <div className='w-full relative flex justify-center py-6'>
            <FlashcardView 
              currentCard={currentCard} 
              isFlipped={isFlipped} 
              setIsFlipped={setIsFlipped}
            />
          </div>

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
        </main>
      </div>
    </div>
  );
}