"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { useModal } from '@/store/modal-store';
import { Save, Plus, Loader2, Trash } from 'lucide-react';
import { useFlashcardQueries } from '@/lib/hooks/useFlashcardsQueries';
import { Flashcard } from '@/lib/types';
import { normalizeFlashcardData } from '@/lib/NormalizeFlashcardData';

export const EditCardPanelToolbar = ({ deckId, onBack }: { deckId: string, onBack: () => void }) => {
  const { onOpen } = useModal();
  const {setActiveCardId, activeCardId, formData, setFormData } = useEditorStore();
  
  // DATA FETCHING
  const { deckQuery, updateCard, createCard } = useFlashcardQueries(deckId);
  const { data: cards = [] } = deckQuery;

  const handleSave = () => {
    if (!formData?.id) return;
    updateCard.mutate(
      { id: formData.id, data: formData },
      { onSuccess: () => { if (window.matchMedia('(max-width: 1023px)').matches) onBack(); } }
    );
  };

  // DELETE MODAL HANDLING
  const handleDelete = () => {
    if (!formData?.id) return;
    onOpen("deleteItemConfirm", { 
      itemId: formData.id, deckId: deckId, itemType: "flashcard",
       onSuccess: () => { setActiveCardId(null); onBack(); }
    });
  };

  // CREAETE MODAL HANDLING
  const handleCreate = () => {
    createCard.mutate(undefined, {
      onSuccess: (result) => {
        if (result?.success && result.data) setActiveCardId(result.data.id);
      }
    });
  };


  useEffect(() => {
    if (!activeCardId) {
      setFormData(null);
      return;
    }

    const card = cards.find((c: Flashcard) => c.id === activeCardId);
    if (card && formData?.id !== activeCardId) {
      setFormData(normalizeFlashcardData(card));
    }
  }, [activeCardId, cards, formData?.id, setFormData]);

  if (!formData) 
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 font-medium bg-white lg:bg-transparent h-full">
        Select a flashcard...
      </div>
    )
    
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-2 shrink-0 bg-main-light/80  backdrop-blur-xs border-b border-gray-200/60">
      <span className="text-main-dark font-bold text-sm">Edit Card</span>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* DELETE */}
        <button
          onClick={handleDelete}
          className="p-1 text-error-secondary hover:bg-button-background rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Delete card"
        >
          <Trash size={20} />
        </button>
        
        {/* ADD */}
        <button
          onClick={handleCreate}
          disabled={createCard.isPending}
          className="p-1 text-button-blue hover:bg-button-background rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Create new card"
        >
          {createCard.isPending ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        </button>
        
        {/* SAVE */}
        <button
            onClick={handleSave}
            disabled={updateCard.isPending}
            className="flex items-center gap-1 px-2.5 py-1 ml-1 bg-main-gradient hover:bg-linear-to-l text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {updateCard.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="hidden sm:inline">{updateCard.isPending ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>
  );
}