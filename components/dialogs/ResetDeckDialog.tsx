"use client";
import { resetDeckProgressAction } from "@/app/actions/decks"; 
import { useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { RotateCcw } from "lucide-react";
import { BaseDialog } from "./BaseDialog"; // Importujemy nowy wrapper!

export const ResetDeckDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();

  const deckId = data?.deckId;

  const handleReset = () => {
    if (!deckId) return;

    startTransition(async () => {
      const result = await resetDeckProgressAction(deckId);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || "Error occured");
      }
    });
  };
  return (
    <BaseDialog 
      isOpen={isOpen} 
      type={type} 
      targetType="resetDeckConfirm" 
      onClose={onClose}
    >
      <div className="text-center flex flex-col mb-6 w-3/4 mx-auto">
        <h1 className="text-lg text-[#111] font-semibold">Reset study progress?</h1>
        <p className="text-15 text-[#494949] font-light mt-1">You won't lose any flashcards, but your spaced repetition history will be cleared.</p>
      </div>

      {/* Przyciski akcji (Cancel / Delete) */}
      <div className="flex flex-row gap-3 mt-2">
        <button
          onClick={onClose}
          disabled={isPending}
          className="w-full outline-2 outline-[#EFEEF4] bg-white hover:bg-[#EFEEF4] text-[#333] px-4 py-3 rounded-xl text-15 transition-all active:scale-95 hover:cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          disabled={isPending || !deckId}
          className="w-full flex items-center justify-center outline-2 outline-transparent bg-[#F61A2D] text-white hover:bg-[#E5191C] px-4 py-2 rounded-xl text-15 font-semibold transition-all active:scale-95 hover:cursor-pointer disabled:opacity-70"
        >
          {isPending ? <RotateCcw size={18} className="animate-spin text-white/80" /> : "Reset"}
        </button>
      </div>
    </BaseDialog>
  );
}