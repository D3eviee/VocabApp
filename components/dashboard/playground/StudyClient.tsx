"use client";
import { useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, Bounds, Center } from "@react-three/drei";
import { StudyClientCard } from "./StudyClientCard";
import { ModelLoader } from "./ModelLoader";
import { StudyClientPin } from "./StudyClientPin";
import { StudyClientModel } from "./StudyClientModel";
import { StudyClientCameraAnimator } from "./StudyClientCameraAnimator";
import { StudyClientViewModelSelector } from "./StudyClientViewModelSelector";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const  StudyClient = ({ playground, flashcards }: { playground: any, flashcards: any[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeCard = activeIndex !== null ? flashcards[activeIndex] : null;
  const activeMeshNames = activeCard?.meshName ? [activeCard.meshName] : [];

  const nextCard = () => setActiveIndex((prev) => (prev === null || prev === flashcards.length - 1 ? 0 : prev + 1));
  const prevCard = () => setActiveIndex((prev) => (prev === null || prev === 0 ? flashcards.length - 1 : prev - 1));
  const closeCard = () => setActiveIndex(null);

  return (
    <div className="w-full h-screen relative bg-[#f5f5f7] overflow-hidden">
      <div className="absolute w-full top-0 left-0 p-6 z-10 flex flex-row justify-between">
        <div className="flex flex-row gap-3 items-center">
          <Link
            href="/dashboard" 
            className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
          >
            <ChevronLeft size={22} color="#2B7FFF"/> 
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 drop-shadow-sm pointer-events-none">{playground.title}</h1>
        </div>        
        <StudyClientViewModelSelector/>
      </div>
      
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        
        <Suspense fallback={<ModelLoader />}>
          {playground.modelUrl && (
            <Bounds fit clip observe margin={1.2}>
                <StudyClientModel url={playground.modelUrl} activeMeshNames={activeMeshNames} />

                {flashcards.map((card, index) => {
                  const isActive = activeIndex === index; 
                  return <StudyClientPin index={index} card={card} isActive={isActive} setActiveIndex={setActiveIndex} key={card.id}/>
                })}
            </Bounds>
          )}
        </Suspense>
        
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          makeDefault 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 1.5} 
          enableDamping 
          enablePan={false}
        />
        <StudyClientCameraAnimator activeCard={activeCard} />
      </Canvas>

      {/* LEARNING CARD */}
      {activeCard &&  
        <StudyClientCard 
          closeFn={closeCard}
          backFn={prevCard}
          nextFn={nextCard}        
          flashcard={activeCard}  
          activeCard={activeCard}
          activeIndex={activeIndex! }
        />
      }
    </div>
  );
}