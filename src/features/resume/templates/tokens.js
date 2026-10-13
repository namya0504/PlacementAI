/**
 * Resume Design Tokens
 * Provides structured color palettes, spacing scales, typography definitions,
 * and section-title decoration tokens for all resume templates.
 */

export const SPACING_TOKENS = {
  compact: {
    sectionGap: 'mb-4',
    itemGap: 'space-y-2',
    headingMargin: 'mb-2',
    pagePadding: 'p-6 sm:p-7',
    itemPadding: 'py-0.5'
  },
  normal: {
    sectionGap: 'mb-6',
    itemGap: 'space-y-3',
    headingMargin: 'mb-3',
    pagePadding: 'p-8 sm:p-9',
    itemPadding: 'py-1'
  },
  relaxed: {
    sectionGap: 'mb-8',
    itemGap: 'space-y-4',
    headingMargin: 'mb-4',
    pagePadding: 'p-10 sm:p-11',
    itemPadding: 'py-2'
  }
};

export const FONT_SCALE_TOKENS = {
  small: {
    name: 'text-2xl',
    role: 'text-xs',
    sectionTitle: 'text-xs',
    itemTitle: 'text-xs',
    body: 'text-[11px] leading-relaxed',
    meta: 'text-[10px]'
  },
  medium: {
    name: 'text-3xl',
    role: 'text-sm',
    sectionTitle: 'text-sm',
    itemTitle: 'text-xs sm:text-sm',
    body: 'text-xs leading-relaxed',
    meta: 'text-[11px]'
  },
  large: {
    name: 'text-4xl',
    role: 'text-base',
    sectionTitle: 'text-base',
    itemTitle: 'text-sm',
    body: 'text-sm leading-relaxed',
    meta: 'text-xs'
  }
};

export const COLOR_PRESETS = {
  navy: {
    id: 'navy',
    name: 'Executive Navy',
    accent: '#1e3a8a',
    secondary: '#3b82f6',
    bgLight: '#eff6ff',
    border: '#bfdbfe',
    textDark: '#0f172a',
    textMuted: '#475569'
  },
  teal: {
    id: 'teal',
    name: 'Modern Teal',
    accent: '#0f766e',
    secondary: '#14b8a6',
    bgLight: '#f0fdfa',
    border: '#99f6e4',
    textDark: '#134e4a',
    textMuted: '#475569'
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    accent: '#b45309',
    secondary: '#f59e0b',
    bgLight: '#fffbeb',
    border: '#fde68a',
    textDark: '#451a03',
    textMuted: '#475569'
  },
  coral: {
    id: 'coral',
    name: 'Vibrant Coral',
    accent: '#be123c',
    secondary: '#f43f5e',
    bgLight: '#fff1f2',
    border: '#fecdd3',
    textDark: '#881337',
    textMuted: '#475569'
  },
  forest: {
    id: 'forest',
    name: 'Deep Forest',
    accent: '#14532d',
    secondary: '#22c55e',
    bgLight: '#f0fdf4',
    border: '#bbf7d0',
    textDark: '#052e16',
    textMuted: '#475569'
  },
  charcoal: {
    id: 'charcoal',
    name: 'Slate Charcoal',
    accent: '#1e293b',
    secondary: '#64748b',
    bgLight: '#f8fafc',
    border: '#cbd5e1',
    textDark: '#0f172a',
    textMuted: '#475569'
  },
  burgundy: {
    id: 'burgundy',
    name: 'Royal Burgundy',
    accent: '#701a75',
    secondary: '#a21caf',
    bgLight: '#fdf4ff',
    border: '#f5d0fe',
    textDark: '#4a044e',
    textMuted: '#475569'
  },
  light: {
    id: 'light',
    name: 'Pure Slate (Ink-Saver)',
    accent: '#334155',
    secondary: '#64748b',
    bgLight: '#f8fafc',
    border: '#e2e8f0',
    textDark: '#0f172a',
    textMuted: '#64748b'
  },
  monochrome: {
    id: 'monochrome',
    name: 'Classic Monochrome',
    accent: '#111827',
    secondary: '#4b5563',
    bgLight: '#f9fafb',
    border: '#e5e7eb',
    textDark: '#111827',
    textMuted: '#4b5563'
  }
};

/**
 * Resolves combined styling tokens given active layout preset and user overrides
 */
export function resolveTokens(themeKey = 'navy', options = {}) {
  const spacingKey = options.spacing || 'normal';
  const fontScaleKey = options.fontScale || 'medium';

  const baseTheme = COLOR_PRESETS[themeKey] || COLOR_PRESETS.navy;

  const accentColor = options.accentColor || baseTheme.accent;

  return {
    theme: {
      ...baseTheme,
      accent: accentColor
    },
    spacing: SPACING_TOKENS[spacingKey] || SPACING_TOKENS.normal,
    fonts: FONT_SCALE_TOKENS[fontScaleKey] || FONT_SCALE_TOKENS.medium,
    hiddenSections: Array.isArray(options.hiddenSections) ? options.hiddenSections : []
  };
}
