import { AddDeckButton } from '@/components/dashboard/main/AddDeckButton';
import Decks from '@/components/dashboard/main/Decks';
import Header from '@/components/dashboard/main/Header';
import Summary from '@/components/dashboard/main/Summary';
import { getCurrentUser } from '@/lib/auth';
import { getUserDecks } from '@/server/queries/decks';

export default async function Dashboard() {
  const user = await getCurrentUser();
  const decks = await getUserDecks();

  return (
    <div className="h-full bg-gray-50 text-gray-900 font-sans overflow-y-auto custom-scrollbar">
      <div className='h-full relative max-w-5xl me-auto ms-auto px-6 pt-8 md:pt-12'>
        <Header user={user}/>
        <Summary/>
        <Decks decks={decks}/>
        <AddDeckButton/>
      </div>
    </div>
  );
}
