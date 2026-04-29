"use client";
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';
import { getDeckItems } from '@/app/actions/queries';
import Button from '../ui/Button';
import { StoryboardStudyModeHeader } from './StoryboardStudyModeHeader';
import StoryboardStudyModeControls from './StoryboardStudyModeControlsButton';
import { StoryboardCarousel } from './StoryboardCarousel';

export default function StoryboardStudyMode({ storyboardId }: { storyboardId: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: storyParts = [], isLoading } = useQuery({
    queryKey: ['story-items', storyboardId],
    queryFn: async () => {
      const items = await getDeckItems(storyboardId);
      return items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && activeIndex < storyParts.length - 1) setActiveIndex(prev => prev + 1);
      if (e.key === 'ArrowLeft' && activeIndex > 0) setActiveIndex(prev => prev - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, storyParts.length]);

  // Automatyczne przewijanie osi czasu do aktywnego elementu
  useEffect(() => {
    const timelineElement = document.getElementById(`timeline-node-${activeIndex}`);
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F7]">Wczytywanie osi czasu...</div>;

  if (storyParts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7] p-8 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4 text-gray-400">
          <History size={40} />
        </div>
        <p className="text-gray-500 font-medium mb-6">Ta oś czasu nie ma jeszcze żadnych wydarzeń.</p>
        <Link href={`/dashboard/storyboard/${storyboardId}/edit`}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft size={16} /> Wróć do edytora
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='bg-[#F2F2F2] h-[calc(100vh-56px)] border-2'>
      <div className="max-w-5xl me-auto ms-auto flex flex-col items-center mt-12 bg-white rounded-3xl border shadow-2xs">
        <StoryboardStudyModeHeader
          cardsCount={storyParts.length}
          currentIndex={activeIndex}
          storyParts={storyParts}
        />

        {/* STUDY AREA */}
        <main className="w-full flex flex-col items-center justify-center pb-8">
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