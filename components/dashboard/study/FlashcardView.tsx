import { Meaning, WordVariation } from "@/server/schema";
import FlashcardWord from "./FlashcardWord";

type FlashcardViewProps = {
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  currentCard: {
    id: string;
    deckId: string;
    order: number;
    front: string | null;
    back: string | null;
    partOfSpeech: string | null;
    meanings: Meaning[];
    dateLabel: string | null;
    title: string | null;
    description: string | null;
    variations: WordVariation[];
    dueDate: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
    createdAt: Date;
  };
};

const FlashcardView = ({ isFlipped, setIsFlipped, currentCard }: FlashcardViewProps) => {
  return (
    <div 
      onClick={() => !isFlipped && setIsFlipped(true)}
      className={`relative w-full max-w-2xl min-h-112.5 bg-white rounded-3xl border-2 overflow-hidden transition-all duration-300 ${!isFlipped ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}`}
    >
      {/* CARD CONTENT */}
      {!isFlipped ? (
        /* FRONT */
        <div className="h-full flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Tap to flip</p>
          <h1 className="text-6xl font-black text-[#2B2B2B] tracking-tight">{currentCard.front}</h1>
        </div>
      ) : (
        /* BACK */
        <div className="absolute w-full flex flex-col p-10 pb-0 overflow-y-auto animate-in fade-in zoom-in-95 duration-300 inset-0">
          
          {/* 1. MAIN WORD */}
          <FlashcardWord 
            word={currentCard.front} 
            partOfSpeech={currentCard.partOfSpeech} 
            meanings={currentCard.meanings} 
          />
          
          {/* 2. VARIANTS */}
          {currentCard.variations && currentCard.variations.length > 0 && (
            <div className="pb-8"> {/* Dodany padding bottom na wypadek scrolla */}
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Word Variations</h3>
              
              {currentCard.variations.map((v: any, index: number) => (
                <FlashcardWord 
                  key={index}
                  word={v.word} 
                  partOfSpeech={v.partOfSpeech} 
                  meanings={v.meanings} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardView;