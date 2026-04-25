"use client";
import { useModal } from "@/store/modal-store";
import InputField from "../auth/InputField";
import SubmitButton from "../auth/SubmitButton";
import BaseModal from "./BaseModal";

export default function CreateRoadmapModal() {
  const { isOpen, type, onClose } = useModal();

  const handleSubmit = async (formData: FormData) => {
    console.log("Tworzę talię:", formData.get("title"));
    onClose();
  };

  return (
    <BaseModal title="Create New Roadmap" isOpen={isOpen} type={type} targetType="createRoadmap">
      <form action={handleSubmit} className="flex flex-col gap-6">
        <InputField
          label="Deck Title" 
          name="title" 
          placeholder="e.g. Spanish Basics" 
          autoFocus
          required 
        />
        <SubmitButton isPending={false}>Create Roadmap</SubmitButton>
      </form>
    </BaseModal>
  );
}