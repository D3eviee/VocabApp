import { Html } from "@react-three/drei";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export const FlashcardMarker = () => {
  const position = usePlaygroundStore((state) => state.newFlashcardPosition);
  if (!position) return null;

  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className="relative cursor-pointer pointer-events-auto">
        {/* PULSING RING */}
        <div className="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-75"></div>
        {/* STATAIC DOT */}
        <div className="relative w-4 h-4 bg-[#7F00FF] rounded-full border-2 border-white shadow-[0_2px_12px_rgba(0,0,0,0.25)]" />
      </div>
    </Html>
  );
}