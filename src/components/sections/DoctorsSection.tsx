import React, { useState } from 'react';
import { DOCTORS } from '../../data/clinicData';
import type { Doctor } from '../../types';
import { Star, Award, GraduationCap, Calendar, CheckCircle2, X, ArrowRight, UserCheck } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

interface DoctorsSectionProps {
  onSelectDoctorForBooking: (doctorId: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctorForBooking }) => {
  const { colors } = useTheme();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <section 
      id="doctors" 
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: colors.bgDark }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}35` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3"
            style={{ backgroundColor: `${colors.secondary}66`, borderColor: `${colors.accent}40`, color: colors.accent }}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Board-Certified Clinicians</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Our Elite <span style={{ color: colors.accent }}>Specialists</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#EAF8F3]/75">
            World-class prosthodontists, implantologists, and aesthetic surgeons combining Ivy League training with computer-guided surgical mastery.
          </p>
        </div>

        {/* Doctors Grid (4 doctors) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 border border-white/15 hover:border-white/40"
            >
              {/* Doctor Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-black/40 flex items-center justify-center">
                {!imgErrors[doc.id] ? (
                  <img
                    src={doc.image}
                    alt={doc.name}
                    loading="lazy"
                    onError={() => setImgErrors(prev => ({ ...prev, [doc.id]: true }))}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center text-center p-4"
                    style={{ backgroundColor: `${colors.secondary}40` }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg mb-2 border"
                      style={{ backgroundColor: colors.primary, color: colors.accent, borderColor: colors.accent }}
                    >
                      {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-white/90">{doc.name}</span>
                    <span className="text-[10px]" style={{ color: colors.accent }}>{doc.specialization}</span>
                  </div>
                )}
                <div 
                  className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80 pointer-events-none"
                  style={{ backgroundImage: `linear-gradient(to top, ${colors.primary}, transparent)` }}
                />
                
                {/* Experience Pill */}
                <div 
                  className="absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur-md border text-[11px] font-bold"
                  style={{
                    backgroundColor: `${colors.bgDark}dd`,
                    borderColor: `${colors.accent}50`,
                    color: colors.accent,
                  }}
                >
                  {doc.experienceYears}+ Yrs Exp
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: colors.accent }} />
                  <span className="font-bold">{doc.rating}</span>
                  <span className="text-white/60 text-[10px]">({doc.reviewCount})</span>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors leading-snug">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-medium mt-1" style={{ color: colors.accent }}>
                    {doc.specialization}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1 line-clamp-1">
                    {doc.qualification}
                  </p>
                  <p className="text-xs text-white/70 mt-3 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>
                </div>

                {/* Surgery count statistic */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <span>Successful Cases:</span>
                  <span className="font-mono font-bold text-white">{doc.completedCases.toLocaleString()}+</span>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedDoctor(doc);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition-colors"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectDoctorForBooking(doc.id);
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-[#063D32] transition-colors flex items-center justify-center gap-1 shadow-md"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="border rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            style={{ backgroundColor: colors.primary, borderColor: `${colors.accent}40` }}
          >
            <button
              onClick={() => {
                sound.playClick();
                setSelectedDoctor(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
              {!imgErrors[selectedDoctor.id] ? (
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  onError={() => setImgErrors(prev => ({ ...prev, [selectedDoctor.id]: true }))}
                  className="w-24 h-24 rounded-2xl object-cover border-2 shrink-0"
                  style={{ borderColor: colors.accent }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-xl border-2 shrink-0"
                  style={{ backgroundColor: colors.secondary, color: colors.accent, borderColor: colors.accent }}
                >
                  {selectedDoctor.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.accent }}>
                  {selectedDoctor.title}
                </span>
                <h3 className="text-2xl font-bold text-white mt-0.5">
                  {selectedDoctor.name}
                </h3>
                <p className="text-xs text-white/70 mt-1">{selectedDoctor.qualification}</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs">
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" style={{ color: colors.accent }} />
                    {selectedDoctor.rating} ({selectedDoctor.reviewCount} reviews)
                  </span>
                  <span className="font-mono font-bold" style={{ color: colors.accent }}>
                    {selectedDoctor.completedCases}+ procedures
                  </span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-6">
              {selectedDoctor.bio}
            </p>

            {/* Education & Fellowships */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" style={{ color: colors.accent }} />
                Academic Background
              </h4>
              <ul className="space-y-1.5 text-xs text-white/80">
                {selectedDoctor.education.map((edu, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: colors.accent }} />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Board Certifications */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: colors.accent }} />
                Board Certifications & Fellowships
              </h4>
              <ul className="space-y-1.5 text-xs text-white/80">
                {selectedDoctor.certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: colors.accent }} />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability Days */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-center justify-between text-xs">
              <span className="text-white/70">Clinical Consultation Days:</span>
              <span className="font-semibold text-white">
                {selectedDoctor.availableDays.join(', ')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  const doctorId = selectedDoctor.id;
                  setSelectedDoctor(null);
                  onSelectDoctorForBooking(doctorId);
                }}
                className="flex-1 py-3.5 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <span>Book Direct Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
