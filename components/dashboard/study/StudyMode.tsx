"use client";
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rateCardAction } from '@/app/actions/queries';
import { SessionEndView } from './SessionEndView';
import { SessionEmptyView } from './SessionEmptyView';
import { StudyModeHeader } from '../StudyModeHeader';
import { FlashcardView } from './FlashcardView';
import { StudyModeControls } from './StudyModeControls';
import { getDueDeckItemsAction } from '@/app/actions/flashcards';
import { FlashcardRate, StudyFlashcard } from '@/lib/types';
import { useStudyShortcuts } from '@/lib/hooks/useStudyShortcuts';

export default function StudyMode({ deckId }: { deckId: string }) {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeRating, setActiveRating] = useState<FlashcardRate | null>(null);  
  const [repeatCardsQueue, setRepeatCardsQueue] = useState<StudyFlashcard[]>([]);

  const { data: initialCards = [] } = useQuery({
    queryKey: ['flashcards-due', deckId],
    queryFn: () => getDueDeckItemsAction(deckId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const sessionQueue = [...initialCards, ...repeatCardsQueue];
  const currentCard = sessionQueue[currentIndex];

  // MUTATION FOR SAVING CARD LEARNING RATING
  const mutation = useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string, rating: FlashcardRate}) => rateCardAction(cardId, rating),
    onError: () => console.error("Error occured while saving.")
  });

  const handleRateCard = useCallback((rating: FlashcardRate) => {
    if (!currentCard) return;
    setActiveRating(rating);

    // WE ADD A BIT OF DELAY, SO THE USER CAN SEE RATING BUTTON FEEDBACK
    setTimeout(() => {
      // IF USER RATED "AGAIN" WE ADD THIS CARD TO REPEAT QUEUE
      mutation.mutate({ cardId: currentCard.id, rating });
      if (rating === 'again') setRepeatCardsQueue(prev => [...prev, currentCard]);

      setIsFlipped(false);
      setActiveRating(null);

      if (currentIndex < sessionQueue.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
        queryClient.invalidateQueries({ queryKey: ['flashcards-due', deckId] });
      }
    }, 150); 
  }, [currentCard, sessionQueue.length, currentIndex, mutation, queryClient, deckId]);
  
  // KEYBOARD SUPPORT
  useStudyShortcuts({ 
    isFinished, 
    isQueueEmpty: sessionQueue.length === 0,
    isFlipped,
    onFlip: () => setIsFlipped(true),
    onRate: handleRateCard
  });

  if (sessionQueue.length === 0) return <SessionEmptyView />;
  if (isFinished) return <SessionEndView />;
  if (!currentCard) return null; 

  return (
    <div className='w-full h-full flex flex-col bg-secondary-light'>
      <StudyModeHeader count={sessionQueue.length} currentIndex={currentIndex}/>
        <div className='relative max-w-5xl h-[calc(100%-45px)] w-full mx-auto flex flex-col'>
          <FlashcardView 
            key={`${currentCard.id}-${currentIndex}`} 
            currentCard={currentCard} 
            isFlipped={isFlipped} 
            setIsFlipped={setIsFlipped}
          />

          {isFlipped && <StudyModeControls onRate={handleRateCard} activeRating={activeRating}/> }
        </div>
    </div>
  );
}