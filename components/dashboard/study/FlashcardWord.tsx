import { Meaning } from "@/server/schema";

type FlashcardWordProps = {
  word: string | null;
  partOfSpeech: string | null;
  meanings: Meaning[] | any[];
};

export const getPartOfSpeechColor = (pos?: string | null) => {
  const normalizedPos = pos?.toLowerCase().replace('_', ' ') || 'noun';
  
  switch (normalizedPos) {
    case 'noun': return 'bg-blue-100 text-blue-700';
    case 'verb': return 'bg-red-100 text-red-700';
    case 'adjective': return 'bg-blue-100 text-blue-700';
    case 'adverb': return 'bg-amber-100 text-amber-700';
    case 'pronoun': return 'bg-purple-100 text-purple-700';
    case 'preposition': return 'bg-teal-100 text-teal-700';
    case 'conjunction': return 'bg-orange-100 text-orange-700';
    case 'interjection': return 'bg-pink-100 text-pink-700';
    case 'idiom': return 'bg-indigo-100 text-indigo-700';
    case 'phrasal verb': return 'bg-rose-100 text-rose-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const FlashcardWord = ({ word, partOfSpeech, meanings }: FlashcardWordProps) => {
  return (
    <div className="w-full bg-[#F7F8F9] px-6 py-4 rounded-2xl border mb-8 shrink-0">
      <div className="flex flex-col border-b mb-3">
        <p className={`w-fit mb-2 px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${getPartOfSpeechColor(partOfSpeech)}`}>
          {partOfSpeech?.replace('_', ' ') || 'noun'}
        </p>
        <h2 className="text-3xl font-black text-gray-900 mb-3">{word}</h2>
      </div>
      
      <div className="space-y-8">
        {meanings?.map((m: any, mIdx: number) => (
          <div key={m.id || mIdx} className="">
            <div className="flex flex-row gap-2">
              <div className={`w-1 shrink-0 rounded-md ${getPartOfSpeechColor(partOfSpeech)}`} />
              <p className="text-md font-semibold text-[#2B2B2B]">{m.back}</p>
            </div>
            
            {m.examples && m.examples.some((ex: string) => ex.trim() !== "") && (
              <div className="mt-1.5 space-y-2 pl-3">
                {m.examples.map((ex: string, i: number) => {
                  if (!ex.trim()) return null;
                  return <p key={i} className="text-sm italic text-[#333]">"{ex}"</p>;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardWord;