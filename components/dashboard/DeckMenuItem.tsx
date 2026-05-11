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
    const { front, type, id } = card;
    const { activeCardId, setActiveCardId } = useEditorStore();
    const isActive = activeCardId === id;
    
    return (
        <div
            onClick={() => setActiveCardId(id)}
            className={`flex w-full flex-col px-6 py-3 rounded-xl transition-all duration-200  hover:cursor-pointer lg:flex-row lg:justify-between ${
                isActive ? "md:bg-white md:hover:bg-white bg-[#F2F2F2]" : "hover:bg-[#F2F2F2] md:bg-[#F2F2F2] md:hover:bg-[#F9F9F9]"
            }`}
        >
            <h2 className="font-semibold text truncate text-[#2B2B2B] mb-1">{front || "New card"}</h2>
            <DeckMenuItemBadge type={type} />
        </div>
  )
}