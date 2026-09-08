"use client";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/modal-store";
import { InputField } from "../auth/InputField";
import { SubmitButton } from "../auth/SubmitButton";
import { BaseModal } from "./BaseModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaygroundFormSchema, playgroundFormSchema } from "@/lib/types";
import { createPlaygroundAction } from "@/app/actions/playgrounds";
import { CancelButton } from "../dashboard/ui/CancelButton";

export const CreatePlaygroundModal = () => {
  const { isOpen, onClose } = useModal();
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset, clearErrors} = useForm<PlaygroundFormSchema>({
    resolver: zodResolver(playgroundFormSchema),
    defaultValues: {
      title: "",
      type: "upload",
      query: "",
    },
  });

  const playgroundCreationMethod = watch("type");
  
  const onSubmit = async (data: PlaygroundFormSchema) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("sourceType", data.type);
      
      if (data.type === "upload" && data.file?.[0]) {
        formData.append("modelFile", data.file[0]);
      }
      
      // GENEROWANIE MINIATURY TYLKO DLA UPLOADU
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
        console.error(result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <BaseModal title="Create" isOpen={isOpen} targetType="createPlayground" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col max-h-300px">
        <div className="mb-6">
          <InputField
            key={isOpen ? "modal-open" : "modal-closed"}
            label="Playground Title"
            placeholder="e.g. Rocket Engine"
            disabled={isSubmitting}
            {...register("title")}
          />
          {errors.title && <p className="text-[11px] font-medium text-red-500 mt-1 pl-1 animate-in fade-in">{errors.title.message}</p> }
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h1 className="text-black text-sm font-bold">Choose a starting point</h1>
            <p className="text-[#2B2B2B] text-xs">How would you like to create your 3D scene?</p>
          </div>


          <div className="min-h-24 relative transition-all duration-300">
            {playgroundCreationMethod === "upload" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label
                  className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors
                    ${errors.file ? "border-red-300 bg-red-50/30" : "border-[#D4D4D4] bg-gray-50"}`}
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
                  <p className="text-xs text-[#2B2B2B] font-medium">Click or drag .glb file here</p>
                </label>
                {errors.file && <p className="absolute -bottom-5 left-1 text-[11px] font-medium text-red-500">{errors.file.message as string}</p> }
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-row gap-3 mt-6">
          <CancelButton onClose={onClose}/>
          <SubmitButton isPending={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </SubmitButton> 
        </div>
      </form>
    </BaseModal>
  );
}