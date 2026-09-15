"use client";
import { useState, useEffect } from 'react';
import { ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';
import StoryboardStudyModeControls from './StoryboardStudyModeControlsButton';
import { StoryboardCarousel } from './StoryboardCarousel';
import { useStoryboardQueries } from '@/lib/hooks/useStoryboardQueries';
import { StudyModeHeader } from '../StudyModeHeader';

export const StoryboardStudyMode = ({ storyboardId }: { storyboardId: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { storyQuery } = useStoryboardQueries(storyboardId);
  const { data: storyParts = [], isLoading } = storyQuery;

  // KEYBOARD 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && activeIndex < storyParts.length - 1) setActiveIndex(prev => prev + 1);
      if (e.key === 'ArrowLeft' && activeIndex > 0) setActiveIndex(prev => prev - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, storyParts.length]);

  useEffect(() => {
    const timelineElement = document.getElementById(`timeline-node-${activeIndex}`);
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F7]">Loading your storyboard...</div>;

  if (storyParts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7] p-8 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
          <History size={40} />
        </div>
        <p className="text-gray-500 font-medium mb-6">No events for this storyboard</p>
        <Link href={`/dashboard/storyboard/${storyboardId}/edit`}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft size={16} /> Back to editor
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='w-full h-full md:min-h-full flex flex-col'>
      <div className="relative flex-1 w-full bg-white mx-auto flex flex-col overflow-hidden">
        <StudyModeHeader/>

        {/* STUDY AREA */}
        <main className="h-full w-full flex flex-col items-center justify-center px-4">
          <StoryboardCarousel
            storyParts={storyParts} 
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex} 
          />
            
          <StoryboardStudyModeControls
            onPrev={() => setActiveIndex(prev => prev - 1)}
            onNext={() => setActiveIndex(prev => prev + 1)}
            canPrev={activeIndex > 0}
            canNext={activeIndex < storyParts.length - 1}
          />
        </main>
      </div>
    </div>
  )
}