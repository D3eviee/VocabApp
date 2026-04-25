"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Używamy routera do nawigacji
import BaseModal from "./BaseModal";
import InputField from "../auth/InputField";
import SubmitButton from "../auth/SubmitButton";
import { createDeckAction } from "@/app/actions/decks";
import { useModal } from "@/store/modal-store";

export default function CreateDeckModal() {
  const router = useRouter();
  const { isOpen, type, onClose } = useModal();
  const [state, formAction, isPending] = useActionState(createDeckAction, null);

  useEffect(() => {
    if (state?.success && state?.deckId) {
      onClose();
      router.push(`/dashboard/decks/${state.deckId}`);
    }
  }, [state, onClose, router]);

  return (
    <BaseModal title="Create New Deck" isOpen={isOpen} type={type} targetType="createDeck">
      <form action={formAction} className="flex flex-col gap-6">
        <InputField 
          label="Deck Title" 
          name="title" 
          placeholder="e.g. Spanish Basics" 
          required 
          disabled={isPending}
        />
        
        {state?.error && (
          <p className="text-sm font-semibold text-red-500 text-center">{state.error}</p>
        )}

        <SubmitButton isPending={isPending}>Create Deck</SubmitButton>
      </form>
    </BaseModal>
  );
}