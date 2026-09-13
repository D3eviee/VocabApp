import { useEffect } from 'react';
import { FlashcardRate } from '../types';

type UseStudyShortcutsProps = {
  isFinished: boolean;
  isQueueEmpty: boolean;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: FlashcardRate) => void;
};

export const useStudyShortcuts = ({isFinished, isQueueEmpty, isFlipped, onFlip, onRate }: UseStudyShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || isQueueEmpty) return;

      if (!isFlipped && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        onFlip();
        return;
      }

      if (isFlipped) {
        switch (e.key) {
          case '1': e.preventDefault(); onRate('again'); break;
          case '2': e.preventDefault(); onRate('hard'); break;
          case '3': e.preventDefault(); onRate('good'); break;
          case '4': e.preventDefault(); onRate('easy'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, isQueueEmpty, isFlipped, onFlip, onRate]);
};