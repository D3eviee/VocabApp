"use server";
import { uploadFileToS3 } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { playgroundFlashcards, playgrounds } from "@/server/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { verifyLimits } from "@/lib/subscription";
import { createPlaygroundRecord } from "@/lib/data/playground";

export async function createPlaygroundAction(formData: FormData) {
  const titleRaw = formData.get("title")?.toString() || "";
  const title = titleRaw.trim().replace(/\s+/g, " ");
  if (!title) return { success: false, error: "Title is required." };

  const sourceType = formData.get("sourceType") as "upload" | "catalog";
  const thumbnailBase64 = formData.get("thumbnailBase64") as string | null;
  const modelFile = formData.get("modelFile") as File | null;

  try{
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    //CHECK FOR LIMITS
    const canCreate = await verifyLimits(user.id, "playground");
    if (!canCreate) {
      return { success: false, error: "Limit reached. Upgrade to pro plan.", requiresUpgrade: true };
    }

    let finalModelUrl: string | null = null;
    let finalThumbnailUrl: string | null = null;

    // THUMBNAIL CREATED ON CANVAS AND UPLOADING TO S3
    if (thumbnailBase64) {
      const res = await fetch(thumbnailBase64);
      const blob = await res.blob();
      const thumbFile = new File([blob], `thumb-${Date.now()}.jpg`, { type: "image/jpeg" });
      finalThumbnailUrl = await uploadFileToS3(thumbFile, "thumbnails");
    }
    
    // CHECKING FOR FLIE EXISTANCE AND UPLOADING MODEL FILE TO S3
    if (sourceType === "upload" && modelFile && modelFile.size > 0) {
      finalModelUrl = await uploadFileToS3(modelFile, "playgrounds");
    }

    // SAVE NEW RECORD TO DB
    const newPlayground = await createPlaygroundRecord({
      title,
      userId: user.id,
      sourceType,
      modelUrl: finalModelUrl,
      thumbnailUrl: finalThumbnailUrl,
    });

    if (!newPlayground || !newPlayground.id) 
      return { success: false, error: "Failed to create playground. Please try again later." };
    

    revalidatePath("/dashboard/playground");
    return { success: true, playgroundId: newPlayground.id }
  }catch(error){
    console.error("[CREATE_PLAYGROUND_ERROR]:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function createPlaygroundFlashcardAction(
  playgroundId: string, 
  position: [number, number, number], 
  meshName: string | null,
  formData: FormData
){
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title || !description || !position) throw new Error("Missing data");

  await db.insert(playgroundFlashcards).values({
    playgroundId,
    title,
    description,
    positionX: position[0],
    positionY: position[1],
    positionZ: position[2],
    meshName,
  });

  revalidatePath(`/dashboard/playground/edit/${playgroundId}`);  
  return { success: true };
}

export async function updatePlaygroundCardAction(flashcardId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !description) return;

  await db
    .update(playgroundFlashcards)
    .set({ title, description })
    .where(eq(playgroundFlashcards.id, flashcardId));

  revalidatePath(`/dashboard/playground/edit/[id]`, 'page');
}

export async function uploadThumbnailAction(formData: FormData) {
  const playgroundId = formData.get("playgroundId") as string;
  const base64Image = formData.get("thumbnailBase64") as string;

  const res = await fetch(base64Image);
  const blob = await res.blob();
  const file = new File([blob], "thumb.jpg", { type: "image/jpeg" });

  const url = await uploadFileToS3(file, "thumbnails");

  await db.update(playgrounds).set({ thumbnailUrl: url }).where(eq(playgrounds.id, playgroundId));
  return { success: true };
}