"use client";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditorStore } from '@/store/use-editor-store';
import { createStorytelingCardAction, getDeckItems, reorderStoryPartsAction } from '@/app/actions/queries';
import { Plus, AlignLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { StoryboardMenuItem } from './StoryboardMenuItem';

export default function StoryboardMenu({ storyboardId }: { storyboardId: string }) {
  const queryClient = useQueryClient();
  const { activeCardId, setActiveCardId } = useEditorStore();

  const { data: storyParts = [], isLoading } = useQuery({
    queryKey: ['story-items', storyboardId],
    queryFn: () => getDeckItems(storyboardId),
  });

  // Lokalny stan dla gładkich animacji DND
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const sorted = [...storyParts].sort((a, b) => (a.order || 0) - (b.order || 0));
    setItems(sorted);
  }, [storyParts]);

  // Sensory wykrywające akcje przeciągania
  const sensors = useSensors(
    // 5px marginesu błędu pozwala na kliknięcie bez przypadkowego aktywowania drag
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addMutation = useMutation({
    mutationFn: () => createStorytelingCardAction(storyboardId),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['story-items', storyboardId] });
        if (result.id) setActiveCardId(result.id);
      }
    }
  });

  const reorderMutation = useMutation({
    mutationFn: (newOrder: { id: string, order: number }[]) => reorderStoryPartsAction(newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-items', storyboardId] });
    }
  });

  // Obsługa upuszczenia elementu
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((i) => i.id === active.id);
        const newIndex = currentItems.findIndex((i) => i.id === over.id);
        
        // Zmiana kolejności w lokalnej tablicy
        const newArray = arrayMove(currentItems, oldIndex, newIndex);
        
        // Przygotowanie payloadu do bazy (nowe numery order)
        const payload = newArray.map((item, idx) => ({
          id: item.id,
          order: idx
        }));

        // Wysłanie do bazy
        reorderMutation.mutate(payload);

        return newArray;
      });
    }
  };

  return (
    <aside className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* NAV */}
      <div className="p-4">
        <Link
          href="/dashboard" 
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-[13px] font-medium transition-colors w-fit"
        >
          <ChevronLeft size={16} /> Back to Decks
        </Link>

        <div className="flex flex-row items-center justify-between mt-6">
          <div className="flex items-center gap-3 text-gray-900 font-bold">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
              <AlignLeft size={16} strokeWidth={2} />
            </div>
            <h2 className="text-xl">Storyboard</h2>
          </div>
          
          <button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending}
            className="p-2 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-white hover:shadow-sm hover:border-gray-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            title="Add new part"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* LISTA CZĘŚCI HISTORII Z DRAG & DROP */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-1">
        {isLoading ? (
          <div className="text-center text-sm font-medium text-gray-400 mt-8 animate-pulse">
            Loading story...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl mt-4">
            <p className="text-sm font-medium text-gray-400 mb-2">No parts yet.</p>
            <p className="text-xs text-gray-400">Click the + button to start your story.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((part: any, index: number) => (
                <StoryboardMenuItem 
                  key={part.id} 
                  part={part} 
                  index={index} 
                  isActive={activeCardId === part.id}
                  onSelect={setActiveCardId}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  );
}