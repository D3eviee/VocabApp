import PrimaryEditorInput from './PrimaryEditorInput';
import { useEditorStore } from '@/store/use-editor-store';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import SecondaryEditorInput from './SecondaryEdiotrInput';

type TranslationProps = {
    meaning: {
        id: string;
        back: string;
        examples: string[];
    },
    index: number
}

const Translation = ({meaning, index}:TranslationProps) => {
    const { removeMeaning, updateMeaningField, addMeaningExample, updateMeaningExample, removeMeaningExample } = useEditorStore();

    return (
        <div key={meaning.id || index} className="flex flex-col gap-6 mb-8 p-6  rounded-2xl bg-[#F2F2F2]  shadow-inner">
            <div className='w-full flex gap-4 items-end mb-2'>
                <PrimaryEditorInput 
                    label='Translation' 
                    value={meaning.back || ""}
                    onChange={(e) => updateMeaningField(index, 'back', e.target.value)} 
                />
                  <button onClick={() => removeMeaning(index)} className="p-3 text-red-400 hover:text-red-600 bg-white border border-gray-200 rounded-xl mt-1">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className='flex flex-row justify-between items-center'>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                      <MessageCircle size={14} /> Examples
                    </label>

                    <button 
                      onClick={() => addMeaningExample(index)} 
                      className="h-fit text-[13px] font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 py-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                 

                  { meaning.examples?.map((ex: string, exIdx: number) => (
                    <div key={exIdx} className="flex items-center group/ex gap-2">
                      <SecondaryEditorInput value={ex} onChange={(e) => updateMeaningExample(index, exIdx, e.target.value)} placeholder="Wpisz przykładowe zdanie..." />
                      <button 
                        onClick={() => removeMeaningExample(index, exIdx)} 
                        className="p-2 text-gray-300 hover:text-red-500 rounded-xl opacity-0 group-hover/ex:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}   
                  
                  
                </div>
              </div>
  )
}

export default Translation