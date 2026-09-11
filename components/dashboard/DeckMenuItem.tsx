'use client'
import { DeckMenuItemBadge } from "./DeckMenuItemBadge"

type DeckMenuItemProps = {
    front: string;
    partOfSpeech: string;
    isActive?: boolean; 
}

export const DeckMenuItem = ({front, isActive, partOfSpeech}: DeckMenuItemProps) => {
    return (
        <div
            className={`flex w-full px-6 py-4 rounded-2xl transition-all duration-200 flex-row justify-between ${
                isActive ? "bg-button-background" : "hover:bg-button-background"
            }`}
        >
            <h1 className="font-semibold truncate text-main-dark text-15">{front || "New card"}</h1>
            <DeckMenuItemBadge type={partOfSpeech} />
        </div>
  )
}