'use client'
import DeckMenuItemBadge from "./DeckMenuItemBadge"
import { useEditorStore } from "@/store/use-editor-store";

// Aktualizujemy typ, aby odzwierciedlał nową strukturę z bazy Drizzle
type Card = {
    id: string;
    front: string;
    meanings?: { partOfSpeech: string }[]; // Tablica znaczeń zamiast płaskiego pola
}

export const DeckMenuItem = ({card}: {card: Card}) => {
    const { front, meanings, id } = card;
    const { activeCardId, setActiveCardId } = useEditorStore();
    const isActive = activeCardId === id;
    
    // BEZPIECZEŃSTWO: Pobieramy część mowy z pierwszego znaczenia. 
    // Jeśli nie ma żadnego znaczenia, ustawiamy "unknown".
    const primaryPartOfSpeech = meanings?.[0]?.partOfSpeech || "unknown";
    
    return (
        <button
            onClick={() => setActiveCardId(id)}
            className={`flex w-full text-left flex-row justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                    ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/5" 
                    : "hover:bg-black/5"
            }`}
        >
            <h2 className={`font-semibold text-[15px] truncate mr-2 ${isActive ? "text-black" : "text-gray-700"}`}>
                {front || "New Word"}
            </h2>
            <DeckMenuItemBadge type={primaryPartOfSpeech} />
        </button>
  )
}