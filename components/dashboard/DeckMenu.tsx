"use client"
import Link from "next/link";
import { ChevronLeft, Plus, Loader2 } from "lucide-react";
import { DeckMenuItem } from "./DeckMenuItem";
import { useEditorStore } from '@/store/use-editor-store';
import { useFlashcardQueries } from "@/lib/hooks/useFlashcardsQueries";

type DeckMenuProps = {
  deckId: string;
  onNavigateToEditor: () => void;
}

export const DeckMenu = ({ deckId, onNavigateToEditor }: DeckMenuProps) => {
  const { setActiveCardId } = useEditorStore(); 
  
  // LOGIKA Z HOOKA
  const { deckQuery, createCard } = useFlashcardQueries(deckId);
  const { data: cards = [], isLoading } = deckQuery;

  const handleCreate = () => {
    createCard.mutate(undefined, {
      onSuccess: (result) => {
        if (result?.success && result.data) {
          setActiveCardId(result.data.id);
          onNavigateToEditor(); 
        }
      }
    });
  };

  const handleCardClick = (id: string) => {
    setActiveCardId(id);
    onNavigateToEditor();
  };

  return (
    <aside className="relative w-full h-full bg-white lg:bg-[#F2F2F2] border-r border-gray-100 lg:border-gray-200 flex flex-col overflow-hidden">
      <div className="top-0 p-2 flex items-center justify-between shrink-0 bg-white lg:bg-[#F2F2F2] border-b lg:border-none border-gray-100">
        <Link
          href="/dashboard" 
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft size={22} color="#2B7FFF"/> 
        </Link>

        <p className="text-[#2B2B2B] font-bold">Cards</p>

        <button
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg transition-colors hover:cursor-pointer disabled:opacity-50"
          onClick={handleCreate}
          disabled={createCard.isPending}
        >
          {createCard.isPending 
            ? (<Loader2 size={20} className="animate-spin text-gray-400" />) 
            : (<Plus size={20} color="#2B7FFF" />)
          }
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-2 lg:p-3 flex flex-col gap-[0.5px]">
        {/* OBSŁUGA ŁADOWANIA */}
        {isLoading ? (
          <div className="text-center text-sm font-medium text-gray-400 mt-8 animate-pulse">Loading cards...</div>
        ) : cards.length === 0 && !createCard.isPending ? ( 
          <div className="text-center py-10 text-sm text-gray-400 font-medium">No cards in this deck.</div>
        ) : (
          cards.map((card: any) => (
            <div key={card.id} onClick={() => handleCardClick(card.id)} className="shrink-0 hover:cursor-pointer">
              <DeckMenuItem front={card.front} id={card.id} partOfSpeech={card.partOfSpeech}/>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}