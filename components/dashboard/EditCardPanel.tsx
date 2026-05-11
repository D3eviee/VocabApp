"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCardAction, getDeckItems, updateCardAction, createCardAction } from '@/app/actions/queries';
import MeaningsSection from './editor/MeaningsSection';
import VariationsSection from './editor/VariationsSection';
import SectionHeader from './editor/SectionHeader';
import { BookOpen, Layers, Save, Trash2, ChevronLeft, Plus } from 'lucide-react';
import { WordSection } from './editor/WordSection';

export default function EditCardPanel({ deckId, onBack }: { deckId: string, onBack: () => void }) {
  const {setActiveCardId, activeCardId, formData, addMeaning, addVariation, updateMainField, setFormData, updateMeaningField, removeMeaning, addMeaningExample, updateMeaningExample, removeMeaningExample} = useEditorStore();
  const queryClient = useQueryClient();
  const { data: cards = [] } = useQuery({ 
      queryKey: ['deck-items', deckId], 
      queryFn: () => getDeckItems(deckId), 
      refetchOnWindowFocus: false,
      staleTime: 1000* 60 * 5 
  });

  const mutation = useMutation({
    mutationFn: () => updateCardAction(formData?.id, formData),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        if (window.innerWidth < 1024) onBack(); 
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCardAction(formData?.id),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        setActiveCardId(null); 
        onBack();
      }
    },
  });

  // DODANO: Mutacja do tworzenia nowej karty bezpośrednio z widoku edytora
  const createMutation = useMutation({
    mutationFn: () => createCardAction(deckId),
    onSuccess: (result) => {
      if (result.success && result.data) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        setActiveCardId(result.data.id); // Od razu przełącza edytor na nową kartę!
      }
    }
  });

  useEffect(() => {
    const card = cards.find((c: any) => c.id === activeCardId);
    if (card) {
      const clonedCard = JSON.parse(JSON.stringify(card));
      if (!clonedCard.meanings || clonedCard.meanings.length === 0) clonedCard.meanings = [{ id: crypto.randomUUID(), back: "", examples: [] }];
      else clonedCard.meanings.forEach((m: any) => { if (!m.examples) m.examples = [] });
      if (!clonedCard.variations) clonedCard.variations = [];
      clonedCard.variations.forEach((v: any) => {
        if (!v.meanings || v.meanings.length === 0) v.meanings = [{ id: crypto.randomUUID(), back: "", examples: [] }];
        else v.meanings.forEach((m: any) => { if (!m.examples) m.examples = [] });
      });
      setFormData(clonedCard);
    } else {
      setFormData(null);
    }
  }, [activeCardId, cards, setFormData]);

  if (!formData) return (<div className="flex-1 flex items-center justify-center text-gray-400 font-medium bg-white lg:bg-transparent h-full">Wybierz fiszkę...</div>)
    
  return (
    <main className="relative flex-1 flex flex-col h-full overflow-y-auto bg-white lg:bg-transparent pb-24 custom-scrollbar">
      {/* HEADER MOBILE */}
      <div className="lg:hidden sticky border-b-[0.5px] top-0 p-2 flex items-center justify-between shrink-0 bg-white lg:bg-[#F2F2F2] z-10">
        <button 
          onClick={onBack}
          className="text-gray-600 p-1 hover:bg-gray-100 rounded-lg flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={24} color="#2B7FFF" /> 
        </button>

        <button
          className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
        >
          {!createMutation.isPending ? <Plus size={24} color="#2B7FFF"/> : <span className="text-[#2B7FFF] text-sm px-1 font-semibold">...</span>}
        </button>
      </div>

      {/* FORM */}
      <div className="flex flex-col xl:flex-row flex-1">
        <div className="flex-1 px-4 md:px-8 flex flex-col mt-6">
          <div className='p-4 bg-gray-50 rounded-3xl mb-6 border'>
            <WordSection
              wordValue={formData.front}
              partOfSpeechValue={formData.partOfSpeech as string}
              onWordChange={(val) => updateMainField('front', val)}
              onPosChange={(val) => updateMainField('partOfSpeech', val)}
            />
          </div>
          
          
          <div className='p-4 bg-gray-50 rounded-3xl border'>
            <SectionHeader 
              title="Meanings" 
              icon={<BookOpen size={16} strokeWidth={2} />} 
              bgColor="bg-indigo-500" 
              onAction={addMeaning} 
            />
            
            <div className='flex flex-col gap-6 mt-4'>
              {formData.meanings?.map((m: any, mIdx: number) => (
                <MeaningsSection 
                  key={m.id || mIdx} variant="main" translationValue={m.back} examples={m.examples}
                  onTranslationChange={(val) => updateMeaningField(mIdx, 'back', val)}
                  onRemoveMeaning={() => removeMeaning(mIdx)} onAddExample={() => addMeaningExample(mIdx)}
                  onExampleChange={(exIdx, val) => updateMeaningExample(mIdx, exIdx, val)}
                  onRemoveExample={(exIdx) => removeMeaningExample(mIdx, exIdx)}
                />
              ))}
            </div>
          </div>
        </div>
          
        <div className="mt-6 flex-1 px-4 flex flex-col">
          <div className='p-4 bg-gray-50 rounded-3xl border'>
            <SectionHeader 
              title="Variations" 
              icon={<Layers size={16} strokeWidth={2.5}/>} 
              bgColor="bg-purple-500" 
              buttonText="Add" 
              onAction={addVariation} 
            />
            <VariationsSection/>
          </div>
        </div>   
      </div>

      {/* DOLNY PASEK Z PRZYCISKAMI */}
      {/* <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-4 lg:left-8 lg:right-8 flex items-center justify-center gap-3 z-50 p-4 lg:p-0 bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-t border-gray-100 lg:border-none">
        <button
          className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-6 py-3 lg:py-2 rounded-2xl font-semibold bg-white text-gray-600 border border-gray-200 shadow-sm active:scale-95 transition-all"
          onClick={() => deleteMutation.mutate()} 
        >
          <Trash2 size={18} strokeWidth={2} /> Delete
        </button>

        <button
          className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-6 py-3 lg:py-2 rounded-2xl font-semibold bg-[#18181B] text-white shadow-sm border border-[#27272A] active:scale-95 transition-all"
          onClick={() => mutation.mutate()} 
          disabled={mutation.isPending}
        >
          {!mutation.isPending && <Save size={18} strokeWidth={2} />}
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div> */}
    </main>
  );
}