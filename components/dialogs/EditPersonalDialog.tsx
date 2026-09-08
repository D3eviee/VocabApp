"use client";
import { useState, useTransition, useEffect } from "react";
import { useModal } from "@/store/modal-store";
import { Loader2, X, Check } from "lucide-react";
import { updateProfileAction } from "@/app/actions/user";
import { BaseDialog } from "./BaseDialog";

export const EditPersonalDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const initialFirstName = data?.user?.firstName || "";
  
  useEffect(() => {
    if (data?.user?.firstName) setFirstName(data.user.firstName);
  }, [data]);

  const handleSave = () => {
    if (firstName === initialFirstName || firstName.trim() === "") {
      onClose();
      return;
    }

    startTransition(async () => {
      // Wywołujemy akcję serwerową, przekazując tylko firstName
      const result = await updateProfileAction({ firstName });
      if (result?.success) {
        window.location.reload(); // Proste odświeżenie strony po zmianie
        onClose();
      }
    });
  };

  // Warunek włączenia przycisku zapisu
  const isChanged = firstName !== initialFirstName && firstName.trim().length > 0;

  return (
    <BaseDialog isOpen={isOpen} type={type} targetType="editProfile" onClose={onClose}>
      <header className="flex items-center justify-between mb-6">
        <button 
          onClick={onClose}
          className="h-9 w-9 bg-[#F2F2F2] text-[#494949] hover:text-[#494949] hover:cursor-pointer active:scale-95 transition-all rounded-full flex items-center justify-center"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-15 font-semibold text-[#494949] tracking-tight">Personal Information</h1>
      
        <button 
          onClick={handleSave} 
          disabled={isPending || !isChanged}
          className={`h-9 w-9 bg-[#F2F2F2] rounded-full flex items-center justify-center transition-all ${isPending || !isChanged ? 'text-[#A1A1A1]' : 'text-[#494949] hover:text-[#494949] hover:cursor-pointer'
          }`}
        >
          {isPending ? ( <Loader2 size={18} className="animate-spin text-gray-300" /> ) : ( <Check size={20} strokeWidth={2.5} /> )}
        </button>
      </header>

      <div className="bg-[#F2F2F2] border-[0.5px] border-[#E1E1E1] rounded-3xl overflow-hidden">
        {/* NAME - EDITABLE */}
        <div className="w-full flex flex-row items-center justify-between p-5 border-b-[0.5px] border-[#E1E1E1]">
          <label className="w-1/3 md:w-2/5 text-base font-medium text-[#111] ml-1 shrink-0">First Name</label>
          <input
            type="text"
            value={firstName}
            placeholder="Your name"
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full text-left bg-transparent outline-none text-black font-medium text-base placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>

        {/* EMAIL - READ ONLY */}
        <div className="w-full flex flex-row items-center justify-between p-5 opacity-70">
          <label className="w-1/3 md:w-2/5 text-base font-medium text-[#777] ml-1 shrink-0">Email</label>
          <input
            type="email"
            disabled
            value={data?.user?.email || ""}
            className="w-full  pr-2 text-left bg-transparent outline-none text-gray-500 font-medium text-base cursor-not-allowed"
          />
        </div>
      </div>

    </BaseDialog>
  );
};