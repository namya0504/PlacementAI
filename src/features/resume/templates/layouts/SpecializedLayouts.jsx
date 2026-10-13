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
 * C1. Minimal Single-Column (ATS-Safe)
 * Guaranteed pure ATS compatibility with simple semantic standard hierarchy.
 */
export function MinimalSingleLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('monochrome', options);
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
      className={`w-full bg-white text-slate-900 ${spacing.pagePadding} space-y-5 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      <div className="border-b border-slate-900 pb-2">
        <h1 className={`${fonts.name} font-bold text-slate-900 tracking-tight`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && <p className="text-xs font-semibold text-slate-700 uppercase mt-0.5">{role}</p>}
        <div className="mt-1">
          <ContactRow personal={personalInfo} accentColor="#0f172a" variant="row" />
        </div>
      </div>

      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
            Professional Summary
          </h2>
          <p className={`${fonts.body} text-slate-700 leading-relaxed`}>{summary || personalInfo.summary}</p>
        </div>
      )}

      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
            Technical Skills
          </h2>
          <SkillList skills={skills} variant="comma" accentColor="#0f172a" />
        </div>
      )}

      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Experience
          </h2>
          <div className={spacing.itemGap}>
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor="#0f172a" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Projects
          </h2>
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor="#0f172a" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className={spacing.itemGap}>
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor="#0f172a" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
            Certifications
          </h2>
          <p className="text-[11px] text-slate-700">
            {validCert.map(c => (typeof c === 'string' ? c : c?.name)).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * C2. Classic Serif Single-Column (ATS-Safe)
 * Traditional academic & corporate look with serif typography and centered header.
 */
export function ClassicSerifLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('navy', options);
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
      className={`w-full bg-white text-slate-900 ${spacing.pagePadding} space-y-5 font-serif min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      <div className="text-center border-b border-slate-400 pb-2.5">
        <h1 className={`${fonts.name} font-bold text-slate-900 tracking-normal`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && <p className="text-xs italic text-slate-600 mt-0.5">{role}</p>}
        <div className="mt-1.5 flex justify-center font-sans">
          <ContactRow personal={personalInfo} accentColor={theme.accent} variant="row" />
        </div>
      </div>

      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-1 font-sans">
            Profile Summary
          </h2>
          <p className={`${fonts.body} text-slate-800 leading-relaxed font-serif`}>{summary || personalInfo.summary}</p>
        </div>
      )}

      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
            Education
          </h2>
          <div className={spacing.itemGap}>
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
            Experience
          </h2>
          <div className={spacing.itemGap}>
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
            Projects
          </h2>
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-1 font-sans">
            Skills & Knowledge
          </h2>
          <SkillList skills={skills} variant="comma" accentColor={theme.accent} />
        </div>
      )}

      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-0.5 mb-1 font-sans">
            Honors & Certifications
          </h2>
          <p className="text-[11px] text-slate-800">
            {validCert.map(c => (typeof c === 'string' ? c : c?.name)).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * C3. Timeline Layout
 * Visual vertical connector line for milestone progression.
 */
export function TimelineLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('teal', options);
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
      className={`w-full bg-white text-slate-800 ${spacing.pagePadding} space-y-6 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      <div className="pb-3 border-b-2" style={{ borderColor: theme.accent }}>
        <h1 className={`${fonts.name} font-black text-slate-900 tracking-tight font-outfit uppercase`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && (
          <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: theme.accent }}>
            {role}
          </p>
        )}
        <div className="mt-2">
          <ContactRow personal={personalInfo} accentColor={theme.accent} variant="row" />
        </div>
      </div>

      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <SectionTitle title="Summary" accentColor={theme.accent} styleVariant="bar" />
          <p className={`${fonts.body} text-slate-700`}>{summary || personalInfo.summary}</p>
        </div>
      )}

      {/* Timeline Experience */}
      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <SectionTitle title="Career Journey" accentColor={theme.accent} styleVariant="bar" />
          <div className="relative pl-5 border-l-2 ml-2 space-y-4" style={{ borderColor: `${theme.accent}40` }}>
            {validExp.map(exp => (
              <div key={exp.id || exp.title} className="relative">
                <span
                  className="absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.accent }}
                />
                <ExperienceItem exp={exp} accentColor={theme.accent} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <SectionTitle title="Key Engineering Projects" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!hiddenSections.includes('education') && validEdu.length > 0 && (
          <div>
            <SectionTitle title="Education" accentColor={theme.accent} styleVariant="bar" />
            <div className="space-y-2">
              {validEdu.map(edu => (
                <EducationItem key={edu.id || edu.degree} edu={edu} accentColor={theme.accent} />
              ))}
            </div>
          </div>
        )}

        {!hiddenSections.includes('skills') && skills.length > 0 && (
          <div>
            <SectionTitle title="Core Skills" accentColor={theme.accent} styleVariant="bar" />
            <SkillList skills={skills} variant="tags" accentColor={theme.accent} />
          </div>
        )}
      </div>

      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <SectionTitle title="Certificates" accentColor={theme.accent} styleVariant="bar" />
          <div className="text-[11px] text-slate-700">
            {validCert.map(c => (typeof c === 'string' ? c : c?.name)).join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * C4. Fresher / Campus Layout (ATS-Safe)
 * Optimized specifically for students with little/no formal work experience.
 * Puts Education & Projects first, groups skills prominently.
 */
export function FresherCampusLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('navy', options);
  const {
    personalInfo = {},
    role = '',
    summary = '',
    education = [],
    skills = [],
    projects = [],
    experience = [],
    certificates = []
  } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  return (
    <div
      className={`w-full bg-white text-slate-900 ${spacing.pagePadding} space-y-5 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      {/* Header */}
      <div className="border-b-2 pb-3" style={{ borderColor: theme.accent }}>
        <h1 className={`${fonts.name} font-black text-slate-900 tracking-tight font-outfit uppercase`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && (
          <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: theme.accent }}>
            {role}
          </p>
        )}
        <div className="mt-2">
          <ContactRow personal={personalInfo} accentColor={theme.accent} variant="row" />
        </div>
      </div>

      {/* Summary / Objective */}
      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <SectionTitle title="Career Objective" accentColor={theme.accent} styleVariant="bar" />
          <p className={`${fonts.body} text-slate-700 leading-relaxed`}>{summary || personalInfo.summary}</p>
        </div>
      )}

      {/* Education First for Freshers */}
      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <SectionTitle title="Education" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills Prominently Displayed */}
      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <SectionTitle title="Technical Competencies" accentColor={theme.accent} styleVariant="bar" />
          <SkillList skills={skills} variant="tags" accentColor={theme.accent} />
        </div>
      )}

      {/* Academic & Personal Projects */}
      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <SectionTitle title="Academic & Personal Projects" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {/* Internships (If any) */}
      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <SectionTitle title="Internships & Work Experience" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <SectionTitle title="Certifications & Achievements" accentColor={theme.accent} styleVariant="bar" />
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
 * C5. Developer Layout
 * Geared for programmers: skills as tags, GitHub / project links emphasized, mono accents.
 */
export function DeveloperLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('forest', options);
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
      className={`w-full bg-white text-slate-800 ${spacing.pagePadding} space-y-6 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className={`${fonts.name} font-black text-slate-900 tracking-tight font-mono`}>
            {personalInfo.fullName || 'YOUR_NAME'}
          </h1>
          {role && (
            <p className="text-xs font-mono font-bold text-emerald-700 tracking-wider mt-0.5">
              &lt;{role} /&gt;
            </p>
          )}
        </div>
        <ContactRow personal={personalInfo} accentColor="#047857" variant="column" />
      </div>

      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-xs font-mono font-bold text-slate-900 mb-2">// TECHNICAL_STACK</div>
          <SkillList skills={skills} variant="tags" accentColor="#047857" />
        </div>
      )}

      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <SectionTitle title="Open Source & Engineered Projects" accentColor="#047857" styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor="#047857" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <SectionTitle title="Work Experience" accentColor="#047857" styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor="#047857" />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!hiddenSections.includes('education') && validEdu.length > 0 && (
          <div>
            <SectionTitle title="Education" accentColor="#047857" styleVariant="bar" />
            <div className="space-y-1.5">
              {validEdu.map(edu => (
                <EducationItem key={edu.id || edu.degree} edu={edu} accentColor="#047857" />
              ))}
            </div>
          </div>
        )}

        {!hiddenSections.includes('certificates') && validCert.length > 0 && (
          <div>
            <SectionTitle title="Certifications" accentColor="#047857" styleVariant="bar" />
            <ul className="text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
              {validCert.map((c, i) => (
                <li key={i}>{typeof c === 'string' ? c : c?.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * C6. Bold Header Layout
 * High-impact colored header block at the top with name and credentials.
 */
export function BoldHeaderLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('coral', options);
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
      className="w-full bg-white text-slate-800 font-sans min-h-[297mm] box-border flex flex-col justify-start"
      style={{ minHeight: '297mm' }}
    >
      {/* Bold Full-Width Header */}
      <div className="p-6 sm:p-8 text-white space-y-2 shadow-sm" style={{ backgroundColor: theme.accent }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`${fonts.name} font-black tracking-tight font-outfit uppercase`}>
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            {role && (
              <p className="text-xs font-bold uppercase tracking-widest opacity-90 mt-0.5">
                {role}
              </p>
            )}
          </div>
          <ProfilePhoto
            photoUrl={personalInfo.photoUrl}
            name={personalInfo.fullName}
            size="w-20 h-20"
            accentColor="#ffffff"
          />
        </div>
        <div className="pt-2 border-t border-white/20">
          <ContactRow personal={personalInfo} accentColor="#ffffff" textColor="text-white/95" variant="row" />
        </div>
      </div>

      <div className={`p-6 sm:p-8 space-y-5`}>
        {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
          <div>
            <SectionTitle title="Profile" accentColor={theme.accent} styleVariant="under" />
            <p className={`${fonts.body} text-slate-700 leading-relaxed`}>{summary || personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-8 space-y-5">
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

            {!hiddenSections.includes('projects') && validProjects.length > 0 && (
              <div>
                <SectionTitle title="Key Projects" accentColor={theme.accent} styleVariant="under" />
                <div className={spacing.itemGap}>
                  {validProjects.map(proj => (
                    <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 sm:col-span-4 space-y-5">
            {!hiddenSections.includes('skills') && skills.length > 0 && (
              <div>
                <SectionTitle title="Skills" accentColor={theme.accent} styleVariant="under" />
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
    </div>
  );
}

/**
 * C7. Compact Dense Layout (ATS-Safe)
 * High information density engineered to pack extensive skills, projects and experience on one page.
 */
export function CompactDenseLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('charcoal', { ...options, spacing: 'compact' });
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
      className="w-full bg-white text-slate-900 p-8 space-y-4 font-sans text-xs min-h-[297mm] box-border flex flex-col justify-start"
      style={{ minHeight: '297mm' }}
    >
      <div className="border-b border-slate-400 pb-1.5 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-outfit uppercase">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {role && <span className="text-[11px] font-bold text-slate-600 uppercase">{role}</span>}
        </div>
        <ContactRow personal={personalInfo} accentColor="#334155" variant="column" />
      </div>

      {!hiddenSections.includes('summary') && (summary || personalInfo.summary) && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Summary</div>
          <p className="text-[11px] leading-snug text-slate-700 mt-0.5">{summary || personalInfo.summary}</p>
        </div>
      )}

      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Skills</div>
          <SkillList skills={skills} variant="comma" accentColor="#334155" className="mt-0.5" />
        </div>
      )}

      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-1">Experience</div>
          <div className="space-y-1">
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor="#334155" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-1">Projects</div>
          <div className="space-y-1">
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor="#334155" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5 mb-1">Education</div>
          <div className="space-y-1">
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor="#334155" />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">Certificates</div>
          <p className="text-[10px] text-slate-700 mt-0.5">
            {validCert.map(c => (typeof c === 'string' ? c : c?.name)).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * C8. Academic / Internship Layout (ATS-Safe)
 * Highlights education, achievements, projects and coursework first.
 */
export function AcademicInternLayout({ data = {}, options = {} }) {
  const { theme, spacing, fonts, hiddenSections } = resolveTokens('navy', options);
  const {
    personalInfo = {},
    role = '',
    summary = '',
    education = [],
    projects = [],
    skills = [],
    experience = [],
    certificates = []
  } = data;

  const validProjects = projects.filter(p => p && (p.title || p.description));
  const validExp = experience.filter(e => e && (e.title || e.company));
  const validEdu = education.filter(ed => ed && (ed.degree || ed.college));
  const validCert = certificates.filter(Boolean);

  return (
    <div
      className={`w-full bg-white text-slate-900 ${spacing.pagePadding} space-y-5 font-sans min-h-[297mm] box-border flex flex-col justify-start`}
      style={{ minHeight: '297mm' }}
    >
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h1 className={`${fonts.name} font-bold text-slate-900 tracking-tight`}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {role && <p className="text-xs font-semibold text-slate-600 tracking-wide mt-0.5">{role}</p>}
        <div className="mt-1.5 flex justify-center">
          <ContactRow personal={personalInfo} accentColor={theme.accent} variant="row" />
        </div>
      </div>

      {!hiddenSections.includes('education') && validEdu.length > 0 && (
        <div>
          <SectionTitle title="Academic Background" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validEdu.map(edu => (
              <EducationItem key={edu.id || edu.degree} edu={edu} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('projects') && validProjects.length > 0 && (
        <div>
          <SectionTitle title="Research & Key Projects" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validProjects.map(proj => (
              <ProjectItem key={proj.id || proj.title} project={proj} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('skills') && skills.length > 0 && (
        <div>
          <SectionTitle title="Technical & Analytical Skills" accentColor={theme.accent} styleVariant="bar" />
          <SkillList skills={skills} variant="tags" accentColor={theme.accent} />
        </div>
      )}

      {!hiddenSections.includes('experience') && validExp.length > 0 && (
        <div>
          <SectionTitle title="Internships & Practical Training" accentColor={theme.accent} styleVariant="bar" />
          <div className={spacing.itemGap}>
            {validExp.map(exp => (
              <ExperienceItem key={exp.id || exp.title} exp={exp} accentColor={theme.accent} />
            ))}
          </div>
        </div>
      )}

      {!hiddenSections.includes('certificates') && validCert.length > 0 && (
        <div>
          <SectionTitle title="Honors, Publications & Certifications" accentColor={theme.accent} styleVariant="bar" />
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
