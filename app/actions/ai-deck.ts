"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { db } from "@/server/db";
import { deckItems, decks } from "@/server/schema";
import { getCurrentUser } from "@/lib/auth";
import { verifyDeckLimit } from "@/lib/subscription";

// DATA SCHEMA FOR AI, TO KNOW THE RETURN VALUE
const flashcardSchema = z.object({
  deckTitle: z.string().describe("Short title, for deck name - based on photo content"),
  cards: z.array(z.object({
    front: z.string().describe("Word or phrase in foreign language"),
    back: z.string().describe("Translation"),
    partOfSpeech: z.string().describe("Part of speech"),
  })),
});

export async function generateDeckFromImageAction(imageBase64: string, userPrompt: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "User unauthorized. Login and try again." };

    // DECK LIMIT VERIFICATION FOR FREE-TIER USERS
    const canCreate = await verifyDeckLimit(user.id);
    if (!canCreate) return { success: false, error: "Number of decks for your plan has been reached", requiresUpgrade: true };

    // AI REQUEST - PROVIDING IMAGE AND PROMPT
    // AI REQUEST - PROVIDING IMAGE AND PROMPT
    const { text } = await generateText({
      model: openai("gpt-4o"),
      // WPROST POKAZUJEMY MODELOWI JAKICH KLUCZY MA UŻYĆ
      system: `You are a learning assistant. Return data ONLY in valid JSON format. 
      You MUST use EXACTLY this JSON structure:
      {
        "deckTitle": "Short title based on photo content",
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
            { type: "text", text: userPrompt || "Scan for key words from the photo, and create flashcards - with translations." },
            { type: "image", image: imageBase64 },
          ],
        },
      ],
    });
    console.log(text)
    // POPRAWKA 2: Inteligentne wycinanie samego obiektu JSON z odpowiedzi modelu
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI returned invalid format:", text);
      return { success: false, error: "AI failed to return valid data format." };
    }

    // Bezpieczne parsowanie wyciętego JSON-a
    const object = flashcardSchema.parse(JSON.parse(jsonMatch[0]));
    
    if (object.cards.length === 0) return { success: false, error: "No content was found" };
    
    // SAVING NEW DECK TO DATABASE
    const [newDeck] = await db.insert(decks).values({
      userId: user.id,
      title: object.deckTitle,
      type: "classic",
    }).returning({ id: decks.id });

    // CREATING AND INSERTING FLASHCARDS TO OUR DECK
    const cardsToInsert = object.cards.map(card => ({
      deckId: newDeck.id,
      front: card.front,
      meanings: [{ 
        id: crypto.randomUUID(), 
        back: card.back,
        examples: [] 
      }], 
      partOfSpeech: card.partOfSpeech,
      order: 0,
    }));

    await db
      .insert(deckItems)
      .values(cardsToInsert);

    return { success: true, deckId: newDeck.id };
  } catch (error) {
    console.error("AI Generation Failed:", error);
    return { success: false, error: "Failed to generate deck. Ensure the image is valid." };
  }
}