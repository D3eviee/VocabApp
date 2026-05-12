"use client";
import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation"; 
import { useModal } from "@/store/modal-store";
import { InputField } from "../auth/InputField";
import { SubmitButton } from "../auth/SubmitButton";
import { BaseModal } from "./BaseModal";
import { createDeckAction } from "@/app/actions/decks";
import { CreateDeckState } from "@/lib/types";

const initialState: CreateDeckState = { success: false };

export default function CreateDeckModal() {
  const { isOpen, type, onClose } = useModal();
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
      title="New Deck" 
      isOpen={isOpen} 
      type={type} 
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
        
        {state?.error && (
          <p className="text-[13px] font-medium text-red-500 text-center animate-in fade-in slide-in-from-bottom-1">{state.error}</p>
        )}

        <SubmitButton isPending={isPending}>
          {isPending ? "Creating..." : "Create"}
        </SubmitButton>
      </form>
    </BaseModal>
  );
}
