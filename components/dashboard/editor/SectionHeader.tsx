import { ReactNode } from "react";
import { Plus } from "lucide-react"; // Importujemy ikonkę Plusa

type SectionHeaderProps = {
  title: string;
  icon: ReactNode;
  bgColor: string;
  buttonText?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, icon, bgColor, onAction }: SectionHeaderProps) => {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-xl text-white ${bgColor}`}>{icon}</div>
        <h2 className="text-lg font-semibold text-[#111]">{title}</h2>
      </div>

      {onAction && (
        <button 
          onClick={onAction} 
          className="p-2 hover:bg-gray-100 rounded-lg active:scale-95 transition-all hover:cursor-pointer"
        >
          <Plus size={18} color="#2B7FFF" />
        </button>
      )}
    </div>
  )
}