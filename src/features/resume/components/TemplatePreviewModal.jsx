import React from 'react';
import { X, Check, CheckCircle2, ShieldCheck, Palette } from 'lucide-react';

/**
 * Full-scale Preview Modal
 * Allows students to inspect any template at high resolution / readable size
 * before selecting it.
 */
export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  resumeData,
  selectedAccent,
  onSelectAccent,
  isSelected,
  onSelectTemplate
}) {
  if (!isOpen || !template) return null;

  const TemplateComponent = template.component;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-outfit">
                {template.name}
              </h2>
              {template.atsFriendly ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> ATS-Friendly
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                  Visual Layout
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              {template.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectTemplate(template.id, selectedAccent);
                onClose();
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md ${
                isSelected
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" /> Selected Template
                </>
              ) : (
                <>
                  <span>Select This Template</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Palette Strip */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Palette className="w-3.5 h-3.5 text-purple-600" />
            <span>Accent Themes:</span>
            <div className="flex items-center gap-1.5 ml-1">
              {template.accentPresets?.map((color, i) => (
                <button
                  key={i}
                  onClick={() => onSelectAccent(color)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    selectedAccent === color
                      ? 'scale-125 border-slate-900 shadow-sm'
                      : 'border-white hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Scroll inside to view full document
          </span>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/40 flex justify-center">
          <div className="w-full max-w-[210mm] bg-white shadow-xl rounded-none border border-slate-300 overflow-hidden">
            <TemplateComponent
              data={resumeData}
              options={{
                accentColor: selectedAccent,
                spacing: 'normal',
                fontScale: 'medium'
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
