"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCardAction, getFlashcardDeckItems, updateCardAction, createCardAction } from '@/app/actions/queries';
import VariationsSection from './editor/VariationsSection';
import { SectionHeader } from './editor/SectionHeader';
import { BookOpen, Layers, Save, Trash2, ChevronLeft, Plus, Loader2 } from 'lucide-react';
import { WordSection } from './editor/WordSection';
import { MeaningsSection } from './editor/MeaningsSection';

export const EditCardPanel = ({ deckId, onBack }: { deckId: string, onBack: () => void }) => {
  const queryClient = useQueryClient();

  const {
    setActiveCardId, activeCardId, formData, addMeaning, addVariation, 
    updateMainField, setFormData, updateMeaningField, removeMeaning, 
    addMeaningExample, updateMeaningExample, removeMeaningExample
  } = useEditorStore();
  
  
  const { data: cards = [] } = useQuery({ 
      queryKey: ['deck-flashcards-items', deckId], 
      queryFn: () => getFlashcardDeckItems(deckId), 
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5 
  });


  // UPDATE CARD 
  const mutation = useMutation({
    mutationFn: () => updateCardAction(formData?.id, formData),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['deck-flashcards-items', deckId] });
        if (window.innerWidth < 1024) onBack(); 
      }
    },
  });

  // DELETE NEW CARD FORM TOOLBAR
  const deleteMutation = useMutation({
    mutationFn: () => deleteCardAction(formData?.id),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['deck-flashcards-items', deckId] });
        setActiveCardId(null); 
        onBack();
      }
    },
  });

  // ADD NEW CARD FORM TOOLBAR
  const createMutation = useMutation({
    mutationFn: () => createCardAction(deckId),
    onSuccess: (result) => {
      if (result.success && result.data) {
        queryClient.invalidateQueries({ queryKey: ['deck-flashcards-items', deckId] });
        setActiveCardId(result.data.id);
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
    <main className="relative flex-1 flex flex-col h-full overflow-y-auto bg-white lg:bg-transparent">
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 shrink-0 bg-white/90 lg:bg-[#F5F5F7]/90 backdrop-blur-md border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="lg:hidden text-gray-600 p-1.5 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
          >
            <ChevronLeft size={24} color="#2B7FFF" /> 
          </button>
          <span className="hidden lg:block text-[#2B2B2B] font-bold text-sm ml-2">Edit Card</span>
        </div>

        {/* Prawa Strona: Akcje */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Usuwanie */}
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer"
            title="Delete card"
          >
            {deleteMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
          </button>

          {/* Nowa Fiszka */}
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="p-2 text-gray-400 hover:text-[#2B7FFF] hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 hover:cursor-pointer"
            title="Create new card"
          >
            {createMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          </button>

          {/* Zapisz */}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-4 py-2 ml-1 sm:ml-2 bg-[#2B7FFF] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 hover:cursor-pointer"
          >
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="hidden sm:inline">{mutation.isPending ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="flex flex-col xl:flex-row flex-1 pb-12">
        <div className="flex-1 px-4 md:px-8 flex flex-col mt-6">
          <div className='p-4 bg-gray-50 rounded-3xl mb-6 border border-gray-200'>
            <WordSection
              wordValue={formData.front}
              partOfSpeechValue={formData.partOfSpeech as string}
              onWordChange={(val) => updateMainField('front', val)}
              onPosChange={(val) => updateMainField('partOfSpeech', val)}
            />
          </div>
          
          
           <div className='p-4 bg-gray-50 rounded-3xl border border-gray-200'>
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

        <div className="mt-6 flex-1 px-4 md:px-8 xl:px-4 flex flex-col">
          <div className='p-4 bg-gray-50 rounded-3xl border border-gray-200'>
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
    </main>
  );
}
