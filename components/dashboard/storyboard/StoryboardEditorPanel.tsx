"use client";
import { useEffect, useRef } from 'react';
import { useStoryboardStore, StoryboardDraft } from '@/store/use-storyboard-store';
import { useStoryboardQueries } from '@/lib/hooks/useStoryboardQueries';
import { StoryboardItem } from '@/lib/types';
import { StoryboardEditorPanelToolbar } from './StoryboardEditorPanelToolbar';

export const StoryboardEditorPanel = ({ storyboardId, onBack }: { storyboardId: string, onBack: () => void }) => {
  const { activeStoryboardItemId, setActiveStoryboardItem, activeStoryboardItem, updateField } = useStoryboardStore();

  // DATA FETCHING
  const { storyQuery } = useStoryboardQueries(storyboardId);
  const { data: storyboardItems = [] } = storyQuery;

  const lastLoadedId = useRef<string | null>(null);

  useEffect(() => {
    if (!activeStoryboardItemId) {
      setActiveStoryboardItem(null);
      lastLoadedId.current = null;
      return;
    }

    if (lastLoadedId.current !== activeStoryboardItemId) {
      const item = storyboardItems.find((p: StoryboardItem) => p.id === activeStoryboardItemId);
      if (item) {
        setActiveStoryboardItem({...item } as StoryboardDraft);
        lastLoadedId.current = activeStoryboardItemId;
      }
    }
  }, [activeStoryboardItemId, storyboardItems, setActiveStoryboardItem]);

  if (!activeStoryboardItem) 
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 font-medium bg-white lg:bg-transparent h-full">
        Select an event or add a new one
      </div>
    )
    
  return (
    <main className="relative flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar min-h-0">
      <StoryboardEditorPanelToolbar storyboardId={storyboardId} onBack={onBack}/>

      {/*FORM */}
      <div className="flex-1 flex flex-col gap-1 px-4 md:px-8 py-6 mx-auto w-full max-w-4xl">
        {/* DATE */}
        <div className="w-full md:w-fit bg-gray-50 rounded-xl px-1 border border-gray-100 mb-3 focus-within:ring-2 focus-within:ring-indigo-200 transition shrink-0">
          <input
            type="text"
            placeholder="Date of the event (e.g., 1410)"
            value={activeStoryboardItem.dateLabel || ""}
            onChange={(e) => updateField('dateLabel', e.target.value)}
            className="w-full md:w-64 p-3 bg-transparent outline-none text-base font-medium text-indigo-950 placeholder:text-gray-400"
          />
        </div>
      
        {/* DESCRIPTION */}
        <input
          type="text"
          placeholder="Type event title"
          value={activeStoryboardItem.title || ""}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full shrink-0 text-4xl md:text-5xl font-extrabold text-[#111] placeholder:text-gray-200 outline-none bg-transparent p-0 border-none focus:ring-0 tracking-tight"
        />

        <div className="w-20 h-1.5 bg-indigo-500 rounded-full mt-4 mb-6 shrink-0" />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Describe this event..."
          value={activeStoryboardItem.description || ""}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full flex-1 text-lg text-gray-800 leading-relaxed placeholder:text-gray-300 outline-none bg-transparent resize-none p-0 border-none focus:ring-0 pb-12"
          spellCheck="false"
        />
      </div>
    </main>
  );
}