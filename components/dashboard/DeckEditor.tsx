"use client";
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEditorStore } from '@/store/use-editor-store';
import { DeckMenu } from '@/components/dashboard/DeckMenu';
import { getFlashcardDeckItems } from '@/app/actions/queries';
import { EditCardPanel } from './EditCardPanel';

export default function DeckEditor({ deckId }: { deckId: string }) {
  const { activeCardId, setActiveCardId } = useEditorStore();
  const [isMounted, setIsMounted] = useState(false);

  // DISPLAY MODE FOR MOBILE AND DESKTOP VIEW
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-flashcards-items', deckId],
    queryFn: () => getFlashcardDeckItems(deckId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // WHEN ON DESKTOP, SET FIRST FLASCARD AS ACTIVE
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
    <div className=" inset-0 flex flex-row bg-white lg:bg-[#F5F5F7] overflow-hidden w-full">
      {/* SIDEBAR (Lista). Ukryta na mobile, gdy jesteśmy w edytorze. Na desktopie zawsze widoczna. */}
      <div className={`${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 shrink-0 h-full`}>
        <DeckMenu deckId={deckId} onNavigateToEditor={handleCardSelectOnMobile}/>
      </div>

      {/* MAIN CONTENT (Edytor). Ukryty na mobile, gdy jesteśmy w liście. Na desktopie zawsze widoczny. */}
      <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} flex-1 h-full`}>
        {activeCardId 
          ? (<EditCardPanel deckId={deckId} onBack={() => setMobileView('list')} />) 
          /* NO CARDS - EMPTY STATE FOR DESKTOP*/ 
          : (<div className="hidden lg:flex flex-1 items-center justify-center text-gray-400">Select or create a card to start editing</div>)
        }
      </div>
    </div>
  );
}
