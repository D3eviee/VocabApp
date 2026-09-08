"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/modal-store";
import { Loader2 } from "lucide-react";
import { deleteAccountAction } from "@/app/actions/user";
import { BaseDialog } from "./BaseDialog";

export const DeleteAccountDialog = () => {
  const { isOpen, type, onClose } = useModal();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAccountAction();
      if (result?.success) {
        onClose();
        router.push("/");
      }
    });
  };

  return (
    <BaseDialog isOpen={isOpen} type={type} targetType="deleteAccountConfirm" onClose={onClose}>
        <div className="text-center flex flex-col mb-6 w-3/4 mx-auto">
            <h1 className="text-lg text-[#111] font-semibold">Delete Account?</h1>
            <p className="text-15 text-[#494949] font-light mt-1">
                This action is permanent and cannot be undone. All your data, flashcards, and progress will be erased.
            </p>
        </div>
        
        <div className="flex flex-row gap-3 mt-2">
            <button 
                onClick={onClose} 
                disabled={isPending} 
                className="w-full flex items-center justify-center outline-2 outline-transparent bg-[#F61A2D] text-white hover:bg-[#E5191C] px-4 py-3 rounded-xl text-15 font-semibold transition-all active:scale-95 hover:cursor-pointer disabled:opacity-70"
            >
                Cancel
            </button>

             <button 
                onClick={handleDelete} 
                disabled={isPending} 
                className="w-full outline-2 outline-[#EFEEF4] bg-white hover:bg-[#EFEEF4] text-[#333] px-4 py-3 rounded-xl text-15 transition-all active:scale-95 hover:cursor-pointer disabled:opacity-50"
            >
                 {isPending ? <Loader2 size={18} className="animate-spin text-white/80" /> : "Delete"}
            </button>
        </div>
    </BaseDialog>
  );
}