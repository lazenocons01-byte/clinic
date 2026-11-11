import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemePreset = 'emerald' | 'cyan' | 'sapphire' | 'obsidian' | 'purple';

export interface ThemeColors {
  id: ThemePreset;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  mint: string;
  bgDark: string;
  bgAlt: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  bgGradFrom: string;
  bgGradVia: string;
  bgGradTo: string;
  textGlow: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeColors> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald & Mint (Original)',
    primary: '#063D32',
    secondary: '#0B5B49',
    accent: '#75F5C5',
    mint: '#A7F3D0',
    bgDark: '#032019',
    bgAlt: '#042820',
    cardBg: 'rgba(11, 91, 73, 0.55)',
    cardBorder: 'rgba(117, 245, 197, 0.25)',
    cardHover: 'rgba(11, 91, 73, 0.85)',
    bgGradFrom: '#052922',
    bgGradVia: '#063D32',
    bgGradTo: '#032019',
    textGlow: 'rgba(117, 245, 197, 0.65)',
  },
  cyan: {
    id: 'cyan',
    name: 'Ocean Cyan & Turquoise',
    primary: '#042B33',
    secondary: '#084855',
    accent: '#38E1FF',
    mint: '#7DEBFF',
    bgDark: '#02181D',
    bgAlt: '#032027',
    cardBg: 'rgba(8, 72, 85, 0.55)',
    cardBorder: 'rgba(56, 225, 255, 0.25)',
    cardHover: 'rgba(8, 72, 85, 0.85)',
    bgGradFrom: '#03232B',
    bgGradVia: '#042B33',
    bgGradTo: '#02181D',
    textGlow: 'rgba(56, 225, 255, 0.65)',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire & Ice Teal',
    primary: '#0A1E3F',
    secondary: '#133566',
    accent: '#64FFDA',
    mint: '#A0FFE6',
    bgDark: '#051126',
    bgAlt: '#071836',
    cardBg: 'rgba(19, 53, 102, 0.55)',
    cardBorder: 'rgba(100, 255, 218, 0.25)',
    cardHover: 'rgba(19, 53, 102, 0.85)',
    bgGradFrom: '#071630',
    bgGradVia: '#0A1E3F',
    bgGradTo: '#051126',
    textGlow: 'rgba(100, 255, 218, 0.65)',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian & Neon Mint',
    primary: '#0E1715',
    secondary: '#182723',
    accent: '#00F0A8',
    mint: '#63FFCE',
    bgDark: '#070B0A',
    bgAlt: '#0B1210',
    cardBg: 'rgba(24, 39, 35, 0.65)',
    cardBorder: 'rgba(0, 240, 168, 0.25)',
    cardHover: 'rgba(24, 39, 35, 0.9)',
    bgGradFrom: '#0B1210',
    bgGradVia: '#0E1715',
    bgGradTo: '#070B0A',
    textGlow: 'rgba(0, 240, 168, 0.75)',
  },
  purple: {
    id: 'purple',
    name: 'Amethyst & Rose Glow',
    primary: '#240F36',
    secondary: '#3B1B54',
    accent: '#E685F5',
    mint: '#F3B4FC',
    bgDark: '#160822',
    bgAlt: '#1B0A2B',
    cardBg: 'rgba(59, 27, 84, 0.60)',
    cardBorder: 'rgba(230, 133, 245, 0.25)',
    cardHover: 'rgba(59, 27, 84, 0.88)',
    bgGradFrom: '#1E0C2E',
    bgGradVia: '#240F36',
    bgGradTo: '#160822',
    textGlow: 'rgba(230, 133, 245, 0.65)',
  },
};

interface ThemeContextType {
  theme: ThemePreset;
  colors: ThemeColors;
  setTheme: (theme: ThemePreset) => void;
  toothColor: string;
  setToothColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreset>('emerald');
  const [toothColor, setToothColor] = useState<string>('#75F5C5');

  const colors = THEME_PRESETS[theme];

  const setTheme = (newTheme: ThemePreset) => {
    setThemeState(newTheme);
    setToothColor(THEME_PRESETS[newTheme].accent);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-mint', colors.mint);
    root.style.setProperty('--color-bg-dark', colors.bgDark);
    root.style.setProperty('--color-bg-alt', colors.bgAlt);
    root.style.setProperty('--color-card-bg', colors.cardBg);
    root.style.setProperty('--color-card-border', colors.cardBorder);
    root.style.setProperty('--color-card-hover', colors.cardHover);
    root.style.setProperty('--color-text-glow', colors.textGlow);
    document.body.style.backgroundColor = colors.primary;
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toothColor, setToothColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
