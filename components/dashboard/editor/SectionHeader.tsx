import { ReactNode } from "react";
import { Plus } from "lucide-react"; // Importujemy ikonkę Plusa

type SectionHeaderProps = {
  title: string;
  icon: ReactNode;
  bgColor: string;
  buttonText?: string;
  onAction?: () => void;
}

const SectionHeader = ({ title, icon, bgColor, buttonText, onAction }: SectionHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between w-full mb-6  border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 ${bgColor} rounded-lg text-white`}>{icon}</div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>

      {buttonText && onAction && (
        <button 
          onClick={onAction} 
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={16} /> {buttonText}
        </button>
      )}
    </div>
  )
}

export default SectionHeader;