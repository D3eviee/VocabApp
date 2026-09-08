import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from "three";

export const StudyClientCameraAnimator = ({ activeCard }: { activeCard: any | null }) => {
  const { camera, controls } = useThree();
  
  return (
    useFrame(() => {
      if (!controls) return;
        const orbitControls = controls as any;
    
        if (activeCard) {
          // POINT COORDINATES
          const targetFocus = new THREE.Vector3(activeCard.positionX, activeCard.positionY, activeCard.positionZ);
          
          // Obliczamy pozycję kamery: lekko odsuniętą i uniesioną względem punktu
          const offset = targetFocus.clone().normalize().multiplyScalar(2).add(new THREE.Vector3(0, 1, 0));
          const targetCameraPos = targetFocus.clone().add(offset);
    
          // Lerping zapewnia gładki ruch kamery
          orbitControls.target.lerp(targetFocus, 0.01);
          camera.position.lerp(targetCameraPos, 1);
          orbitControls.update();
        }
      })
    )
}
