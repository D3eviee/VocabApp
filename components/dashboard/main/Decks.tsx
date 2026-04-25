'use client'
import DeckThumbnail from '../DeckThumbnail';

type Decks = {
    id: string;
    userId: string;
    title: string;
    type: "classic" | "storytelling";
    createdAt: Date;
}[]

export default function Decks({decks}:{decks:Decks}) {   
    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                { decks.map((deck) => <DeckThumbnail key={deck.id} deck={deck}/> )}
            </div>
        </div>
    );
}