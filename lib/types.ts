import { Meaning, playgroundFlashcards, playgrounds, WordVariation } from "@/server/schema";
import z from "zod";

export type DeckThumbnail = {
    id: string;
    title: string;
    type: "classic" | "storytelling";
    dueCardsCount: number
}

export type Flashcard = {
  id: string;
  deckId: string;
  front: string | null;
  partOfSpeech: string | null;
  meanings: Meaning[];
  variations: WordVariation[];
  dateLabel: string | null;
  title: string | null;
  description: string | null;
  order: number;
  dueDate: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  createdAt: Date;
}

export type StudyFlashcard = {
  id: string;
  partOfSpeech: string | null,
  front: string | null;
  meanings: Meaning[];
  variation: WordVariation[]
}
export type FlashcardRate = 'again' | 'hard' | 'good' | 'easy'

export type PlaygroundThumbnail = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

export type CreateDeckState = {
  success: boolean;
  error?: string;
  title?: string;
  deckId?: string;
  requiresUpgrade?: boolean
};

export const playgroundFormSchema = z.object({
  title: z.string().max(50),
  type: z.enum(["upload", "catalog"]),
  query: z.string().optional(),
  file: z.any().optional() 
}).superRefine((data, ctx) => {
  if (data.type === "upload" && (!data.file || data.file.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a .glb file",
      path: ["file"],
    });
  }
});

export type PlaygroundFormSchema = z.infer<typeof playgroundFormSchema>;
export type Playground = typeof playgrounds.$inferSelect;
export type PlaygroundCard = typeof playgroundFlashcards.$inferSelect;
