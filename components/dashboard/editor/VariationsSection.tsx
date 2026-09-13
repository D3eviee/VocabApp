import { useEditorStore, Variation } from '@/store/use-editor-store';
import { Languages, Plus } from 'lucide-react'
import { TranslationSection } from './TranslationSection';
import { WordSection } from './WordSection';
import { Meaning } from '@/server/schema';

export const VariationsSection = () => {
  const { formData, removeVariation, updateVariationField, addVariation,
    addVariationMeaning, removeVariationMeaning, updateVariationMeaningField, addVariationMeaningExample, updateVariationMeaningExample, removeVariationMeaningExample
  } = useEditorStore();

  if (!formData) return (<div className="flex-1 flex items-center justify-center text-gray-400 font-medium">Select a flashcard...</div>)

  return (
    <div className='flex-1 min-h-0 flex flex-col gap-4 overflow-scroll'>
      {formData.variations?.map((v: Variation, varIdx: number) => (
        <div key={v.id} className="shrink-0 flex flex-col p-4 rounded-3xl border-[1.5px] border-hover-border">
          <div className="mb-6">
            <WordSection
              inputLabel='Word'
              wordValue={v.word}
              partOfSpeechValue={v.partOfSpeech}
              onWordChange={(val) => updateVariationField(varIdx, 'word', val)}
              onPosChange={(val) => updateVariationField(varIdx, 'partOfSpeech', val)}
              onDelete={() => removeVariation(varIdx)}  
            />
          </div>
          
          <div className='relative px-4 pt-6 pb-3 rounded-3xl border-[1.5px] border-hover-border'>
            <div className='flex flex-row justify-between items-center mb-3 pl-2 pr-4.5'>
              <div className="flex flex-row items-center gap-2 bg-secondary-light">
                {<Languages size={20} className='text-[#6155f5]'/>} 
                <h2 className={`text-15 font-semibold text-main-gradient`}>Translations</h2>
              </div>

              <button 
                onClick={() => addVariationMeaning(varIdx)} 
                className="h-full p-1 rounded-lg transition-colors bg-main-gradient hover:bg-linear-to-tl cursor-pointer"
              >
                <Plus size={18} strokeWidth={2.5} /> 
              </button>            
            </div>
            
            <div className='flex flex-col gap-4'>
            {v.meanings?.map((vm: Meaning, vmIdx: number) => (
                <TranslationSection
                  key={vm.id || vmIdx}
                  translation={vm.back}
                  examples={vm.examples}
                  onTranslationChange={(val) => updateVariationMeaningField(varIdx, vmIdx, 'back', val)}
                  onRemoveTranslation={() => removeVariationMeaning(varIdx, vmIdx)}
                  onAddExample={() => addVariationMeaningExample(varIdx, vmIdx)}
                  onExampleChange={(exIdx, val) => updateVariationMeaningExample(varIdx, vmIdx, exIdx, val)}
                  onRemoveExample={(exIdx) => removeVariationMeaningExample(varIdx, vmIdx, exIdx)}
                />
              ))}
              </div>
          </div>
        </div>
      ))}

      {/* ADD VARIATION BUTTON */}
      <div className='w-full text-center'>
        <button 
          className="text-white shadow-sm font-semibold text-sm px-8 py-2 bg-main-gradient text-center rounded-2xl cursor-pointer hover:bg-linear-to-l" 
          onClick={() => addVariation()}
        >
          Add varation
        </button>
      </div>
    </div>
  )
}