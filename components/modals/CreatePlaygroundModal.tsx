"use client";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/modal-store";
import { FloatingInputField } from "../auth/FloatingInputField";
import { BaseModal } from "./BaseModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaygroundFormSchema, playgroundFormSchema } from "@/lib/types";
import { createPlaygroundAction } from "@/app/actions/playgrounds";
import { Button } from "../dashboard/ui/Button";
import { ErrorMessage } from "../dashboard/ui/ErrorMessage";
import { FileCheck2 } from "lucide-react";

export const CreatePlaygroundModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "createPlayground";

  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<PlaygroundFormSchema>({
    resolver: zodResolver(playgroundFormSchema),
    defaultValues: {
      title: "",
      type: "upload", 
      query: "",
      file: null
    },
  });

  const selectedFiles = watch("file");
  const currentFile = selectedFiles?.[0]; 
  
  const onSubmit = async (data: PlaygroundFormSchema) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("sourceType", data.type);
      
      if (data.type === "upload" && data.file?.[0]) {
        formData.append("modelFile", data.file[0]);
      }
      
      if (data.type === "upload") {
        const canvasElement = document.querySelector("canvas");
        if (canvasElement) {
          const dataURL = canvasElement.toDataURL("image/jpeg", 0.8);
          formData.append("thumbnailBase64", dataURL);
        }
      }
      
      const result = await createPlaygroundAction(formData);
      
      if (result?.success && result?.playgroundId) {
        onClose();
        router.push(`/dashboard/playground/${result.playgroundId}/edit`);
      } else if (result?.error) {
        setError("root", { type: "server", message: result.error });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("root", { type: "server", message: "An unexpected application error occurred." });
    }
  }

  return (
    <BaseModal
      title="New Playground" 
      onClose={onClose} 
      isOpen={isModalOpen} 
    >
      <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col max-h-75">
        <FloatingInputField
          id="playground-title"
          key={isModalOpen ? "modal-open" : "modal-closed"} 
          label="Title" 
          autoFocus
          required 
          disabled={isSubmitting}
          {...register("title")}
        />

        {errors.title?.message && <ErrorMessage message={errors.title.message}/>}

        <div className="animate-in fade-in slide-in-from-top-2 duration-300 h-full relative mt-3">
          <label
            className={`flex flex-col items-center justify-center w-full h-24 border border-dashed rounded-xl cursor-pointer transition-all duration-200
              ${errors.file ? 
                "border-error-primary bg-error-secondary/10 text-[#FFF]" : currentFile ? "border-confirm-secondary bg-confirm-secondary/10" : 
                "border-hover-border bg-gray-50 hover:bg-gray-100"}`}
            htmlFor="model-file"
          >
            <input
              type="file"
              accept=".glb,.gltf"
              className="hidden"
              id="model-file"
              disabled={isSubmitting}
              {...register("file")}
            />
            
            {currentFile ? (
              <div className="flex flex-col items-center text-center px-4 animate-in zoom-in-95 duration-200">
                <FileCheck2 className="w-6 h-6 text-confirm-primary mb-1" />
                <p className="text-sm text-confirm-secondary font-medium truncate max-w-50">{currentFile.name}</p>
                <p className="text-[10px] text-confirm-secondary  mt-0.5 font-medium">{(currentFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change</p>
              </div>
            ) : (
              <p className="text-xs text-[#2B2B2B] font-medium">Click or drag .glb file here</p>
            )}
          </label>

          {/* VALIDATION ERROR*/}
          {errors.file && <p className="absolute -bottom-5 left-1 text-13 font-medium text-error-secondary">{errors.file.message as string}</p> }
        </div>

        {/* SERVER ERROR */}
        {errors.root?.message && <ErrorMessage message={errors.root.message} /> }

        <div className="flex flex-row gap-3 mt-10">
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
            isLoading={isSubmitting}
          >
            Create
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}