import { FlashcardDraft, Variation, Meaning } from "@/store/use-editor-store";
import { Flashcard } from "./types";
// Pamiętaj o usunięciu importu Meaning z "@/server/schema", skoro zdefiniowałeś go w store!

export const normalizeFlashcardData = (card: Flashcard): FlashcardDraft => {
  // 1. Mapowanie znaczeń (Meanings)
  const normalizedMeanings: Meaning[] = card.meanings?.length 
    ? card.meanings.map((m: any) => ({
        id: m.id || crypto.randomUUID(),
        back: m.back || "",
        examples: m.examples || []
      }))
    : [{ id: crypto.randomUUID(), back: "", examples: [] }];

  // 2. Mapowanie wariacji (Variations) i ich zagnieżdżonych znaczeń
  const normalizedVariations: Variation[] = card.variations?.length 
    ? card.variations.map((v: any) => {
        // Normalizujemy znaczenia wewnątrz wariacji
        const varMeanings: Meaning[] = v.meanings?.length
          ? v.meanings.map((m: any) => ({
              id: m.id || crypto.randomUUID(),
              back: m.back || "",
              examples: m.examples || []
            }))
          : [{ id: crypto.randomUUID(), back: "", examples: [] }];

        return {
          id: v.id || crypto.randomUUID(),
          word: v.word || "",
          partOfSpeech: v.partOfSpeech || "",
          meanings: varMeanings
        };
      })
    : [];

  // 3. Zwracamy czysty obiekt dokładnie w takim kształcie, jakiego oczekuje formularz
  return {
    id: card.id,
    deckId: card.deckId,
    front: card.front || "",
    partOfSpeech: card.partOfSpeech || "",
    meanings: normalizedMeanings,
    variations: normalizedVariations,
  };
};