import { FlashcardDeckThumbnail } from '../FlashcardDeckThumbnail';
import { StoryboardDeckThumbnail } from '../StoryboardDeckThumbnail';

type Decks = {
    id: string;
    userId: string;
    title: string;
    type: "classic" | "storytelling";
    createdAt: Date;
}[]

export default function Decks({decks}:{decks:Decks}) {  
    const classic = decks.filter(deck => deck.type == "classic")
    const storyboards = decks.filter(deck => deck.type == "storytelling")
    
    return (
        <div className='flex flex-col gap-6'>
            <div>
            <h2 className="text-xl font-semibold mb-3">Decks</h2>
            <div className="w-full flex flex-row gap-3">
                { classic.map((deck) => <FlashcardDeckThumbnail key={deck.id} deck={deck}/> )}
            </div>
        </div>
            <div>
            <h2 className="text-xl font-semibold mb-3">Storyboards</h2>
            <div className="w-full flex flex-row gap-3">
                { storyboards.map((deck) => <StoryboardDeckThumbnail key={deck.id} deck={deck}/> )}
            </div>
        </div>
    </div>  
    );
}