import React, { useState } from 'react';
import { TECHNOLOGIES } from '../../data/clinicData';
import { 
  ScanLine, 
  BrainCircuit, 
  Radio, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Play, 
  Zap 
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

export const TechnologySection: React.FC = () => {
  const { colors, toothColor } = useTheme();
  const [activeTechId, setActiveTechId] = useState<string>(TECHNOLOGIES[0].id);
  const [aiScanRunning, setAiScanRunning] = useState<boolean>(false);
  const [aiScanComplete, setAiScanComplete] = useState<boolean>(false);

  const activeTech = TECHNOLOGIES.find((t) => t.id === activeTechId) || TECHNOLOGIES[0];

  const getTechIcon = (name: string) => {
    switch (name) {
      case 'ScanLine':
        return <ScanLine className="w-5 h-5" style={{ color: colors.accent }} />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5" style={{ color: colors.accent }} />;
      case 'Radio':
        return <Radio className="w-5 h-5" style={{ color: colors.accent }} />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" style={{ color: colors.accent }} />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" style={{ color: colors.accent }} />;
      default:
        return <Zap className="w-5 h-5" style={{ color: colors.accent }} />;
    }
  };

  const runAiDiagnosticDemo = () => {
    sound.playScanTone();
    setAiScanRunning(true);
    setAiScanComplete(false);
    setTimeout(() => {
      setAiScanRunning(false);
      setAiScanComplete(true);
      sound.playSuccess();
    }, 1800);
  };

  return (
    <section 
      id="technology" 
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: colors.primary }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 right-10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}40` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Futuristic Clinical Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Advanced Dental <span style={{ color: colors.accent }}>Technology</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            Pioneering digital intraoral scans, artificial intelligence diagnostic vision, and robotic surgical navigation for millimeter-perfect outcomes.
          </p>
        </div>

        {/* Technology Main Interactive Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Tech Navigation Tabs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {TECHNOLOGIES.map((tech) => {
              const isSelected = tech.id === activeTechId;
              return (
                <div
                  key={tech.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTechId(tech.id);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-4 ${
                    isSelected
                      ? 'shadow-lg translate-x-2'
                      : 'hover:bg-white/10'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${colors.secondary}cc` : 'rgba(255,255,255,0.04)',
                    borderColor: isSelected ? colors.accent : 'rgba(255,255,255,0.12)',
                    boxShadow: isSelected ? `0 8px 25px ${colors.accent}30` : undefined,
                  }}
                >
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: isSelected ? colors.accent : `${colors.secondary}77`,
                      borderColor: isSelected ? colors.accent : `${colors.accent}40`,
                      color: isSelected ? '#063D32' : colors.accent,
                    }}
                  >
                    {getTechIcon(tech.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{tech.title}</h4>
                      <span 
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
                      >
                        {tech.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 truncate mt-0.5">{tech.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Technology Preview Screen (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono flex items-center gap-1.5" style={{ color: colors.accent }}>
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: colors.accent }} />
                  SYSTEM ONLINE // ACCURACY: {activeTech.accuracy}
                </span>
                <span className="text-xs text-white/50">{activeTech.tag}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {activeTech.title}
              </h3>
              <p className="text-xs font-medium mb-4 italic" style={{ color: colors.mint }}>
                {activeTech.subtitle}
              </p>
              <p className="text-sm text-white/85 leading-relaxed mb-6">
                {activeTech.description}
              </p>

              {/* Clinical Impact Quote Box */}
              <div 
                className="rounded-2xl p-4 border mb-6"
                style={{ backgroundColor: `${colors.secondary}55`, borderColor: `${colors.accent}30` }}
              >
                <span className="text-[10px] uppercase font-bold block mb-1" style={{ color: colors.accent }}>
                  Clinical Patient Advantage
                </span>
                <p className="text-xs text-white/90 font-medium">
                  "{activeTech.clinicalImpact}"
                </p>
              </div>

              {/* Hardware / Software Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {activeTech.specs.map((spec, i) => (
                  <div key={i} className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <span className="text-[10px] text-white/60 block">Feature {i + 1}</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block">{spec}</span>
                  </div>
                ))}
              </div>

              {/* Interactive AI Simulation Widget (If AI Diagnostics is active) */}
              {activeTech.id === 'ai-diagnostics' && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4" style={{ color: colors.accent }} />
                      Live AI Caries Diagnostic Simulation
                    </span>
                    <button
                      onClick={runAiDiagnosticDemo}
                      disabled={aiScanRunning}
                      className="px-3.5 py-1.5 rounded-lg text-[#063D32] text-xs font-bold flex items-center gap-1.5 hover:bg-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {aiScanRunning ? (
                        <>
                          <div className="w-3 h-3 rounded-full border-2 border-[#063D32] border-t-transparent animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Simulate AI Scan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Simulated Radiograph Canvas */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-black/60 border border-white/15 flex items-center justify-center">
                    <img
                      src="/images/tooth-glow-reference.jpg"
                      alt="Dental Scan Preview"
                      className="w-full h-full object-cover opacity-60 filter contrast-125"
                    />

                    {/* Scanning Laser Line */}
                    {aiScanRunning && (
                      <div 
                        className="absolute inset-x-0 h-1 animate-bounce"
                        style={{ backgroundColor: toothColor, boxShadow: `0 0 15px ${toothColor}` }}
                      />
                    )}

                    {/* Detected AI Bounding Boxes */}
                    {aiScanComplete && !aiScanRunning && (
                      <div className="absolute inset-0 p-4 pointer-events-none flex items-center justify-around">
                        <div className="border-2 border-red-400 bg-red-500/20 px-2 py-1 rounded text-[10px] text-red-200 font-mono shadow-lg">
                          Demineralization Detected (99.2%)
                        </div>
                        <div 
                          className="border-2 px-2 py-1 rounded text-[10px] font-mono shadow-lg"
                          style={{
                            borderColor: colors.accent,
                            backgroundColor: `${colors.accent}25`,
                            color: colors.accent,
                          }}
                        >
                          Enamel Integrity Intact (99.8%)
                        </div>
                      </div>
                    )}

                    {!aiScanRunning && !aiScanComplete && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white/70">
                        Click "Simulate AI Scan" to test machine-learning detection
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
