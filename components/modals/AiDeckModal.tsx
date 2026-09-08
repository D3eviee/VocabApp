"use client";
import { useState, useTransition, useRef } from "react";
import { useModal } from "@/store/modal-store";
import { Loader2, X, ImagePlus, Sparkles } from "lucide-react";
import { generateDeckFromImageAction } from "@/app/actions/ai-deck";
import { useRouter } from "next/navigation";
import { BaseModal } from "./BaseModal";
import { ErrorMessage } from "../dashboard/ui/ErrorMessage";
import { CancelButton } from "../dashboard/ui/CancelButton";
import { SubmitButton } from "../auth/SubmitButton";

// HELPER FUNCTION TO CONVERT IMAGE TO BASE64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const AiDeckModal = () => {
  const { isOpen, onClose } = useModal();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError("");
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    startTransition(async () => {
      try {
        // CLEAR BASE64
        const base64 = await fileToBase64(file);
        const base64Data = base64.split(",")[1]; 
        
        //AI RESULT
        const result = await generateDeckFromImageAction(base64Data, prompt);
        
        if (result.success && result.deckId) {
          onClose();
          router.push(`/dashboard/decks/${result.deckId}`); // Przekierowanie do nowej talii
          router.refresh();
        } else if (result.requiresUpgrade) {
          onClose();
          // Tutaj możesz od razu otworzyć modal subskrypcji
          // onOpen("subscription"); 
        } else {
          setError(result.error || "Wystąpił nieznany błąd");
        }
      } catch (err) {
        setError("Błąd podczas przetwarzania pliku.");
      }
    });
  };

  const canSubmit = file !== null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      targetType="aiDeckGenerator" 
      onClose={onClose} 
      title="Create with AI"
    >

      <div className="px-1 flex flex-col gap-4 mb-2">
        {/* POLE UPLOADU ZDJĘCIA */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
            previewUrl ? 'border-transparent bg-black' : 'border-gray-300 bg-[#F2F2F7] hover:bg-gray-200'
          }`}
        >
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
          />
          
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
          ) : (
            <>
              <ImagePlus size={32} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Tap to upload a photo</p>
              <p className="text-xs text-gray-400 mt-1">Book page, notes, or list</p>
            </>
          )}
        </div>

        {/* POLE TEKSTOWE NA PROMPT */}
        <div className="bg-[#F2F2F7] border border-gray-200 rounded-2xl p-4 shadow-inner shadow-gray-100/50">
          <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            Instructions for AI
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Extract Spanish vocabulary and translate to English..."
            className="w-full bg-transparent outline-none text-gray-950 font-medium text-[15px] placeholder:text-gray-400 placeholder:font-normal resize-none h-20"
          />
        </div>

        {error && <ErrorMessage message={error}/>}

        <div className="flex flex-row gap-3 mt-6">
          <CancelButton onClose={onClose}/>
          <SubmitButton 
            isPending={isPending}
            onClick={handleGenerate}
            disabled={isPending || !canSubmit}
          //   className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
          //   isPending || !canSubmit
          //     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          //     : 'bg-linear-to-tr from-[#4F39F6] to-purple-500 text-white hover:opacity-90 active:scale-95 cursor-pointer'
          // }`}

          >
            {isPending ? (
            <div className="flex items-center justify-center flex-row gap-2">
              <Sparkles size={16} />
              <span className="animate-pulse">Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-row gap-2">
              <Sparkles size={16} />
              Generate
            </div>
          )}
          </SubmitButton> 
        </div>

      </div>
    </BaseModal>
  );
};