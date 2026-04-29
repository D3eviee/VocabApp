"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeckItems, updateCardAction, deleteCardAction } from '@/app/actions/queries';
import { Save, Trash2, LayoutTemplate } from 'lucide-react';

export default function EditStoryPartPanel({ storyboardId }: { storyboardId: string }) {
  const { 
    activeCardId, setActiveCardId, formData, setFormData, updateMainField 
  } = useEditorStore();

  const queryClient = useQueryClient();

  const { data: storyParts = [] } = useQuery({
    queryKey: ['story-items', storyboardId],
    queryFn: () => getDeckItems(storyboardId),
  });

  const saveMutation = useMutation({
    mutationFn: () => updateCardAction(formData?.id, formData),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['story-items', storyboardId] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCardAction(formData?.id),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['story-items', storyboardId] });
        setActiveCardId(null); 
      } else {
        alert("Wystąpił błąd podczas usuwania.");
      }
    },
  });

  useEffect(() => {
    const part = storyParts.find((p: any) => p.id === activeCardId);
    if (part) {
      setFormData(JSON.parse(JSON.stringify(part)));
    } else {
      setFormData(null);
    }
  }, [activeCardId, storyParts, setFormData]);

  if (!formData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-400 font-medium">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <LayoutTemplate size={32} className="text-gray-300" />
        </div>
        <p>Wybierz lub stwórz nowe wydarzenie na osi czasu.</p>
      </div>
    );
  }

  return (
    <main className="relative flex-1 flex flex-col bg-white">
      
      {/* OBSZAR EDYCJI */}
      <div className="flex-1 overflow-y-auto px-12 py-12 pb-24">
        <div className="max-w-3xl mx-auto flex flex-col h-full gap-5">
          
          {/* POLE: DATE_LABEL */}
          <div className="flex items-center">
            <div className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold tracking-widest uppercase flex items-center transition-all focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-amber-50">
              <input
                type="text"
                placeholder="np. 1410 albo XIX wiek"
                value={formData.dateLabel || ""}
                onChange={(e) => updateMainField('dateLabel', e.target.value)}
                className="bg-transparent outline-none placeholder-amber-700/40 text-amber-900 w-48 font-black"
              />
            </div>
          </div>

          {/* POLE: TITLE */}
          <input
            type="text"
            placeholder="Tytuł wydarzenia (np. Bitwa pod Grunwaldem)"
            value={formData.title || ""}
            onChange={(e) => updateMainField('title', e.target.value)}
            className="w-full text-4xl font-black text-gray-900 placeholder-gray-300 outline-none bg-transparent"
          />

          <div className="w-16 h-1 bg-indigo-500 rounded-full my-2"></div>

          {/* POLE: DESCRIPTION */}
          <textarea
            placeholder="Opisz to wydarzenie historyczne..."
            value={formData.description || ""}
            onChange={(e) => updateMainField('description', e.target.value)}
            className="w-full flex-1 min-h-100 text-lg text-gray-700 leading-relaxed placeholder-gray-300 outline-none bg-transparent resize-none"
            spellCheck="false"
          />

        </div>
      </div>

      {/* FOOTER AKCJI (Bez zmian) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-50 pointer-events-none">
        <div className="pointer-events-auto flex gap-3 p-2 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => window.confirm("Usunąć to wydarzenie?") && deleteMutation.mutate()}
            disabled={deleteMutation.isPending || saveMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
          >
            <Trash2 size={18} strokeWidth={2} />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <button
            onClick={() => saveMutation.mutate()} 
            disabled={saveMutation.isPending || deleteMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold bg-[#18181B] text-white shadow-md hover:bg-[#27272A] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
          >
            {!saveMutation.isPending && <Save size={18} strokeWidth={2} />}
            {saveMutation.isPending ? "Saving..." : "Save Event"}
          </button>
        </div>
      </div>
    </main>
  );
}