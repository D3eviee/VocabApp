"use client";
import { useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { resetFlashcardsDeckProgressAction } from "@/app/actions/flashcards";
import { useQueryClient } from "@tanstack/react-query";
import { BaseModal } from "../modals/BaseModal";
import { Button } from "../dashboard/ui/Button";

export const ResetDeckDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  
  const isModalOpen = isOpen && type === "resetDeckConfirm";
  const deckId = data?.deckId;
  
  const handleReset = () => {
    if (!deckId) return;

    startTransition(async () => {
      try {
        const result = await resetFlashcardsDeckProgressAction(deckId);
        
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ['flashcards-due', deckId] });
          
          // TODO: SUCCES TOAST HERE
          onClose();
        } else {
          // TODO: ERROR TOAST HERE
        }
      } catch (error) {
        alert(error || "Error occured");
        // TODO: ERROR TOAST HERE
      }
    });
  };

  return (
    <BaseModal 
      isOpen={isModalOpen} 
    >
      <div className="text-center flex flex-col">
        <h1 className="text-lg text-heading font-semibold">Reset study progress?</h1>
        <p className="text-15 text-subheading font-light mt-1">You won't lose any flashcards, but your spaced repetition history will be cleared.</p>
      </div>

      {/* Przyciski akcji (Cancel / Delete) */}
      <div className="flex flex-row gap-3 mt-6">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="danger"
          onClick={handleReset}
          isLoading={isPending}
          disabled={!deckId}
        >
          Reset
        </Button>
      </div>
    </BaseModal>
  );
}