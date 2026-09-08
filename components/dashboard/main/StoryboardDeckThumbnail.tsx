'use client'
import { DeckThumbnail } from "@/lib/types";
import { Pencil, Play } from "lucide-react"
import { ThumbnailOptionMenu } from "./ThumbnailOptionMenu";
import { ButtonLink } from "../ui/ButtonLink";

export const StoryboardDeckThumbnail = ({deck}:{deck: DeckThumbnail}) => {
    const { id, title } = deck
    return (
        <div className="relative w-full bg-white rounded-4xl outline-2 outline-light-border p-6 flex flex-col">
            <h3 className="h-15 w-[90%]  font-semibold text-lg line-clamp-2 text-heading">{title}</h3>
            <ThumbnailOptionMenu deckId={id} reset={false}/>
            
            {/* ACTION BUTTONS */}
            <div className="w-full flex flex-row gap-3 mt-6">
                <ButtonLink href={`/dashboard/storyboard/${id}/study`} variant="gradient">
                    <Play size={16} strokeWidth={2}/>
                    Review
                </ButtonLink>
                <ButtonLink href={`/dashboard/storyboard/${id}/edit`} variant="secondary">
                    <Pencil size={16} strokeWidth={2}/>
                    Edit
                </ButtonLink>
            </div>
        </div>
    )
}
