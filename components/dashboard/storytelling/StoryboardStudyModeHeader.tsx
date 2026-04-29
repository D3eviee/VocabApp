import { Meaning, WordVariation } from '@/server/schema';
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link';
import { useMemo } from 'react';

type StoryboardStudyModeHeaderProps = {
  currentIndex:number, 
  cardsCount:number, 
  storyParts: {
    id: string;
    deckId: string;
    order: number;
    front: string | null;
    back: string | null;
    partOfSpeech: string | null;
    meanings: Meaning[];
    dateLabel: string | null;
    title: string | null;
    description: string | null;
    variations: WordVariation[];
    dueDate: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
    createdAt: Date;
  }[]
}



export const StoryboardStudyModeHeader = ({currentIndex, cardsCount, storyParts}:StoryboardStudyModeHeaderProps) => {
  const timelineData = useMemo(() => {
    // Słownik dla rzymskich cyfr (często używane przy wiekach)
    const romanMap: Record<string, number> = { 
      i:1, ii:2, iii:3, iv:4, v:5, vi:6, vii:7, viii:8, ix:9, x:10, 
      xi:11, xii:12, xiii:13, xiv:14, xv:15, xvi:16, xvii:17, xviii:18, xix:19, xx:20, xxi:21 
    };

    let minYear = Infinity, maxYear = -Infinity;

    const parsed = storyParts.map(part => {
      let year = null;
      if (part.dateLabel) {
        const text = part.dateLabel.toString().toLowerCase();
        const match = text.match(/\d+/);

        if (match) {
          year = parseInt(match[0], 10);
        } else {
          // Próba znalezienia cyfr rzymskich (np. "XIX wiek")
          for (const [roman, num] of Object.entries(romanMap)) {
             if (text.includes(`${roman} w`) || text === roman) { year = num; break; }
          }
        }

        if (year !== null) {
          if (text.includes('p.n.e') || text.includes('bc') || text.includes('pne')) year = -year;
          else if (text.includes('wiek') || text.includes(' w.') || text.includes(' w ')) year = year * 100;
        }
      }

      if (year !== null) {
        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, year);
      }
      return { ...part, parsedYear: year };
    });

    return { 
      parsed, 
      span: maxYear > minYear ? maxYear - minYear : 0
    };
  }, [storyParts]);

  return (
    <header className='relative flex flex-row justify-between w-full px-10 py-6'>
      {/* BACK BUTTON */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard`}
          className='p-1 rounded-2xl bg-[#333] flex items-center justify-center'
        >
          <ChevronLeft size={28} strokeWidth={2} className='mr-0.5'/>
        </Link>
      </div>
      
      <div className="absolute w-1/2 left-1/2 flex flex-col items-center top-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="flex items-center w-fit justify-center">
          {timelineData.parsed.map((part: any, index: number) => {
            const isActive = index === currentIndex;
            const isPast = index <= currentIndex;
            // DEAFULT GAP
            let gapPx = 80;
            
            if (index < timelineData.parsed.length - 1) {
              const currentYear = part.parsedYear;
              const nextYear = timelineData.parsed[index + 1].parsedYear;
              
              if (currentYear !== null && nextYear !== null && timelineData.span > 0) {
                const diff = nextYear - currentYear;
                const extraGap = Math.max(0, (diff / timelineData.span) * 30);
                gapPx = 80 + extraGap;
              }
            }
            
            return (
              <div key={part.id} className="flex items-center mt-4">
                {/* TIMELINE DOT) */}
                <div 
                  id={`timeline-node-${index}`}
                  className="relative z-10 flex flex-col items-center justify-center"
                >
                  <span className={`whitespace-nowrp absolute -top-6 text-center text-xs font-black uppercase tracking-wide transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}>
                    {part.dateLabel}
                  </span>
                  
                  <div className={`w-3 h-3 rounded-full border-2 bg-[#F5F5F7] transition-all duration-300 ${isActive ? 'border-indigo-600 scale-150 shadow-md' : isPast ? 'border-indigo-500' : 'border-gray-300'}`} />
                </div>

                {/* LINE */}
                {index < timelineData.parsed.length - 1 && (
                  <div 
                    style={{ width: `${gapPx}px` }} 
                    className={`h-1 -mx-1 z-0 transition-colors duration-500 rounded-full ${index < currentIndex ? 'bg-indigo-500' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            )})
          }
        </div>
      </div>
    </header>
  )
}
