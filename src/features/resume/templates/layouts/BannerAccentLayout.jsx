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
 * Banner + Accent Strip Layout (Layout A)
 * Features an edge vertical accent strip, full-width shaded summary band,
 * round marker section titles, and 2-column layout (narrow left, wide right).
 */
export function BannerAccentLayout({ data = {}, options = {}, themePreset = 'amber' }) {
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

  return (
    <div
      className="w-full bg-white text-slate-800 font-sans relative overflow-hidden box-border flex flex-col justify-start"
      style={{ minHeight: '297mm' }}
    >
      {/* Thin vertical accent strip running along the left page edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 z-10"
        style={{ backgroundColor: theme.accent }}
      />

      <div className={`pl-6 sm:pl-8 pr-6 sm:pr-8 pt-6 pb-6 ${spacing.itemGap}`}>
        {/* Header Block: Large Name on Left, Contact Block with SVG icons on Right */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <h1 className={`${fonts.name} font-black text-slate-900 tracking-tight font-outfit uppercase`}>
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            {role && (
              <p
                className={`${fonts.role} font-bold uppercase tracking-wider`}
                style={{ color: theme.accent }}
              >
                {role}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ContactRow personal={personalInfo} accentColor={theme.accent} variant="column" />
            <ProfilePhoto
              photoUrl={personalInfo.photoUrl}
              name={personalInfo.fullName}
              size="w-16 h-16 sm:w-20 sm:h-20"
              accentColor={theme.accent}
            />
          </div>
        </div>

        {/* Full-width shaded band for the Summary */}
        {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
          <div
            className="my-3 p-3.5 rounded-lg border text-slate-800"
            style={{
              backgroundColor: theme.bgLight,
              borderColor: theme.border
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: theme.accent }}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                Professional Profile
              </span>
            </div>
            <p className={`${fonts.body} text-slate-700 leading-relaxed pl-4`}>
              {summary || personalInfo.summary}
            </p>
          </div>
        )}

        {/* Body Grid: Narrow Left Column (Skills, Education, Certs), Wide Right Column (Exp, Projects) */}
        <div className="grid grid-cols-12 gap-6 pt-1">
          {/* Narrow Left Column (4 cols) */}
          <div className="col-span-12 sm:col-span-4 space-y-4 pr-1">
            {/* Education */}
            {!hiddenSections.includes('education') && validEdu.length > 0 && (
              <div>
                <SectionTitle
                  title="Education"
                  accentColor={theme.accent}
                  styleVariant="marker"
                />
                <div className="space-y-2.5">
                  {validEdu.map(edu => (
                    <div key={edu.id || edu.degree} className="text-[11px] space-y-0.5">
                      <div className="font-bold text-slate-900 leading-snug">{edu.degree}</div>
                      <div className="text-slate-600 font-medium">{edu.college}</div>
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>{edu.year}</span>
                        {edu.cgpa && (
                          <span className="font-bold" style={{ color: theme.accent }}>
                            GPA: {edu.cgpa}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {!hiddenSections.includes('skills') && skills.length > 0 && (
              <div>
                <SectionTitle
                  title="Core Competencies"
                  accentColor={theme.accent}
                  styleVariant="marker"
                />
                <SkillList skills={skills} variant="tags" accentColor={theme.accent} />
              </div>
            )}

            {/* Certifications */}
            {!hiddenSections.includes('certificates') && validCert.length > 0 && (
              <div>
                <SectionTitle
                  title="Certifications"
                  accentColor={theme.accent}
                  styleVariant="marker"
                />
                <ul className="text-[10px] text-slate-700 space-y-1.5">
                  {validCert.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <span>{typeof c === 'string' ? c : c?.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Wide Right Column (8 cols): Experience & Projects */}
          <div className="col-span-12 sm:col-span-8 space-y-4 border-l border-slate-100 pl-4 sm:pl-6">
            {/* Experience */}
            {!hiddenSections.includes('experience') && validExp.length > 0 && (
              <div>
                <SectionTitle
                  title="Experience"
                  accentColor={theme.accent}
                  styleVariant="marker"
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
                  styleVariant="marker"
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
      </div>
    </div>
  );
}
