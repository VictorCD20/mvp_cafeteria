import type { AppearanceConfig, ThemeColors, ThemePreset, ThemePresetKey } from '../types/index.ts';

export const defaultPresets: Record<Exclude<ThemePresetKey, 'personalizado'>, ThemePreset> = {
  cafe: {
    id: 'cafe',
    name: 'Café Cálido',
    description: 'Tonos cálidos, moca y caramelo natural inspirados en café de especialidad',
    primary: '#7A4B2A',
    secondary: '#D9A66B',
    accent: '#F2C078',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    foreground: '#2D211B',
    button: '#7A4B2A'
  },
  neutro: {
    id: 'neutro',
    name: 'Neutro Moderno',
    description: 'Apariencia limpia, sobria y profesional en escala de grises pizarra',
    primary: '#334155',
    secondary: '#64748B',
    accent: '#CBD5E1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    foreground: '#0F172A',
    button: '#334155'
  },
  oscuro: {
    id: 'oscuro',
    name: 'Modo Oscuro Profundo',
    description: 'Interfaz oscura de alto confort para ambientes nocturnos o de poca luz',
    primary: '#A0683F',
    secondary: '#D5B38D',
    accent: '#F2C078',
    background: '#121212',
    surface: '#1E1E1E',
    foreground: '#F5EFE6',
    button: '#A0683F'
  },
  alto_contraste: {
    id: 'alto_contraste',
    name: 'Alto Contraste',
    description: 'Accesibilidad reforzada con máxima distinción de bordes y tipografía',
    primary: '#000000',
    secondary: '#1E293B',
    accent: '#FACC15',
    background: '#FFFFFF',
    surface: '#F1F5F9',
    foreground: '#000000',
    button: '#000000'
  }
};

export const defaultAppearanceConfig: AppearanceConfig = {
  activeTheme: 'cafe',
  allowCustomTheme: true,
  mode: 'light',
  density: 'comfortable',
  brandName: 'CODIA Cafetería Gourmet',
  brandLogo: 'coffee',
  customColors: {
    primary: '#7A4B2A',
    secondary: '#D9A66B',
    accent: '#F2C078',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    foreground: '#2D211B',
    button: '#7A4B2A'
  },
  presets: defaultPresets as unknown as Record<string, ThemePreset>
};

/**
 * Obtiene los colores activos según la configuración de apariencia
 */
export function getActiveThemeColors(appearance: AppearanceConfig): ThemeColors {
  if (appearance.activeTheme === 'personalizado') {
    return appearance.customColors;
  }
  const preset = appearance.presets?.[appearance.activeTheme] || defaultPresets[appearance.activeTheme as keyof typeof defaultPresets] || defaultPresets.cafe;
  return {
    primary: preset.primary,
    secondary: preset.secondary,
    accent: preset.accent,
    background: preset.background,
    surface: preset.surface,
    foreground: preset.foreground,
    button: preset.button || preset.primary
  };
}

/**
 * Calcula la luminancia relativa de un color hexadecimal (WCAG 2.1)
 */
function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const sRGB = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calcula el ratio de contraste entre dos colores (e.g. 4.5:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const lum1 = getRelativeLuminance(hex1);
    const lum2 = getRelativeLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5;
  }
}

/**
 * Verifica si el ratio de contraste cumple con nivel AA (>= 4.5)
 */
export function isAccessibleContrast(foregroundHex: string, backgroundHex: string): boolean {
  const ratio = getContrastRatio(foregroundHex, backgroundHex);
  return ratio >= 4.5;
}

/**
 * Inyecta las variables CSS y clases de tema en el documento HTML
 */
export function applyThemeToDOM(appearance: AppearanceConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const colors = getActiveThemeColors(appearance);

  // Determinar si aplica modo oscuro
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark =
    appearance.mode === 'dark' ||
    (appearance.mode === 'system' && prefersDark) ||
    appearance.activeTheme === 'oscuro';

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Densidad visual
  if (appearance.density === 'compact') {
    root.classList.add('density-compact');
    root.classList.remove('density-comfortable');
  } else {
    root.classList.add('density-comfortable');
    root.classList.remove('density-compact');
  }

  // Inyectar variables CSS personalizables
  root.style.setProperty('--app-primary', colors.primary);
  root.style.setProperty('--app-secondary', colors.secondary);
  root.style.setProperty('--app-accent', colors.accent);
  root.style.setProperty('--app-background', colors.background);
  root.style.setProperty('--app-surface', colors.surface);
  root.style.setProperty('--app-foreground', colors.foreground);
  root.style.setProperty('--app-button', colors.button);
}
