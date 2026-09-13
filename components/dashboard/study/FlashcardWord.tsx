import { Meaning } from "@/server/schema";
import { FlashcardWordTypeBadge } from "./FlashcardWordTypeBadge";

type FlashcardWordProps = {
  word: string | null
  partOfSpeech: string | null
  meanings: Meaning[]
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
    <div className="h-full w-full bg-main-light rounded-4xl py-8 px-18 border-3 border-hover-button shadow-sm">
      <div className="flex flex-col">
        <FlashcardWordTypeBadge partOfSpeech={partOfSpeech}/>
        <h2 className="text-4xl mt-4 font-bold text-heading text-center">{word}</h2>
      </div>
      
      <div className="space-y-3 pt-8">
        {meanings?.map((m: Meaning) => (
          <div key={m.id} className="bg-white flex flex-col gap-1.5 rounded-2xl py-3 border-[0.5px] border-hover-border shadow-xs w-fit px-6 mx-auto">
            <p className="text-base font-semibold text-subheading text-center">{m.back}</p>
            
            {m.examples && m.examples.some((ex: string) => ex.trim() !== "") && (
              <div className="flex flex-col gap-2">
                {m.examples.map((ex: string, i: number) => {
                  if (!ex.trim()) return null;
                  return <p key={i} className="text-sm italic font-light text-subheading text-center">"{ex}"</p>;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}