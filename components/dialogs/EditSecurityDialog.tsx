"use client";
import { useState, useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { Loader2, X, Check } from "lucide-react";
import { updatePasswordAction } from "@/app/actions/user";
import { BaseDialog } from "./BaseDialog";

export const EditSecurityDialog = () => {
  const { isOpen, type, onClose } = useModal();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    // Podstawowa walidacja
    if (password !== confirmPassword) {
      setError("Hasła nie pasują do siebie!");
      return;
    }
    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    startTransition(async () => {
      // Wywołujemy akcję serwerową zmiany hasła
      const result = await updatePasswordAction({ password });
      if (result?.success) {
        // Czyścimy formularz po sukcesie
        setPassword(""); setConfirmPassword(""); setError("");
        onClose();
      } else {
        // Wyświetlamy błąd z bazy danych
        setError(result?.error || "Nie udało się zaktualizować hasła.");
      }
    });
  };

  // Warunek włączenia przycisku zapisu
  const canSave = password.length >= 6 && confirmPassword.length >= 6 && password === confirmPassword;

  return (
    <BaseDialog isOpen={isOpen} type={type} targetType="editSecurity" onClose={onClose}>
        <header className="flex items-center justify-between mb-6">
            <button 
                onClick={onClose}
                className="h-9 w-9 bg-[#F2F2F2] text-[#494949] hover:text-[#494949] hover:cursor-pointer active:scale-95 transition-all rounded-full flex items-center justify-center"
            >
                <X size={20} strokeWidth={2.5} />
            </button>
            
            <h1 className="text-15 font-semibold text-[#494949] tracking-tight">Security</h1>
            
            <button 
                onClick={handleSave} 
                disabled={isPending || !canSave}
                className={`h-9 w-9 bg-[#F2F2F2] rounded-full flex items-center justify-center transition-all ${isPending || !canSave ? 'text-[#A1A1A1]' : 'text-[#494949] hover:text-[#494949] hover:cursor-pointer'}`}
            >
                {isPending ? ( <Loader2 size={18} className="animate-spin text-gray-300" /> ) : ( <Check size={20} strokeWidth={2.5} /> )}
            </button>
        </header>
        
        <div className="bg-[#F2F2F2] border-[0.5px] border-[#E1E1E1] rounded-3xl overflow-hidden">
        
        {/* NEW PASSWORD */}
        <div className="w-full flex flex-row items-center justify-between p-5 border-b-[0.5px] border-[#E1E1E1]">
          <label className="w-1/2 text-base font-medium text-[#111] ml-1 shrink-0">New password</label>
          <input
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError("");}}
            className="w-full text-left bg-transparent outline-none text-black font-medium text-base placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>

        {/* RETYPE PASSWORD */}
         <div className="w-full flex flex-row items-center justify-between p-5">
          <label className="w-1/2 text-base font-medium text-[#111] ml-1 shrink-0">Retype</label>
          <input
            type="password"
            placeholder="Re-type password"
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value); setError("");}}
            className="w-full text-left bg-transparent outline-none text-black font-medium text-base placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
      </div>
      
      {/* ERROR MESSAGE */}
      {error && <p className="text-[#F74652] text-sm font-medium ml-3 mt-1.5 animate-pulse">{error}</p>}
    </BaseDialog>
  );
};