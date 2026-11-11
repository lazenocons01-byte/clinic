import React, { useState } from 'react';
import { SERVICES } from '../../data/clinicData';
import type { Service } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  X, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Layers, 
  Smile, 
  Gem, 
  Crown, 
  Baby
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const { colors, toothColor } = useTheme();
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Preventative', 'Cosmetic', 'Restorative', 'Surgical', 'Pediatric'];

  const filteredServices = filterCategory === 'All'
    ? SERVICES
    : SERVICES.filter((s) => s.category === filterCategory);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'general-dentistry':
        return <ShieldCheck className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'teeth-whitening':
        return <Zap className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'dental-implants':
        return <Layers className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'root-canal':
        return <Activity className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'orthodontics':
        return <Smile className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'cosmetic-dentistry':
        return <Gem className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'dental-crowns':
        return <Crown className="w-6 h-6" style={{ color: colors.accent }} />;
      case 'pediatric-dentistry':
        return <Baby className="w-6 h-6" style={{ color: colors.accent }} />;
      default:
        return <Sparkles className="w-6 h-6" style={{ color: colors.accent }} />;
    }
  };

  return (
    <section 
      id="services" 
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: colors.primary }}
    >
      {/* Background Glow */}
      <div 
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}40` }}
      />
      <div 
        className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${toothColor}12` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>World-Class Clinical Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Comprehensive <span style={{ color: colors.accent }}>Dental Services</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            Engineered with microscopic precision, painless digital protocols, and biomimetic aesthetics for lifelong oral vitality.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setFilterCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'text-[#063D32] shadow-md font-bold scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
              }`}
              style={{
                backgroundColor: filterCategory === cat ? colors.accent : undefined,
                boxShadow: filterCategory === cat ? `0 4px 15px ${colors.accent}40` : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid (8 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 relative border border-white/15 hover:border-white/40"
            >
              {/* Highlight Badge */}
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    borderColor: `${colors.accent}40`,
                    color: colors.accent,
                  }}
                >
                  {service.category}
                </span>
                <span className="text-[11px] font-mono font-semibold" style={{ color: colors.accent }}>
                  {service.startingPrice}
                </span>
              </div>

              {/* 3D-styled Icon */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-md border"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary}, ${colors.bgDark})`,
                  borderColor: `${colors.accent}40`,
                }}
              >
                {getServiceIcon(service.id)}
              </div>

              {/* Title & Description */}
              <div className="mb-6 flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs mt-1 line-clamp-1 italic" style={{ color: colors.mint }}>
                  {service.tagline}
                </p>
                <p className="text-xs text-white/70 mt-3 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Card Footer: Highlight tag + Learn More button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                  <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  <span>{service.duration}</span>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveModalService(service);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:text-white transition-colors group/btn"
                  style={{ color: colors.accent }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal Drawer */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            style={{ backgroundColor: colors.primary, borderColor: `${colors.accent}40` }}
          >
            {/* Close button */}
            <button
              onClick={() => {
                sound.playClick();
                setActiveModalService(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-2xl border flex items-center justify-center"
                style={{ backgroundColor: colors.secondary, borderColor: `${colors.accent}50` }}
              >
                {getServiceIcon(activeModalService.id)}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.accent }}>
                  {activeModalService.category} Dentistry
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {activeModalService.name}
                </h3>
              </div>
            </div>

            <p className="text-sm italic mb-4" style={{ color: colors.mint }}>
              "{activeModalService.tagline}"
            </p>

            <p className="text-sm text-white/85 leading-relaxed mb-6">
              {activeModalService.fullOverview}
            </p>

            {/* Key Clinical Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-xs">
              <div>
                <span className="text-[10px] text-white/60 uppercase block">Duration</span>
                <span className="font-semibold text-white mt-0.5 block">{activeModalService.duration}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">Recovery</span>
                <span className="font-semibold text-white mt-0.5 block">{activeModalService.recoveryTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">Frequency</span>
                <span className="font-semibold text-white mt-0.5 block">{activeModalService.recommendedFrequency}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 uppercase block">From</span>
                <span className="font-semibold mt-0.5 block" style={{ color: colors.accent }}>{activeModalService.startingPrice}</span>
              </div>
            </div>

            {/* Clinical Benefits */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Key Patient Advantages
              </h4>
              <ul className="space-y-2 text-xs text-white/85">
                {activeModalService.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.accent }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Procedure Walkthrough
              </h4>
              <div className="space-y-3">
                {activeModalService.steps.map((st) => (
                  <div key={st.stepNumber} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span 
                      className="w-6 h-6 rounded-full text-[#063D32] text-xs font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {st.stepNumber}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-white">{st.title}</h5>
                      <p className="text-[11px] text-white/70 mt-0.5">{st.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/15">
              <button
                onClick={() => {
                  sound.playClick();
                  const serviceId = activeModalService.id;
                  setActiveModalService(null);
                  onSelectServiceForBooking(serviceId);
                }}
                className="flex-1 py-3.5 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <span>Book This Service Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveModalService(null)}
                className="py-3 px-6 rounded-full bg-transparent hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
