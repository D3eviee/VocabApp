"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { FlashcardMarker } from "./FlashcardMarker";
import { LeftPanel } from "./LeftPanel";
import { uploadThumbnailAction } from "@/app/actions/playgrounds";
import { Playground, PlaygroundCard } from "@/lib/types";
import { EditModeModel } from "./EditModeModel";
import { ModelLoader } from "./ModelLoader";
import { ExistingFlashcardMarker } from "./ExistingFlashcardMaker";

export const PlaygroundEditor = ({ playground, playgroundCards }: { playground: Playground; playgroundCards: PlaygroundCard[]}) => {
  // CAPTURING THUMBNAIL FOR DASHBOARD AND SAVING TO DB
  const captureAndSaveThumbnail = async (gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
    // 1. Zapisz oryginalny kolor tła
    const originalClearColor = new THREE.Color();
    gl.getClearColor(originalClearColor);
    const originalAlpha = gl.getClearAlpha();

    // 2. Ustaw białe tło tymczasowo dla zrzutu
    gl.setClearColor(0xffffff, 1); 
    gl.render(scene, camera); // Wymuś odświeżenie renderu z nowym tłem

    // 3. Pobierz obraz
    const dataURL = gl.domElement.toDataURL("image/jpeg", 0.9);

    // RESET BG
    gl.setClearColor(originalClearColor, originalAlpha);

    // SAVE THUMBNAIL TO DB
    const formData = new FormData();
    formData.append("playgroundId", playground.id);
    formData.append("thumbnailBase64", dataURL);
    await uploadThumbnailAction(formData);
  };

return (
  <div className="flex h-full w-full bg-[#F2F2F2] overflow-hidden">
    <div className="w-1/3 h-full">
      <LeftPanel playgroundId={playground.id} playgroundTitle={playground.title} playgroundCards={playgroundCards} />
    </div>
    
    <div className="w-full h-full relative bg-radial from-[#121827] to-[#242426]">
        <Canvas 
          dpr={[1, 2]}
          frameloop="demand"
          camera={{ position: [0, 2, 5], fov: 20 }}
          onCreated={({ gl, scene, camera }) => {
            if (!playground.thumbnailUrl) setTimeout(() => captureAndSaveThumbnail(gl, scene, camera), 2000);
          }}
        >
          <ambientLight intensity={0.6} color="white"/>
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          
          <Suspense fallback={<ModelLoader />}>
            {playground.modelUrl && (
              <Bounds fit clip observe>
                  <EditModeModel url={playground.modelUrl} />
                  <FlashcardMarker />
                  {playgroundCards?.map((card) => <ExistingFlashcardMarker key={card.id} card={card} /> )}
              </Bounds>
            )}
          </Suspense>

          <Suspense fallback={null}>
            <Environment preset="apartment"/>
          </Suspense>

          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.5}
            enableDamping
          />
        </Canvas>
      </div>
    </div>
  );
}