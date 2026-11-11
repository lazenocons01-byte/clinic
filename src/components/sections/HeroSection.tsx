import React from 'react';
import { ToothCanvas } from '../3d/ToothCanvas';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onNavigateSection,
}) => {
  const { colors, toothColor } = useTheme();

  const handleBadgeClick = (badgeName: string) => {
    sound.playClick();
    if (badgeName === 'Expert Care') {
      onNavigateSection('doctors');
    } else if (badgeName === 'Advanced Technology') {
      onNavigateSection('technology');
    } else if (badgeName === 'Healthy Smiles') {
      onNavigateSection('anatomy');
    } else if (badgeName === 'Confident You') {
      onNavigateSection('testimonials');
    }
  };

  return (
    <section 
      className="relative min-h-[92vh] pt-28 pb-12 flex flex-col justify-between overflow-hidden transition-colors duration-700"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradFrom}, ${colors.bgGradVia}, ${colors.bgGradTo})`,
      }}
    >
      {/* Cinematic Depth-of-Field Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft bokeh circles matching reference image */}
        <div 
          className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full blur-[120px] transition-all duration-700"
          style={{ backgroundColor: `${colors.secondary}40` }}
        />
        <div 
          className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full blur-[140px] transition-all duration-700"
          style={{ backgroundColor: `${toothColor}18` }}
        />
        <div 
          className="absolute bottom-10 left-1/3 w-[600px] h-[350px] rounded-full blur-[110px] transition-all duration-700"
          style={{ backgroundColor: `${colors.secondary}40` }}
        />
        
        {/* Subtle clinical light flare grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${toothColor} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col justify-between h-full">
        {/* Top Tagline Badge */}
        <div className="text-center pt-2 pb-2">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-medium text-white/90 shadow-sm"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40` }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: toothColor }} />
            <span>Redefining Contemporary Dental Science with 3D Precision</span>
          </div>
        </div>

        {/* Cinematic Main Headline with Generous Spacing */}
        <div className="text-center mt-2 mb-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            <span className="block drop-shadow-sm mb-1">Healthier Smiles</span>
            <span 
              className="block bg-clip-text text-transparent transition-all duration-500"
              style={{
                backgroundImage: `linear-gradient(to right, ${toothColor}, ${colors.mint}, ${colors.accent})`,
                filter: `drop-shadow(0 0 25px ${toothColor}66)`
              }}
            >
              Brighter Lives
            </span>
          </h1>
        </div>

        {/* Central 3D Floating Tooth with Dedicated Stage */}
        <div className="relative my-2 sm:my-4 flex-1 flex items-center justify-center">
          <ToothCanvas onBadgeClick={handleBadgeClick} />
        </div>

        {/* Hero Bottom Layout: Supporting Text + CTA + Social Proof Rating */}
        <div 
          className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t mt-4"
          style={{ borderColor: `${colors.accent}20` }}
        >
          {/* Left: Supporting text & CTA button matching Reference Image 1 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 text-center sm:text-left">
            <div>
              <p className="text-base sm:text-lg font-medium text-white/90 max-w-sm leading-snug">
                Comprehensive dental care for a healthier, happier you.
              </p>
              <p className="text-xs text-white/70 mt-1">
                Advanced dental care designed around your comfort, confidence, and smile.
              </p>
            </div>

            {/* Glowing Mint CTA Button (Matching Reference Image 1) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenBooking();
              }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full text-[#063D32] font-bold text-sm hover:scale-105 transition-all duration-300 shadow-xl group shrink-0"
              style={{
                backgroundColor: toothColor,
                boxShadow: `0 12px 30px ${toothColor}44`,
              }}
            >
              <span>Book Your Appointment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: Verified Patient Rating & Clinic Credibility */}
          <div 
            className="flex items-center gap-4 backdrop-blur-md px-5 py-3 rounded-2xl border"
            style={{ backgroundColor: `${colors.secondary}55`, borderColor: `${colors.accent}30` }}
          >
            <div className="flex -space-x-2.5 overflow-hidden">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#063D32] object-cover"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                alt="Patient"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#063D32] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                alt="Patient"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-[#063D32] object-cover"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
                alt="Patient"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: toothColor }} />
                ))}
                <span className="text-xs font-bold text-white ml-1">4.98 / 5.0</span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                Over 15,000+ Verified Patient Smile Transformations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
