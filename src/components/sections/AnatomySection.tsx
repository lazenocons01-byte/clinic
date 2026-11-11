import React, { useState } from 'react';
import { AnatomyCanvas } from '../3d/AnatomyCanvas';
import { ANATOMY_LAYERS } from '../../data/clinicData';
import { 
  ShieldCheck, 
  Layers, 
  Activity, 
  Anchor, 
  HeartHandshake, 
  Sparkles, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface AnatomySectionProps {
  onOpenBooking: () => void;
}

export const AnatomySection: React.FC<AnatomySectionProps> = ({ onOpenBooking }) => {
  const { colors, toothColor } = useTheme();
  const [selectedLayerId, setSelectedLayerId] = useState<string>('enamel');
  const [enamelOpacity, setEnamelOpacity] = useState<number>(0.7);
  const [explodeFactor, setExplodeFactor] = useState<number>(0.0);

  const currentLayer = ANATOMY_LAYERS.find((l) => l.id === selectedLayerId) || ANATOMY_LAYERS[0];

  const getLayerIcon = (id: string) => {
    switch (id) {
      case 'enamel':
        return <ShieldCheck className="w-4 h-4 text-[#75F5C5]" />;
      case 'dentin':
        return <Layers className="w-4 h-4 text-[#F4D06F]" />;
      case 'pulp':
        return <Activity className="w-4 h-4 text-[#FF6B6B]" />;
      case 'root':
        return <Anchor className="w-4 h-4 text-[#70C1B3]" />;
      case 'gum':
        return <HeartHandshake className="w-4 h-4 text-[#FF9EAA]" />;
      default:
        return <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />;
    }
  };

  return (
    <section 
      id="anatomy" 
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: colors.bgDark }}
    >
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}35` }}
      />
      <div 
        className="absolute bottom-0 right-10 w-[400px] h-[400px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${toothColor}15` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive 3D Micro-Anatomy</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Discover What's <span style={{ color: colors.accent }}>Inside</span> Your Tooth
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            Rotate, peel back anatomical layers, and click 3D hotspots to inspect the micro-tubular architecture, nerve plexuses, and biological defense systems of the human molar.
          </p>
        </div>

        {/* Layer Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {ANATOMY_LAYERS.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  sound.playChime();
                  setSelectedLayerId(layer.id);
                }}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? 'text-[#063D32] shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
                }`}
                style={{
                  backgroundColor: isSelected ? colors.accent : undefined,
                  boxShadow: isSelected ? `0 8px 25px ${colors.accent}44` : undefined,
                }}
              >
                {getLayerIcon(layer.id)}
                <span>{layer.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063D32] ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3D Model + Medical Detail Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Interactive Anatomy Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <AnatomyCanvas
              selectedLayerId={selectedLayerId}
              onSelectLayer={(id) => setSelectedLayerId(id)}
              enamelOpacity={enamelOpacity}
              explodeFactor={explodeFactor}
            />

            {/* Interactive Anatomical Sliders Controls */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/15">
              {/* Enamel Transparency Slider */}
              <div className="w-full sm:w-1/2 flex items-center gap-3">
                <Sliders className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Enamel Transparency</span>
                    <span className="font-mono" style={{ color: colors.accent }}>{Math.round((1 - enamelOpacity) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={enamelOpacity}
                    onChange={(e) => setEnamelOpacity(parseFloat(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: colors.accent }}
                  />
                </div>
              </div>

              {/* Explode / Layer Disassembly Slider */}
              <div className="w-full sm:w-1/2 flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4 pt-2 sm:pt-0">
                <Layers className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Explode Anatomy</span>
                    <span className="font-mono" style={{ color: colors.accent }}>{Math.round(explodeFactor * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={explodeFactor}
                    onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: colors.accent }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layer Medical Deep-Dive Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 relative overflow-hidden shadow-2xl">
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: currentLayer.color }}
              />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.accent }}>
                      Anatomical Layer
                    </span>
                    <span className="text-xs text-white/50 italic">({currentLayer.scientificName})</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {currentLayer.name}
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5">
                    {currentLayer.subtitle}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${currentLayer.color}20`,
                    borderColor: currentLayer.color,
                  }}
                >
                  {getLayerIcon(currentLayer.id)}
                </div>
              </div>

              {/* Physical Properties Badges */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] text-white/60 uppercase">Hardness Metric</span>
                  <span className="block text-xs font-semibold text-white mt-0.5">{currentLayer.hardness}</span>
                </div>
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] text-white/60 uppercase">Avg Thickness</span>
                  <span className="block text-xs font-semibold text-white mt-0.5">{currentLayer.thickness}</span>
                </div>
              </div>

              {/* Overview & Primary Function */}
              <div className="space-y-4 text-xs sm:text-sm text-[#EAF8F3]/85 mb-6">
                <div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    Biomechanical Function
                  </h4>
                  <p className="leading-relaxed text-white/80">{currentLayer.primaryFunction}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    Micro-Composition
                  </h4>
                  <p className="leading-relaxed text-white/80">{currentLayer.composition}</p>
                </div>
              </div>

              {/* Clinical Risks & Care Advice */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[11px] font-semibold text-red-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    Common Pathologies
                  </span>
                  <ul className="grid grid-cols-1 gap-1 text-xs text-white/70">
                    {currentLayer.clinicalRisks.map((risk, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 mb-1.5" style={{ color: colors.accent }}>
                    <CheckCircle2 className="w-3 h-3" style={{ color: colors.accent }} />
                    Preservation Protocol
                  </span>
                  <ul className="grid grid-cols-1 gap-1 text-xs text-white/70">
                    {currentLayer.careGuidelines.map((guideline, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent }} />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenBooking();
                }}
                className="w-full mt-6 py-3 rounded-xl text-[#063D32] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg"
                style={{
                  backgroundColor: colors.accent,
                  boxShadow: `0 8px 25px ${colors.accent}44`,
                }}
              >
                <span>Schedule 3D Tooth Health Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
