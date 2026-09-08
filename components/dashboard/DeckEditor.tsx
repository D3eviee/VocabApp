"use client";
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { DeckMenu } from '@/components/dashboard/DeckMenu';
import { EditCardPanel } from './EditCardPanel';
import { useFlashcardQueries } from '@/lib/hooks/useFlashcardsQueries';

export default function DeckEditor({ deckId }: { deckId: string }) {
  const { activeCardId, setActiveCardId } = useEditorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  const { deckQuery } = useFlashcardQueries(deckId);
  const { data: cards = [] } = deckQuery;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && cards.length > 0 && !activeCardId) {
      if (window.innerWidth >= 1024) setActiveCardId(cards[0].id);
    }
  }, [isMounted, cards, activeCardId, setActiveCardId]);

  const handleCardSelectOnMobile = () => {
    if (window.innerWidth < 1024) setMobileView('editor');
  };

  if (!isMounted) return null;

  return (
    <div className="inset-0 flex flex-row bg-white lg:bg-[#F5F5F7] overflow-hidden w-full h-full">
      <div className={`${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 shrink-0 h-full`}>
        <DeckMenu deckId={deckId} onNavigateToEditor={handleCardSelectOnMobile}/>
      </div>

      <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} flex-1 h-full min-h-0`}>
        {activeCardId 
          ? (<EditCardPanel deckId={deckId} onBack={() => setMobileView('list')} />) 
          : (<div className="hidden lg:flex flex-1 items-center justify-center text-gray-400 bg-white lg:bg-transparent">Select or create a card to start editing</div>)
        }
      </div>
    </div>
  );
}