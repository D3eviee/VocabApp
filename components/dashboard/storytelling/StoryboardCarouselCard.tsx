import React, { useState, useEffect } from 'react';

type StoryboardCarouselCardProps = {
  card: {
    id: string;
    dateLabel: string | null;
    title: string | null;
    description: string | null;
  };
  isActive: boolean;
  className?: string;
  onClick?: () => void;
};

export const StoryboardCarouselCard = ({ card, isActive, className = '', onClick }: StoryboardCarouselCardProps) => {
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);
  const [isDescriptionRevealed, setIsDescriptionRevealed] = useState(false);

  // Resetujemy oba pola, gdy użytkownik przesunie karuzelę dalej
  useEffect(() => {
    if (!isActive) {
      setIsTitleRevealed(false);
      setIsDescriptionRevealed(false);
    }
  }, [isActive]);

  const flipTitle = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isActive) {
      e.stopPropagation(); 
      setIsTitleRevealed(true);
    }
  }

  const flipDescription = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(isActive) {
      e.stopPropagation();
      setIsDescriptionRevealed(true)
    }
  }

  return (
    <div 
      onClick={onClick}
      className={`absolute w-full max-w-2xl min-h-112.5 bg-white rounded-3xl p-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col border-2 
      ${className}`}
    >
      {/* DATE */}
      {card.dateLabel && (
        <div className="mb-6 text-center">
          <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-xl font-black tracking-widest uppercase">{card.dateLabel}</span>
        </div>
      )}

      {/* EVENT NAME */}
      {!isTitleRevealed ? (
        <div 
          onClick={(e) => {flipTitle(e)}}
          className="py-8 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 transition-all duration-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300"
        >
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tap to reveal title</p>
        </div>
      ) : (
        <div className="flex flex-col animate-in duration-150">
          <h2 className="text-center text-4xl font-black text-gray-900  leading-tight">{card.title}</h2>
        </div>
      )}

      {/* DIVIDER */}
      {card.description && <div className="w-1/5 h-1 bg-indigo-500 rounded-full my-6 me-auto ms-auto"></div>}

      {/* EVENT DESCRIPTION */}
      {(card.description && !isDescriptionRevealed) ? (
        <div 
          onClick={(e) => {flipDescription(e)}}
          className="py-14 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 transition-all duration-200 cursor-pointer hover:bg-gray-100 hover:border-gray-300"
        >
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tap to reveal description</p>
        </div>
      ) : (
        <div className="text-center px-10 flex-1 text-md text-gray-600 leading-relaxed animate-in duration-150">{card.description}</div>
      )}
    </div>
  );
};