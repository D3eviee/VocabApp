import { FloatingInputField } from '@/components/auth/FloatingInputField';
import { FloatingSelectField } from '../ui/FloatingSelectField';

const POS_OPTIONS = [
  {label:"Noun",value: "noun" },
  {label:"Verb",value: "verb"},
  {label:"Adverb",value: "adverb"},
  {label:"Adjective",value: "adjective"},
  {label:"Phrasal verb",value: "phrasal_verb"},
  {label:"Interjection",value: "interjection"},
  {label:"Draft",value: "draft"},
]

type WordSectionProps = {
  wordValue: string;
  partOfSpeechValue: string;
  onWordChange: (value: string) => void;
  onPosChange: (value: string) => void;
  onDelete?: () => void;
  inputLabel: string;
}

export const WordSection = ({ wordValue, partOfSpeechValue, onWordChange, onPosChange, inputLabel, onDelete}: WordSectionProps) => {
  return (
    <div className="w-full flex flex-row items-center gap-4">
      <FloatingInputField
        label={inputLabel} 
        value={wordValue || ""}
        onChange={(e) => onWordChange(e.target.value)} 
        className='text-black'
      />
    
      <FloatingSelectField
        label="Part of speech"
        value={partOfSpeechValue || "draft"} 
        onChange={(e) => onPosChange(e.target.value)} 
      >
        {POS_OPTIONS.length > 0 && (
          POS_OPTIONS.map((option) => 
            <option key={option.value} value={option.value}>{option.label}</option>
          )
        )}
      </FloatingSelectField>

      {onDelete &&
      <button
        aria-label='delete-button'
        className='p-1.5 h-fit bg-red-50 border border-error-secondary text-error-secondary rounded-xl cursor-pointer hover:bg-error-secondary hover:text-white transition-all duration-150'
        onClick={() => onDelete()}
      >
        {/* <X size={20} strokeWidth={2} className='text-error-primary'/> */}
        <p className=' text-xs font-bold'>Delete</p>
      </button>
      }
    </div>
  )
}