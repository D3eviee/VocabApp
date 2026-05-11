import { ReactNode } from 'react'
import { PrimaryEditorInput } from './PrimaryEditorInput';

const POS_OPTIONS = ["noun", "verb", "adjective", "adverb", "phrasal_verb", "idiom"];

type WordSectionProps = {
  wordValue: string;
  partOfSpeechValue: string;
  onWordChange: (value: string) => void;
  onPosChange: (value: string) => void;
  showHeader?: boolean;
  inputLabel?: string;
  actionButton?: ReactNode;
}

export const WordSection = ({ wordValue, partOfSpeechValue, onWordChange, onPosChange, inputLabel = 'Word', showHeader = true, actionButton }: WordSectionProps) => {
  return (
    <div className="w-full flex flex-col xl:flex-row gap-4">
      <PrimaryEditorInput
        label={inputLabel} 
        value={wordValue || ""}
        onChange={(e) => onWordChange(e.target.value)} 
      />
      
      <div className="w-full md:min-w-48 flex flex-col">
        <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
        <div className='w-full flex flex-row  gap-4'>
          <select 
            value={partOfSpeechValue || "noun"} 
            onChange={(e) => onPosChange(e.target.value)} 
            className="w-full text-[#333] font-semibold rounded-xl p-3 outline-none border-[0.5px] border-transparent bg-[#F2F2F2] focus:border-[#E1E1E1]"
          >
            {POS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
          </select>
          
          { actionButton && <div className="mb-px">{actionButton}</div> }
        </div>
      </div>
    </div>
  )
}
