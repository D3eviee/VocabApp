"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, RotateCcw, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { getDeckItems, rateCardAction } from '@/app/actions/queries';
import Button from '../ui/Button';

export default function StudyMode({ deckId }: { deckId: string }) {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  // MUTACJA DO AKTUALIZACJI SRS W BAZIE DANYCH
  const mutation = useMutation({
    mutationFn: ({ cardId, rating }: { cardId: string, rating: 'again' | 'hard' | 'good' | 'easy' }) => 
      rateCardAction(cardId, rating),
    onSuccess: () => {
      // Opcjonalnie: odśwież dane z serwera w tle
      queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });

      // Przejdź do kolejnej karty lub zakończ sesję
      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }
  });

  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    mutation.mutate({ cardId: currentCard.id, rating });
  };

  // PUSTY STAN (Brak kart w talii)
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

  // WIDOK KOŃCA SESJI NAUKI
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F7]">
        <div className="p-6 bg-green-100 text-green-600 rounded-full mb-6">
          <BrainCircuit size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Session Complete!</h1>
        <p className="text-gray-500 font-medium mb-8">You've reviewed all cards for now.</p>
        <Link href={`/dashboard`}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft size={16} /> Back to Deck
          </Button>
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F7]">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link href={`/dashboard`} className="text-gray-400 hover:text-gray-900 transition-colors">
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
      <main className="flex-1 flex flex-col items-center justify-center p-8 pb-20 overflow-hidden">
        
        <div 
          onClick={() => !isFlipped && setIsFlipped(true)}
          className={`w-full max-w-2xl min-h-112.5 bg-white rounded-3xl shadow-xl shadow-gray-200/50 relative overflow-hidden transition-all duration-300 ${!isFlipped ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1' : ''}`}
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
              
              {/* 1. ZNACZENIA SŁOWA GŁÓWNEGO */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-black text-gray-900">{currentCard.front}</h2>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {currentCard.partOfSpeech?.replace('_', ' ') || 'noun'}
                  </span>
                </div>
                
                <div className="space-y-8">
                  {currentCard.meanings?.map((m: any, mIdx: number) => (
                    <div key={m.id || mIdx} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-medium text-gray-700">{m.back}</span>
                      </div>

                      {m.examples && m.examples.some((ex: string) => ex.trim() !== "") && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200">
                          {m.examples.map((ex: string, i: number) => {
                            if (!ex.trim()) return null;
                            return (
                              <p key={i} className="text-[15px] italic text-gray-600 leading-relaxed">"{ex}"</p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. WARIACJE SŁOWA */}
              {currentCard.variations && currentCard.variations.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Word Variations</h3>
                  
                  {currentCard.variations.map((v: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      
                      <div className="flex items-center flex-wrap gap-3 mb-4 border-b border-gray-200 pb-3">
                        <span className="text-lg font-bold text-gray-900">{v.word}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {v.partOfSpeech?.replace('_', ' ') || 'noun'}
                        </span>
                      </div>
                      
                      {/* Znaczenia wariacji */}
                      <div className="space-y-4">
                        {v.meanings?.map((vm: any, vmIdx: number) => (
                          <div key={vmIdx}>
                             <span className="text-base font-medium text-gray-700">{vm.back}</span>
                             {vm.examples && vm.examples.some((ex: string) => ex.trim() !== "") && (
                              <div className="space-y-2 mt-2 pl-3 border-l-2 border-purple-200">
                                {vm.examples.map((ex: string, i: number) => {
                                  if (!ex.trim()) return null;
                                  return (
                                    <p key={i} className="text-[14px] italic text-gray-600 leading-relaxed">"{ex}"</p>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CONTROLS (Zależne od stanu isFlipped) */}
        <div className="h-24 flex items-center justify-center mt-8 w-full max-w-2xl">
          {!isFlipped ? (
            <Button 
              onClick={() => setIsFlipped(true)}
              variant="secondary" 
              className="px-8 py-4 rounded-2xl shadow-sm text-base w-full max-w-62.5"
            >
              <RotateCcw size={18} />
              Show Answer
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-3 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
              <button 
                onClick={() => handleRateCard('again')}
                disabled={mutation.isPending}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all active:scale-95 group disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="text-sm font-bold text-gray-900 group-hover:text-red-600">Again</span>
                <span className="text-[11px] font-medium text-gray-400">&lt; 1 min</span>
              </button>
              
              <button 
                onClick={() => handleRateCard('hard')}
                disabled={mutation.isPending}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all active:scale-95 group disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="text-sm font-bold text-gray-900 group-hover:text-orange-600">Hard</span>
                <span className="text-[11px] font-medium text-gray-400">1 day</span>
              </button>

              <button 
                onClick={() => handleRateCard('good')}
                disabled={mutation.isPending}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all active:scale-95 group disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="text-sm font-bold text-gray-900 group-hover:text-green-600">Good</span>
                <span className="text-[11px] font-medium text-gray-400">3 days</span>
              </button>

              <button 
                onClick={() => handleRateCard('easy')}
                disabled={mutation.isPending}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95 group disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Easy</span>
                <span className="text-[11px] font-medium text-gray-400">5 days</span>
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}