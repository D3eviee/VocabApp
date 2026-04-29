"use client";
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEditorStore } from '@/store/use-editor-store';
import { getDeckItems } from '@/app/actions/queries';
import StoryboardMenu from './StoryboardMenu';
import EditStoryPartPanel from './EditStoryPartPanel';

export default function StoryboardEditor({ storyboardId }: { storyboardId: string }) {
  const { activeCardId, setActiveCardId } = useEditorStore();

  const { data: storyParts = [] } = useQuery({
    queryKey: ['story-items', storyboardId],
    queryFn: () => getDeckItems(storyboardId), // Ponownie wykorzystujemy starą akcję, bo to wciąż pobieranie z deckItems
  });

  // Automatyczne zaznaczenie pierwszej części historii po wejściu do edytora
  useEffect(() => {
    if (!activeCardId && storyParts.length > 0) {
      setActiveCardId(storyParts[0].id);
    }
  }, [activeCardId, storyParts, setActiveCardId]);

  return (
    <div className="h-full flex flex-row bg-[#F5F5F7] overflow-hidden">
      <StoryboardMenu storyboardId={storyboardId} />
      <EditStoryPartPanel storyboardId={storyboardId} />
    </div>
  );
}