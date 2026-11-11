import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Calendar, Menu, X, ArrowRight, Palette } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme, THEME_PRESETS, type ThemePreset } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const { theme, setTheme, colors } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) sound.playClick();
  };

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Results', href: '#gallery' },
    { label: 'Our Doctors', href: '#doctors' },
    { label: 'Technology', href: '#technology' },
    { label: '3D Anatomy', href: '#anatomy' },
    { label: 'Assessment', href: '#assessment' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md border-b py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
      style={{
        backgroundColor: scrolled ? `${colors.primary}ea` : 'transparent',
        borderColor: scrolled ? `${colors.accent}25` : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo matching reference image */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 group cursor-pointer"
          onClick={() => sound.playClick()}
        >
          {/* Custom Stylized Tooth Icon from Reference Image */}
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm transition-colors"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.secondary})`,
              borderColor: `${colors.accent}60`,
            }}
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              style={{ color: colors.accent }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C7.5 2 4.5 5 4.5 9.5C4.5 13 6 17.5 7.5 22C8.5 22 9.5 18 10.5 15C11.2 13 12.8 13 13.5 15C14.5 18 15.5 22 16.5 22C18 17.5 19.5 13 19.5 9.5C19.5 5 16.5 2 12 2Z" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
            Dentivo
            <span 
              className="w-1.5 h-1.5 rounded-full ml-1 inline-block animate-pulse"
              style={{ backgroundColor: colors.accent }}
            />
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#EAF8F3]/85">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sound.playClick()}
              className="hover:text-white transition-colors relative group py-1"
            >
              {link.label}
              <span 
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Palette Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setPaletteMenuOpen(!paletteMenuOpen);
              }}
              title="Change Clinic Aesthetic Color Palette"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span 
                className="w-2.5 h-2.5 rounded-full border border-white/50"
                style={{ backgroundColor: colors.accent }}
              />
            </button>

            {paletteMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-52 p-2 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
                style={{ backgroundColor: `${colors.primary}fa` }}
              >
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider px-2 py-1">
                  Choose Color Theme
                </span>
                {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                  const p = THEME_PRESETS[key];
                  const isCurrent = theme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        sound.playChime();
                        setTheme(key);
                        setPaletteMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-white/20 text-white font-bold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/40"
                          style={{ backgroundColor: p.accent }}
                        />
                        <span>{p.name.split(' (')[0]}</span>
                      </div>
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.primary }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute interactive audio" : "Enable interactive audio"}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" style={{ color: colors.accent }} /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          {/* Admin Clinic Portal Link */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            title="Clinic Staff Portal"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
          >
            <Shield className="w-3.5 h-3.5" style={{ color: colors.accent }} />
            <span>Staff Portal</span>
          </button>

          {/* Book Appointment Pill Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBooking();
            }}
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#063D32] text-xs font-semibold hover:opacity-95 transition-all duration-300 shadow-md group"
          >
            <span>Book Appointment</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-b px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300"
          style={{ backgroundColor: `${colors.primary}fa`, borderColor: `${colors.accent}30` }}
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="text-base font-medium text-white/90 hover:text-white py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-3">
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-xl text-[#063D32] font-semibold text-center flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white font-medium flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" style={{ color: colors.accent }} />
              <span>Clinic Staff Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
