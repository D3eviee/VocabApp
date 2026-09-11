"use client"
import { Plus, Loader2 } from "lucide-react";
import { DeckMenuItem } from "./DeckMenuItem";
import { useEditorStore } from '@/store/use-editor-store';
import { useFlashcardQueries } from "@/lib/hooks/useFlashcardsQueries";
import { BackToDashboardButton } from "./ui/BackToDashboardButton";
import { Flashcard } from "@/lib/types";

type DeckMenuProps = {
  deckId: string;
  onNavigateToEditor: () => void;
}

export const DeckMenu = ({ deckId, onNavigateToEditor }: DeckMenuProps) => {
  const activeCardId = useEditorStore((state) => state.activeCardId);
  const setActiveCardId = useEditorStore((state) => state.setActiveCardId);
  
  // FETCHING DATA WITH HOOK
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
    <aside className="relative w-full h-full bg-main-light border-r border-r-light-border flex flex-col overflow-hidden">
      <div className="top-0 p-2 flex items-center justify-between shrink-0">
        <BackToDashboardButton/>
        <p className="text-main-dark font-bold">Cards</p>

        <button
          className="p-1 hover:bg-button-background rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          onClick={handleCreate}
          disabled={createCard.isPending}
          aria-label="Create new card"
        >
          {createCard.isPending 
            ? (<Loader2 size={20} strokeWidth={2} className="animate-spin text-button-blue"/>) 
            : (<Plus size={22} strokeWidth={2} className="text-button-blue" />)
          }
        </button>
      </div>

      {/* FLASHCARDS LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto py-3 px-2 flex flex-col">
        {isLoading ? (
          <div className="text-center text-sm font-medium text-secondary-dark mt-8 animate-pulse">Loading cards...</div>
        ) : cards.length === 0 && !createCard.isPending ? ( 
          <div className="text-center mt-8 text-sm text-secondary-dark  font-medium">No cards in this deck.</div>
        ) : (
          cards.map((card: Flashcard) => (
            <button 
              key={card.id} 
              onClick={() => handleCardClick(card.id)} 
              className="shrink-0 cursor-pointer  focus:outline-none focus-visible:ring-1 focus-visible:ring-button-blue rounded-2xl"
            >
              <DeckMenuItem 
                front={card.front || "draft"}
                partOfSpeech={card.partOfSpeech || "draft"}
                isActive={activeCardId === card.id} 
              />
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
