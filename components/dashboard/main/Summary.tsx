"use client";
import { Layers, Flame, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserStatsAction } from '@/app/actions/queries'; // Załóżmy, że tak nazwiesz akcję

export type UserStats = {
  currentStreak: number;
  dueToday: number;
  retentionRate: number;
};

export default function Summary() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: () => getUserStatsAction(),
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4 h-[88px]">
            <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
        <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
          <Flame size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Streak</p>
          <p className="text-2xl font-semibold mt-0.5">{stats.currentStreak} Days</p>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
          <Layers size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Due Today</p>
          <p className="text-2xl font-semibold mt-0.5">{stats.dueToday} Cards</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
          <Target size={24} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Retention Rate</p>
          <p className="text-2xl font-semibold mt-0.5">{stats.retentionRate}%</p>
        </div>
      </div>
    </div>
  );
}