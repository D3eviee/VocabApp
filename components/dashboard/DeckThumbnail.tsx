import { Pencil, Play } from "lucide-react"
import Link from "next/link";

type Deck =  {
    id: string;
    userId: string;
    title: string;
    type: "classic" | "storytelling";
    createdAt: Date;
}

const DeckThumbnail = ({deck}:{deck: Deck}) => {
    const { id, title, createdAt, type, userId} = deck
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:border-gray-300 transition-colors">
            {/* Deck Info */}
            <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            </div>
              
              
              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <Link
                    href={`/dashboard/decks/${id}/study`}
                    className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white px-4 py-2 rounded-full text-13 font-semibold transition-all active:scale-95"
                >
                    <Play size={14} fill="currentColor" />
                    Study
                </Link>
                <Link 
                    href={`/dashboard/decks/${id}/edit`}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-full text-13 font-semibold transition-all active:scale-95"
                >
                    <Pencil size={14} />
                    Edit
                </Link>
            </div>
        </div>
    )
}

export default DeckThumbnail