import { playgroundFlashcards, playgrounds } from "@/server/schema";
import z from "zod";

export type DeckThumbnail = {
    id: string;
    title: string;
    type: "classic" | "storytelling";
    dueCardsCount: number
}

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
  title: z.string().min(2, "Title is too short").max(50),
  type: z.enum(["upload", "search", "generate"]),
  query: z.string().optional(),
  file: z.custom<FileList>().optional()
}).superRefine((data, ctx) => {
  if (data.type === "upload" && (!data.file || data.file.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a .glb file",
      path: ["file"],
    });
  }
  if ((data.type === "search" || data.type === "generate") && (!data.query || data.query.length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide a query or prompt",
      path: ["query"],
    });
  }
});

export type PlaygroundFormSchema = z.infer<typeof playgroundFormSchema>;
export type Playground = typeof playgrounds.$inferSelect;
export type PlaygroundCard = typeof playgroundFlashcards.$inferSelect;
