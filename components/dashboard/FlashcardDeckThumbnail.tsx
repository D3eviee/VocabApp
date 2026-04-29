import { Pencil, Play } from "lucide-react"
import Link from "next/link";

type Deck =  {
    id: string;
    userId: string;
    title: string;
    type: "classic" | "storytelling";
    createdAt: Date;
}

export const FlashcardDeckThumbnail = ({deck}:{deck: Deck}) => {
    const { id, title, createdAt, type, userId} = deck
    return (
        <div className="w-86 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col hover:border-gray-300 transition-colors">
            <h3 className="w-full font-semibold text-xl text-[#111]">{title}</h3>
            
            {/* ACTION BUTTONS */}
            <div className="flex flex-col mt-6">
                <Link
                    href={`/dashboard/decks/${id}/study`}
                    className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white py-3 rounded-2xl text-13 font-semibold transition-all active:scale-95 mb-2"
                >
                    <Play size={14} fill="currentColor" />
                    Study
                </Link>
                <Link 
                    href={`/dashboard/decks/${id}/edit`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-3 rounded-2xl text-13 font-semibold transition-all active:scale-95"
                >
                    <Pencil size={14} />
                    Edit
                </Link>
            </div>
        </div>
    )
}