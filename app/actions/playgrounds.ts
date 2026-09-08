"use server";
import { uploadFileToS3 } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { playgroundFlashcards, playgrounds } from "@/server/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

// export async function createPlaygroundAction(formData: FormData) {
//   try {
//     const title = formData.get("title") as string;
//     const sourceType = formData.get("sourceType") as "upload" | "search" | "generate";
//     const query = formData.get("query") as string | null;
//     const modelFile = formData.get("modelFile") as File | null;
//     const thumbnailBase64 = formData.get("thumbnailBase64") as string | null;

//     let modelUrl = null;
//     let thumbnailUrl = null;

//     // AUTH
//     const user = await getCurrentUser();
//     if (!user) throw new Error("Unauthorized");

//     // IF FILE PROVIDED -> SEND TO S3
//     if (sourceType === "upload" && modelFile) 
//         modelUrl = await uploadFileToS3(modelFile, "playgrounds");

//   // IF FILE PROVIDED -> SEND TO S3
//     if (thumbnailBase64) {
//       const base64Data = thumbnailBase64.replace(/^data:image\/\w+;base64,/, "");
//       const buffer = Buffer.from(base64Data, "base64");
//       const thumbKey = `thumbnails/${user.id}-${Date.now()}.jpg`;

//       await uploadFileToS3(
//         new File([buffer], "thumbnail.jpg", { type: "image/jpeg" }), 
//         "thumbnails"
//       );
//     }

//     let finalThumbnailUrl = null;
//     if (thumbnailBase64) {
//       const res = await fetch(thumbnailBase64);
//       const blob = await res.blob();
//       const thumbFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
//       finalThumbnailUrl = await uploadFileToS3(thumbFile, "thumbnails");
//     }
    
//     // SAVE TO DB
//     const [newPlayground] = await db.insert(playgrounds).values({
//       title,
//       userId: user.id,
//       sourceType,
//       originalQuery: query,
//       modelUrl,
//       thumbnailUrl: finalThumbnailUrl,
//     }).returning({ id: playgrounds.id });

//     // 4. Odświeżenie widoku w Next.js i zwrócenie ID
//     revalidatePath("/dashboard/playground");
//     return { success: true, playgroundId: newPlayground.id };
//   } catch (error) {
//     console.error("Failed to create playground:", error);
//     return { 
//       success: false, 
//       error: "Something went wrong while creating the playground. Please try again." 
//     };
//   }
// }

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


export async function createPlaygroundAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const sourceType = formData.get("sourceType") as "upload" | "search" | "generate";
    const thumbnailBase64 = formData.get("thumbnailBase64") as string | null;

    let finalModelUrl = null;
    let finalThumbnailUrl = null;

    // --- LOGIKA 1: Zapisanie miniatury ---
    if (thumbnailBase64) {
      // Pobieramy miniaturę (z canvasa lub z linku od API) i konwertujemy na plik
      const res = await fetch(thumbnailBase64);
      const blob = await res.blob();
      const thumbFile = new File([blob], `thumb-${Date.now()}.jpg`, { type: "image/jpeg" });
      finalThumbnailUrl = await uploadFileToS3(thumbFile, "thumbnails");
    }

    // --- LOGIKA 2: Obsługa UPLOADU z komputera ---
    if (sourceType === "upload") {
      const modelFile = formData.get("modelFile") as File | null;
      if (modelFile) {
        finalModelUrl = await uploadFileToS3(modelFile, "playgrounds");
      }
    }

    // --- LOGIKA 3: Obsługa SEARCH (Pobieranie modelu z zewnętrznego API) ---
    if (sourceType === "search") {
      const externalModelId = formData.get("externalModelId") as string;
      
      if (!externalModelId) throw new Error("Brak ID modelu do pobrania");

      // 1. Uderzamy do Download API Sketchfaba (Wymaga tokenu w .env!)
      const downloadApiUrl = `https://api.sketchfab.com/v3/models/${externalModelId}/download`;
      
      const downloadRes = await fetch(downloadApiUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${process.env.SKETCHFAB_API_TOKEN}`, 
        },
      });

      if (!downloadRes.ok) throw new Error("Brak dostępu do pobierania tego modelu.");
      
      const downloadData = await downloadRes.json();

      // Sketchfab udostępnia format GLB, który zawiera wszystko (siatkę i tekstury) w 1 pliku
      const glbDownloadUrl = downloadData.glb?.url;
      if (!glbDownloadUrl) throw new Error("Model nie jest dostępny w formacie .glb");

      // 2. Pobieramy fizyczny plik z otrzymanego URL-a na nasz serwer
      const fileResponse = await fetch(glbDownloadUrl);
      const fileBlob = await fileResponse.blob();
      
      // 3. Konwertujemy pobranego Bloba na obiekt File (Next.js/S3 tego wymaga)
      const downloadedFile = new File([fileBlob], `model-${externalModelId}.glb`, { 
        type: "model/gltf-binary" 
      });

      // 4. Uploadujemy plik do naszego AWS S3
      finalModelUrl = await uploadFileToS3(downloadedFile, "playgrounds");
    }

    // --- ZAPIS DO BAZY DANYCH ---
    const [newPlayground] = await db.insert(playgrounds).values({
      title,
      userId: user.id,
      sourceType,
      modelUrl: finalModelUrl,
      thumbnailUrl: finalThumbnailUrl,
    }).returning({ id: playgrounds.id });

    revalidatePath("/dashboard/playground");
    return { success: true, playgroundId: newPlayground.id };

  } catch (error: any) {
    console.error("Failed to create playground:", error);
    return { 
      success: false, 
      error: error.message || "Something went wrong while creating the playground." 
    };
  }
}