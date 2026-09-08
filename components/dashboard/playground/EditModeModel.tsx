import { useEffect } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import * as THREE from "three";
import { usePlaygroundStore } from "@/store/usePlaygroundStore";

export const EditModeModel = ({ url }: { url: string }) =>  {
  const gl = useThree((state) => state.gl);
  const selectedMeshName = usePlaygroundStore((state) => state.selectedMeshName);
  const setSelectedElement = usePlaygroundStore((state) => state.setSelectedElement);

  // GETTING MODEL TREE
  const { scene } = useGLTF(url, true, true, (loader) => {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/");
    ktx2Loader.detectSupport(gl);
    loader.setKTX2Loader(ktx2Loader);
  });
  
  const highlightColor = new THREE.Color("#FF0000");
  const defaultColor = new THREE.Color("#000000");

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
          child.material = child.material.clone();
        }

        if (child.name === selectedMeshName) {
          child.material.emissive.copy(highlightColor); 
          child.material.emissiveIntensity = 1;
        } else {
          child.material.emissive.copy(defaultColor);
          child.material.emissiveIntensity = 0;
        }
      }
    });
  }, [selectedMeshName, scene]);

  return (
    <primitive
      object={scene}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const clickedMeshName = e.object.name;
        const { x, y, z } = e.point;
        setSelectedElement(clickedMeshName, [x, y, z]);
      }}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        document.body.style.cursor = "crosshair";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    />
  );
}