import { useEditorStore } from '@/store/use-editor-store';
import { SectionHeader } from './SectionHeader'
import { BookOpen, Trash2 } from 'lucide-react'
import { MeaningsSection } from './MeaningsSection';
import { WordSection } from './WordSection';

const VariationsSection = () => {
  const { 
    formData, removeVariation, updateVariationField,
    addVariationMeaning, removeVariationMeaning, updateVariationMeaningField, addVariationMeaningExample, updateVariationMeaningExample, removeVariationMeaningExample
  } = useEditorStore();

  if (!formData) return (<div className="flex-1 flex items-center justify-center text-gray-400 font-medium">Wybierz fiszkę z menu...</div>)

  return (
    <div className='flex-1 overflow-y-auto min-h-0 flex flex-col'>
      {formData.variations?.map((v: any, varIdx: number) => (
        <div key={v.id || varIdx} className="shrink-0 flex flex-col rounded-3xl border border-gray-200 overflow-hidden">
          <div className="px-6 pt-6 pb-0 border-b border-gray-100 mb-6">
            <WordSection
              inputLabel='Word'
              wordValue={v.word}
              partOfSpeechValue={v.partOfSpeech}
              onWordChange={(val) => updateVariationField(varIdx, 'word', val)}
              onPosChange={(val) => updateVariationField(varIdx, 'partOfSpeech', val)}
              actionButton={
                <button 
                  onClick={() => removeVariation(varIdx)} 
                  className="p-3.5 text-red-400 hover:text-red-600 bg-white border border-gray-200 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              }
            />
          </div>

          <div className='flex flex-col p-4 gap-4'>
            <SectionHeader
              title="Meanings" 
              icon={<BookOpen size={16} strokeWidth={2.5} />} 
              bgColor="bg-indigo-500" 
              buttonText="Add"
              onAction={() => addVariationMeaning(varIdx)}
            />

            {v.meanings?.map((vm: any, vmIdx: number) => (
              <MeaningsSection
                key={vm.id || vmIdx}
                variant="variation"
                translationValue={vm.back}
                examples={vm.examples}
                onTranslationChange={(val) => updateVariationMeaningField(varIdx, vmIdx, 'back', val)}
                onRemoveMeaning={() => removeVariationMeaning(varIdx, vmIdx)}
                onAddExample={() => addVariationMeaningExample(varIdx, vmIdx)}
                onExampleChange={(exIdx, val) => updateVariationMeaningExample(varIdx, vmIdx, exIdx, val)}
                onRemoveExample={(exIdx) => removeVariationMeaningExample(varIdx, vmIdx, exIdx)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default VariationsSection