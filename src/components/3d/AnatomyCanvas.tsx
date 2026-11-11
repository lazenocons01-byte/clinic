import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ANATOMY_LAYERS } from '../../data/clinicData';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface AnatomyCanvasProps {
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
  enamelOpacity: number;
  explodeFactor: number;
}

// 3D Tooth Anatomy Scene with Hotspots and Animated Camera Transitions
const AnatomyScene: React.FC<{
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
  enamelOpacity: number;
  explodeFactor: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ selectedLayerId, onSelectLayer, enamelOpacity, explodeFactor, controlsRef }) => {
  const { colors } = useTheme();
  const { scene } = useGLTF('/models/tooth-anatomy.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Smooth camera position lerp when selectedLayerId changes
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.2, 4.2));

  useEffect(() => {
    const currentLayer = ANATOMY_LAYERS.find((l) => l.id === selectedLayerId);
    if (currentLayer) {
      targetCamPos.current.set(
        currentLayer.cameraPosition[0],
        currentLayer.cameraPosition[1],
        currentLayer.cameraPosition[2]
      );
    }
  }, [selectedLayerId]);

  // Adjust materials and layer offsets on each frame
  useFrame((state) => {
    if (controlsRef.current) {
      controlsRef.current.object.position.lerp(targetCamPos.current, 0.05);
      controlsRef.current.update();
    }

    // Gentle idle floating
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    }

    // Dynamic layer transparency & highlights
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === 'Layer_Enamel') {
          const mat = mesh.material as THREE.MeshPhysicalMaterial;
          mat.transparent = true;
          mat.opacity = enamelOpacity;
          // Explode layer upward
          mesh.position.y = explodeFactor * 0.35;
          mesh.scale.setScalar(1.0 + explodeFactor * 0.08);
        } else if (mesh.name === 'Layer_Dentin') {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (selectedLayerId === 'dentin') {
            mat.emissive = new THREE.Color(0x554400);
            mat.emissiveIntensity = 0.5;
          } else {
            mat.emissiveIntensity = 0.0;
          }
        } else if (mesh.name.startsWith('Layer_Pulp') || mesh.name.startsWith('Layer_RootCanal')) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (selectedLayerId === 'pulp') {
            mat.emissive = new THREE.Color(0xff2222);
            mat.emissiveIntensity = 0.9;
          } else {
            mat.emissiveIntensity = 0.3;
          }
        } else if (mesh.name === 'Layer_Gingiva') {
          // Explode downward
          mesh.position.y = -explodeFactor * 0.45;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} scale={0.82}>
      <primitive object={scene} />

      {/* 3D Hotspot Pins */}
      {ANATOMY_LAYERS.map((layer) => {
        const isSelected = layer.id === selectedLayerId;
        return (
          <group
            key={layer.id}
            position={[
              layer.hotspotPosition[0],
              layer.hotspotPosition[1],
              layer.hotspotPosition[2],
            ]}
          >
            {/* 3D HTML Hotspot Pin Badge */}
            <Html center distanceFactor={8}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playChime();
                  onSelectLayer(layer.id);
                }}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  isSelected
                    ? 'text-[#063D32] scale-105 shadow-lg font-bold'
                    : 'bg-black/60 border-white/20 text-white/90 hover:border-white/50 hover:scale-105'
                }`}
                style={{
                  backgroundColor: isSelected ? colors.accent : undefined,
                  borderColor: isSelected ? colors.accent : undefined,
                }}
              >
                {/* Pulsing beacon dot */}
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSelected ? 'bg-[#063D32]' : ''
                    }`}
                    style={{ backgroundColor: !isSelected ? colors.accent : undefined }}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isSelected ? 'bg-[#063D32]' : ''
                    }`}
                    style={{ backgroundColor: !isSelected ? colors.accent : undefined }}
                  />
                </span>
                <span className="text-[10px] whitespace-nowrap tracking-wide">
                  {layer.name}
                </span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export const AnatomyCanvas: React.FC<AnatomyCanvasProps> = ({
  selectedLayerId,
  onSelectLayer,
  enamelOpacity,
  explodeFactor,
}) => {
  const { colors } = useTheme();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] select-none rounded-3xl overflow-hidden glass-panel border border-white/15">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div 
          className="w-[280px] h-[280px] rounded-full blur-[90px] transition-all duration-700"
          style={{ backgroundColor: `${colors.accent}15` }}
        />
      </div>

      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div 
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: `${colors.accent}44`, borderTopColor: colors.accent }}
            />
            <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.accent }}>
              Loading Anatomical Cross-Section...
            </p>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.2, 4.3], fov: 36 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.3} color="#ffffff" />
          <directionalLight position={[4, 6, 4]} intensity={2.4} color="#ffffff" />
          <directionalLight position={[-4, 2, -3]} intensity={2.0} color={colors.accent} />
          <pointLight position={[0, -1, 2]} intensity={1.5} color="#eaf8f3" />

          <AnatomyScene
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer}
            enamelOpacity={enamelOpacity}
            explodeFactor={explodeFactor}
            controlsRef={controlsRef}
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={2.8}
            maxDistance={5.6}
            dampingFactor={0.08}
          />
        </Canvas>
      </Suspense>

      {/* Corner interactive instructions */}
      <div className="absolute bottom-3 left-4 pointer-events-none text-[10px] text-white/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
        Click pins or drag to rotate layers in 3D
      </div>
    </div>
  );
};

useGLTF.preload('/models/tooth-anatomy.glb');
