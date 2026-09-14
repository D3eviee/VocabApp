"use client";
import { useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { deleteDeckAction } from "@/app/actions/decks";
import { useQueryClient } from "@tanstack/react-query";
import { BaseModal } from "../modals/BaseModal";
import { Button } from "../dashboard/ui/Button";

export const DeleteDeckDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const isModalOpen = isOpen && type === "deleteDeckConfirm";
  const deckId = data.deckId;
  
  const handleDelete = () => {
    if (!deckId) return;

    startTransition(async () => {
      try {
        const result = await deleteDeckAction(deckId);
        
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ['flashcards-due', deckId] });
          // TODO: SUCCESS TOAST HERE
          onClose();
        } else {
          alert("Error occured");
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
        <h1 className="text-lg text-heading font-semibold">Delete this item?</h1>
        <p className="text-15 text-subheading font-light mt-1">
          This will permanently delete all data from your deck. This action cannot be undone.
        </p>
      </div>

      {/* ACTION BUTTONS */}
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
          onClick={handleDelete}
          isLoading={isPending}
          disabled={!deckId}
        >
          Delete
        </Button>
      </div>
    </BaseModal>
  );
}
