'use client'
type RatingType = 'again' | 'hard' | 'good' | 'easy';

type RatingButtonProps = {
  type: RatingType;
  label: string;
  timeHint: string;
  onClick: () => void;
  isPressed?: boolean;
};

const buttonStyles: Record<RatingType, { button: string, isPressedStyle:string }> = {
  again: { 
    button: "bg-[#F60000] hover:bg-[#E50000]",
    isPressedStyle: "active:bg-[#E50000]"
  },
  hard: { 
    button: "bg-[#FF8C00] hover:bg-[#EE7B00]", 
    isPressedStyle: "active:bg-[#EE7B00]"
  },
  good: { 
    button: "bg-[#3DCB3F] hover:bg-[#2EBA2E]",
    isPressedStyle: "active:bg-[#2EBA2E]"
  },
  easy: { 
    button: "bg-[#3783FF] hover:bg-[#2672EE]", 
    isPressedStyle: "bg-[#2672EE]"
  },
};

export const StudyModeControlsButton = ({ type, label, timeHint, onClick, isPressed }: RatingButtonProps) => {
  const styles = buttonStyles[type];

  return (
        <button
      onClick={onClick}
      className={`w-full flex flex-col items-center py-3 border-[0.5px] border-hover-border rounded-3xl transition-all duration-100 cursor-pointer group 
      ${styles.button} 
      ${isPressed ? `${styles.isPressedStyle} scale-95 brightness-90` : 'bg-light-border active:scale-95'}`}
    >
    
      <span className={`text-sm font-bold text-subheading group-hover:text-white ${isPressed ? "text-white" : ""}`}>{label}</span>
      <span className={`text-sm font-medium text-subheading group-hover:text-white ${isPressed ? "text-white" : ""}`}>{timeHint}</span>
    </button>
  );
};