import { DeckThumbtail } from '@/lib/types';
import { FlashcardDeckThumbnail } from '../FlashcardDeckThumbnail';
import { StoryboardDeckThumbnail } from '../StoryboardDeckThumbnail';

export default function Decks({decks}:{decks:DeckThumbtail[]}) {  
    const classic = decks.filter(deck => deck.type === "classic");
    const storyboards = decks.filter(deck => deck.type === "storytelling");
    
    return (
        <div className='w-full flex flex-col gap-8'>
            <div>
                <h2 className="text-2xl md:text-xl font-semibold mb-4">Decks</h2>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    { classic.map((deck) => <FlashcardDeckThumbnail key={deck.id} deck={deck}/> )}
                </div>
            </div>
            
            <div className='w-full'>
                <h2 className="text-2xl md:text-xl font-semibold mb-4">Storyboards</h2>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
                    { storyboards.map((deck) => <StoryboardDeckThumbnail key={deck.id} deck={deck}/> )}
                </div>
            </div>
        </div>  
    );
}