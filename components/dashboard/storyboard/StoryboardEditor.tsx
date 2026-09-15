"use client";
import { useEffect, useState } from 'react';
import { useStoryboardStore } from '@/store/use-storyboard-store';
import { StoryboardMenu } from './StoryboardMenu';
import { StoryboardEditorPanel } from './StoryboardEditorPanel';
import { useStoryboardQueries } from '@/lib/hooks/useStoryboardQueries';

export const StoryboardEditor = ({ storyboardId }: { storyboardId: string }) => {
  const { activeStoryboardItemId, setActivePartId } = useStoryboardStore();
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');
  const { storyQuery } = useStoryboardQueries(storyboardId);
  const { data: storyParts = [] } = storyQuery;

  useEffect(() => {
    if (storyParts.length > 0 && !activeStoryboardItemId) 
      setActivePartId(storyParts[0].id)
    }, [storyParts, activeStoryboardItemId, setActivePartId]);

  const handlePartSelectOnMobile = () => {
    if (window.innerWidth < 1024) setMobileView('editor');
  };

  return (
    <div className="h-full inset-0 flex flex-row bg-white lg:bg-[#F5F5F7] overflow-hidden w-full">
      {/* SIDEBAR */}
      <div className={`${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 shrink-0 h-full`}>
        <StoryboardMenu storyboardId={storyboardId} onNavigateToEditor={handlePartSelectOnMobile}/>
      </div>

      {/* EDITOR */}
      <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} flex-1 h-full min-h-0`}>
        {activeStoryboardItemId 
          ? (<StoryboardEditorPanel storyboardId={storyboardId} onBack={() => setMobileView('list')} />) 
          : (
            <div className="hidden lg:flex flex-1 items-center justify-center text-gray-400 bg-white lg:bg-transparent">
              Select or create an event to start editing
            </div>
          )
        }
      </div>
    </div>
  );
}