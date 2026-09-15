"use client";
import { useState, useEffect } from 'react';
import { Plus, Loader2 } from "lucide-react";
import { StoryboardMenuItem } from "./StoryboardMenuItem";
import { useStoryboardStore } from '@/store/use-storyboard-store';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStoryboardQueries } from "@/lib/hooks/useStoryboardQueries";
import { BackToDashboardLink } from "../ui/BackToDashboardLink";
import { StoryboardItem } from '@/lib/types';

type StoryboardMenuProps = {
  storyboardId: string;
  onNavigateToEditor: () => void;
}

export const StoryboardMenu = ({ storyboardId, onNavigateToEditor }: StoryboardMenuProps) => {
  const { activeStoryboardItemId, setActivePartId } = useStoryboardStore(); 
  const { storyQuery, addStoryboardItem, reorderParts } = useStoryboardQueries(storyboardId);
  const { data: storyParts = [], isLoading } = storyQuery;

  const [items, setItems] = useState<StoryboardItem[]>([]);

  useEffect(() => {
    const sorted = [...storyParts].sort((a, b) => (a.order || 0) - (b.order || 0));
    setItems(sorted);
  }, [storyParts]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleCreate = () => {
    addStoryboardItem.mutate(undefined, {
      onSuccess: (result) => {
        if (result?.success && result.id) {
          setActivePartId(result.id);
          onNavigateToEditor(); 
        }
      }
    });
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
        if (over && active.id !== over.id) {
        setItems((currentItems) => {
          const oldIndex = currentItems.findIndex((i) => i.id === active.id);
          const newIndex = currentItems.findIndex((i) => i.id === over.id);
          const newArray = arrayMove(currentItems, oldIndex, newIndex);
          
          const payload = newArray.map((item, idx) => ({ id: item.id, order: idx }));
          reorderParts.mutate(payload);
          return newArray;
        });
      }
    }

  return (
    <aside className="relative w-full h-full bg-main-light border-r border-r-light-border flex flex-col overflow-hidden">
      <div className="top-0 p-2 flex items-center justify-between shrink-0">
        <BackToDashboardLink/>
        <p className="text-main-dark font-bold">Storyboard</p>

        <button
          className="p-1 hover:bg-button-background rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          onClick={handleCreate}
          disabled={addStoryboardItem.isPending}
          aria-label="Create new storyboard item"
        >
          {addStoryboardItem.isPending 
            ? (<Loader2 size={20} strokeWidth={2} className="animate-spin text-button-blue"/>) 
            : (<Plus size={22} strokeWidth={2} className="text-button-blue" />)
          }
        </button>
      </div>

      {/* EVENT LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto py-3 px-2 flex flex-col">
        {isLoading ? (
          <div className="text-center text-sm font-medium text-secondary-dark mt-8 animate-pulse">Loading items...</div>
        ) : items.length === 0 && !addStoryboardItem.isPending ? ( 
          <div className="text-center mt-8 text-sm text-secondary-dark  font-medium">No cards in this storyboard.</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <StoryboardMenuItem 
                  key={item.id}
                  storyboardItem={item} 
                  isActive={activeStoryboardItemId === item.id} 
                  onSelect={() => {
                    setActivePartId(item.id);
                    onNavigateToEditor();
                  }} 
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  )
}