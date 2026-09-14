"use client";
import { useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { useQueryClient } from "@tanstack/react-query";
import { BaseModal } from "../modals/BaseModal";
import { Button } from "../dashboard/ui/Button";
import { deleteDeckItemAction } from "@/app/actions/decks";

export const DeleteItemDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const isModalOpen = isOpen && type === "deleteItemConfirm";
  const itemId = data?.itemId;
  const itemType = data?.itemType;
  const deckId = data?.deckId;

  const handleDelete = () => {
    if (!itemId || !itemType || !deckId) return;

    startTransition(async () => {
      try {
        const result = await deleteDeckItemAction(deckId, itemId);
        if (result?.success) {
          if (itemType === "storyboard") 
            queryClient.invalidateQueries({ queryKey: ['storyboard-items', deckId] });
          else if (itemType === "flashcard")
            queryClient.invalidateQueries({ queryKey: ['flashcards-items', deckId] });

          // TODO: TOAST
          onClose();
        } else {
           // TODO: TOAST
        }
      } catch (error) {
        console.error("Delete Error:", error);
         // TODO: TOAST
      }
    });
  };
  
  return (
    <BaseModal isOpen={isModalOpen} >
      <div className="text-center flex flex-col">
        <h1 className="text-lg text-heading font-semibold">Delete this item?</h1>
        <p className="text-15 text-subheading font-light mt-1">
          This action cannot be undone. Item will be permanently removed.
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
          disabled={!itemId}
        >
          Delete
        </Button>
      </div>
    </BaseModal>
  );
}