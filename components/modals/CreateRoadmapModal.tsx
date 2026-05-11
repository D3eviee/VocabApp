"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/modal-store";
import { InputField } from "../auth/InputField";
import { SubmitButton } from "../auth/SubmitButton";
import BaseModal from "./BaseModal";
import { createStoryboardAction } from "@/app/actions/decks";

export default function CreateRoadmapModal() {
  const { isOpen, type, onClose } = useModal();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await createStoryboardAction(formData);
    
      if (result.success && result.deckId) {
        onClose(); 
        router.push(`/dashboard/storyboard/${result.deckId}/edit`);
      } else {
        alert(result.error || "Wystąpił błąd podczas tworzenia.");
      }
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <BaseModal 
      title="Create New Roadmap" 
      isOpen={isOpen} 
      type={type} 
      targetType="createRoadmap"
    >
      <form action={handleSubmit} className="flex flex-col gap-6">
        <InputField
          label="Roadmap Title"
          name="title" 
          placeholder="e.g. Spanish Basics" 
          autoFocus
          required 
          disabled={isPending}
        />
        <SubmitButton isPending={isPending}>
          {isPending ? "Creating..." : "Create"}
        </SubmitButton>
      </form>
    </BaseModal>
  );
}