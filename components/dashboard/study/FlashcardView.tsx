import { Meaning, WordVariation } from "@/server/schema";
import { FlashcardWord } from "./FlashcardWord";

type FlashcardViewProps = {
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  currentCard: {
    // ... twoje typy (zostawiam bez zmian)
    id: string; front: string | null; partOfSpeech: string | null; meanings: Meaning[]; variations: WordVariation[];
  };
};

export const FlashcardView = ({ isFlipped, setIsFlipped, currentCard }: FlashcardViewProps) => {
  return (
    <div
      key={currentCard.id}
      onClick={() => !isFlipped && setIsFlipped(true)}
      className={`relative w-full h-full  overflow-hidden transition-all duration-300 flex flex-col ${!isFlipped ? 'cursor-pointer  hover:-translate-y-1' : ''}
      `}
    >
      {/* CARD CONTENT */}
      {!isFlipped 
        ? (
        /* FRONT */
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-xs font-semibold text-[#494949] uppercase tracking-widest mb-4">Tap to flip</p>
          <h1 className="text-5xl font-bold text-[#111] tracking-tight wrap-break-words">{currentCard.front}</h1>
        </div>
        ) : (
        /* BACK */
        <div className="w-full flex-1 flex flex-col gap-6 items-center justify-center px-4 overflow-scroll py-6">
          {/* 1. MAIN WORD */}
          <FlashcardWord 
            word={currentCard.front} 
            partOfSpeech={currentCard.partOfSpeech} 
            meanings={currentCard.meanings} 
          />
          
          {/* 2. VARIANTS */}
          {currentCard.variations && currentCard.variations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold text-[#494949] uppercase tracking-widest mb-3 ml-3">Word Variations</h3>
              
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