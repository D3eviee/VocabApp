// components/modals/DeleteDeckModal.tsx
"use client";

import { useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { deleteDeckAction } from "@/app/actions/decks";
import { Loader2 } from "lucide-react";
import { BaseDialog } from "./BaseDialog"; // Importujemy nowy wrapper!

export const DeleteDeckDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();

  const deckId = data?.deckId;

  const handleDelete = () => {
    if (!deckId) return;

    startTransition(async () => {
      const result = await deleteDeckAction(deckId);
      if (result.success) {
        onClose();
      } else {
        alert(result.error || "Wystąpił błąd podczas usuwania.");
      }
    });
  };

  return (
    <BaseDialog 
      isOpen={isOpen} 
      type={type} 
      targetType="deleteDeckConfirm" 
      onClose={onClose}
    >
      <div className="text-center flex flex-col mb-6 w-3/4 mx-auto">
        <h1 className="text-lg text-[#111] font-semibold">Delete this item?</h1>
        <p className="text-15 text-[#494949] font-light mt-1">
          This will permanently delete all data from your deck.
        </p>
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
          onClick={handleDelete}
          disabled={isPending || !deckId}
          className="w-full flex items-center justify-center outline-2 outline-transparent bg-[#F61A2D] text-white hover:bg-[#E5191C] px-4 py-2 rounded-xl text-15 font-semibold transition-all active:scale-95 hover:cursor-pointer disabled:opacity-70"
        >
          {isPending ? <Loader2 size={18} className="animate-spin text-white/80" /> : "Delete"}
        </button>
      </div>
    </BaseDialog>
  );
}