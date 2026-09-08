'use client'
import { DeckThumbnail } from "@/lib/types";
import { Brain, Edit } from "lucide-react"
import { ThumbnailOptionMenu } from "./ThumbnailOptionMenu";
import { ButtonLink } from "../ui/ButtonLink";

export const FlashcardDeckThumbnail = ({deck}:{deck: DeckThumbnail}) => {
    const { id, title, dueCardsCount} = deck
    return (
        <div className="relative w-full bg-white rounded-4xl outline-2 outline-light-border p-6 flex flex-col">
            <h3 className="h-15 w-[90%]  font-semibold text-lg line-clamp-2 text-heading">{title}</h3>
            <ThumbnailOptionMenu deckId={id} />
            
            {/* ACTION BUTTONS */}
            <div className="w-full flex flex-row gap-3 mt-6">
                <ButtonLink href={`/dashboard/decks/${id}/study`} variant="gradient">
                    <Brain size={16} strokeWidth={2} />
                    Study
                </ButtonLink>
                <ButtonLink href={`/dashboard/decks/${id}/edit`} variant="secondary">
                    <Edit size={16} strokeWidth={2} />
                    Edit
                </ButtonLink>
            </div>

            {/* TO REPEATY COUNT BADGE */}
            {dueCardsCount > 0 && 
            <div className="flex justify-center items-center shadow-xs border border-[#C01717] absolute -right-1 -top-2 bg-[#E23939] text-white text-xs font-medium  h-7 w-7 rounded-full">
                {deck.dueCardsCount}
            </div>}
        </div>
    )
}