import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Calendar, Stethoscope, Zap, Heart } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface DentalAssessmentSectionProps {
  onSelectServiceAndDoctor: (serviceId: string, doctorId: string) => void;
}

export const DentalAssessmentSection: React.FC<DentalAssessmentSectionProps> = ({
  onSelectServiceAndDoctor,
}) => {
  const { colors, toothColor } = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('whitening');
  const [anxiety, setAnxiety] = useState<string>('mild');
  const [lastScan, setLastScan] = useState<string>('never');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const calculatePlan = () => {
    sound.playSuccess();
    setIsCalculated(true);
  };

  const resetQuiz = () => {
    sound.playClick();
    setCurrentStep(1);
    setIsCalculated(false);
  };

  // Determine recommended plan based on user choices
  const getRecommendation = () => {
    if (goal === 'whitening') {
      return {
        serviceId: 'teeth-whitening',
        serviceName: 'LumiBrite Cold-Laser Teeth Whitening',
        doctorId: 'doc-3',
        doctorName: 'Dr. Maya Lin, DDS, AAACD',
        timeline: 'Single 45-min appointment',
        benefit: '8-12 shades brighter with desensitizing barrier protocol',
        score: '96% Aesthetic Fit',
      };
    } else if (goal === 'alignment') {
      return {
        serviceId: 'orthodontics',
        serviceName: 'Next-Gen Clear Aligners & AI Tracking',
        doctorId: 'doc-3',
        doctorName: 'Dr. Maya Lin, DDS, AAACD',
        timeline: '6 to 10 months discrete wear',
        benefit: 'Virtually invisible aligners with 3D digital outcome preview',
        score: '98% Biomechanical Fit',
      };
    } else if (goal === 'implant') {
      return {
        serviceId: 'dental-implants',
        serviceName: '3D Guided Flapless Dental Implant',
        doctorId: 'doc-2',
        doctorName: 'Dr. Alexander Vance, DMD, ICOI',
        timeline: 'Single-visit computer-navigated placement',
        benefit: 'Permanent titanium/zirconia root with lifetime warranty',
        score: '99% Restorative Fit',
      };
    } else {
      return {
        serviceId: 'general-dentistry',
        serviceName: 'Comprehensive 3D Digital Scan & Gentle Cleanse',
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Jenkins, DDS, FACP',
        timeline: 'Immediate 45-min biological assessment',
        benefit: 'Microscopic cavity detection and painless ultrasonic biofilm polish',
        score: '95% Preventative Fit',
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <section id="assessment" className="relative py-24 bg-[#04241D] overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}40` }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <Stethoscope className="w-3.5 h-3.5" style={{ color: toothColor }} />
            <span>Interactive 60-Second Diagnostic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Ideal <span style={{ color: colors.accent }}>Treatment Plan</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#EAF8F3]/75">
            Answer 3 quick clinical questions to receive an algorithmic recommendation tailored to your aesthetics, comfort preferences, and timeline.
          </p>
        </div>

        {/* Assessment Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 relative shadow-2xl">
          {!isCalculated ? (
            <div>
              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-[#063D32]"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {currentStep}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    Step {currentStep} of 3
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === currentStep ? 'w-8' : 'w-3'
                      }`}
                      style={{ backgroundColor: s <= currentStep ? colors.accent : 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: Goal */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    What is your primary smile goal?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'whitening', label: 'Laser Teeth Whitening', desc: 'Lift coffee/tea stains by 8-12 shades', icon: Zap },
                      { id: 'alignment', label: 'Straighten Teeth / Clear Aligners', desc: 'Fix crowding, gaps, and bite alignment', icon: Sparkles },
                      { id: 'implant', label: 'Permanent Dental Implant', desc: 'Replace a missing or broken tooth', icon: Heart },
                      { id: 'checkup', label: 'Biological Health & Pain Relief', desc: 'Thorough 3D scan and gentle preventative care', icon: Stethoscope },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = goal === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            sound.playClick();
                            setGoal(opt.id);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                            isSelected
                              ? 'bg-white/15 border-white text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                          }`}
                          style={{ borderColor: isSelected ? colors.accent : undefined }}
                        >
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                            style={{ backgroundColor: `${colors.secondary}77`, borderColor: `${colors.accent}40`, color: colors.accent }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{opt.label}</span>
                            <span className="text-[11px] text-white/60 block mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Anxiety & Comfort */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    How would you describe your dental anxiety level?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'low', label: 'Zero Anxiety', desc: 'I am totally comfortable with standard clinical visits.' },
                      { id: 'mild', label: 'Mild Apprehension', desc: 'I prefer noise-cancelling headphones and gentle care.' },
                      { id: 'high', label: 'Severe Dental Anxiety', desc: 'I want warm sedation options and needleless lasers.' },
                    ].map((opt) => {
                      const isSelected = anxiety === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            sound.playClick();
                            setAnxiety(opt.id);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white/15 border-white text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                          }`}
                          style={{ borderColor: isSelected ? colors.accent : undefined }}
                        >
                          <span className="text-xs font-bold text-white block mb-1">{opt.label}</span>
                          <span className="text-[11px] text-white/60 block">{opt.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Last Dental 3D Scan */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    When was your last 3D digital oral scan or X-ray?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'recent', label: 'Within last 6 months', desc: 'Routine preventative tracking.' },
                      { id: 'year', label: '1 to 2 years ago', desc: 'Due for an updated 3D diagnostic scan.' },
                      { id: 'never', label: 'Never / Over 3 years', desc: 'Complimentary full-arch 3D optical scan recommended.' },
                    ].map((opt) => {
                      const isSelected = lastScan === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            sound.playClick();
                            setLastScan(opt.id);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white/15 border-white text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                          }`}
                          style={{ borderColor: isSelected ? colors.accent : undefined }}
                        >
                          <span className="text-xs font-bold text-white block mb-1">{opt.label}</span>
                          <span className="text-[11px] text-white/60 block">{opt.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                {currentStep > 1 ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep((prev) => prev - 1);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white"
                  >
                    Back
                  </button>
                ) : <div />}

                {currentStep < 3 ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep((prev) => prev + 1);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={calculatePlan}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <span>Generate Clinical Plan</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Recommendation Card */
            <div className="animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${colors.accent}25`, color: colors.accent }}
                >
                  Clinical Algorithmic Match // {recommendation.score}
                </span>

                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Recommended: {recommendation.serviceName}
              </h3>

              <p className="text-xs text-white/80 leading-relaxed mb-6">
                Based on your answers, our clinical director recommends pairing your visit with{' '}
                <strong className="text-white">{recommendation.doctorName}</strong>.
              </p>

              {/* Highlights */}
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl mb-6 border"
                style={{ backgroundColor: `${colors.secondary}50`, borderColor: `${colors.accent}30` }}
              >
                <div>
                  <span className="text-[10px] text-white/60 uppercase block">Expected Timeline</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{recommendation.timeline}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 uppercase block">Specialist Assigned</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{recommendation.doctorName}</span>
                </div>
              </div>

              <div className="mb-6 space-y-2 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                  <span>{recommendation.benefit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                  <span>
                    {anxiety === 'high'
                      ? 'Comfort Suite activated: Noise-cancelling audio & painless laser numbing prepped.'
                      : 'Comprehensive 3D intraoral digital twin scan included.'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectServiceAndDoctor(recommendation.serviceId, recommendation.doctorId);
                }}
                className="w-full py-3.5 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-xl transition-all"
                style={{ backgroundColor: colors.accent }}
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Customized Treatment Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

