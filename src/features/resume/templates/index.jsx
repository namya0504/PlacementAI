import React from 'react';
import {
  ModernTemplate,
  ProfessionalTemplate,
  MinimalTemplate,
  CreativeTemplate
} from './layouts/LegacyLayouts';
import { BannerAccentLayout } from './layouts/BannerAccentLayout';
import { DarkSidebarLayout } from './layouts/DarkSidebarLayout';
import {
  MinimalSingleLayout,
  ClassicSerifLayout,
  TimelineLayout,
  FresherCampusLayout,
  DeveloperLayout,
  BoldHeaderLayout,
  CompactDenseLayout,
  AcademicInternLayout
} from './layouts/SpecializedLayouts';

/**
 * Standardized Template Catalog Registry
 * Each template satisfies:
 * { id, name, description, category, tags, atsFriendly, columns, supportsPhoto, accentPresets, component }
 */
export const TEMPLATES_REGISTRY = [
  // --- 1. LEGACY TEMPLATES (PRESERVED) ---
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean single-column layout with subtle borders and clear section hierarchy.',
    category: 'General',
    tags: ['ATS-friendly', 'Minimal', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#1e3a8a', '#0f766e', '#1e293b', '#7c3aed', '#b45309'],
    component: ModernTemplate
  },
  {
    id: 'professional',
    name: 'Executive Corporate',
    description: 'Two-column corporate structure with dedicated sidebar for skills & education.',
    category: 'General',
    tags: ['ATS-friendly', 'Two-column'],
    atsFriendly: true,
    columns: 2,
    supportsPhoto: false,
    accentPresets: ['#1e293b', '#1e3a8a', '#0f766e', '#334155', '#475569'],
    component: ProfessionalTemplate
  },
  {
    id: 'minimal',
    name: 'Clean Cleanliness',
    description: 'Hyper-minimalist monochrome typography layout prioritizing raw content clarity.',
    category: 'Minimal',
    tags: ['ATS-friendly', 'Minimal', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#111827', '#1e293b', '#374151', '#4b5563'],
    component: MinimalTemplate
  },
  {
    id: 'creative',
    name: 'Dynamic Accent',
    description: 'Modern portfolio design with high-contrast colored header and optional photo.',
    category: 'Creative',
    tags: ['Creative', 'Two-column'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#701a75', '#4338ca', '#be123c', '#0f766e', '#1e3a8a'],
    component: CreativeTemplate
  },

  // --- 2. BANNER + ACCENT STRIP (LAYOUT A - 4 COLOR THEMES) ---
  {
    id: 'banner_amber',
    name: 'Amber Horizon',
    description: 'Edge accent strip with warm amber summary band and balanced two-column body.',
    category: 'Banner',
    tags: ['Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#b45309', '#d97706', '#f59e0b', '#78350f', '#451a03'],
    component: (props) => <BannerAccentLayout {...props} themePreset="amber" />
  },
  {
    id: 'banner_teal',
    name: 'Teal Vista',
    description: 'Modern teal accent edge with shaded summary band and round section markers.',
    category: 'Banner',
    tags: ['Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#0f766e', '#0d9488', '#14b8a6', '#115e59', '#134e4a'],
    component: (props) => <BannerAccentLayout {...props} themePreset="teal" />
  },
  {
    id: 'banner_coral',
    name: 'Coral Sunrise',
    description: 'Energetic coral edge accent with round bullet markers and clean credentials column.',
    category: 'Banner',
    tags: ['Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#be123c', '#e11d48', '#f43f5e', '#9f1239', '#881337'],
    component: (props) => <BannerAccentLayout {...props} themePreset="coral" />
  },
  {
    id: 'banner_navy',
    name: 'Executive Navy Banner',
    description: 'Authoritative deep navy edge strip with structured summary and project showcase.',
    category: 'Banner',
    tags: ['Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#1e3a8a', '#1d4ed8', '#2563eb', '#172554', '#1e293b'],
    component: (props) => <BannerAccentLayout {...props} themePreset="navy" />
  },

  // --- 3. DARK SIDEBAR (LAYOUT B - 4 DARK THEMES + 1 LIGHT VARIANT) ---
  {
    id: 'sidebar_forest',
    name: 'Forest Evergreen',
    description: 'Full-height deep forest green sidebar with contact details, skills, and white main body.',
    category: 'Sidebar',
    tags: ['Sidebar', 'Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#14532d', '#166534', '#15803d', '#052e16', '#1b4332'],
    component: (props) => <DarkSidebarLayout {...props} themePreset="forest" />
  },
  {
    id: 'sidebar_navy',
    name: 'Cobalt Sidebar',
    description: 'Full-height classic navy sidebar featuring white typography and crystal clarity.',
    category: 'Sidebar',
    tags: ['Sidebar', 'Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#1e3a8a', '#172554', '#1e40af', '#1e293b', '#0369a1'],
    component: (props) => <DarkSidebarLayout {...props} themePreset="navy" />
  },
  {
    id: 'sidebar_charcoal',
    name: 'Charcoal Elite',
    description: 'Sophisticated matte slate-charcoal full-bleed sidebar for experienced engineering profiles.',
    category: 'Sidebar',
    tags: ['Sidebar', 'Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#1e293b', '#0f172a', '#334155', '#475569', '#18181b'],
    component: (props) => <DarkSidebarLayout {...props} themePreset="charcoal" />
  },
  {
    id: 'sidebar_burgundy',
    name: 'Burgundy Prestige',
    description: 'Rich royal burgundy full-height column creating a memorable executive aesthetic.',
    category: 'Sidebar',
    tags: ['Sidebar', 'Two-column', 'Creative'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#701a75', '#86198f', '#a21caf', '#4a044e', '#581c87'],
    component: (props) => <DarkSidebarLayout {...props} themePreset="burgundy" />
  },
  {
    id: 'sidebar_light',
    name: 'Ink-Saver Pure Light',
    description: 'Subtle soft-slate column variant engineered to conserve printer ink while retaining 2-column structure.',
    category: 'Sidebar',
    tags: ['Sidebar', 'Two-column', 'Minimal'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: true,
    accentPresets: ['#334155', '#475569', '#1e293b', '#64748b', '#0f172a'],
    component: (props) => <DarkSidebarLayout {...props} themePreset="light" />
  },

  // --- 4. ORIGINAL SPECIALIZED TEMPLATES (LAYOUT C) ---
  {
    id: 'minimal_single',
    name: 'Simple ATS Standard',
    description: 'Single-column standardized hierarchy designed specifically for 100% automated ATS compliance.',
    category: 'ATS-Friendly',
    tags: ['ATS-friendly', 'Minimal', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#0f172a', '#1e293b', '#334155', '#475569'],
    component: MinimalSingleLayout
  },
  {
    id: 'classic_serif',
    name: 'Academic Serif Ivy',
    description: 'Centered header with elegant Georgia serif typography and delicate section divider lines.',
    category: 'ATS-Friendly',
    tags: ['ATS-friendly', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#1e3a8a', '#7f1d1d', '#1e293b', '#064e3b', '#374151'],
    component: ClassicSerifLayout
  },
  {
    id: 'timeline',
    name: 'Career Milestone Tracker',
    description: 'Vertical milestone track showing sequential career and internship progression.',
    category: 'Creative',
    tags: ['Creative', 'Two-column'],
    atsFriendly: false,
    columns: 2,
    supportsPhoto: false,
    accentPresets: ['#0f766e', '#1e3a8a', '#7c3aed', '#b45309', '#be123c'],
    component: TimelineLayout
  },
  {
    id: 'fresher_campus',
    name: 'Campus Graduate First',
    description: 'Tailored for fresh college graduates: prioritizes Education, Skills, and Coursework Projects.',
    category: 'Fresher',
    tags: ['Fresher', 'ATS-friendly', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#1e3a8a', '#047857', '#6d28d9', '#b45309', '#0f766e'],
    component: FresherCampusLayout
  },
  {
    id: 'developer',
    name: 'Full-Stack Tech Stack',
    description: 'Developer focus with code-tag badges, GitHub links, and monospaced tech stack accents.',
    category: 'Developer',
    tags: ['Developer', 'ATS-friendly', 'Two-column'],
    atsFriendly: true,
    columns: 2,
    supportsPhoto: false,
    accentPresets: ['#047857', '#0284c7', '#10b981', '#6366f1', '#1e293b'],
    component: DeveloperLayout
  },
  {
    id: 'bold_header',
    name: 'Impact Header Block',
    description: 'Eye-catching colored top header block featuring name and integrated contact info.',
    category: 'Creative',
    tags: ['Creative', 'Single-column'],
    atsFriendly: false,
    columns: 1,
    supportsPhoto: true,
    accentPresets: ['#be123c', '#1e3a8a', '#0f766e', '#7c3aed', '#b45309'],
    component: BoldHeaderLayout
  },
  {
    id: 'compact_dense',
    name: 'High-Density Single Page',
    description: 'Engineered for dense resumes with multiple projects, skills, and certifications.',
    category: 'Minimal',
    tags: ['ATS-friendly', 'Minimal', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#334155', '#1e293b', '#0f172a', '#475569'],
    component: CompactDenseLayout
  },
  {
    id: 'academic_intern',
    name: 'Research & Honors',
    description: 'Academic orientation highlighting coursework, research papers, awards, and project achievements.',
    category: 'Academic',
    tags: ['Academic', 'ATS-friendly', 'Single-column'],
    atsFriendly: true,
    columns: 1,
    supportsPhoto: false,
    accentPresets: ['#1e3a8a', '#831843', '#0f766e', '#1e293b', '#581c87'],
    component: AcademicInternLayout
  }
];

/**
 * Resolves a template entry by id with automatic fallback to 'modern'
 */
export function resolveTemplate(templateId = 'modern') {
  if (!templateId) return TEMPLATES_REGISTRY[0];
  const found = TEMPLATES_REGISTRY.find(t => t.id.toLowerCase() === templateId.toLowerCase());
  return found || TEMPLATES_REGISTRY[0];
}

/**
 * Filter categories available for the Canva-style picker
 */
export const TEMPLATE_FILTER_CATEGORIES = [
  'All',
  'ATS-friendly',
  'Fresher',
  'Developer',
  'Sidebar',
  'Two-column',
  'Minimal',
  'Creative'
];
