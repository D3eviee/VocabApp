import { Meaning } from "@/server/schema";

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

export const FlashcardWordTypeBadge = ({ partOfSpeech }: {partOfSpeech: string | null}) => {
  return (
    <div
      className={`w-fit px-2 py-1 rounded-md mx-auto text-xs font-semibold uppercase tracking-wider ${getPartOfSpeechColor(partOfSpeech)}`}
    >
      {partOfSpeech?.replace('_', ' ') || 'noun'}
    </div>
  );
}