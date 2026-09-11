"use client";
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { DeckMenu } from '@/components/dashboard/DeckMenu';
import { EditCardPanel } from './EditCardPanel';
import { useFlashcardQueries } from '@/lib/hooks/useFlashcardsQueries';

export default function DeckEditor({ deckId }: { deckId: string }) {
  const activeCardId = useEditorStore((state) => state.activeCardId);
  const setActiveCardId = useEditorStore((state) => state.setActiveCardId);
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  // DATA FETCHING
  const { deckQuery } = useFlashcardQueries(deckId);
  const { data: cards = [] } = deckQuery;


  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop && cards.length > 0 && !activeCardId) {
      setActiveCardId(cards[0].id);
    }
  }, [cards, activeCardId, setActiveCardId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileView('list');
    };
      
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const handleCardSelectOnMobile = () => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobile) setMobileView('editor');
  }

  return (
    <div className="relative flex flex-row  overflow-hidden w-full h-full">
      <div className={`${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 shrink-0 h-full`}>
        <DeckMenu deckId={deckId} onNavigateToEditor={handleCardSelectOnMobile}/>
      </div>

      <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} flex-1 h-full min-h-0`}>
        {activeCardId 
          ? <EditCardPanel deckId={deckId} onBack={() => setMobileView('list')} />
          : 
            <div className="hidden lg:flex flex-1 items-center justify-center text-gray-400 bg-white lg:bg-transparent">
              Select or create a card to start editing
            </div>
        }
      </div>
    </div>
  );
}