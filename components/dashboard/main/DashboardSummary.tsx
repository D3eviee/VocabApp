import { Layers, Flame, Target } from 'lucide-react';
import { DashboardSummaryItem } from './DashboardSummaryItem';
import { getUserStats } from '@/server/queries/users';

export const DashboardSummary = async () => {
  const stats = await getUserStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 md:mb-16">
      <DashboardSummaryItem 
        secondaryColor='text-orange-500'
        accentColor='bg-orange-100'
        icon={<Flame size={24} strokeWidth={1.5} />}
        title="Current Streak"
        value={`${stats.currentStreak} Days`}
      />

      <DashboardSummaryItem
        accentColor='text-blue-500'
        secondaryColor="bg-blue-100"
        icon={<Layers size={24} strokeWidth={1.5} />}
        title="Due Today"
        value={`${stats.dueToday} Cards`}
      />

      <DashboardSummaryItem 
        accentColor='text-emerald-500'
        secondaryColor="bg-emerald-100"
        icon={<Target size={24} strokeWidth={1.5} />}
        title="Retention Rate"
        value={`${stats.retentionRate}%`}
      />
    </div>
  );
}