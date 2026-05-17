"use client";
import { useEffect } from 'react';
import { useStoryboardStore, StoryboardDraft } from '@/store/use-storyboard-store';
import { Save, Trash2, ChevronLeft, Plus, Loader2 } from 'lucide-react';
import { useStoryboardQueries } from '@/lib/hooks/useStoryboardQueries';
import { useModal } from '@/store/modal-store';

export const EditStoryPartPanel = ({ storyboardId, onBack }: { storyboardId: string, onBack: () => void }) => {
  const { onOpen } = useModal();
  const { activePartId, setActivePartId, formData, setFormData, updateField } = useStoryboardStore();
  const { storyQuery, updatePart, deletePart, createPart } = useStoryboardQueries(storyboardId);
  const { data: storyParts = [] } = storyQuery;

  const handleSave = () => {
    if (!formData?.id) return;
    updatePart.mutate(
      { id: formData.id, data: formData },
      { onSuccess: () => { if (window.innerWidth < 1024) onBack(); } }
    );
  };

  const handleDelete = () => {
    if (!formData?.id) return;
    
    onOpen("deleteItemConfirm", { 
      itemId: formData.id,
      deckId: storyboardId,
      itemType: "storyboardEvent",
      onSuccess: () => {
        setActivePartId(null);
        onBack();
      }
    });
  };

  const handleCreate = () => {
    createPart.mutate(undefined, {
      onSuccess: (result) => {
        if (result?.success && result.id) setActivePartId(result.id);
      }
    });
  };

  useEffect(() => {
    const part = storyParts.find((p: any) => p.id === activePartId);
    if (part) {
      const clonedPart = JSON.parse(JSON.stringify(part));
      
      clonedPart.title = clonedPart.title || "";
      clonedPart.description = clonedPart.description || "";
      clonedPart.dateLabel = clonedPart.dateLabel || "";

      setFormData(clonedPart as StoryboardDraft);
    } else {
      setFormData(null);
    }
  }, [activePartId, storyParts, setFormData]);

  if (!formData) return (<div className="flex-1 flex items-center justify-center text-gray-400 font-medium bg-white lg:bg-transparent h-full">Select event or add new</div>)
    
  return (
    <main className="relative flex-1 flex flex-col h-full overflow-y-auto bg-white lg:bg-transparent custom-scrollbar min-h-0">
      {/* HEADER */}
       <div className="p-2 flex items-center justify-between shrink-0 border-b lg:border-none border-gray-100">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="lg:hidden text-gray-600 p-1 hover:bg-gray-200 rounded-lg flex items-center transition-colors">
           <ChevronLeft size={22} color="#2B7FFF"/> 
          </button>
          <span className="hidden lg:block text-[#2B2B2B] font-bold text-sm ml-2">Edit Event</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleDelete} disabled={deletePart.isPending} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer" title="Delete event">
            {deletePart.isPending ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
          </button>

          <button onClick={handleCreate} disabled={createPart.isPending} className="p-1 text-gray-400 hover:text-[#2B7FFF] hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer" title="Create new event">
            {createPart.isPending ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          </button>

          <button onClick={handleSave} disabled={updatePart.isPending} className="flex items-center gap-2 px-3 py-1 md:py-2  ml-1 sm:ml-2 bg-[#2B7FFF] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 hover:cursor-pointer">
            {updatePart.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            <span className="hidden sm:inline">{updatePart.isPending ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      {/*FORM */}
      <div className="flex-1 flex flex-col gap-1 px-4 md:px-8 py-6 mx-auto w-full max-w-4xl">
        {/* DATE */}
        <div className="w-full md:w-fit bg-gray-50 rounded-xl px-1 border border-gray-100 mb-3 focus-within:ring-2 focus-within:ring-indigo-200 transition shrink-0">
          <input
            type="text"
            placeholder="Date of the event (e.g., 1410)"
            value={formData.dateLabel || ""}
            onChange={(e) => updateField('dateLabel', e.target.value)}
            className="w-full md:w-64 p-3 bg-transparent outline-none text-base font-medium text-indigo-950 placeholder:text-gray-400"
          />
        </div>
      
        {/* DESCRIPTION */}
        <input
          type="text"
          placeholder="Type event title"
          value={formData.title || ""}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full shrink-0 text-4xl md:text-5xl font-extrabold text-[#111] placeholder:text-gray-200 outline-none bg-transparent p-0 border-none focus:ring-0 tracking-tight"
        />

        <div className="w-20 h-1.5 bg-indigo-500 rounded-full mt-4 mb-6 shrink-0" />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Describe this event..."
          value={formData.description || ""}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full flex-1 text-lg text-gray-800 leading-relaxed placeholder:text-gray-300 outline-none bg-transparent resize-none p-0 border-none focus:ring-0 pb-12"
          spellCheck="false"
        />
      </div>
    </main>
  );
}