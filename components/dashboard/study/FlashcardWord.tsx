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

export const FlashcardWord = ({ word, partOfSpeech, meanings }: FlashcardWordProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col border-b-[0.5px] border-[#D4D4D4] border-dotted mb-6 pb-4">
        <p 
          className={`w-fit mb-4 px-2 py-1 rounded-md mx-auto text-xs font-semibold uppercase tracking-wider ${getPartOfSpeechColor(partOfSpeech)}`}>
            {partOfSpeech?.replace('_', ' ') || 'noun'}
        </p>
        <h2 className="text-4xl font-bold text-[#111] text-center">{word}</h2>
      </div>
      
      <div className="space-y-8">
        {meanings?.map((m: any, mIdx: number) => (
          <div key={m.id || mIdx}>
            <p className="text-lg font-semibold text-[#333] text-center">{m.back}</p>
            
            {m.examples && m.examples.some((ex: string) => ex.trim() !== "") && (
              <div className="mt-1.5 space-y-2 pl-3">
                {m.examples.map((ex: string, i: number) => {
                  if (!ex.trim()) return null;
                  return <p key={i} className="text-sm italic font-light text-[#333] text-center">"{ex}"</p>;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}