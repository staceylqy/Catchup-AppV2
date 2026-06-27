export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export const DEFAULT_THEME: ColorTheme = {
  primary: '#004349',
  secondary: '#795900',
  accent: '#22423b'
};

export const THEME_PRESETS: { name: string; colors: ColorTheme }[] = [
  {
    name: 'Cognitive Teal',
    colors: { primary: '#004349', secondary: '#795900', accent: '#22423b' }
  },
  {
    name: 'Royal Indigo',
    colors: { primary: '#1e3a8a', secondary: '#b45309', accent: '#4f46e5' }
  },
  {
    name: 'Forest Emerald',
    colors: { primary: '#065f46', secondary: '#c2410c', accent: '#0d9488' }
  },
  {
    name: 'Rose Crimson',
    colors: { primary: '#9d174d', secondary: '#0369a1', accent: '#be185d' }
  },
  {
    name: 'Sunset Amber',
    colors: { primary: '#7c2d12', secondary: '#047857', accent: '#c2410c' }
  },
  {
    name: 'Classic Slate',
    colors: { primary: '#1e293b', secondary: '#0f766e', accent: '#475569' }
  },
  {
    name: 'Midnight Lavender',
    colors: { primary: '#581c87', secondary: '#854d0e', accent: '#7c3aed' }
  },
  {
    name: 'Warm Terracotta',
    colors: { primary: '#9a3412', secondary: '#166534', accent: '#ea580c' }
  }
];

export function getLuminance(hex: string): number {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastColor(hex: string): string {
  return getLuminance(hex) > 0.6 ? '#191c1d' : '#ffffff';
}

export function mixWithWhite(hex: string, weight: number): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  const newR = Math.round(r + (255 - r) * weight);
  const newG = Math.round(g + (255 - g) * weight);
  const newB = Math.round(b + (255 - b) * weight);
  
  const rHex = newR.toString(16).padStart(2, '0');
  const gHex = newG.toString(16).padStart(2, '0');
  const bHex = newB.toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
}

export function mixWithBlack(hex: string, weight: number): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  const newR = Math.round(r * (1 - weight));
  const newG = Math.round(g * (1 - weight));
  const newB = Math.round(b * (1 - weight));
  
  const rHex = newR.toString(16).padStart(2, '0');
  const gHex = newG.toString(16).padStart(2, '0');
  const bHex = newB.toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}${bHex}`;
}

export function applyTheme(theme: ColorTheme) {
  const root = document.documentElement;
  
  // Primary
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-on-primary', getContrastColor(theme.primary));
  
  const primaryContainer = mixWithWhite(theme.primary, 0.88);
  root.style.setProperty('--color-primary-container', primaryContainer);
  root.style.setProperty('--color-on-primary-container', theme.primary);
  
  const primaryFixed = mixWithWhite(theme.primary, 0.7);
  root.style.setProperty('--color-primary-fixed', primaryFixed);
  root.style.setProperty('--color-primary-fixed-dim', mixWithWhite(theme.primary, 0.6));
  root.style.setProperty('--color-on-primary-fixed', mixWithBlack(theme.primary, 0.7));
  root.style.setProperty('--color-on-primary-fixed-variant', theme.primary);
  
  // Secondary
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-on-secondary', getContrastColor(theme.secondary));
  
  const secondaryContainer = mixWithWhite(theme.secondary, 0.88);
  root.style.setProperty('--color-secondary-container', secondaryContainer);
  root.style.setProperty('--color-on-secondary-container', theme.secondary);
  
  const secondaryFixed = mixWithWhite(theme.secondary, 0.7);
  root.style.setProperty('--color-secondary-fixed', secondaryFixed);
  root.style.setProperty('--color-secondary-fixed-dim', mixWithWhite(theme.secondary, 0.6));
  root.style.setProperty('--color-on-secondary-fixed', mixWithBlack(theme.secondary, 0.7));
  root.style.setProperty('--color-on-secondary-fixed-variant', theme.secondary);
  
  // Tertiary (Accent)
  root.style.setProperty('--color-tertiary', theme.accent);
  root.style.setProperty('--color-on-tertiary', getContrastColor(theme.accent));
  
  const tertiaryContainer = mixWithWhite(theme.accent, 0.88);
  root.style.setProperty('--color-tertiary-container', tertiaryContainer);
  root.style.setProperty('--color-on-tertiary-container', theme.accent);
  
  const tertiaryFixed = mixWithWhite(theme.accent, 0.7);
  root.style.setProperty('--color-tertiary-fixed', tertiaryFixed);
  root.style.setProperty('--color-tertiary-fixed-dim', mixWithWhite(theme.accent, 0.6));
  root.style.setProperty('--color-on-tertiary-fixed', mixWithBlack(theme.accent, 0.7));
  root.style.setProperty('--color-on-tertiary-fixed-variant', theme.accent);
}
