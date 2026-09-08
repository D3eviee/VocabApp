import { usePlaygroundStore } from "@/store/usePlaygroundStore";
import { Html } from "@react-three/drei";

export const ExistingFlashcardMarker = ({ card }: { card: any }) => {
  const hoveredFlashcardId = usePlaygroundStore((state) => state.hoveredFlashcardId);
  const editingFlashcardId = usePlaygroundStore((state) => state.editingFlashcardId);
  const setEditingFlashcardId = usePlaygroundStore((state) => state.setEditingFlashcardId);

  const isHovered = hoveredFlashcardId === card.id;
  const isEditing = editingFlashcardId === card.id;

  return (
    <Html position={[card.positionX, card.positionY, card.positionZ]} center zIndexRange={[100, 0]}>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setEditingFlashcardId(card.id);
        }}
        className={`w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-300 cursor-pointer ${
          isEditing ? 'bg-red-500 animate-pulse scale-125'
            : isHovered ? 'bg-red-500 scale-150' 
              : 'bg-[#555] border-white scale-100 hover:scale-125' 
        }`} 
      />
      
      {(isHovered || isEditing) && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-4 py-2 text-white text-xs font-semibold rounded-xl shadow-lg whitespace-nowrap pointer-events-none z-50 ${isEditing ? 'bg-red-500' : 'bg-gray-700'}`}>
          {card.title}
        </div>
      )}
    </Html>
  );
}