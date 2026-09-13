import { StudyModeControlsButton } from "./StudyModeControlsButton";

type StudyModeControlsProps = {
  onRate: (rating: 'again' | 'hard' | 'good' | 'easy') => void;
  activeRating: 'again' | 'hard' | 'good' | 'easy' | null;
}

const RATING_OPTIONS = [
  { type: 'again', label: 'Again', timeHint: '< 1 min' },
  { type: 'hard', label: 'Hard', timeHint: '1 day' },
  { type: 'good', label: 'Good', timeHint: '3 days' },
  { type: 'easy', label: 'Easy', timeHint: '5 days' },
] as const;

export const StudyModeControls = ({ onRate, activeRating }: StudyModeControlsProps) => {
  return (
    <div className="w-full h-fit flex flex-row items-center justify-center py-12 px-32 max-w-5xl">
        <div className="flex flex-row justify-center gap-2 w-full">
          {RATING_OPTIONS.map((option) => (
            <StudyModeControlsButton
              key={option.type}
              type={option.type}
              label={option.label}
              timeHint={option.timeHint}
              onClick={() => onRate(option.type)}
              isPressed={activeRating === option.type} 
            />
          ))}
        </div>
    </div>
  )
}