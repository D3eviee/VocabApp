import { ReactNode } from 'react'
import { PrimaryEditorInput } from './PrimaryEditorInput';

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
        <div className='w-full flex flex-row h-full  gap-4'>
          <select 
            value={partOfSpeechValue || "draft"} 
            onChange={(e) => onPosChange(e.target.value)} 
            className="w-full text-[#333] font-semibold rounded-xl px-3 py-2.5 outline-none border-[0.5px] border-transparent bg-white focus:border-[#E1E1E1]"
          >
            {POS_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          
          { actionButton && <div className="mb-px">{actionButton}</div> }
        </div>
      </div>
    </div>
  )
}
