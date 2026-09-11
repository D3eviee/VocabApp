"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { verifyLimits } from "@/lib/subscription";
import { revalidatePath } from "next/cache";
import { createDeckRecord, checkDeckOwnership } from "@/lib/data/decks";
import { getUserFlashcardDecks, insertFlashcardsBatch } from "@/lib/data/flashcards";

// DATA SCHEMA FOR AI, TO KNOW THE RETURN VALUE
const flashcardSchema = z.object({
  cards: z.array(z.object({
    front: z.string().describe("Word or phrase in foreign language"),
    back: z.string().describe("Translation"),
    partOfSpeech: z.string().describe("Part of speech"),
  })),
});

// FETCHES USER FLASHCARD DECKS FOR AI MODAL SELECT INPUT
export async function fetchUserDecksAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, data: [] };
    
    const userDecks = await getUserFlashcardDecks(user.id);
    return { success: true, data: userDecks };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// GENERATES OR MODIFIES DECK USING AI MODEL  
export async function generateDeckFromImageAction(imageBase64: string, userPrompt: string, targetDeckId: string, deckTitle?: string ) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized. Please login." };

     // SECURUTY CHECK AND LIMIT VERIFICATION
    if (targetDeckId === "new") {
      if (!deckTitle || deckTitle.trim().length === 0) {
        return { success: false, error: "Deck title is required." };
      }
      // IF CRETING NEW DECK -> CHECK LIMITS
      const canCreate = await verifyLimits(user.id, "classic");
      if (!canCreate) return { success: false, error: "Limit reached.", requiresUpgrade: true };
    } else {
      // IF MODYFYING CHECKING OWNERSHIP
      const isOwner = await checkDeckOwnership(targetDeckId, user.id);
      if (!isOwner) return { success: false, error: "Unauthorized deck access." };
    }


    // AI REQUEST - PROVIDING IMAGE AND PROMPT
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a learning assistant. Return data ONLY in valid JSON format. You MUST use EXACTLY this JSON structure:
      {
        "cards": [
          {
            "front": "Word or phrase in foreign language",
            "back": "Translation",
            "partOfSpeech": "Part of speech (e.g. noun, verb)"
          }
        ]
      }
      Ignore graphics elements on the images, which are not learning content.`,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt || "Extract key vocabulary and translate." },
            { type: "image", image: imageBase64 },
          ],
        },
      ],
    });

    // EXTRACING PRECISE JSON RESPONSE FROM RESPONDS
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { success: false, error: "AI failed to return valid data." };

    // PARSING RETURNED JSON
    const object = flashcardSchema.parse(JSON.parse(jsonMatch[0]));
    if (object.cards.length === 0) return { success: false, error: "No content found in image." };

    let finalDeckId = targetDeckId;

    // CREATING NEW FLASHCARDS DECK IN DB
    if (finalDeckId === "new" && deckTitle) {
      const newDeck = await createDeckRecord(deckTitle.trim(), user.id, "classic");
      if (!newDeck?.id) return { success: false, error: "Failed to create deck." };
      finalDeckId = newDeck.id;
    }

    // INSETRING NEW FLASHCARDS TO EXISTING OR CREATED DECK
    await insertFlashcardsBatch(
      object.cards.map(card => ({
        deckId: finalDeckId,
        front: card.front,
        back: card.back,
        partOfSpeech: card.partOfSpeech,
      }))
    );

    revalidatePath(`/dashboard/decks/${finalDeckId}`);
    return { success: true, deckId: finalDeckId };
  }catch(error){
    console.error("[AI_GENERATOR_ERROR]:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}  