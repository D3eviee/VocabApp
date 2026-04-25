"use client";
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEditorStore } from '@/store/use-editor-store';
import DeckMenu from '@/components/dashboard/DeckMenu';
import { getDeckItems } from '@/app/actions/queries';
import EditCardPanel from './EditCardPanel';

export default function DeckEditor({ deckId }: { deckId: string }) {
  const { activeCardId, setActiveCardId } = useEditorStore();

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  useEffect(() => {
    if (!activeCardId && cards.length > 0) {
      setActiveCardId(cards[0].id);
    }
  }, [activeCardId, cards, setActiveCardId]);

  return (
    <div className="h-full flex flex-row bg-[#F5F5F7] overflow-hidden">
      <DeckMenu deckId={deckId} />
      <EditCardPanel deckId={deckId} />
    </div>
  );
}