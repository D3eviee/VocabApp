import { getUserDecks } from '@/app/actions/decks';
import { FlashcardDeckThumbnail } from './FlashcardDeckThumbnail';
import { StoryboardDeckThumbnail } from './StoryboardDeckThumbnail';

export const DashboardDecks = async () =>  {  
    const decks = await getUserDecks();
    if (decks.length === 0) return <div className="text-gray-500 py-25  text-center font-light">You don't have any decks yet.</div>

    const classic = decks.filter(deck => deck.type === "classic");
    const storyboards = decks.filter(deck => deck.type === "storytelling");

    return (
        <div className='w-full flex flex-col gap-8'>
            {classic.length > 0 && (
                <div className='flex flex-col'>
                    <h2 className="text-3xl font-semibold mb-4 text-[#111]">Decks</h2>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {classic.map((deck) => <FlashcardDeckThumbnail key={deck.id} deck={deck} />)}
                    </div>
                </div>
            )}
            
            {storyboards.length > 0 && (
                <div className='flex flex-col'>
                    <h2 className="text-3xl font-semibold mb-4 text-[#111]">Storyboards</h2>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {storyboards.map((deck) => <StoryboardDeckThumbnail key={deck.id} deck={deck} />)}
                    </div>
                </div>
            )}
        </div>  
    );
}