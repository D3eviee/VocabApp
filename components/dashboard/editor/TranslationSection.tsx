import { FloatingInputField } from '@/components/auth/FloatingInputField';
import { MessageCircle, Plus, SendHorizonal, X } from 'lucide-react'

type MeaningsSectionProps = {
  translation: string;
  examples: string[];
  onTranslationChange: (value: string) => void;
  onRemoveTranslation: () => void;
  onAddExample: () => void;
  onExampleChange: (exIndex: number, value: string) => void;
  onRemoveExample: (exIndex: number) => void;
}

export const TranslationSection = (
  { translation, examples, onTranslationChange, onRemoveTranslation, onAddExample, onExampleChange, onRemoveExample }: MeaningsSectionProps) =>{
  return (
    <div className="w-full border-2 border-light-border bg-main-light p-4 rounded-3xl" >
      <div className='w-full flex gap-2 items-center mb-6'>
        <FloatingInputField
          label='Translation' 
          className='bg-white border-none'
          value={translation || ""}
          onChange={(e) => onTranslationChange(e.target.value)} 
        />

        {/* DELETE MEANING */}
        <button 
          onClick={onRemoveTranslation} 
          className="h-full p-1 cursor-pointer rounded-lg transition-colors  text-error-secondary hover:bg-white"
        >
          <X size={20} strokeWidth={2.5} className='h-full'/>
        </button>
      </div>

      {/* EXAMPLES */}
      <div className='w-full flex flex-col'>
        <div className="pl-2 w-full flex items-center justify-between mb-2">
          <div className='flex flex-row gap-2 items-center'>
            <SendHorizonal size={14} strokeWidth={2.5} className='text-secondary-dark'/> 
            <span className='text-13 text-secondary-dark font-bold tracking-wider  leading-none uppercase'>Examples</span>
          </div>

          <button 
           onClick={onAddExample} 
           className="h-full p-1 rounded-lg transition-colors bg-main-gradient hover:bg-linear-to-tl cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} /> 
          </button>
        </div>

        <div className="w-full flex flex-col gap-2">
          {examples?.map((ex: string, exIdx: number) => (
            <div key={exIdx} className="w-full flex flex-row items-center gap-2">
              <FloatingInputField
                label='Sentence' 
                className='bg-white border-none'
                value={ex} 
                onChange={(e) => onExampleChange(exIdx, e.target.value)} 
              />

              <button 
                onClick={() => onRemoveExample(exIdx)} 
                className="h-full p-1 cursor-pointer rounded-lg transition-colors  text-error-secondary hover:bg-white"
              >
                <X size={20} strokeWidth={2.5}/>
              </button>
            </div>
          ))}    
        </div>
      </div>
    </div>
  );
}