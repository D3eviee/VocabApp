"use client";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export const StudyClientPin = ({ card, isActive, setActiveIndex, index }: any) => {
  const { scene } = useThree();
  const viewMode = usePlaygroundStore((state) => state.viewMode);
  
  // Referencja do grupy otaczającej naszą pinezkę HTML
  const groupRef = useRef<THREE.Group>(null);

  // Zapisujemy oryginalną, bazową pozycję z bazy danych w pamięci (tylko raz)
  const basePosition = useMemo(
    () => new THREE.Vector3(card.positionX, card.positionY, card.positionZ),
    [card.positionX, card.positionY, card.positionZ]
  );

  useFrame(() => {
    if (!groupRef.current) return;

    // Szukamy w scenie dokładnie tego elementu, do którego przypięta jest fiszka
    const parentMesh = scene.getObjectByName(card.meshName);
    
    // Zaczynamy od oryginalnej pozycji
    const targetPos = basePosition.clone();

    // Jeśli tryb to "rozstrzelony" i siatka ma obliczony wektor odrzutu, dodajemy go do pozycji pinezki!
    if (viewMode === "exploded" && parentMesh?.userData.explodeVector) {
      targetPos.add(parentMesh.userData.explodeVector);
    }

    // Płynnie animujemy grupę pinezki (tak samo jak model w StudyClientModel)
    groupRef.current.position.lerp(targetPos, 0.08);
  });

  return (
    <group ref={groupRef} position={basePosition}>
      <Html center zIndexRange={[100, 0]}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex(index);
          }}
          className={`w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-300 cursor-pointer ${
            isActive ? 'bg-violet-500 scale-150 animate-pulse' : 'bg-[#555] border-white hover:scale-125'
          }`} 
        />
        {isActive && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap">
            {card.title}
          </div>
        )}
      </Html>
    </group>
  );
};


// type StudyClientPinProps = {
//   card:any,
//   isActive:boolean,
//   setActiveIndex:any 
//   index: number
// }
// export const StudyClientPin = ({card, isActive, setActiveIndex, index} : StudyClientPinProps) => {
//   return (
//     <Html
//       key={card.id} 
//       position={[card.positionX, card.positionY, card.positionZ]} 
//       center 
//       zIndexRange={[100, 0]}
//     >
//       <div 
//         onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
//         className={`relative group cursor-pointer transition-transform duration-300 ${isActive ? 'scale-125' : 'hover:scale-110'}`}
//       >
//         {isActive && <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-60"></div>}
//         <div className={`w-4 h-4 rounded-full border-[2.5px] shadow-lg transition-colors ${isActive ? 'bg-blue-500 border-white' : 'bg-white border-gray-300'}`} />
        
//         {!isActive && (
//           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
//             {card.title}
//           </div>
//         )}
//       </div>
//     </Html>
//   );
// }
