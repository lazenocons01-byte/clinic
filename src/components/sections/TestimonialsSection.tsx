import React, { useState } from 'react';
import { TESTIMONIALS } from '../../data/clinicData';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

export const TestimonialsSection: React.FC = () => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    sound.playClick();
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section 
      id="testimonials" 
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: colors.primary }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/4 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}40` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Verified Patient Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Loved by Over <span style={{ color: colors.accent }}>15,000+</span> Smiles
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            Real stories from patients who experienced our anxiety-free care, same-day ceramic artistry, and painless digital dentistry.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/20 relative shadow-2xl">
            {/* Quote watermark */}
            <Quote 
              className="absolute top-6 right-8 w-20 h-20 opacity-10 pointer-events-none" 
              style={{ color: colors.accent }} 
            />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <img
                src={current.avatar}
                alt={current.patientName}
                className="w-20 h-20 rounded-full object-cover border-2 shadow-lg shrink-0"
                style={{ borderColor: colors.accent }}
              />
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: colors.accent }} />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {current.patientName}
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                  {current.location}
                </p>
                <div 
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-2 border"
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    borderColor: `${colors.accent}40`,
                    color: colors.accent,
                  }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified: {current.treatment}</span>
                </div>
              </div>
            </div>

            {/* Testimonial text */}
            <p className="text-base sm:text-lg text-white/90 italic leading-relaxed mb-8">
              "{current.review}"
            </p>

            {/* Navigation & Dots */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-8' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    style={{
                      backgroundColor: idx === currentIndex ? colors.accent : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
