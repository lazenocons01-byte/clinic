import React from 'react';
import { CLINIC_INFO } from '../../data/clinicData';
import { ShieldCheck, Cpu, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const WhyChooseUsSection: React.FC = () => {
  const { colors } = useTheme();

  const cards = [
    {
      title: 'Expert Dental Care',
      subtitle: 'Ivy League Board Specialists',
      description: 'Our clinicians hold fellowships from Harvard, UPenn, and ICOI with decades of surgical and aesthetic experience.',
      icon: ShieldCheck,
      points: ['Multi-specialist clinical board', 'Zero-rushed consultations', 'Customized biological treatment plans']
    },
    {
      title: 'Advanced Technology',
      subtitle: '3D Optical & Robotic Navigation',
      description: 'Eliminating guesswork with 20-micron digital scanners, cold-laser pain-free treatments, and AI radiography verification.',
      icon: Cpu,
      points: ['Zero radiation optical 3D scans', 'Needleless hydrophotonic lasers', 'Same-day German CAD/CAM crowns']
    },
    {
      title: 'Comfortable Treatment',
      subtitle: 'Anxiety-Free Clinical Sanctuary',
      description: 'Designed as a serene boutique spa with noise-cancelling headphones, ceiling entertainment screens, and warm sedation options.',
      icon: Heart,
      points: ['Gentle computer-controlled numbing', 'Heated ergonomic memory foam suites', 'Zero judgment compassionate philosophy']
    },
    {
      title: 'Confident Smiles',
      subtitle: 'Lifelong Biomimetic Aesthetics',
      description: 'We craft authentic, luminous smiles that honor your natural facial dynamics, backed by lifetime warranties on restorative implants.',
      icon: Sparkles,
      points: ['Artisanal hand-layered ceramics', 'Predictive 3D trial smiles before work', 'Long-term preventative maintenance']
    }
  ];

  return (
    <section 
      id="why-us" 
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: colors.bgDark }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[160px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}35` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Dentivo Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Why Patients <span style={{ color: colors.accent }}>Choose Dentivo</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            Where biological science, computational engineering, and five-star hospitality converge to elevate your dental journey.
          </p>
        </div>

        {/* 4 Premium Floating Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden border border-white/15"
              >
                {/* Glow pill behind icon */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md border"
                  style={{
                    backgroundColor: colors.secondary,
                    borderColor: `${colors.accent}40`,
                    color: colors.accent,
                  }}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="mb-6 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: colors.accent }}>
                    {card.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <ul className="space-y-2 border-t border-white/10 pt-4 text-xs text-white/80">
                    {card.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Clinical Statistics Counters */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/15">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {CLINIC_INFO.stats.map((stat, i) => (
              <div key={i} className="pt-4 sm:pt-0">
                <span className="block text-3xl sm:text-5xl font-extrabold font-mono text-white">
                  {typeof stat.value === 'number' && stat.value > 1000
                    ? stat.value.toLocaleString()
                    : stat.value}
                  <span style={{ color: colors.accent }}>{stat.suffix}</span>
                </span>
                <span className="block text-xs sm:text-sm font-medium text-white/70 mt-2 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
