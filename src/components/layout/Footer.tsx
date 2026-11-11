import React, { useState, useEffect } from 'react';
import { CLINIC_INFO } from '../../data/clinicData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';

export const Footer: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { colors } = useTheme();
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);

  // Compute live open/closed status based on actual time
  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hours = now.getHours();

    if (day >= 1 && day <= 5) {
      // Monday to Friday: 8 AM to 7:30 PM (19:30)
      setIsOpenNow(hours >= 8 && hours < 20);
    } else if (day === 6) {
      // Saturday: 9 AM to 5 PM
      setIsOpenNow(hours >= 9 && hours < 17);
    } else {
      // Sunday: Emergency only
      setIsOpenNow(false);
    }
  }, []);

  return (
    <footer 
      id="contact" 
      className="relative text-[#EAF8F3] pt-20 pb-12 border-t overflow-hidden transition-colors duration-700"
      style={{
        backgroundColor: colors.bgDark,
        borderColor: `${colors.accent}25`,
      }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-0 right-1/4 w-[600px] h-[300px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: `${colors.secondary}30` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Emergency Hotline Banner */}
        <div 
          className="glass-card rounded-2xl p-6 mb-16 border flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            borderColor: `${colors.accent}40`,
            background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: colors.accent }}>
                24/7 Dental Emergency Response
              </span>
              <h4 className="text-lg font-bold text-white">
                Severe Toothache, Broken Crown, or Dental Trauma?
              </h4>
              <p className="text-xs text-white/80">
                Our emergency trauma team is on-call 24 hours a day with guaranteed immediate pain-relief triage.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onOpenBooking();
              }}
              className="px-5 py-3 rounded-full text-[#063D32] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-md"
              style={{ backgroundColor: colors.accent }}
            >
              Book Priority Visit
            </button>
            <a
              href={`tel:${CLINIC_INFO.emergencyPhone}`}
              onClick={() => sound.playClick()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-500/20 shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {CLINIC_INFO.emergencyPhone}</span>
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center border"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}30, ${colors.secondary})`,
                  borderColor: `${colors.accent}50`,
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.accent }}>
                  <path d="M12 2C7.5 2 4.5 5 4.5 9.5C4.5 13 6 17.5 7.5 22C8.5 22 9.5 18 10.5 15C11.2 13 12.8 13 13.5 15C14.5 18 15.5 22 16.5 22C18 17.5 19.5 13 19.5 9.5C19.5 5 16.5 2 12 2Z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Dentivo
              </span>
            </div>

            <p className="text-xs text-[#EAF8F3]/75 leading-relaxed">
              International center of excellence for computational dental diagnostics, biomimetic ceramics, and painless restorative procedures. Designed for comfort and lasting radiance.
            </p>

            {/* Live Open Status Indicator */}
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs"
              style={{ backgroundColor: colors.primary, borderColor: `${colors.accent}30` }}
            >
              <span 
                className={`w-2 h-2 rounded-full ${isOpenNow ? 'animate-ping' : 'bg-amber-400'}`} 
                style={{ backgroundColor: isOpenNow ? colors.accent : undefined }}
              />
              <span className="text-white font-medium">
                {isOpenNow ? 'Clinic Open Now until 7:30 PM' : 'Currently Closed • Emergency Team Active'}
              </span>
            </div>

            {/* Accreditations */}
            <div className="pt-2 flex items-center gap-3 text-white/50 text-xs">
              <span className="border border-white/10 px-2 py-1 rounded text-[10px]">ADA Member</span>
              <span className="border border-white/10 px-2 py-1 rounded text-[10px]">AACD Accredited</span>
              <span className="border border-white/10 px-2 py-1 rounded text-[10px]">ICOI Fellow</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h5>
            <ul className="space-y-2.5 text-xs text-[#EAF8F3]/70">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Results</a></li>
              <li><a href="#doctors" className="hover:text-white transition-colors">Our Doctors</a></li>
              <li><a href="#technology" className="hover:text-white transition-colors">Technology</a></li>
              <li><a href="#anatomy" className="hover:text-white transition-colors">3D Anatomy</a></li>
              <li><a href="#assessment" className="hover:text-white transition-colors">Assessment</a></li>
              <li><a href="#why-us" className="hover:text-white transition-colors">Why Choose Us</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Clinical Hours (3 cols) */}
          <div className="lg:col-span-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              Operating Hours
            </h5>
            <ul className="space-y-2.5 text-xs text-[#EAF8F3]/80">
              {CLINIC_INFO.workingHours.map((wh, i) => (
                <li key={i} className="flex flex-col border-b border-white/5 pb-2">
                  <span className="font-semibold text-white">{wh.days}</span>
                  <span className="text-white/60 text-[11px] mt-0.5">{wh.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Location (3 cols) */}
          <div className="lg:col-span-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              Concierge Location
            </h5>
            <div className="space-y-3 text-xs text-[#EAF8F3]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.accent }} />
                <span>{CLINIC_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                <span>{CLINIC_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                <span>{CLINIC_INFO.email}</span>
              </p>

              {/* Styled Interactive Google Map Link */}
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=450+Lexington+Avenue+New+York"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  style={{ color: colors.accent }}
                >
                  <span>Open Interactive Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} DENTIVO Dental Center of Excellence. All rights reserved.</p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4" style={{ color: colors.accent }}>
            <a href="#" className="hover:text-white transition-colors" title="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="X / Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
