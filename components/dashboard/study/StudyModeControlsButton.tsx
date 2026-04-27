type RatingType = 'again' | 'hard' | 'good' | 'easy';

type RatingButtonProps = {
  type: RatingType;
  label: string;
  timeHint: string;
  onClick: () => void;
  disabled?: boolean;
};

const buttonStyles: Record<RatingType, { button: string; label: string, timeHint:string }> = {
  again: {
    button: "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
    label: "group-hover:text-red-600",
    timeHint: "group-hover:text-red-500",
  },
  hard: {
    button: "hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600",
    label: "group-hover:text-orange-600",
    timeHint: "group-hover:text-orange-500",
  },
  good: {
    button: "hover:bg-green-50 hover:border-green-200 hover:text-green-600",
    label: "group-hover:text-green-600",
    timeHint: "group-hover:text-green-500",
  },
  easy: {
    button: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-300 ",
    label: "group-hover:text-blue-600",
    timeHint: "group-hover:text-blue-500",
  },
};

export const StudyModeControlsButton = ({ type, label, timeHint, onClick, disabled }: RatingButtonProps) => {
  const styles = buttonStyles[type];

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-32 flex flex-col items-center py-2 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all active:scale-95 group disabled:opacity-50 disabled:pointer-events-none ${styles.button}`}
    >
      <span className={`text-sm font-bold text-[#333] ${styles.label}`}>{label}</span>
      <span className={`text-xs font-medium text-[#999] ${styles.timeHint}`}>{timeHint}
      </span>
    </button>
  );
};