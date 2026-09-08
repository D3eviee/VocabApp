"use client";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/modal-store";
import { InputField } from "../auth/InputField";
import { SubmitButton } from "../auth/SubmitButton";
import { BaseModal } from "./BaseModal";
import { createStoryboardAction } from "@/app/actions/decks";
import { CreateDeckState } from "@/lib/types";
import { CancelButton } from "../dashboard/ui/CancelButton";

const initialState: CreateDeckState = { success: false};

export const CreateStoryboardModal = () => {
  const { isOpen, type, onClose } = useModal();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStoryboardAction, initialState);

  useEffect(() => {
    if (state.success && state.deckId) {
      onClose(); 
      router.push(`/dashboard/storyboard/${state.deckId}/edit`);
    }
  }, [state.success, state.deckId, onClose, router]);

  return (
    <BaseModal 
      title="New Storyboard" 
      isOpen={isOpen} 
      targetType="createRoadmap"
      onClose={onClose}
    >
      <form action={formAction} className="flex flex-col">
        <InputField
          key={isOpen ? "modal-open" : "modal-closed"} 
          label="Storyboard Title"
          name="title" 
          autoFocus
          required 
          disabled={isPending}
          defaultValue={state?.title || ""}
        />

        {state?.error && (
          <p className="text-[13px] font-medium text-red-500 text-center animate-in fade-in slide-in-from-bottom-1">{state.error}</p>
        )}

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