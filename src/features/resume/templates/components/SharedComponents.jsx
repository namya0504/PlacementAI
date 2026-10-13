import React from 'react';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  LinkedinIcon,
  GithubIcon,
  ExternalLinkIcon
} from './Icons';

/**
 * ProfilePhoto component
 * Returns null if no photo exists unless showInitials is explicitly requested.
 * Prevents empty circles or awkward whitespace gaps.
 */
export function ProfilePhoto({
  photoUrl,
  name = '',
  size = 'w-24 h-24',
  className = '',
  showInitials = false,
  accentColor = '#3b82f6'
}) {
  if (photoUrl && photoUrl.trim()) {
    return (
      <div className={`${size} rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 ${className}`}>
        <img
          src={photoUrl}
          alt={name ? `${name}'s photo` : 'Profile'}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onError={(e) => {
            // Hide on broken image URL
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  if (showInitials && name.trim()) {
    const initials = name
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div
        className={`${size} rounded-full flex items-center justify-center font-bold text-white shadow-md shrink-0 ${className}`}
        style={{ backgroundColor: accentColor }}
      >
        <span className="text-sm sm:text-base tracking-wider">{initials}</span>
      </div>
    );
  }

  return null;
}

/**
 * Standardized Section Title with multiple decoration styles
 */
export function SectionTitle({
  title,
  styleVariant = 'line', // 'line' | 'bar' | 'marker' | 'caps' | 'under'
  accentColor = '#1e3a8a',
  className = '',
  textClassName = 'text-xs font-bold uppercase tracking-wider'
}) {
  if (!title) return null;

  if (styleVariant === 'bar') {
    return (
      <div className={`flex items-center gap-2 mb-2 pb-1 ${className}`}>
        <span
          className="w-1.5 h-4 rounded-full shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <h2 className={`${textClassName}`} style={{ color: accentColor }}>
          {title}
        </h2>
      </div>
    );
  }

  if (styleVariant === 'marker') {
    return (
      <div className={`flex items-center gap-2 mb-2 pb-1 border-b border-slate-200 ${className}`}>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <h2 className={`${textClassName} text-slate-900`}>
          {title}
        </h2>
      </div>
    );
  }

  if (styleVariant === 'under') {
    return (
      <div className={`mb-2.5 ${className}`}>
        <h2 className={`${textClassName}`} style={{ color: accentColor }}>
          {title}
        </h2>
        <div
          className="h-0.5 w-12 mt-1 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    );
  }

  // Default 'line'
  return (
    <div className={`mb-2 pb-1 border-b border-slate-200 flex items-center justify-between ${className}`}>
      <h2 className={`${textClassName} text-slate-900`}>
        {title}
      </h2>
    </div>
  );
}

/**
 * Clickable Contact Block with inline SVGs
 */
export function ContactRow({
  personal = {},
  variant = 'row', // 'row' | 'column' | 'grid'
  accentColor = '#1e3a8a',
  textColor = 'text-slate-600',
  className = ''
}) {
  const { email, phone, location, linkedin, github } = personal;

  const items = [
    email && {
      icon: <MailIcon className="w-3 h-3 shrink-0" />,
      label: email,
      href: `mailto:${email}`
    },
    phone && {
      icon: <PhoneIcon className="w-3 h-3 shrink-0" />,
      label: phone,
      href: `tel:${phone.replace(/\s+/g, '')}`
    },
    location && {
      icon: <MapPinIcon className="w-3 h-3 shrink-0" />,
      label: location
    },
    linkedin && {
      icon: <LinkedinIcon className="w-3 h-3 shrink-0" />,
      label: linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/').replace(/\/$/, ''),
      href: linkedin.startsWith('http') ? linkedin : `https://${linkedin}`
    },
    github && {
      icon: <GithubIcon className="w-3 h-3 shrink-0" />,
      label: github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/').replace(/\/$/, ''),
      href: github.startsWith('http') ? github : `https://${github}`
    }
  ].filter(Boolean);

  if (items.length === 0) return null;

  if (variant === 'column') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {items.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-2 text-[11px] ${textColor}`}>
            <span style={{ color: accentColor }}>{item.icon}</span>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:underline truncate max-w-[190px]"
              >
                {item.label}
              </a>
            ) : (
              <span className="truncate max-w-[190px]">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Row / wrap
  return (
    <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] ${textColor} ${className}`}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span style={{ color: accentColor }}>{item.icon}</span>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Skill list rendering with multiple presentation modes
 */
export function SkillList({
  skills = [],
  variant = 'tags', // 'tags' | 'bullets' | 'comma' | 'bars'
  accentColor = '#1e3a8a',
  className = ''
}) {
  if (!Array.isArray(skills) || skills.length === 0) return null;

  const normalized = skills
    .map(s => (typeof s === 'string' ? s : s?.name))
    .filter(Boolean);

  if (normalized.length === 0) return null;

  if (variant === 'tags') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {normalized.map((skill, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded text-[10px] font-medium border"
            style={{
              borderColor: `${accentColor}33`,
              backgroundColor: `${accentColor}10`,
              color: accentColor
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'bullets') {
    return (
      <ul className={`text-[11px] text-slate-700 space-y-1 ${className}`}>
        {normalized.map((skill, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === 'comma') {
    return (
      <p className={`text-[11px] leading-relaxed text-slate-700 font-medium ${className}`}>
        {normalized.join(' • ')}
      </p>
    );
  }

  // fallback tags
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {normalized.map((skill, i) => (
        <span key={i} className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {skill}
        </span>
      ))}
    </div>
  );
}

/**
 * Clean Experience item
 */
export function ExperienceItem({
  exp,
  accentColor = '#1e3a8a',
  className = ''
}) {
  if (!exp || (!exp.title && !exp.company)) return null;

  return (
    <div className={`space-y-0.5 ${className}`}>
      <div className="flex flex-wrap justify-between items-baseline gap-1">
        <div className="text-xs font-bold text-slate-900">
          <span>{exp.title}</span>
          {exp.company && (
            <span className="font-semibold text-slate-700 ml-1">
              — {exp.company}
            </span>
          )}
        </div>
        <div className="text-[10px] font-medium text-slate-500 shrink-0">
          {[exp.duration, exp.location].filter(Boolean).join(' • ')}
        </div>
      </div>
      {exp.details && (
        <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line mt-0.5">
          {exp.details.startsWith('•') ? exp.details : `• ${exp.details}`}
        </p>
      )}
    </div>
  );
}

/**
 * Project item with clickable repository / live demo links
 */
export function ProjectItem({
  project,
  accentColor = '#1e3a8a',
  className = ''
}) {
  if (!project || (!project.title && !project.description)) return null;

  return (
    <div className={`space-y-0.5 ${className}`}>
      <div className="flex flex-wrap justify-between items-baseline gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900">{project.title}</span>
          {project.link && (
            <a
              href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-0.5 text-[10px]"
              style={{ color: accentColor }}
            >
              <ExternalLinkIcon className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        {project.tech && (
          <span className="text-[10px] font-medium text-slate-500 italic">
            {project.tech}
          </span>
        )}
      </div>
      {project.description && (
        <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line mt-0.5">
          {project.description.startsWith('•') ? project.description : `• ${project.description}`}
        </p>
      )}
    </div>
  );
}

/**
 * Education item
 */
export function EducationItem({
  edu,
  accentColor = '#1e3a8a',
  className = ''
}) {
  if (!edu || (!edu.degree && !edu.college)) return null;

  return (
    <div className={`flex justify-between items-baseline text-xs ${className}`}>
      <div>
        <div className="font-bold text-slate-900">{edu.degree}</div>
        <div className="text-[11px] text-slate-600 font-normal">{edu.college}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-slate-500 font-medium">{edu.year}</div>
        {edu.cgpa && (
          <div className="text-[10px] font-bold" style={{ color: accentColor }}>
            GPA: {edu.cgpa}
          </div>
        )}
      </div>
    </div>
  );
}
