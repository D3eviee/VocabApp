"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCardAction, getDeckItems, updateCardAction } from '@/app/actions/queries';
import WordSection from './editor/WordSection';
import MeaningsSection from './editor/MeaningsSection';
import VariationsSection from './editor/VariationsSection';
import SectionHeader from './editor/SectionHeader';
import { BookOpen, Layers, Save, Trash2 } from 'lucide-react';
import Button from './ui/Button';


export default function EditCardPanel({ deckId }: { deckId: string }) {
  const {setActiveCardId, activeCardId, formData, addMeaning, addVariation, updateMainField, setFormData, updateMeaningField, removeMeaning, addMeaningExample, updateMeaningExample, removeMeaningExample} = useEditorStore();

  const queryClient = useQueryClient();

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  const mutation = useMutation({
    mutationFn: () => updateCardAction(formData?.id, formData),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        alert("Zapisano pomyślnie!");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCardAction(formData?.id),
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        setActiveCardId(null); 
      } else {
        alert("Wystąpił błąd podczas usuwania.");
      }
    },
  });

  useEffect(() => {
    const card = cards.find((c: any) => c.id === activeCardId);
    if (card) {
      const clonedCard = JSON.parse(JSON.stringify(card));
      
      // Zabezpieczenie na puste znaczenia - jeśli ktoś usunął wszystkie lub ma starą kartę
      if (!clonedCard.meanings || clonedCard.meanings.length === 0) {
        clonedCard.meanings = [{ id: crypto.randomUUID(), back: "", examples: [] }];
      } else {
        // Upewniamy się, że istniejące znaczenia mają tablicę examples
        clonedCard.meanings.forEach((m: any) => { if (!m.examples) m.examples = [] });
      }

      if (!clonedCard.variations) clonedCard.variations = [];
      clonedCard.variations.forEach((v: any) => {
        if (!v.meanings || v.meanings.length === 0) {
            // Wariacja też zawsze powinna mieć min. jedno puste tłumaczenie
            v.meanings = [{ id: crypto.randomUUID(), back: "", examples: [] }];
        } else {
            v.meanings.forEach((m: any) => { if (!m.examples) m.examples = [] });
        }
      });
      
      setFormData(clonedCard);
    } else {
      setFormData(null);
    }
  }, [activeCardId, cards, setFormData]);

  if (!formData) return (<div className="flex-1 flex items-center justify-center text-gray-400 font-medium">Wybierz fiszkę z menu...</div>)
    
  return (
    <main className="relative flex-1 flex flex-row">
      <div className="h-full w-full mx-8 pt-4 pb-18 flex flex-col">
        <WordSection 
          wordValue={formData.front}
          partOfSpeechValue={formData.partOfSpeech as string}
          onWordChange={(val) => updateMainField('front', val)}
          onPosChange={(val) => updateMainField('partOfSpeech', val)}
        />
        
        <SectionHeader 
          title="Meanings & Translations" 
          icon={<BookOpen size={16} strokeWidth={2.5} />} 
          bgColor="bg-indigo-500" 
          buttonText="Add"
          onAction={addMeaning}
        />
          
        <div className='overflow-scroll'>
          {formData.meanings?.map((m: any, mIdx: number) => (
            <MeaningsSection 
              key={m.id || mIdx}
              variant="main"
              translationValue={m.back}
              examples={m.examples}
              onTranslationChange={(val) => updateMeaningField(mIdx, 'back', val)}
              onRemoveMeaning={() => removeMeaning(mIdx)}
              onAddExample={() => addMeaningExample(mIdx)}
              onExampleChange={(exIdx, val) => updateMeaningExample(mIdx, exIdx, val)}
              onRemoveExample={(exIdx) => removeMeaningExample(mIdx, exIdx)}
            />
          ))}
        </div>
      </div>
        
      <div className="h-full w-full mx-8 pt-4 pb-18 flex flex-col">
        <SectionHeader 
          title="Word Variations" 
          icon={<Layers size={16} strokeWidth={2.5}/>} 
          bgColor="bg-purple-500" 
          buttonText="Add"
          onAction={addVariation}
        />
        
        <VariationsSection/>
      </div>   

      <div className="absolute bottom-4 left-0 right-0 justify-center flex items-center gap-3 z-50">
        <button
          className="
            flex flex-row items-center gap-2 px-6 py-2 rounded-2xl font-semibold bg-white text-gray-600 border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:bg-red-50 hover:text-red-600 hover:border-red-200  hover:-translate-y-0.5 hover:cursor-pointer active:scale-95 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          onClick={() => deleteMutation.mutate()} 
        >
          <Trash2 size={18} strokeWidth={2} />
          Delete
        </button>

        <button
          className="
            flex flex-row items-center gap-2 px-6 py-2 rounded-2xl font-semibold bg-[#18181B] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-[#27272A]
            hover:bg-[#27272A] hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:cursor-pointer active:scale-95 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          onClick={() => mutation.mutate()} 
          disabled={mutation.isPending}
        >
          {!mutation.isPending && <Save size={18} strokeWidth={2} />}
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </main>
  );
}