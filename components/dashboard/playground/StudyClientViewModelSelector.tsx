import { usePlaygroundStore, ViewMode } from "@/store/usePlaygroundStore";
import { Box, Layers, Focus } from "lucide-react";

export const StudyClientViewModelSelector = () => {
  const { viewMode, setViewMode } = usePlaygroundStore();

  const modes: { id: ViewMode; label: string; icon: any }[] = [
    { id: "default", label: "Całość", icon: Box },
    { id: "exploded", label: "Rozstrzelony", icon: Layers },
    { id: "isolated", label: "Izolacja", icon: Focus },
  ];

  return (
    <div className="h-fit p-2 flex gap-4 bg-white/60 rounded-xl shadow-lg border-[0.5px] border-[#B2B2B2] backdrop-blur-xl">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = viewMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            title={mode.label}
            className="h-fit cursor-pointer rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            <Icon size={16} strokeWidth={2} color={isActive ? "purple": "black"}/>
          </button>
        );
      })}
    </div>
  );
};