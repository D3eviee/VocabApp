"use client";

import { useRef, useTransition } from "react";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { createPlaygroundFlashcardAction, updatePlaygroundCardAction } from "@/app/actions/playgrounds";
import { PlaygroundCard } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const LeftPanel = ({ playgroundId, playgroundTitle, playgroundCards }: { playgroundId: string; playgroundTitle: string; playgroundCards: PlaygroundCard[] }) => {
  const { 
    newFlashcardPosition, 
    editingFlashcardId, 
    clearSelection, 
    setHoveredFlashcardId, 
    setEditingFlashcardId ,
    selectedMeshName
  } = usePlaygroundStore();
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  // SEARCHING FOR EXISTING FLASHCARD TO EDIT
  const editingCard = editingFlashcardId  ? playgroundCards.find(c => c.id === editingFlashcardId) : null;
  // HELPER CONST FOR ACTIVE STATE OF FORM
  const isActive = newFlashcardPosition || editingCard; 

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      if (editingCard) {
        // UPDATE AND DESELECT ELEMENT TO CLOSE FORM
        await updatePlaygroundCardAction(editingCard.id, formData);
        // 
        clearSelection();
      } else if (newFlashcardPosition) {
        // CREATE AND DESELECT ELEMENT TO CLOSE FORM
        await createPlaygroundFlashcardAction(playgroundId, newFlashcardPosition, selectedMeshName, formData);
        clearSelection();
      }
    });
  };

  return (
    <div className="w-full h-full border-r border-r-white bg-[#F5F5F5] flex flex-col">
      
      
      {/* HEADER */}
      <div className="flex flex-col gap-1.5 mb-6 ">
        <div className="p-2 flex items-center justify-between shrink-0 bg-white lg:bg-[#F2F2F2] border-b lg:border-none border-gray-100">
          <Link
            href="/dashboard" 
            className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
          >
            <ChevronLeft size={22} color="#2B7FFF"/> 
          </Link>
        </div>

        <div className="flex flex-col gap-1.5 mx-6">
          <h1 className="text-2xl font-semibold text-gray-900  leading-none ">{playgroundTitle}</h1>
          <p className="text-[#555] text-sm font-light leading-none">Prepare your model for studying</p>
        </div>
      </div>
      
      <div className="relative bg-white rounded-3xl mb-6 mx-6">
        {/* ACTIVE FORM */}
        <div 
          className={`p-6 transition-opacity duration-300 ${!isActive && 'pointer-events-none select-none'}`}
          aria-hidden={!isActive}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-900">{editingCard ? "Edit card" : "Create card"}</h3>
            <button 
              onClick={clearSelection} 
              className="text-xs text-gray-400 hover:text-red-500 transition-all cursor-pointer px-2 py-1 rounded-lg hover:bg-red-300"
              disabled={!(newFlashcardPosition || editingCard)}
            >
              Cancel
            </button>
          </div>
          
          <form key={editingCard?.id || 'new'} ref={formRef} action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tytuł</label>
              <input 
                name="title" 
                required 
                defaultValue={editingCard?.title || ""}
                className="w-full border border-gray-200 rounded-lg p-2 text-black text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" 
                placeholder="np. Blok silnika" 
                disabled={!(newFlashcardPosition || editingCard)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Opis</label>
              <textarea 
                name="description" 
                required 
                defaultValue={editingCard?.description || ""}
                className="w-full border border-gray-200 text-black rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" 
                rows={3} 
                placeholder="Dodaj objaśnienie..." 
                disabled={!(newFlashcardPosition || editingCard)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending || !(newFlashcardPosition || editingCard)}
              className="w-full bg-blue-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isPending ? "Zapisywanie..." : (editingCard ? "Zapisz zmiany" : "Zapisz fiszkę")}
            </button>
          </form>
        </div>
        
        {/* BLUR - WHEN FORM IS NOT ACTIVE */}
        {!isActive && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/65 rounded-3xl backdrop-blur-xs animate-in fade-in duration-500">
            <p className="text-gray-500 font-medium text-sm drop-shadow-sm text-center px-6">Select an element to create a card.</p>
          </div>
        )}
      </div>
  
      {/* CARDS LIST */}
      <div className="h-full flex flex-col gap-2 mx-6">
        <p className="text-sm font-semibold text-gray-700">Created cards</p>

        {(playgroundCards && playgroundCards.length > 0) ? (
          <div className="min-h-full max-h-full overflow-scroll space-y-2">
            {playgroundCards.map((card) => (
              <div 
                key={card.id}
                onClick={() => setEditingFlashcardId(card.id)}
                onMouseEnter={() => setHoveredFlashcardId(card.id)}
                onMouseLeave={() => setHoveredFlashcardId(null)}
                className={`px-4 py-3 rounded-2xl border border-[#D4D4D4] shadow-xs transition-all cursor-pointer group 
                  ${editingFlashcardId === card.id ? 'bg-violet-100 border-violet-600  ' : 'bg-white hover:border-violet-300 ' }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${editingFlashcardId === card.id ? 'bg-violet-500' : 'bg-gray-300'}`} />
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-sm font-semibold text-gray-800 leading-none">{card.title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-50 leading-none">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ): <p className="text-[#555] mx-auto font-light text-sm pt-6">No items. Add your first card.</p>}
      </div>
    </div>
  );
}