import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ToothModel, type ToothMaterialMode } from './ToothModel';
import { FloatingParticles } from './FloatingParticles';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  ShieldCheck, 
  Cpu, 
  Heart, 
  Smile, 
  Move3d, 
  Check, 
  RotateCcw,
  Palette
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface ToothCanvasProps {
  onBadgeClick?: (badgeName: string) => void;
}

const COLOR_SWATCHES = [
  { name: 'Mint Glow', color: '#75F5C5' },
  { name: 'Diamond White', color: '#FFFFFF' },
  { name: 'Ice Cyan', color: '#38E1FF' },
  { name: 'Champagne Gold', color: '#F4D06F' },
  { name: 'Rose Quartz', color: '#FF70A6' },
  { name: 'Neon Emerald', color: '#00F0A8' },
];

export const ToothCanvas: React.FC<ToothCanvasProps> = ({ onBadgeClick }) => {
  const { toothColor, setToothColor, colors } = useTheme();
  const [materialMode, setMaterialMode] = useState<ToothMaterialMode>('crystal');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Camera reset
  const handleReset = () => {
    sound.playClick();
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    sound.playClick();
    if (controlsRef.current) {
      const zoomFactor = direction === 'in' ? 0.85 : 1.18;
      controlsRef.current.object.position.multiplyScalar(zoomFactor);
    }
  };

  const changeMaterial = (mode: ToothMaterialMode) => {
    sound.playChime();
    setMaterialMode(mode);
  };

  const selectColor = (c: string) => {
    sound.playChime();
    setToothColor(c);
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] flex items-center justify-center select-none my-2">
      {/* Background Soft Radial Bokeh Glow with Dynamic Theme Color */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div 
          className="w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full blur-[90px] animate-pulse-glow transition-all duration-700"
          style={{ backgroundColor: `${toothColor}20` }}
        />
        <div 
          className="w-[180px] sm:w-[260px] h-[180px] sm:h-[260px] rounded-full blur-[70px] transition-all duration-700"
          style={{ backgroundColor: `${colors.secondary}50` }}
        />
      </div>

      {/* 3D WebGL Canvas */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        onMouseDown={() => setIsInteracting(true)}
        onMouseUp={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div 
                className="w-12 h-12 rounded-full border-2 animate-spin"
                style={{ borderColor: `${toothColor}44`, borderTopColor: toothColor }}
              />
              <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: toothColor }}>
                Loading 3D Molar Engine...
              </p>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 4.4], fov: 36 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            {/* Ambient & Key Lighting */}
            <ambientLight intensity={1.1} color="#ffffff" />
            
            {/* Main key light casting crisp reflections */}
            <directionalLight
              position={[5, 7, 5]}
              intensity={2.4}
              color="#ffffff"
              castShadow
            />
            {/* Dynamic rim light matching tooth color */}
            <directionalLight
              position={[-5, 3, -4]}
              intensity={3.2}
              color={toothColor}
            />
            {/* Soft fill lights */}
            <pointLight position={[0, 1.2, 3]} intensity={1.4} color="#ffffff" />
            <pointLight position={[0, -1.8, 1.5]} intensity={1.2} color={toothColor} />

            {/* Float wrapper with gentle breathing motion */}
            <Float
              speed={2.0}
              rotationIntensity={0.15}
              floatIntensity={0.2}
              floatingRange={[-0.05, 0.05]}
            >
              <ToothModel
                materialMode={materialMode}
                autoRotate={autoRotate && !isInteracting}
                scale={0.92}
                customColor={toothColor}
              />
            </Float>

            {/* Glowing fairy sparkles */}
            <FloatingParticles count={160} radius={1.9} height={2.2} color={toothColor} />

            {/* Ground shadow */}
            <ContactShadows
              position={[0, -1.6, 0]}
              opacity={0.35}
              scale={5.5}
              blur={2.5}
              far={3.0}
              color="#021D17"
            />

            {/* OrbitControls with restricted camera bounds */}
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={true}
              minDistance={3.0}
              maxDistance={5.8}
              minPolarAngle={Math.PI * 0.2}
              maxPolarAngle={Math.PI * 0.8}
              dampingFactor={0.06}
              rotateSpeed={0.8}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Floating Glass Badges connected by glowing ring (Matching Reference Image 1) */}
      <div className="absolute inset-0 pointer-events-none z-20 hidden md:block">
        {/* SVG Orbital Glowing Ring & Connectors */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 540" fill="none">
          <ellipse
            cx="500"
            cy="270"
            rx="340"
            ry="95"
            stroke="url(#orbitGradient)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="opacity-50"
          />
          <line x1="220" y1="270" x2="370" y2="270" stroke={toothColor} strokeWidth="1.2" strokeOpacity="0.35" />
          <line x1="780" y1="270" x2="630" y2="270" stroke={toothColor} strokeWidth="1.2" strokeOpacity="0.35" />
          
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={toothColor} stopOpacity="0.05" />
              <stop offset="50%" stopColor={toothColor} stopOpacity="0.75" />
              <stop offset="100%" stopColor={toothColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Badge 1: Expert Care (Far Left) */}
        <div 
          onClick={() => onBadgeClick?.('Expert Care')}
          className="pointer-events-auto absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 group cursor-pointer"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0B5B49]/70 backdrop-blur-md border border-white/15 shadow-lg shadow-black/20 hover:border-white/40 hover:bg-[#0B5B49]/90 hover:scale-105 transition-all duration-300">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${toothColor}20`, borderColor: `${toothColor}50`, color: toothColor }}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-white tracking-wide">Expert Care</span>
              <span className="block text-[10px] text-white/70">Board Specialists</span>
            </div>
          </div>
        </div>

        {/* Badge 2: Advanced Technology (Mid Left) */}
        <div 
          onClick={() => onBadgeClick?.('Advanced Technology')}
          className="pointer-events-auto absolute left-24 lg:left-40 bottom-16 group cursor-pointer"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0B5B49]/70 backdrop-blur-md border border-white/15 shadow-lg shadow-black/20 hover:border-white/40 hover:bg-[#0B5B49]/90 hover:scale-105 transition-all duration-300">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${toothColor}20`, borderColor: `${toothColor}50`, color: toothColor }}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-white tracking-wide">Advanced Tech</span>
              <span className="block text-[10px] text-white/70">3D AI Precision</span>
            </div>
          </div>
        </div>

        {/* Badge 3: Healthy Smiles (Mid Right) */}
        <div 
          onClick={() => onBadgeClick?.('Healthy Smiles')}
          className="pointer-events-auto absolute right-24 lg:right-40 bottom-16 group cursor-pointer"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0B5B49]/70 backdrop-blur-md border border-white/15 shadow-lg shadow-black/20 hover:border-white/40 hover:bg-[#0B5B49]/90 hover:scale-105 transition-all duration-300">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${toothColor}20`, borderColor: `${toothColor}50`, color: toothColor }}
            >
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-white tracking-wide">Healthy Smiles</span>
              <span className="block text-[10px] text-white/70">Long-term Health</span>
            </div>
          </div>
        </div>

        {/* Badge 4: Confident You (Far Right) */}
        <div 
          onClick={() => onBadgeClick?.('Confident You')}
          className="pointer-events-auto absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 group cursor-pointer"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0B5B49]/70 backdrop-blur-md border border-white/15 shadow-lg shadow-black/20 hover:border-white/40 hover:bg-[#0B5B49]/90 hover:scale-105 transition-all duration-300">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${toothColor}20`, borderColor: `${toothColor}50`, color: toothColor }}
            >
              <Smile className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-white tracking-wide">Confident You</span>
              <span className="block text-[10px] text-white/70">Lifelong Radiance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating 360° Drag Hint Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063D32]/85 backdrop-blur-md border border-white/20 shadow-xl text-xs text-white">
          <Move3d className="w-3.5 h-3.5 animate-spin" style={{ color: toothColor, animationDuration: '6s' }} />
          <span>Drag to rotate in <strong style={{ color: toothColor }}>360°</strong></span>
        </div>
      </div>

      {/* Compact Interactive Floating HUD Dock (Top Right) */}
      <div className="absolute top-2 right-4 z-20 flex items-center gap-1.5">
        {/* Color Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              sound.playClick();
              setShowColorPicker(!showColorPicker);
            }}
            title="Aura & Tooth Color"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#063D32]/80 hover:bg-[#063D32] border border-white/20 text-white shadow-md backdrop-blur-md transition-all"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: toothColor }} />
            <span 
              className="w-2.5 h-2.5 rounded-full border border-white/60"
              style={{ backgroundColor: toothColor }}
            />
          </button>

          {/* Color Popover */}
          {showColorPicker && (
            <div className="absolute top-full right-0 mt-2 p-3 bg-[#063D32]/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 flex flex-col gap-2 min-w-[160px] animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Tooth Aura Color</span>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_SWATCHES.map((sw) => (
                  <button
                    key={sw.color}
                    onClick={() => selectColor(sw.color)}
                    title={sw.name}
                    className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: sw.color }}
                  >
                    {toothColor.toLowerCase() === sw.color.toLowerCase() && (
                      <Check className="w-3.5 h-3.5 text-[#063D32]" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="color"
                  value={toothColor}
                  onChange={(e) => setToothColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                  title="Choose custom color"
                />
                <span className="text-[10px] text-white/80 font-mono">{toothColor.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Material Mode Pills */}
        <div className="flex items-center bg-[#063D32]/80 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
          <button
            onClick={() => changeMaterial('crystal')}
            title="Translucent Crystal"
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              materialMode === 'crystal'
                ? 'bg-white text-[#063D32] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Crystal
          </button>

          <button
            onClick={() => changeMaterial('enamel')}
            title="Natural Enamel"
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              materialMode === 'enamel'
                ? 'bg-white text-[#063D32] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Natural
          </button>

          <button
            onClick={() => changeMaterial('xray')}
            title="Holographic X-Ray"
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              materialMode === 'xray'
                ? 'bg-white text-[#063D32] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            X-Ray
          </button>
        </div>

        {/* Camera Quick Tools */}
        <div className="flex items-center bg-[#063D32]/80 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
          <button
            onClick={() => {
              sound.playClick();
              setAutoRotate(!autoRotate);
            }}
            title={autoRotate ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
            className="p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ color: autoRotate ? toothColor : 'inherit', animationDuration: '8s' }} />
          </button>

          <button
            onClick={handleReset}
            title="Reset View"
            className="p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
