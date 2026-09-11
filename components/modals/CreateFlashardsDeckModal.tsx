"use client";
import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation"; 
import { useModal } from "@/store/modal-store";
import { FloatingInputField } from "../auth/FloatingInputField";
import { BaseModal } from "./BaseModal";
import { CreateDeckState } from "@/lib/types";
import { ErrorMessage } from "../dashboard/ui/ErrorMessage";
import { Button } from "../dashboard/ui/Button";
import { createFlashcardsDeckAction } from "@/app/actions/flashcards";
import { Loader2Icon } from "lucide-react";

const initialState: CreateDeckState = { success: false };

export const CreateFlashardsDeckModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createFlashcardsDeckAction, initialState);

  const isModalOpen = isOpen && type === "createFlashcardsDeck";

  useEffect(() => {
    if (state.success && state.deckId) {
      onClose();
      router.push(`/dashboard/decks/${state.deckId}/edit`); 
    }
  }, [state.success, state.deckId, onClose, router]);

  return (
    <BaseModal
      onClose={onClose} 
      title="New Deck" 
      isOpen={isModalOpen} 
    >
      <form action={formAction} className="flex flex-col">
        <FloatingInputField 
          id="deck-title"
          key={isModalOpen ? "modal-open" : "modal-closed"} 
          label="Title" 
          name="title" 
          required 
          disabled={isPending}
          defaultValue={state.title || ""} 
        />
        
        {state?.error && <ErrorMessage message={state.error}/>}
        
        <div className="flex flex-row gap-3 mt-6">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isPending}
          >
            {isPending ? <Loader2Icon size={16} color="white" className="animate-spin"/> : "Create"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}