"use client";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Loader2 } from "lucide-react";
import { StoryboardMenuItem } from "./StoryboardMenuItem";
import { useStoryboardStore } from '@/store/use-storyboard-store';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStoryboardQueries } from "@/lib/hooks/useStoryboardQueries";

type StoryboardMenuProps = {
  storyboardId: string;
  onNavigateToEditor: () => void;
}

export const StoryboardMenu = ({ storyboardId, onNavigateToEditor }: StoryboardMenuProps) => {
  const { activePartId, setActivePartId } = useStoryboardStore(); 
  const { storyQuery, createPart, reorderParts } = useStoryboardQueries(storyboardId);
  const { data: storyParts = [], isLoading } = storyQuery;

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const sorted = [...storyParts].sort((a, b) => (a.order || 0) - (b.order || 0));
    setItems(sorted);
  }, [storyParts]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleCreate = () => {
    createPart.mutate(undefined, {
      onSuccess: (result) => {
        if (result?.success && result.id) {
          setActivePartId(result.id);
          onNavigateToEditor(); 
        }
      }
    });
  };

  const handlePartClick = (id: string) => {
    setActivePartId(id);
    onNavigateToEditor();
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
  };

  return (
    <aside className="relative w-full h-full bg-white lg:bg-[#F2F2F2] border-r border-gray-100 lg:border-gray-200 flex flex-col overflow-hidden">
      <div className="p-2 flex items-center justify-between shrink-0 bg-white lg:bg-[#F2F2F2] border-b lg:border-none border-gray-100">
        <Link
          href="/dashboard" 
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft size={22} color="#2B7FFF"/> 
        </Link>

        <p className="text-[#2B2B2B] font-bold">Storyboard</p>

        <button
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg transition-colors hover:cursor-pointer disabled:opacity-50"
          onClick={handleCreate}
          disabled={createPart.isPending}
        >
          {createPart.isPending 
            ? (<Loader2 size={20} className="animate-spin text-gray-400" />) 
            : (<Plus size={20} color="#2B7FFF" />)
          }
        </button>
      </div>

      {/* EVENT LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 lg:p-3 flex flex-col gap-[0.5px]">
        {isLoading ? (
          <div className="text-center text-sm font-medium text-gray-400 mt-8 animate-pulse">Loading story...</div>
        ) : items.length === 0 && !createPart.isPending ? ( 
          <div className="text-center py-10 text-sm text-gray-400 font-medium">No events in this story.</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((part: any, index: number) => (
                <div key={part.id} onClick={() => handlePartClick(part.id)} className="shrink-0 hover:cursor-pointer">
                  <StoryboardMenuItem 
                    part={part} 
                    index={index} 
                    isActive={activePartId === part.id} 
                    onSelect={setActivePartId} 
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  )
}