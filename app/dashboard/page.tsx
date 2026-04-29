import Decks from '@/components/dashboard/main/Decks';
import Header from '@/components/dashboard/main/Header';
import Summary from '@/components/dashboard/main/Summary';
import { getCurrentUser } from '@/lib/auth';
import { getUserDecks } from '@/server/queries/decks';

export default async function Dashboard() {
  const user = await getCurrentUser();
  const decks = await getUserDecks();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className='max-w-5xl me-auto ms-auto px-6 pt-12'>
        <Header user={user}/>
        <Summary/>
        <Decks decks={decks}/>
      </div>
    </div>
  );
}