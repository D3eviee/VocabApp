import React from 'react';
import { StoryboardCarouselCard } from './StoryboardCarouselCard';

interface StoryboardCarouselProps {
  storyParts: any[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const StoryboardCarousel = ({storyParts, activeIndex, setActiveIndex }: StoryboardCarouselProps) => {
  return (
    <div className='w-full h-[60vh] min-h-125 relative flex justify-center items-center py-6 overflow-hidden'>
      {storyParts.map((part: any, index: number) => {
        const offset = index - activeIndex;

        let transformClasses = "";
        if (offset === 0) {
          transformClasses = "translate-x-0 scale-100 blur-0 opacity-100 z-30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] pointer-events-auto";
        } else if (offset === -1) {
          transformClasses = "-translate-x-[115%] scale-75 blur-[4px] opacity-40 z-20 cursor-pointer hover:opacity-70 hover:blur-[2px] pointer-events-auto";
        } else if (offset === 1) {
          transformClasses = "translate-x-[115%] scale-75 blur-[4px] opacity-40 z-20 cursor-pointer hover:opacity-70 hover:blur-[2px] pointer-events-auto";
        } else {
          transformClasses = offset < 0 
            ? "-translate-x-[200%] scale-50 blur-md opacity-0 pointer-events-none" 
            : "translate-x-[200%] scale-50 blur-md opacity-0 pointer-events-none";
        }

        return (
          <StoryboardCarouselCard
            key={part.id}
            card={part}
            isActive={offset === 0}
            className={transformClasses}
            onClick={() => {
              if (offset === -1) setActiveIndex(prev => prev - 1);
              if (offset === 1) setActiveIndex(prev => prev + 1);
            }}
          />
        );
      })}
    </div>
  );
}