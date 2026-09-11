"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import { useModal } from "@/store/modal-store";
import { ImagePlus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { BaseModal } from "./BaseModal";
import { ErrorMessage } from "../dashboard/ui/ErrorMessage";
import { Button } from "../dashboard/ui/Button";
import { fetchUserDecksAction, generateDeckFromImageAction } from "@/app/actions/ai";
import { FloatingInputField } from "../auth/FloatingInputField";
import { FloatingSelectField } from "../dashboard/ui/FloatingSelectField";
import { FloatingTextAreaField } from "../dashboard/ui/FloatingTextAreaField";

const NEW_DECK_VALUE = "new";
const MAX_FILE_SIZE_MB = 7;

// HELPER FUNCTION TO CONVERSE FILE TO BASE64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const CreateWithAIModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "aiDeckGenerator";
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [targetDeckId, setTargetDeckId] = useState<string>(NEW_DECK_VALUE);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  
  // USER DECK LIST
  const [userDecks, setUserDecks] = useState<{id: string, title: string}[]>([]);

  const cleanupPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // WE DOWNLOAD DECKS WHEN ON MOUNT
  useEffect(() => {
    if (isModalOpen) {
      fetchUserDecksAction().then((res) => {
        if (res.success && res.data) setUserDecks(res.data);
      });
    } else {
      setFile(null);
      setPreviewUrl(null);
      setPrompt("");
      setTargetDeckId(NEW_DECK_VALUE);
      setNewDeckTitle("");
      setError("");
    }
    return () => cleanupPreview();
  }, [isModalOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`Image is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      
      cleanupPreview();
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError("");
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    startTransition(async () => {
      try {
        const base64 = await fileToBase64(file);
        const base64Data = base64.split(",")[1]; 
        const result = await generateDeckFromImageAction(base64Data, prompt, targetDeckId, newDeckTitle);
        
        if (result.success && result.deckId) {
          onClose();
          router.push(`/dashboard/decks/${result.deckId}/edit`);
          router.refresh();
        } else if (result.requiresUpgrade) {
          onClose();
          // onOpen("subscription"); // IF LIMIT REACHED
        } else {
          setError(result.error || "An unexpected error occurred");
        }
      } catch (err) {
        setError("Error during file processing.");
      }
    });
  };

  // SUBMIT ONLY IF FILE, VALID TITLE (IF NEW), AND PROMPT ARE PRESENT
  const isTitleValid = targetDeckId === NEW_DECK_VALUE ? newDeckTitle.trim().length > 0 : true;
  const isPromptValid = prompt.trim().length > 0;  
  const canSubmit = file !== null && isTitleValid && isPromptValid;

  return (
    <BaseModal 
      title="Create with AI"
      subtitle="Create or add cards to your decks"
      isOpen={isModalOpen} 
      onClose={onClose} 
    >
      <form onSubmit={handleGenerate}>
      {/* DECK SELECTOR AND TITLE INPUT */}
      <div className="flex flex-col gap-3 mb-3">
        <FloatingSelectField
          label="Target Deck"
          value={targetDeckId}
          onChange={(e) => setTargetDeckId(e.target.value)}
          disabled={isPending}
        >
          <option value="new">✨ Create new deck</option>
          {userDecks.length > 0 && (
            <optgroup label="Your Decks">
              {userDecks.map((deck) => 
              <option key={deck.id} value={deck.id}>📁 {deck.title}</option>
              )}
            </optgroup>
          )}
        </FloatingSelectField>

        {/* IF NEW DECK SELECTED -> TITLE INPUT FOR NEW DECK */}
        {targetDeckId === "new" && (
          <FloatingInputField 
            type="text"
            label="Deck Name"
            required
            autoFocus={false}
            value={newDeckTitle}
            onChange={(e) => setNewDeckTitle(e.target.value)}
            disabled={isPending}
          />
        )}
      </div>

      {/* IMAGE UPLOAD FIELD  */}
      <label
        className={`mb-3 flex flex-col items-center justify-center w-full h-38 border-2 border-dashed  cursor-pointer transition-all duration-200 rounded-2xl overflow-hidden
        ${previewUrl 
          ? "outline-confirm-primary" 
          : "bg-gray-50 hover:bg-gray-100"}
        ${isPending ? "opacity-50 pointer-events-none" : ""}`}
        htmlFor="ai-image-upload"
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="ai-image-upload"
          onChange={handleFileSelect}
          disabled={isPending}
        />

        {previewUrl && file ? (
          <div className="w-full h-full relative group flex items-center justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-contain" 
            />
                
            {/* INFO ON HOVER */}
              <div className="h-full w-full hover:bg-gray-100/60 z-10 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-all duration-200">
                <p className="px-3 py-1.5 text-sm font-medium text-white bg-heading rounded-xl">Change</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <ImagePlus size={24} className="text-subheading mb-2 opacity-80"/>
              <p className="text-xs text-heading font-medium mb-0.5">Click or drag a photo here</p>
              <p className="text-[10px] text-subheading font-medium">Book page, notes, or list</p>
            </div>
          )}
        </label>

        {/* AI PROMPT INPUT */}
        <FloatingTextAreaField
          label="Instructions"
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isPending}
        />

        {error && 
          <div className="mt-3">
            <ErrorMessage message={error}/>
          </div>
        }

        <div className="flex flex-row gap-3 mt-6">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button 
            type="submit" 
            variant="primary" 
            onClick={handleGenerate}
            disabled={!canSubmit || isPending}
            isLoading={isPending}
          >
            <Sparkles size={16} className={isPending ? "animate-pulse" : ""} />
            {targetDeckId === "new" ? "Generate Deck" : "Add Cards"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};