import { Meaning, WordVariation } from "@/server/schema";
import FlashcardWord from "./FlashcardWord";

type FlashcardViewProps = {
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  currentCard: {
    // ... twoje typy (zostawiam bez zmian)
    id: string; front: string | null; partOfSpeech: string | null; meanings: Meaning[]; variations: WordVariation[];
  };
};

const FlashcardView = ({ isFlipped, setIsFlipped, currentCard }: FlashcardViewProps) => {
  return (
    <div 
      onClick={() => !isFlipped && setIsFlipped(true)}
      className={`
        relative w-full max-w-2xl h-full min-h-[45vh] md:max-h-50 bg-white rounded-3xl md:border-2 overflow-hidden transition-all duration-300 flex flex-col
        ${!isFlipped ? 'cursor-pointer  hover:-translate-y-1' : ''}
      `}
    >
      {/* CARD CONTENT */}
      {!isFlipped ? (
        /* FRONT */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 md:mb-6">Tap to flip</p>
          {/* Responsywny rozmiar tekstu i łamanie słów */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2B2B2B] tracking-tight wrap-break-words px-2">
            {currentCard.front}
          </h1>
        </div>
      ) : (
        /* BACK */
        <div className="absolute inset-0 flex flex-col p-6 md:p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-300 custom-scrollbar">
          
          {/* 1. MAIN WORD */}
          <FlashcardWord 
            word={currentCard.front} 
            partOfSpeech={currentCard.partOfSpeech} 
            meanings={currentCard.meanings} 
          />
          
          {/* 2. VARIANTS */}
          {currentCard.variations && currentCard.variations.length > 0 && (
            <div className="pb-8 mt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Word Variations</h3>
              
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