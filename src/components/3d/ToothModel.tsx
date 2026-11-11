import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export type ToothMaterialMode = 'crystal' | 'enamel' | 'xray' | 'gold';

interface ToothModelProps {
  materialMode?: ToothMaterialMode;
  autoRotate?: boolean;
  scale?: number;
  customColor?: string;
}

export const ToothModel: React.FC<ToothModelProps> = ({
  materialMode = 'crystal',
  autoRotate = true,
  scale = 1.6,
  customColor = '#75F5C5',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Load the GLTF tooth model
  const { scene } = useGLTF('/models/tooth.glb');

  // Clone scene so we can modify materials without side-effects
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Create custom materials based on active mode and dynamic color
  const materials = useMemo(() => {
    const accentCol = new THREE.Color(customColor);
    const emissiveCol = accentCol.clone().multiplyScalar(0.2);

    // 1. Reference Image Crystal Translucent with Dynamic Aura Color
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      emissive: emissiveCol,
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.02,
      transmission: 0.82, // high translucency
      ior: 1.54,
      thickness: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationColor: accentCol,
      attenuationDistance: 0.7,
      transparent: true,
      opacity: 0.95,
    });

    // 2. Natural Pearl Enamel
    const naturalEnamelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xfcfdfd),
      roughness: 0.18,
      metalness: 0.05,
      transmission: 0.35,
      ior: 1.58,
      thickness: 1.0,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      attenuationColor: new THREE.Color(0xeaf8f3),
      attenuationDistance: 1.5,
    });

    // 3. Holographic X-Ray Scan
    const xrayMat = new THREE.MeshPhysicalMaterial({
      color: accentCol,
      emissive: accentCol,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.92,
      transparent: true,
      opacity: 0.65,
    });

    // 4. Luxury Restorative Gold
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffd700),
      roughness: 0.2,
      metalness: 0.95,
      envMapIntensity: 1.5,
    });

    return { crystal: crystalMat, enamel: naturalEnamelMat, xray: xrayMat, gold: goldMat };
  }, [customColor]);

  // Apply chosen material to the meshes
  useMemo(() => {
    const selectedMat = materials[materialMode];
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === 'EnamelCrownAndRoots') {
          mesh.material = selectedMat;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        } else if (mesh.name === 'GlowingInternalCore') {
          // Inner glowing core
          const coreColor = materialMode === 'gold' ? 0xcc8800 : new THREE.Color(customColor);
          const coreMat = new THREE.MeshBasicMaterial({
            color: coreColor,
            transparent: true,
            opacity: materialMode === 'crystal' ? 0.7 : 0.4,
          });
          mesh.material = coreMat;
        }
      }
    });
  }, [clonedScene, materials, materialMode, customColor]);

  // Subtle floating and gentle breathing inertia
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Natural floating hover
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.09;
      
      // Auto-rotation when idle
      if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.45;
      }
    }

    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={scale}>
      <primitive object={clonedScene} position={[0, 0.4, 0]} />
    </group>
  );
};

useGLTF.preload('/models/tooth.glb');
