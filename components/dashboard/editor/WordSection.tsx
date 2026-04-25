import PrimaryEditorInput from './PrimaryEditorInput'
import SectionHeader from './SectionHeader'
import { Layers } from 'lucide-react'
import { ReactNode } from 'react'

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

const WordSection = ({ wordValue, partOfSpeechValue, onWordChange, onPosChange, inputLabel = 'Word', showHeader = true, actionButton
}: WordSectionProps) => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row gap-4 w-full items-end mb-12">
        <div className="flex-1">
          <PrimaryEditorInput 
            label={inputLabel} 
            value={wordValue || ""}
            onChange={(e) => onWordChange(e.target.value)} 
          />
        </div>
        
        <div className="min-w-48 flex flex-col">
          <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
          <select 
            value={partOfSpeechValue || "noun"} 
            onChange={(e) => onPosChange(e.target.value)} 
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 font-semibold text-gray-700 outline-none transition-all"
          >
            {POS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
          </select>
        </div>

        { actionButton && <div className="mb-px">{actionButton}</div> }
      </div>
    </div>
  )
}

export default WordSection;