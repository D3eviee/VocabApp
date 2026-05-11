"use client";
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEditorStore } from '@/store/use-editor-store';
import DeckMenu from '@/components/dashboard/DeckMenu';
import { getDeckItems } from '@/app/actions/queries';
import EditCardPanel from './EditCardPanel';

export default function DeckEditor({ deckId }: { deckId: string }) {
  const { activeCardId, setActiveCardId } = useEditorStore();

  // DISPLAY MODE FOR MOBILE AND DESKTOP VIEW
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
    refetchOnWindowFocus: false,
    staleTime: 1000* 60 * 5
  });

  useEffect(() => {
    if (!activeCardId && cards.length > 0) {
      if (window.innerWidth >= 1024) {
        setActiveCardId(cards[0].id);
      }
    }
  }, [activeCardId, cards, setActiveCardId]);


  return (
    <div className="h-dvh md:h-full flex flex-row bg-white lg:bg-[#F5F5F7] overflow-hidden w-full">
      <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 shrink-0 h-full`}>
        <DeckMenu 
          deckId={deckId} 
          onCardSelect={(id) => {
            setActiveCardId(id);
            setMobileView('editor'); // Po kliknięciu idziemy do edytora
          }}
          onNewCard={(id) => {
            setActiveCardId(id);
            setMobileView('editor'); // Po stworzeniu nowej idziemy do edytora
          }}
        />
      </div>

      <div className={`${mobileView === 'editor' ? 'flex' : 'hidden'} lg:flex flex-1 h-full`}>
        <EditCardPanel 
          deckId={deckId} 
          onBack={() => setMobileView('list')}
        />
      </div>
    </div>
  );
}