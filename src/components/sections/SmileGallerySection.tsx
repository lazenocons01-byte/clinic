import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  specialist: string;
  duration: string;
  beforeImg: string;
  afterImg: string;
  summary: string;
  shadeImprovement: string;
  treatments: string[];
}

const SMILE_CASES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Full Porcelain Veneers & Gum Contouring',
    category: 'Cosmetic Dentistry',
    specialist: 'Dr. Maya Lin, DDS, AAACD',
    duration: '2 Visits (10 Days)',
    beforeImg: '/images/gallery/case1-before.jpg',
    afterImg: '/images/gallery/case1-after.jpg',
    summary: 'Corrected severe diastema gaps, enamel fluorosis staining, and irregular incisal edges with 10 hand-layered feldspathic porcelain veneers.',
    shadeImprovement: 'A3 → BL1 (+10 Shades Whiter)',
    treatments: ['10 Biomimetic Porcelain Veneers', 'Laser Gingival Contouring', 'Enamel Micro-Preparation'],
  },
  {
    id: 'case-2',
    title: 'Laser Teeth Whitening & Enamel Remineralization',
    category: 'Aesthetic Whitening',
    specialist: 'Dr. Sarah Jenkins, DDS, FACP',
    duration: 'Single 45-Minute Session',
    beforeImg: '/images/gallery/case2-before.jpg',
    afterImg: '/images/gallery/case2-after.jpg',
    summary: 'Eliminated stubborn decades-old coffee and tobacco staining using LumiBrite cold-laser phototherapy with zero nerve sensitivity.',
    shadeImprovement: 'A3.5 → B1 (+8 Shades Whiter)',
    treatments: ['Cold-Light Laser Phototherapy', 'Fluoride Remineralization', 'Custom Take-Home Trays'],
  },
  {
    id: 'case-3',
    title: 'Computer-Guided Dental Implant & Monolithic Crown',
    category: 'Implantology & Surgery',
    specialist: 'Dr. Alexander Vance, DMD, ICOI',
    duration: 'Single-Day Flapless Procedure',
    beforeImg: '/images/gallery/case3-before.jpg',
    afterImg: '/images/gallery/case3-after.jpg',
    summary: 'Restored fractured lower right first molar (#30) with robotic 3D-guided titanium implant and high-translucency monolithic zirconia crown.',
    shadeImprovement: 'Natural Enamel Match',
    treatments: ['3D CBCT Surgical Guide', 'Flapless Titanium Implant', 'CAD/CAM Zirconia Crown'],
  },
];

export const SmileGallerySection: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { colors, toothColor } = useTheme();
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100

  const activeCase = SMILE_CASES[activeCaseIdx];

  const handlePrev = () => {
    sound.playClick();
    setActiveCaseIdx((prev) => (prev === 0 ? SMILE_CASES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sound.playClick();
    setActiveCaseIdx((prev) => (prev === SMILE_CASES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="relative py-24 bg-[#052922] overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}40` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: toothColor }} />
            <span>Documented Clinical Results</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Smile Transformations <span style={{ color: colors.accent }}>Before & After</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            Drag the interactive slider to inspect microscopic enamel restorations, custom porcelain veneers, and same-day dental implants.
          </p>
        </div>

        {/* Case Studies Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {SMILE_CASES.map((cs, idx) => (
            <button
              key={cs.id}
              onClick={() => {
                sound.playClick();
                setActiveCaseIdx(idx);
                setSliderPos(50);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                idx === activeCaseIdx
                  ? 'bg-white text-[#063D32] shadow-lg font-bold scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/10'
              }`}
            >
              {cs.title.split(' & ')[0]}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Split Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Interactive Split Slider Viewer (7 cols) */}
          <div className="lg:col-span-7 select-none">
            <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              {/* After Image (Background) */}
              <img
                src={activeCase.afterImg}
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                After Dentivo Treatment
              </span>

              {/* Before Image (Clipped Foreground) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={activeCase.beforeImg}
                  alt="Before Treatment"
                  className="absolute inset-0 w-full h-full object-cover filter contrast-90"
                />
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white/90 border border-white/20">
                  Before Initial State
                </span>
              </div>

              {/* Vertical Divider Line with Grab Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div 
                  className="w-0.5 h-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  style={{ backgroundColor: colors.accent }}
                />
                <div 
                  className="absolute w-10 h-10 rounded-full bg-white text-[#063D32] shadow-xl flex items-center justify-center font-bold text-xs border-2"
                  style={{ borderColor: colors.accent }}
                >
                  ⇄
                </div>
              </div>

              {/* Invisible Range Input for Smooth Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Drag before and after divider"
              />

              {/* Drag Hint at bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-3.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-white/90 border border-white/20">
                Drag slider across image
              </div>
            </div>
          </div>

          {/* Case Clinical Notes & Details (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/15 relative">
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
                >
                  {activeCase.category}
                </span>
                <span className="text-xs text-white/60">{activeCase.duration}</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {activeCase.title}
              </h3>

              <p className="text-xs text-white/70 italic mb-4">
                Clinical lead: {activeCase.specialist}
              </p>

              <p className="text-xs sm:text-sm text-[#EAF8F3]/85 leading-relaxed mb-6">
                {activeCase.summary}
              </p>

              {/* Shade Improvement Metric Box */}
              <div 
                className="p-3.5 rounded-2xl mb-6 border"
                style={{ backgroundColor: `${colors.secondary}50`, borderColor: `${colors.accent}30` }}
              >
                <span className="text-[10px] uppercase font-bold text-white/70 block">
                  Enamel Luminescence Gain
                </span>
                <span className="text-sm font-bold font-mono text-white mt-0.5 block" style={{ color: colors.accent }}>
                  {activeCase.shadeImprovement}
                </span>
              </div>

              {/* Treatments Performed */}
              <div className="mb-6 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Procedures Delivered
                </span>
                {activeCase.treatments.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#EAF8F3]/80">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accent }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {/* Actions & Carousel navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenBooking();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md"
                  style={{ backgroundColor: colors.accent }}
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

