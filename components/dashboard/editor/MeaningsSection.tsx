import PrimaryEditorInput from './PrimaryEditorInput'
import SecondaryEditorInput from './SecondaryEdiotrInput'
import { MessageCircle, Plus, Trash2 } from 'lucide-react'

type MeaningsSectionProps = {
  translationValue: string;
  examples: string[];
  onTranslationChange: (value: string) => void;
  onRemoveMeaning: () => void;
  onAddExample: () => void;
  onExampleChange: (exIndex: number, value: string) => void;
  onRemoveExample: (exIndex: number) => void;
  variant?: 'main' | 'variation';
}

const MeaningsSection = ({ translationValue, examples, onTranslationChange,onRemoveMeaning, onAddExample, onExampleChange, onRemoveExample, variant = 'main' }: MeaningsSectionProps) =>{
  return (
    <div className="h-fit w-full mt-4 bg-white shadow-xs border rounded-2xl p-6">
      <div className='w-full flex gap-4 items-end mb-4'>
        <PrimaryEditorInput 
          label='Translation' 
          value={translationValue || ""}
          onChange={(e) => onTranslationChange(e.target.value)} 
        />
        <button 
          onClick={onRemoveMeaning} 
          className="p-3.5 text-red-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl mb-px transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* 2. Przykłady zdań */}
      <div className='w-full flex flex-col'>
        <div className="w-full flex items-center justify-between mt-6 mb-4">
          <div className='flex flex-row gap-1 items-center'>
            <MessageCircle size={14} className='text-gray-400'/> 
            <span className='text-[13px] text-gray-400 font-bold tracking-wider uppercase'>Sentences</span>
          </div>
          <button 
              onClick={onAddExample} 
              className={`h-fit px-2 py-0.5 rounded-lg text-[13px] font-semibold flex items-center gap-1 transition-colors hover:cursor-pointer bg-purple-500`}
            >
              <Plus size={14} /> Add
            </button>
        </div>

        <div className="w-full flex flex-col gap-2">
          {examples?.map((ex: string, exIdx: number) => (
            <div key={exIdx} className="w-full flex flex-row gap-3.5">
              <SecondaryEditorInput 
                value={ex} 
                onChange={(e) => onExampleChange(exIdx, e.target.value)} 
                placeholder="Wpisz przykładowe zdanie..." 
              />

              <button 
                onClick={() => onRemoveExample(exIdx)} 
                className="p-3.5 text-red-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl mb-px transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}    
        </div>
      </div>
    </div>
  );
}

export default MeaningsSection;