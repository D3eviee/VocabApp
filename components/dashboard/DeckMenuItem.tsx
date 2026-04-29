'use client'
import DeckMenuItemBadge from "./DeckMenuItemBadge"
import { useEditorStore } from "@/store/use-editor-store";

type Card = {
    id: string;
    front: string;
    type: string;
    meanings?: { partOfSpeech: string }[];
}

export const DeckMenuItem = ({card}: {card: Card}) => {
    const { front, meanings, id } = card;
    const { activeCardId, setActiveCardId } = useEditorStore();
    const isActive = activeCardId === id;
    console.log(card.type)
    
    return (
        <div
            onClick={() => setActiveCardId(id)}
            className={`flex w-full text-left flex-row justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                    ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5" 
                    : "hover:bg-black/5"
            }`}
        >
            <h2 className={`font-semibold text-[15px] truncate mr-2 ${isActive ? "text-black" : "text-gray-700"}`}>{front || "New Word"}</h2>
            <DeckMenuItemBadge type={card.type} />
        </div>
  )
}