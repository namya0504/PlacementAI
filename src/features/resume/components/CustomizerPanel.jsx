import React from 'react';
import { resolveTemplate, TEMPLATES_REGISTRY } from '../templates';
import {
  Palette,
  Sliders,
  Type,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

/**
 * Customizer Panel (Step 3: Preview & Download)
 * Allows students to customize accent color presets, spacing scale, font size,
 * section visibility, and switch templates live without content loss.
 */
export function CustomizerPanel({
  templateId = 'modern',
  onChangeTemplate,
  options = {},
  onChangeOptions
}) {
  const currentTemplate = resolveTemplate(templateId);

  const accentColor = options.accentColor || currentTemplate.accentPresets?.[0] || '#1e3a8a';
  const spacing = options.spacing || 'normal';
  const fontScale = options.fontScale || 'medium';
  const hiddenSections = Array.isArray(options.hiddenSections) ? options.hiddenSections : [];

  const handleToggleSection = (sectionKey) => {
    const updated = hiddenSections.includes(sectionKey)
      ? hiddenSections.filter(s => s !== sectionKey)
      : [...hiddenSections, sectionKey];
    onChangeOptions({ ...options, hiddenSections: updated });
  };

  const handleSetSpacing = (s) => {
    onChangeOptions({ ...options, spacing: s });
  };

  const handleSetFontScale = (f) => {
    onChangeOptions({ ...options, fontScale: f });
  };

  const handleSetAccentColor = (color) => {
    onChangeOptions({ ...options, accentColor: color });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-sm text-slate-900 font-outfit">
            Customize Design
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Live Preview</span>
      </div>

      {/* ATS Awareness Notice */}
      {!currentTemplate.atsFriendly ? (
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Visual Design Notice:</span> This design is visual. For online applications through company portals, an ATS-friendly template is safer.
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">ATS Optimized:</span> Single or clean structured columns ensuring clean readability by resume parsing engines.
          </div>
        </div>
      )}

      {/* Template Switcher Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Template Design
        </label>
        <div className="relative">
          <select
            value={templateId}
            onChange={(e) => {
              const newTplId = e.target.value;
              onChangeTemplate(newTplId);
              const tpl = resolveTemplate(newTplId);
              if (tpl?.accentPresets?.[0]) {
                onChangeOptions({ ...options, accentColor: tpl.accentPresets[0] });
              }
            }}
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 pr-8"
          >
            {TEMPLATES_REGISTRY.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category} {t.atsFriendly ? '• ATS' : ''})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Accent Color Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Accent Palette
          </label>
          <span className="text-[10px] text-slate-400 font-mono uppercase">{accentColor}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentTemplate.accentPresets?.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSetAccentColor(c)}
              className={`w-7 h-7 rounded-xl border-2 transition-transform ${
                accentColor.toLowerCase() === c.toLowerCase()
                  ? 'scale-110 border-slate-900 shadow-md ring-2 ring-purple-500/30'
                  : 'border-white hover:scale-105 shadow-xs'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Spacing Controls */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Spacing Density
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'compact', label: 'Compact' },
            { id: 'normal', label: 'Normal' },
            { id: 'relaxed', label: 'Relaxed' }
          ].map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSetSpacing(s.id)}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                spacing === s.id
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Controls */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Typography Scale
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'small', label: 'Small' },
            { id: 'medium', label: 'Medium' },
            { id: 'large', label: 'Large' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSetFontScale(f.id)}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                fontScale === f.id
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Visibility Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Section Visibility
        </label>
        <div className="space-y-1.5">
          {[
            { key: 'summary', label: 'Summary / Objective' },
            { key: 'experience', label: 'Experience & Internships' },
            { key: 'projects', label: 'Projects' },
            { key: 'education', label: 'Education' },
            { key: 'skills', label: 'Skills' },
            { key: 'certificates', label: 'Certificates' }
          ].map(sec => {
            const isHidden = hiddenSections.includes(sec.key);
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => handleToggleSection(sec.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition ${
                  isHidden
                    ? 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-200'
                }`}
              >
                <span>{sec.label}</span>
                {isHidden ? (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
