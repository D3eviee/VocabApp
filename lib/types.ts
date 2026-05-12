export type DeckThumbtail = {
    id: string;
    title: string;
    type: "classic" | "storytelling";
    dueCardsCount: number
}

export type CreateDeckState = {
  success: boolean;
  error?: string;
  title?: string;
  deckId?: string;
};