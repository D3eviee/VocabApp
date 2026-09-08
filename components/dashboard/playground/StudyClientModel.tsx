"use client"
import { KTX2Loader } from "three-stdlib";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export const StudyClientModel = ({ url, activeMeshNames }: { url: string, activeMeshNames: string[] }) => {
  const gl = useThree((state) => state.gl);
  const viewMode = usePlaygroundStore((state) => state.viewMode);

  const { scene } = useGLTF(url, true, true, (loader) => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/");
    ktx2Loader.detectSupport(gl);
    loader.setKTX2Loader(ktx2Loader);
  });

  const highlightColor = useMemo(() => new THREE.Color("#8B5CF6"), []);
  const defaultColor = useMemo(() => new THREE.Color("#000000"), []);

  // 2. INICJALIZACJA: Wyliczana tylko raz po załadowaniu modelu
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Klonowanie materiału (Twoja poprawna logika)
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
          child.material = child.material.clone();
        }

        // Zapis bazowej pozycji dla animacji
        if (!child.userData.originalPosition) {
          child.userData.originalPosition = child.position.clone();
        }
        
        // Obliczenie wektora "rozstrzelenia" z geometrycznego środka elementu
        if (!child.userData.explodeVector) {
          const box = new THREE.Box3().setFromObject(child);
          const meshCenter = new THREE.Vector3();
          box.getCenter(meshCenter);

          const explodeDirection = meshCenter.clone().normalize().multiplyScalar(0.4);
          explodeDirection.y += 0.2; 

          child.userData.explodeVector = explodeDirection;
        }
      }
    });
  }, [scene]);

  // 3. PĘTLA RENDEROWANIA (60 FPS): Obsługa kolorów, izolacji i płynnego ruchu
  useFrame(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Sprawdzamy, czy element znajduje się w tablicy aktywnych elementów fiszki
        const isHighlighted = activeMeshNames.includes(child.name);

        // --- PODŚWIETLANIE ---
        if (isHighlighted) {
          child.material.emissive.copy(highlightColor);
          child.material.emissiveIntensity = 0.5;
        } else {
          child.material.emissive.copy(defaultColor);
          child.material.emissiveIntensity = 0;
        }

        if (viewMode === "isolated" && activeMeshNames.length > 0) {
          if (isHighlighted) {
            // Aktywny element fiszki (solidny)
            child.material.transparent = false;
            child.material.opacity = 1;
          } else {
            // Cała reszta modelu (przezroczysty duch)
            child.material.transparent = true; // To musi być TRUE!
            child.material.opacity = 0.1;
          }
        } else {
          // Inne tryby (wszystko solidne)
          child.material.transparent = false;
          child.material.opacity = 1;
        }

        // --- TRYB ROZSTRZELONY (EXPLODED) ---
        const targetPosition = child.userData.originalPosition.clone();
        if (viewMode === "exploded") {
          targetPosition.add(child.userData.explodeVector);
        }
        
        // Płynne przesuwanie mesha do docelowej pozycji
        child.position.lerp(targetPosition, 0.08);
      }
    });
  });

  return <primitive object={scene} />;
}