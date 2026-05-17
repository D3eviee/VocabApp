'use client'
import { DeckThumbtail } from "@/lib/types";
import { Brain, Edit } from "lucide-react"
import Link from "next/link";
import { DashboardDeckOptionMenu } from "./DashboardDeckOptionMenu";

export const FlashcardDeckThumbnail = ({deck}:{deck: DeckThumbtail}) => {
    const { id, title } = deck
    return (
        <div className="relative w-full bg-white rounded-4xl outline-2 outline-[#EFEEF4] p-6 flex flex-col hover:outline-[#D4D4D4] hover:cursor-pointer transition-colors">
            <h3 className="h-15 w-[90%] font-semibold text-xl text-[#111] line-clamp-2">{title}</h3>
            <DashboardDeckOptionMenu deckId={id} />
            
            {/* ACTION BUTTONS */}
            <div className="w-full flex flex-row gap-3 mt-6">
                <Link
                    href={`/dashboard/decks/${id}/study`}
                    className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white py-3 rounded-2xl text-13 font-semibold transition-all active:scale-95"
                >
                    <Brain size={16} strokeWidth={2} />
                    Study
                </Link>
                <Link 
                    href={`/dashboard/decks/${id}/edit`}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-3 rounded-2xl text-13 font-semibold transition-all active:scale-95"
                >
                    <Edit size={16} strokeWidth={3} />
                    Edit
                </Link>
            </div>

            {deck.dueCardsCount > 0 && <div className="shadow-xs border border-black/15 absolute -right-2 -top-2 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-full">{deck.dueCardsCount}</div>}
        </div>
    )
}

