"use client";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getDeckItems } from '@/app/actions/queries';
import Button from '../ui/Button';

export default function StudyMode({ deckId }: { deckId: string }) {
  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7]">
        <p className="text-gray-500 font-medium mb-6">This deck is empty. Add some flashcards first!</p>
        <Link href={`/dashboard/decks/${deckId}`}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft size={16} /> Back to Editor
          </Button>
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F7]">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link href={`/dashboard/decks/${deckId}`} className="text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-sm font-bold text-gray-400 tracking-widest uppercase">
          {currentIndex + 1} / {cards.length}
        </div>
        <div className="w-6" />
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Study Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          // Naprawione klasy Tailwind (min-h-[400px] i rounded-3xl)
          className="w-full max-w-2xl min-h-100 bg-white rounded-3xl shadow-xl shadow-gray-200/50 cursor-pointer relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          {/* FRONT KARTY */}
          {!isFlipped ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-300">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Tap to flip</span>
              <h1 className="text-6xl font-black text-gray-900 tracking-tight">{currentCard.front}</h1>
            </div>
          ) : (
            /* BACK KARTY (Znaczenia + Wariacje) */
            <div className="absolute inset-0 flex flex-col p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
              
              {/* 1. ZNACZENIA SŁOWA (Meanings) */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h2 className="text-3xl font-black text-gray-900 mb-6">{currentCard.front}</h2>
                
                <div className="space-y-8">
                  {currentCard.meanings?.map((m: any, mIdx: number) => (
                    <div key={m.id || mIdx} className="space-y-3">
                      
                      {/* Typ i Tłumaczenie */}
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {m.partOfSpeech?.replace('_', ' ') || 'noun'}
                        </span>
                        <span className="text-xl font-medium text-gray-700">{m.back}</span>
                      </div>

                      {/* Przykłady dla tego konkretnego znaczenia */}
                      {m.examples && m.examples.some((ex: string) => ex.trim() !== "") && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200">
                          {m.examples.map((ex: string, i: number) => {
                            if (!ex.trim()) return null;
                            return (
                              <p key={i} className="text-[15px] italic text-gray-600 leading-relaxed">
                                "{ex}"
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  {(!currentCard.meanings || currentCard.meanings.length === 0) && (
                    <p className="text-gray-400 italic text-sm">Brak zdefiniowanych znaczeń.</p>
                  )}
                </div>
              </div>

              {/* 2. WARIACJE (Variations) - Bez zmian */}
              {currentCard.variations && currentCard.variations.length > 0 ? (
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Word Variations</h3>
                  
                  {currentCard.variations.map((v: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      
                      {/* Nagłówek wariacji */}
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {v.partOfSpeech?.replace('_', ' ') || 'noun'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">{v.word}</span>
                        <span className="text-gray-400 mx-1">—</span>
                        <span className="text-base font-medium text-gray-700">{v.back}</span>
                      </div>
                      
                      {/* Przykłady do wariacji */}
                      {v.examples && v.examples.some((ex: string) => ex.trim() !== "") && (
                        <div className="space-y-2 mt-3 pl-3 border-l-2 border-purple-200">
                          {v.examples.map((ex: string, i: number) => {
                            if (!ex.trim()) return null;
                            return (
                              <p key={i} className="text-[14px] italic text-gray-600 leading-relaxed">
                                "{ex}"
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic">
                  Brak dodatkowych odmian słowa.
                </div>
              )}

            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-12">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-4 rounded-2xl bg-white shadow-sm text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          
          <Button 
            onClick={() => setIsFlipped(!isFlipped)}
            variant="secondary" 
            className="px-8 py-4 rounded-2xl shadow-sm text-base"
          >
            <RotateCcw size={18} className={isFlipped ? "-rotate-180 transition-transform duration-300" : "transition-transform duration-300"} />
            {isFlipped ? "Show Word" : "Show Meaning"}
          </Button>

          <button 
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="p-4 rounded-2xl bg-gray-900 text-white shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </main>
    </div>
  );
}