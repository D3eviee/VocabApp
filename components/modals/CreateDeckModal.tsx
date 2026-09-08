"use client";
import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation"; 
import { useModal } from "@/store/modal-store";
import { InputField } from "../auth/InputField";
import { SubmitButton } from "../auth/SubmitButton";
import { BaseModal } from "./BaseModal";
import { createDeckAction } from "@/app/actions/decks";
import { CreateDeckState } from "@/lib/types";
import { CancelButton } from "../dashboard/ui/CancelButton";
import { ErrorMessage } from "../dashboard/ui/ErrorMessage";
import { error } from "console";

const initialState: CreateDeckState = { success: false };

export const CreateDeckModal = () => {
  const { isOpen, onClose } = useModal();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createDeckAction, initialState);

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
      isOpen={isOpen} 
      targetType="createDeck"
    >
      <form action={formAction} className="flex flex-col">
        <InputField 
          key={isOpen ? "modal-open" : "modal-closed"} 
          label="Deck Title" 
          name="title" 
          placeholder="e.g. Spanish Basics" 
          required 
          disabled={isPending}
          defaultValue={state.title || ""} 
        />
        
        {state?.error && <ErrorMessage message={state.error}/>}
        
        <div className="flex flex-row gap-3 mt-6">
          <CancelButton onClose={onClose}/>
          <SubmitButton isPending={isPending}>
              {isPending ? "Creating..." : "Create"}
          </SubmitButton> 
        </div>
      </form>
    </BaseModal>
  );
}
