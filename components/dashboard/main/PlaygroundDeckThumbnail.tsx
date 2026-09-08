'use client'
import { Brain, Edit, Box } from "lucide-react"
import { ButtonLink } from "../ui/ButtonLink";
import { ThumbnailOptionMenu } from "./ThumbnailOptionMenu";
import { PlaygroundThumbnail } from "@/lib/types";

export const PlaygroundDeckThumbnail = ({ playground }: { playground: PlaygroundThumbnail }) => {
    const { id, title, thumbnailUrl,  } = playground;

    return (
        <div className="relative w-full bg-white rounded-4xl outline-2 outline-light-border p-6 flex flex-col">    
            <h3 className="w-[90%] font-semibold text-lg line-clamp-1 text-heading mb-3">{title}</h3>
            <ThumbnailOptionMenu deckId={id} reset={false}/>
            
            {/* STATYCZNY PODGLĄD MODELU */}
            <div className="w-full h-32 overflow-hidden">
                {thumbnailUrl ? (
                    <img 
                        src={thumbnailUrl} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                ) : (
                    // Fallback, jeśli model nie ma jeszcze wygenerowanej miniaturki
                    <Box size={40} className="text-gray-300" strokeWidth={1.5} />
                )}
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="w-full flex flex-row gap-3 mt-6">
                <ButtonLink href={`/dashboard/playground/${id}/study`} variant="gradient">
                    <Brain size={16} strokeWidth={2} />
                    Study
                </ButtonLink>
                <ButtonLink href={`/dashboard/playground/${id}/edit`} variant="secondary">
                    <Edit size={16} strokeWidth={2} />
                    Edit
                </ButtonLink>
            </div>
        </div>
    )
}