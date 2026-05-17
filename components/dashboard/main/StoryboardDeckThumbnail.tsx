'use client'
import { DeckThumbtail } from "@/lib/types";
import { Pencil, Play } from "lucide-react"
import Link from "next/link";
import { DashboardDeckOptionMenu } from "./DashboardDeckOptionMenu";

export const StoryboardDeckThumbnail = ({deck}:{deck: DeckThumbtail}) => {
    const { id, title } = deck
    return (
        <div className="relative w-full bg-white rounded-4xl outline-2 outline-[#EFEEF4] p-6 flex flex-col hover:outline-[#D4D4D4] hover:cursor-pointer transition-colors">
            <h3 className="h-15 w-[90%] font-semibold text-xl text-[#111] line-clamp-2">{title}</h3>
            <DashboardDeckOptionMenu deckId={id} />
            
            {/* ACTION BUTTONS */}
            <div className="w-full flex flex-row gap-3 mt-6">
                <Link
                    href={`/dashboard/storyboard/${id}/study`}
                    className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white py-3 rounded-2xl text-13 font-semibold transition-all active:scale-95"
                >
                    <Play size={14} fill="currentColor" />
                    Review
                </Link>
                <Link 
                    href={`/dashboard/storyboard/${id}/edit`}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-3 rounded-2xl text-13 font-semibold transition-all active:scale-95"
                >
                    <Pencil size={14} />
                    Edit
                </Link>
            </div>
        </div>
    )
}
