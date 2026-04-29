import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryboardStudyModeControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export default function StoryboardStudyModeControls({ onPrev, onNext, canPrev, canNext }: StoryboardStudyModeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-8 mt-2">
      <button 
        onClick={onPrev}
        disabled={!canPrev}
        className="p-2 rounded-2xl bg-[#18181B] text-white border disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>
      
      <button 
        onClick={onNext}
        disabled={!canNext}
        className="p-2 rounded-2xl bg-[#18181B] text-white border disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}