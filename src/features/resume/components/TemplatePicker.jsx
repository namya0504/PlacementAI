import React, { useState, useMemo } from 'react';
import {
  TEMPLATES_REGISTRY,
  TEMPLATE_FILTER_CATEGORIES
} from '../templates';
import { SAMPLE_RESUME_DATA } from '../templates/sampleData';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import {
  CheckCircle2,
  Eye,
  Sparkles,
  ShieldCheck,
  Check,
  SlidersHorizontal,
  User,
  Layers
} from 'lucide-react';

/**
 * Canva-style Resume Template Picker (Step 1)
 * Renders authentic live miniature previews of all registered templates,
 * interactive color dots, filter chips, recommended badges, and full-preview modal.
 */
export function TemplatePicker({
  selectedTemplateId = 'modern',
  onSelectTemplate,
  userResumeData = null,
  currentRole = '',
  selectedAccent = '',
  onSelectAccent
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [useSampleData, setUseSampleData] = useState(true);
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);
  
  // Per-card local accent color overrides (defaults to template's primary preset)
  const [cardAccents, setCardAccents] = useState(() => {
    const initial = {};
    TEMPLATES_REGISTRY.forEach(t => {
      initial[t.id] = t.accentPresets?.[0] || '#1e3a8a';
    });
    return initial;
  });

  // Calculate rule-based recommendation
  const recommendedTemplateIds = useMemo(() => {
    const recommended = new Set();
    const roleLower = (currentRole || userResumeData?.role || '').toLowerCase();
    const hasWorkExp = Array.isArray(userResumeData?.experience) && userResumeData.experience.some(e => e.title || e.company);
    const hasPhoto = Boolean(userResumeData?.personalInfo?.photoUrl);

    if (!hasWorkExp) {
      recommended.add('fresher_campus');
    }
    if (roleLower.includes('dev') || roleLower.includes('software') || roleLower.includes('engineer') || roleLower.includes('frontend') || roleLower.includes('backend')) {
      recommended.add('developer');
    }
    if (hasPhoto) {
      recommended.add('sidebar_navy');
      recommended.add('banner_amber');
    }
    if (recommended.size === 0) {
      recommended.add('modern');
    }
    return recommended;
  }, [currentRole, userResumeData]);

  // Data to render in live thumbnails
  const activeThumbnailData = useMemo(() => {
    if (useSampleData || !userResumeData) {
      return SAMPLE_RESUME_DATA;
    }
    return userResumeData;
  }, [useSampleData, userResumeData]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (activeFilter === 'All') return TEMPLATES_REGISTRY;
    if (activeFilter === 'ATS-friendly') {
      return TEMPLATES_REGISTRY.filter(t => t.atsFriendly);
    }
    return TEMPLATES_REGISTRY.filter(t => 
      t.tags?.some(tag => tag.toLowerCase() === activeFilter.toLowerCase()) ||
      t.category.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter]);

  const handleCardAccentClick = (e, templateId, color) => {
    e.stopPropagation();
    setCardAccents(prev => ({ ...prev, [templateId]: color }));
    if (templateId === selectedTemplateId && onSelectAccent) {
      onSelectAccent(color);
    }
  };

  return (
    <div className="space-y-6">
      {/* Picker Header & Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
            <span>Explore Resume Templates</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {filteredTemplates.length} Available
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any template to select it. Switch anytime without losing your information.
          </p>
        </div>

        {/* Data Toggle: Sample Data vs My Data */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setUseSampleData(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              useSampleData
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sample Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setUseSampleData(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              !useSampleData
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Data</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1 pl-1">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
        </span>
        {TEMPLATE_FILTER_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
              activeFilter === cat
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid: 4 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTemplates.map(template => {
          const isSelected = selectedTemplateId === template.id;
          const isRecommended = recommendedTemplateIds.has(template.id);
          const currentCardAccent = cardAccents[template.id] || template.accentPresets?.[0];
          const TemplateComponent = template.component;

          return (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template.id);
                if (onSelectAccent) onSelectAccent(currentCardAccent);
              }}
              className={`group bg-white rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden cursor-pointer relative shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-600/20'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              {/* Badges Overlay */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-1">
                  {isRecommended && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Recommended
                    </span>
                  )}
                  {template.atsFriendly && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shadow-xs flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> ATS
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Scaled Live Document Preview Thumbnail Container */}
              <div className="w-full h-56 bg-slate-50 border-b border-slate-100 overflow-hidden relative flex items-start justify-center p-2 group-hover:bg-slate-100/70 transition-colors">
                <div
                  className="bg-white shadow-md border border-slate-200 rounded pointer-events-none overflow-hidden"
                  style={{
                    width: '794px',
                    minHeight: '1123px',
                    transform: 'scale(0.22)',
                    transformOrigin: 'top center',
                    marginTop: '2px'
                  }}
                >
                  <TemplateComponent
                    data={activeThumbnailData}
                    options={{
                      accentColor: currentCardAccent,
                      spacing: 'compact',
                      fontScale: 'small'
                    }}
                  />
                </div>

                {/* Hover Action Overlay: "Quick Preview" */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewModalTemplate(template);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 font-bold text-xs shadow-md flex items-center gap-1.5 transition transform hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <span>Full Preview</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Info & Color Presets */}
              <div className="p-4 space-y-2.5 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 font-outfit truncate">
                      {template.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize shrink-0">
                      {template.columns}-col
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {template.description}
                  </p>
                </div>

                {/* Interactive Color Dots */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {template.accentPresets?.slice(0, 5).map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleCardAccentClick(e, template.id, color)}
                        className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                          currentCardAccent === color
                            ? 'scale-125 border-slate-900 shadow-xs'
                            : 'border-white hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  <span className={`text-[11px] font-bold ${isSelected ? 'text-purple-600' : 'text-slate-400'}`}>
                    {isSelected ? 'Active' : 'Select'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewModalTemplate && (
        <TemplatePreviewModal
          isOpen={Boolean(previewModalTemplate)}
          onClose={() => setPreviewModalTemplate(null)}
          template={previewModalTemplate}
          resumeData={activeThumbnailData}
          selectedAccent={cardAccents[previewModalTemplate.id] || previewModalTemplate.accentPresets?.[0]}
          onSelectAccent={(color) => {
            setCardAccents(prev => ({ ...prev, [previewModalTemplate.id]: color }));
            if (onSelectAccent) onSelectAccent(color);
          }}
          isSelected={selectedTemplateId === previewModalTemplate.id}
          onSelectTemplate={(id, accent) => {
            onSelectTemplate(id);
            if (onSelectAccent && accent) onSelectAccent(accent);
          }}
        />
      )}
    </div>
  );
}
