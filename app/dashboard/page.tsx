import { AddDeckButton } from '@/components/dashboard/main/AddDeckButton';
import { DashboardDecks } from '@/components/dashboard/main/DashboardDecks';
import { DecksSkeleton } from '@/components/dashboard/main/DashboardDecksSkeleton';
import { DashboardHeader } from '@/components/dashboard/main/DashboardHeader';
import { DashboardHeaderSkeleton } from '@/components/dashboard/main/DashboardHeaderSkeleton';
import { DashboardSummary } from '@/components/dashboard/main/DashboardSummary';
import { SummarySkeleton } from '@/components/dashboard/main/SummarySkeleton';
import { Suspense } from 'react';

export default async function Dashboard() {
  
  return (
    <div className="h-full bg-gray-50 text-gray-900 font-sans overflow-y-auto custom-scrollbar">
      <div className='h-full relative max-w-5xl me-auto ms-auto px-4 pt-8 md:pt-12'>
        {/* HEADER */}
        <Suspense fallback={ <DashboardHeaderSkeleton/> }>
          <DashboardHeader/>
        </Suspense>
        
        {/* USER STATS */}
        <Suspense fallback={ <SummarySkeleton/> }>
          <DashboardSummary/>
        </Suspense>
        
        {/* DECKS */}
        <Suspense fallback={<DecksSkeleton />}>
          <DashboardDecks />
        </Suspense>
        
        <AddDeckButton/>
      </div>
    </div>
  );
}
