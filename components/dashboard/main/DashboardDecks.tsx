import { FlashcardDeckThumbnail } from './FlashcardDeckThumbnail';
import { StoryboardDeckThumbnail } from './StoryboardDeckThumbnail';
import { PlaygroundDeckThumbnail } from './PlaygroundDeckThumbnail';
import { DashboardSection } from './DashboardSection';
import { getUserDecks, getUserPlaygrounds } from '@/lib/data/dashboard';

export const DashboardDecks = async () => {
    const [decks, userPlaygrounds] = await Promise.all([
        getUserDecks(),
        getUserPlaygrounds()
    ]);

    if (decks.length === 0 && userPlaygrounds.length === 0) 
        return <div className="text-gray-500 py-25 text-center font-light">You don't have any content yet.</div>

    const classic = decks.filter(deck => deck.type === "classic");
    const storyboards = decks.filter(deck => deck.type === "storytelling");

    return (
        <div className='w-full flex flex-col gap-16 pb-12'>
            {classic.length > 0 && (
                <DashboardSection title="Decks">
                    {classic.map(deck => <FlashcardDeckThumbnail key={deck.id} deck={deck} />)}
                </DashboardSection>
            )}

            {storyboards.length > 0 && (
                <DashboardSection title="Storyboards">
                    {storyboards.map(deck => <StoryboardDeckThumbnail key={deck.id} deck={deck} />)}
                </DashboardSection>
            )}

            {userPlaygrounds.length > 0 && (
                <DashboardSection title="Playgrounds">
                    {userPlaygrounds.map(pg => <PlaygroundDeckThumbnail key={pg.id} playground={pg} />)}
                </DashboardSection>
            )}
        </div>
    );
}