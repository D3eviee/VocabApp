import { Layers, Flame, Target } from 'lucide-react';

export default function Summary() { 
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
            <Flame size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Streak</p>
            <p className="text-2xl font-semibold mt-0.5">14 Days</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
            <Layers size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Due Today</p>
            <p className="text-2xl font-semibold mt-0.5">17 Cards</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
            <Target size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Retention Rate</p>
            <p className="text-2xl font-semibold mt-0.5">84%</p>
          </div>
        </div>
      </div>
    );
}