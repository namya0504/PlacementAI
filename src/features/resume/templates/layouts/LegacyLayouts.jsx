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
 * Modern Template (Legacy 'modern' ID)
 * Clean single-column layout with refined accent touches.
 */
export function ModernTemplate({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('navy', options);
  const { personalInfo = {}, role = '', summary = '', experience = [], education = [], skills = [], projects = [], certificates = [] } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  return (
    <div
      className={`w-full bg-white text-slate-800 ${spacing.pagePadding} space-y-6 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className={`${fonts.name} font-extrabold tracking-tight text-slate-900 font-outfit uppercase`}>
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {role && (
            <p className={`${fonts.role} font-bold tracking-wider uppercase mt-0.5`} style={{ color: theme.accent }}>
              {role}
            </p>
          )}
        </div>
        <ContactRow personal={personalInfo} accentColor={theme.accent} variant="column" />
      </div>

      {/* Summary */}
      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <SectionTitle title="Professional Summary" accentColor={theme.accent} styleVariant="line" />
          <p className={`${fonts.body} text-slate-700`}>{summary || personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <SectionTitle title="Experience" accentColor={theme.accent} styleVariant="line" />
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
          <SectionTitle title="Projects" accentColor={theme.accent} styleVariant="line" />
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <SectionTitle title="Education" accentColor={theme.accent} styleVariant="line" />
          <div className={spacing.itemGap}>
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <SectionTitle title="Technical Skills" accentColor={theme.accent} styleVariant="line" />
          <SkillList skills={skills} variant="comma" accentColor={theme.accent} />
        </div>
      )}

      {/* Certifications */}
      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <SectionTitle title="Certifications" accentColor={theme.accent} styleVariant="line" />
          <ul className="text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
            {validCert.map((c, i) => (
              <li key={i}>{typeof c === 'string' ? c : c?.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Professional Template (Legacy 'professional' ID)
 * Two-column corporate layout with sidebar for skills & credentials.
 */
export function ProfessionalTemplate({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('charcoal', options);
  const { personalInfo = {}, role = '', summary = '', experience = [], education = [], skills = [], projects = [], certificates = [] } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  return (
    <div
      className={`w-full bg-white text-slate-800 ${spacing.pagePadding} space-y-6 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      {/* Header */}
      <div className="pb-3 border-b-2" style={{ borderColor: theme.accent }}>
        <h1 className={`${fonts.name} font-bold text-slate-900 tracking-tight`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && (
          <p className={`${fonts.role} font-semibold uppercase tracking-wider text-slate-600 mt-0.5`}>
            {role}
          </p>
        )}
        <div className="mt-2">
          <ContactRow personal={personalInfo} accentColor={theme.accent} variant="row" />
        </div>
      </div>

      {/* Summary */}
      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className={`${fonts.body} text-slate-700 italic`}>
            {summary || personalInfo.summary}
          </p>
        </div>
      )}

      {/* Two Column Body */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="col-span-8 space-y-5">
          {!hiddenSections.includes('experience') && validExp.length > 0 && (
            <div>
              <SectionTitle title="Experience" accentColor={theme.accent} styleVariant="bar" />
              <div className={spacing.itemGap}>
                {validExp.map(exp => (
                  <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor={theme.accent} />
                ))}
              </div>
            </div>
          )}

          {!hiddenSections.includes('projects') && validProjects.length > 0 && (
            <div>
              <SectionTitle title="Projects" accentColor={theme.accent} styleVariant="bar" />
              <div className={spacing.itemGap}>
                {validProjects.map(proj => (
                  <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side Column */}
        <div className="col-span-4 space-y-5 border-l border-slate-100 pl-4">
          {!hiddenSections.includes('education') && validEdu.length > 0 && (
            <div>
              <SectionTitle title="Education" accentColor={theme.accent} styleVariant="bar" />
              <div className="space-y-2">
                {validEdu.map(edu => (
                  <div key={edu.id || edu.degree} className="text-[11px]">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.college}</div>
                    <div className="text-[10px] text-slate-500">{edu.year} {edu.cgpa ? `• GPA: ${edu.cgpa}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hiddenSections.includes('skills') && skills.length > 0 && (
            <div>
              <SectionTitle title="Skills" accentColor={theme.accent} styleVariant="bar" />
              <SkillList skills={skills} variant="tags" accentColor={theme.accent} />
            </div>
          )}

          {!hiddenSections.includes('certificates') && validCert.length > 0 && (
            <div>
              <SectionTitle title="Certifications" accentColor={theme.accent} styleVariant="bar" />
              <ul className="text-[10px] text-slate-700 space-y-1">
                {validCert.map((c, i) => (
                  <li key={i} className="border-l-2 pl-2" style={{ borderColor: theme.accent }}>
                    {typeof c === 'string' ? c : c?.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal Template (Legacy 'minimal' ID)
 * Strict, distraction-free monochrome ATS layout.
 */
export function MinimalTemplate({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('monochrome', options);
  const { personalInfo = {}, role = '', summary = '', experience = [], education = [], skills = [], projects = [], certificates = [] } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  return (
    <div
      className={`w-full bg-white text-slate-900 ${spacing.pagePadding} space-y-5 font-mono min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      {/* Centered Minimal Header */}
      <div className="text-center pb-3 border-b border-slate-300">
        <h1 className={`${fonts.name} font-bold tracking-tight text-slate-900 uppercase`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && (
          <p className="text-xs font-medium text-slate-600 tracking-wider mt-0.5">
            {role}
          </p>
        )}
        <div className="mt-1 flex justify-center">
          <ContactRow personal={personalInfo} accentColor="#111827" variant="row" />
        </div>
      </div>

      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Summary
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700">{summary || personalInfo.summary}</p>
        </div>
      )}

      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Education
          </div>
          <div className="space-y-1.5">
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor="#111827" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Technical Skills
          </div>
          <SkillList skills={skills} variant="comma" accentColor="#111827" />
        </div>
      )}

      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Experience
          </div>
          <div className="space-y-2">
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor="#111827" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Projects
          </div>
          <div className="space-y-2">
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor="#111827" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Certifications
          </div>
          <div className="text-[11px] text-slate-700">
            {validCert.map(c => typeof c === 'string' ? c : c?.name).join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Creative Template (Legacy 'creative' ID)
 * Vibrant accent blocks and modern portfolio aesthetics.
 */
export function CreativeTemplate({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('burgundy', options);
  const { personalInfo = {}, role = '', summary = '', experience = [], education = [], skills = [], projects = [], certificates = [] } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  return (
    <div
      className={`w-full bg-white text-slate-800 ${spacing.pagePadding} space-y-6 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      {/* Creative Gradient Header with Optional Photo */}
      <div className="p-5 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm" style={{ backgroundColor: theme.accent }}>
        <div className="space-y-1 text-center sm:text-left">
          <h1 className={`${fonts.name} font-black tracking-tight font-outfit uppercase`}>
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {role && (
            <p className="text-xs font-bold tracking-widest uppercase opacity-90">
              {role}
            </p>
          )}
          <div className="pt-2">
            <ContactRow personal={personalInfo} accentColor="#ffffff" textColor="text-white/90" variant="row" />
          </div>
        </div>
        <ProfilePhoto photoUrl={personalInfo.photoUrl} name={personalInfo.fullName} size="w-20 h-20" />
      </div>

      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <SectionTitle title="About Me" accentColor={theme.accent} styleVariant="under" />
          <p className={`${fonts.body} text-slate-700`}>{summary || personalInfo.summary}</p>
        </div>
      )}

      {/* Two Columns */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-5">
          {!hiddenSections.includes('projects') && validProjects.length > 0 && (
            <div>
              <SectionTitle title="Featured Projects" accentColor={theme.accent} styleVariant="under" />
              <div className={spacing.itemGap}>
                {validProjects.map(proj => (
                  <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
                ))}
              </div>
            </div>
          )}

          {!hiddenSections.includes('experience') && validExp.length > 0 && (
            <div>
              <SectionTitle title="Experience" accentColor={theme.accent} styleVariant="under" />
              <div className={spacing.itemGap}>
                {validExp.map(exp => (
                  <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor={theme.accent} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-5">
          {!hiddenSections.includes('skills') && skills.length > 0 && (
            <div>
              <SectionTitle title="Skills & Tech" accentColor={theme.accent} styleVariant="under" />
              <SkillList skills={skills} variant="tags" accentColor={theme.accent} />
            </div>
          )}

          {!hiddenSections.includes('education') && validEdu.length > 0 && (
            <div>
              <SectionTitle title="Education" accentColor={theme.accent} styleVariant="under" />
              <div className="space-y-2">
                {validEdu.map(edu => (
                  <EducationItem key={edu.id || edu.degree} edu={edu} accentColor={theme.accent} />
                ))}
              </div>
            </div>
          )}

          {!hiddenSections.includes('certificates') && validCert.length > 0 && (
            <div>
              <SectionTitle title="Certifications" accentColor={theme.accent} styleVariant="under" />
              <ul className="text-[10px] text-slate-700 space-y-1">
                {validCert.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <span>{typeof c === 'string' ? c : c?.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
