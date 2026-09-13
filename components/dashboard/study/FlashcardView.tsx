import { Meaning, WordVariation } from "@/server/schema";
import { FlashcardWord } from "./FlashcardWord";
import {  } from "@/store/use-editor-store";

type FlashcardViewProps = {
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  currentCard: {
    id: string;
    partOfSpeech: string | null,
    front: string | null;
    meanings: Meaning[];
    variation: WordVariation[]
  }
};

export const FlashcardView = ({ isFlipped, setIsFlipped, currentCard }: FlashcardViewProps) => {
  return (
    <div
      key={currentCard.id}
      onClick={() => !isFlipped && setIsFlipped(true)}
      className={`w-full h-full transition-all duration-300 flex-1 flex-col overflow-scroll
        ${!isFlipped ? 'cursor-pointer  hover:-translate-y-1' : ''}
      `}
    >
      {/* CARD CONTENT */}
      {!isFlipped 
        ? (
        /* FRONT */
        <div className="w-full h-full flex flex-col items-center justify-center px-32">
          <p className="text-xs font-semibold text-subheading uppercase tracking-widest mb-3">Tap to flip</p>
          <h1 className="text-[42px] font-semibold text-heading tracking-tight wrap-break-words">{currentCard.front}</h1>
        </div>
        ) : (
        /* BACK */
        <div className="w-full flex flex-col gap-8 items-center justify-center overflow-scroll py-6 px-32">
          {/* MAIN WORD */}
          <FlashcardWord 
            word={currentCard.front} 
            partOfSpeech={currentCard.partOfSpeech} 
            meanings={currentCard.meanings} 
          />
          
          {/* VARIANTS */}
          {currentCard.variation && currentCard.variation.length > 0 && (
            <div className="w-full h-full">
              <h2 className="text-xs font-bold text-subheading uppercase tracking-widest mb-3 ml-3">Word Variations</h2>
              
              <div className="flex flex-col min-h-full gap-4 overflow-y-scroll">
                {currentCard.variation.map((v: any, index: number) => (
                  <FlashcardWord 
                    key={index}
                    word={v.word} 
                    partOfSpeech={v.partOfSpeech} 
                    meanings={v.meanings} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};