import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FloatingParticlesProps {
  count?: number;
  radius?: number;
  height?: number;
  color?: string;
}

// Generate a soft radial circle texture for glowing round sparkles
function createSparkleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 180,
  radius = 2.0,
  height = 2.2,
  color = '#75F5C5',
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleTexture = useMemo(() => createSparkleTexture(), []);

  // Generate particle positions and random phases
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical distribution around the tooth
      const angle = Math.random() * Math.PI * 2;
      const r = radius * 0.45 + Math.random() * radius * 0.65;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * height;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      spd[i] = Math.random() * 0.6 + 0.25;
    }
    return [pos, spd];
  }, [count, radius, height]);

  // Animate particles swirl
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle orbital motion
      const currentX = pos[idx];
      const currentZ = pos[idx + 2];
      const speed = speeds[i] * 0.35;
      
      const cosA = Math.cos(delta * speed);
      const sinA = Math.sin(delta * speed);

      pos[idx] = currentX * cosA - currentZ * sinA;
      pos[idx + 2] = currentX * sinA + currentZ * cosA;

      // Gentle vertical bobbing
      pos[idx + 1] += Math.sin(t * speeds[i] + i) * 0.002;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        map={particleTexture}
        color={new THREE.Color(color)}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
