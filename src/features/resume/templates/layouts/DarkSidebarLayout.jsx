import React from 'react';
import { resolveTokens } from '../tokens';
import {
  SectionTitle,
  ContactRow,
  SkillList,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  ProfilePhoto
} from '../components/SharedComponents';

/**
 * Dark Sidebar Layout (Layout B)
 * Features a full-height colored left sidebar and a crisp white main column.
 * Themes: Forest Green, Navy, Charcoal, Burgundy, and Light (Ink-Saver).
 */
export function DarkSidebarLayout({ data = {}, options = {}, themePreset = 'forest' }) {
  const isLight = themePreset === 'light';
  const { theme, spacing, fonts, hiddenSections } = resolveTokens(themePreset, options);
  const {
    personalInfo = {},
    role = '',
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certificates = []
  } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  // Sidebar color styling
  const sidebarBg = isLight ? '#f1f5f9' : theme.accent;
  const sidebarText = isLight ? 'text-slate-800' : 'text-white';
  const sidebarMuted = isLight ? 'text-slate-600' : 'text-white/80';
  const sidebarHeading = isLight ? 'text-slate-900' : 'text-white';
  const sidebarBorder = isLight ? 'border-slate-300' : 'border-white/20';

  return (
    <div
      className="w-full bg-white text-slate-800 font-sans flex flex-row items-stretch box-border"
      style={{ minHeight: '297mm' }}
    >
      {/* FULL-HEIGHT LEFT SIDEBAR */}
      <div
        className={`w-1/3 p-6 sm:p-7 shrink-0 space-y-6 flex flex-col justify-start self-stretch ${sidebarText}`}
        style={{ backgroundColor: sidebarBg, minHeight: '297mm' }}
      >
        {/* Profile Photo (if available) */}
        {personalInfo.photoUrl && (
          <div className="flex justify-start">
            <ProfilePhoto
              photoUrl={personalInfo.photoUrl}
              name={personalInfo.fullName}
              size="w-24 h-24"
              accentColor="#ffffff"
            />
          </div>
        )}

        {/* Contact Info in Sidebar */}
        <div className="space-y-2">
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${sidebarHeading} border-b ${sidebarBorder} pb-1`}>
            Contact Details
          </h3>
          <ContactRow
            personal={personalInfo}
            accentColor={isLight ? theme.accent : '#ffffff'}
            textColor={sidebarMuted}
            variant="column"
          />
        </div>

        {/* Skills in Sidebar */}
        {!hiddenSections.includes('skills') && skills.length > 0 && (
          <div className="space-y-2">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${sidebarHeading} border-b ${sidebarBorder} pb-1`}>
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => {
                const name = typeof s === 'string' ? s : s?.name;
                return (
                  <span
                    key={i}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-white/10 border-white/20 text-white'
                    }`}
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {!hiddenSections.includes('education') && validEdu.length > 0 && (
          <div className="space-y-2">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${sidebarHeading} border-b ${sidebarBorder} pb-1`}>
              Education
            </h3>
            <div className="space-y-2 text-[11px]">
              {validEdu.map(edu => (
                <div key={edu.id || edu.degree} className="space-y-0.5">
                  <div className={`font-bold ${sidebarHeading}`}>{edu.degree}</div>
                  <div className={sidebarMuted}>{edu.college}</div>
                  <div className={`text-[10px] opacity-75`}>
                    {edu.year} {edu.cgpa ? `• GPA: ${edu.cgpa}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {!hiddenSections.includes('certificates') && validCert.length > 0 && (
          <div className="space-y-2">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${sidebarHeading} border-b ${sidebarBorder} pb-1`}>
              Certifications
            </h3>
            <ul className={`text-[10px] space-y-1 ${sidebarMuted}`}>
              {validCert.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-snug">
                  <span className="w-1 h-1 rounded-full bg-current shrink-0 mt-1.5" />
                  <span>{typeof c === 'string' ? c : c?.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* WHITE MAIN COLUMN */}
      <div
        className="w-2/3 p-6 sm:p-8 space-y-6 bg-white self-stretch flex flex-col justify-start"
        style={{ minHeight: '297mm' }}
      >
        {/* Main Column Header */}
        <div className="border-b border-slate-200 pb-3">
          <h1 className={`${fonts.name} font-black text-slate-900 tracking-tight font-outfit uppercase`}>
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {role && (
            <p
              className={`${fonts.role} font-bold uppercase tracking-wider mt-0.5`}
              style={{ color: theme.accent }}
            >
              {role}
            </p>
          )}
        </div>

        {/* Professional Summary */}
        {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
          <div>
            <SectionTitle
              title="About Me"
              accentColor={theme.accent}
              styleVariant="bar"
            />
            <p className={`${fonts.body} text-slate-700 leading-relaxed`}>
              {summary || personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {!hiddenSections.includes('experience') && validExp.length > 0 && (
          <div>
            <SectionTitle
              title="Experience"
              accentColor={theme.accent}
              styleVariant="bar"
            />
            <div className={spacing.itemGap}>
              {validExp.map(exp => (
                <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor={theme.accent} />
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {!hiddenSections.includes('projects') && validProjects.length > 0 && (
          <div>
            <SectionTitle
              title="Key Projects"
              accentColor={theme.accent}
              styleVariant="bar"
            />
            <div className={spacing.itemGap}>
              {validProjects.map(proj => (
                <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
