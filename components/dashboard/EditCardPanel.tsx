"use client";
import { useEffect } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { VariationsSection } from './editor/VariationsSection';
import { SectionHeader } from './editor/SectionHeader';
import { Languages, BookOpenIcon, Pen, Shapes } from 'lucide-react';
import { WordSection } from './editor/WordSection';
import { TranslationSection } from './editor/TranslationSection';
import { useFlashcardQueries } from '@/lib/hooks/useFlashcardsQueries';
import { Flashcard } from '@/lib/types';
import { normalizeFlashcardData } from '@/lib/NormalizeFlashcardData';
import { Meaning } from '@/server/schema';
import { EditCardPanelToolbar } from './EditCardPanelToolbar';

export const EditCardPanel = ({ deckId, onBack }: { deckId: string, onBack: () => void }) => {
  const {
    activeCardId, formData,
    updateMainField, setFormData, updateMeaningField, removeMeaning, 
    addMeaningExample, updateMeaningExample, removeMeaningExample
  } = useEditorStore();
  
  // DATA FETCHING
  const { deckQuery } = useFlashcardQueries(deckId);
  const { data: cards = [] } = deckQuery;


  useEffect(() => {
    if (!activeCardId) {
      setFormData(null);
      return;
    }

    const card = cards.find((c: Flashcard) => c.id === activeCardId);
    if (card && formData?.id !== activeCardId) {
      setFormData(normalizeFlashcardData(card));
    }
  }, [activeCardId, cards, formData?.id, setFormData]);

  if (!formData) return (<div className="flex-1 flex items-center justify-center text-gray-400 font-medium bg-white lg:bg-transparent h-full">Wybierz fiszkę...</div>)
    
  return (
    <main className="relative flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar min-h-0">
      <EditCardPanelToolbar onBack={onBack} deckId={deckId}/>
      
      {/* FORM */}
      <div className="flex flex-row gap-6 flex-1 p-6 py-12 bg-secondary-light">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col">
          {/* MAIN WORD INPUT FRAME */}
          <div className='relative px-4 pt-6 pb-3 rounded-3xl mb-10 border-[1.5px] border-hover-border'>
            <SectionHeader 
              title='Main word'
              icon={<Pen size={20} className='text-[#6155f5]'/>} 
              textColor='text-main-gradient' 
            />

            <WordSection
              inputLabel='Word'
              wordValue={formData.front || ""}
              partOfSpeechValue={formData.partOfSpeech || ""}
              onWordChange={(val) => updateMainField('front', val)}
              onPosChange={(val) => updateMainField('partOfSpeech', val)}
            />
          </div>
          
          {/* BASE WORD MEANINGS */}
          <div className='relative px-4 pt-6 pb-3 rounded-3xl border-[1.5px] border-hover-border'>
            <SectionHeader 
              title='Translations'
              icon={<Languages size={20} className='text-[#6155f5]'/>} 
              textColor='text-main-gradient' 
            />
            
            <div className='flex flex-col gap-4'>
              {formData.meanings?.map((m: Meaning, mIdx: number) => (
                <TranslationSection 
                  key={m.id} 
                  translation={m.back} 
                  examples={m.examples}
                  onTranslationChange={(val) => updateMeaningField(mIdx, 'back', val)}
                  onRemoveTranslation={() => removeMeaning(mIdx)} onAddExample={() => addMeaningExample(mIdx)}
                  onExampleChange={(exIdx, val) => updateMeaningExample(mIdx, exIdx, val)}
                  onRemoveExample={(exIdx) => removeMeaningExample(mIdx, exIdx)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col">
          <div className='relative px-4 pt-6 pb-3 rounded-3xl border-[1.5px] border-hover-border'>
            <SectionHeader
              title="Variations" 
              icon={<Shapes size={20} className='text-[#6155f5]'/>} 
              textColor="text-main-gradient"
            />

            <VariationsSection/>
          </div>
        </div> 
      </div>
    </main>
  );
}