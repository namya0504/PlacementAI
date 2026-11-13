import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  CheckCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Menu,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  User,
  Wand2,
  FolderOpen,
  Star,
  Upload,
  X,
  FileCheck,
  RefreshCw,
  Check,
  GitBranch,
  ExternalLink,
  AlertCircle,
  Link as LinkIcon,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useSidebar } from '../context/SidebarContext';
import { generateProfessionalSummary, generateProjectBulletPoints } from '../services/aiService';
import { TemplatePicker } from '../features/resume/components/TemplatePicker';
import { CustomizerPanel } from '../features/resume/components/CustomizerPanel';
import { resolveTemplate, TEMPLATES_REGISTRY } from '../features/resume/templates';

const SECTION_TABS = [
  { key: 'personal', label: 'Personal Details', icon: User },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'skills', label: 'Skills', icon: Code },
  { key: 'projects', label: 'Projects', icon: FileText },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'experience', label: 'Experience', icon: Briefcase }
];

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, user: authUser } = useAuth();
  const user = currentUser || authUser;
  const toast = useToast();
  const { isCollapsed } = useSidebar();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('personal');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const currentTabIndex = SECTION_TABS.findIndex(t => t.key === activeTab);
  const nextTab = currentTabIndex >= 0 && currentTabIndex < SECTION_TABS.length - 1 ? SECTION_TABS[currentTabIndex + 1] : null;

  const handleNextSection = () => {
    if (activeTab === 'experience') {
      if (!validateBeforeStep3()) return;
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nextTab) {
      setActiveTab(nextTab.key);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBackSection = () => {
    if (activeTab === 'personal') {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const prevTab = SECTION_TABS[currentTabIndex - 1];
      if (prevTab) {
        setActiveTab(prevTab.key);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  // My Resumes Drawer / Modal State
  const [myResumes, setMyResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [showMyResumesModal, setShowMyResumesModal] = useState(false);
  const [settingPrimaryId, setSettingPrimaryId] = useState(null);
  const [deletingResumeId, setDeletingResumeId] = useState(null);
  const [uploadingResumeFile, setUploadingResumeFile] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Save / Cancel state for created resume
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // "Save as Profile Resume" banner state (shown after download)
  const [showSaveProfileBanner, setShowSaveProfileBanner] = useState(false);
  const [savingProfileResume, setSavingProfileResume] = useState(false);
  const [savedProfileResumeMsg, setSavedProfileResumeMsg] = useState('');
  // Holds the last generated pdfBuffer/blob so we can upload it if user confirms
  const lastPdfBlobRef = React.useRef(null);

  const previewRef = useRef(null);

  // Resume State - Dynamic to authenticated user
  const [role, setRole] = useState(user?.targetRole || user?.role || '');

  // Keep role in sync with profile/user state changes when not viewing a specific saved resume query
  useEffect(() => {
    const updatedRole = user?.targetRole || user?.role;
    if (updatedRole && !searchParams.get('resumeId')) {
      setRole(updatedRole);
    }
  }, [user?.targetRole, user?.role, searchParams]);
  const [template, setTemplate] = useState(searchParams.get('template') || 'modern');
  const [templateOptions, setTemplateOptions] = useState({
    accentColor: '',
    spacing: 'normal',
    fontScale: 'medium',
    hiddenSections: []
  });

  const [personal, setPersonal] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    photoUrl: user?.photoURL || ''
  });

  const [education, setEducation] = useState([
    {
      id: 'edu_1',
      degree: '',
      college: '',
      cgpa: '',
      year: ''
    }
  ]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState([
    {
      id: 'proj_1',
      title: '',
      tech: '',
      link: '',
      description: ''
    }
  ]);
  // Certifications: {name: string, link: string}[]
  const [certifications, setCertifications] = useState([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertLink, setNewCertLink] = useState('');

  // GitHub repo import state
  const [ghRepos, setGhRepos] = useState([]); // fetched repos
  const [ghFetching, setGhFetching] = useState(false);
  const [ghFetchError, setGhFetchError] = useState('');
  const [ghFetchedFor, setGhFetchedFor] = useState(''); // which URL was last fetched
  const [ghSelected, setGhSelected] = useState(new Set()); // selected repo IDs

  // Step validation errors
  const [validationErrors, setValidationErrors] = useState([]);
  const [experience, setExperience] = useState([
    {
      id: 'exp_1',
      title: '',
      company: '',
      duration: '',
      location: '',
      details: ''
    }
  ]);

  // Education CRUD Handlers
  const handleAddEducation = () => {
    setEducation(prev => [
      ...prev,
      {
        id: 'edu_' + Date.now(),
        degree: '',
        college: '',
        cgpa: '',
        year: ''
      }
    ]);
  };

  const handleRemoveEducation = (id) => {
    setEducation(prev => prev.filter(e => e.id !== id));
  };

  // Projects CRUD Handlers
  const handleAddProject = () => {
    setProjects(prev => [
      ...prev,
      {
        id: 'proj_' + Date.now(),
        title: '',
        tech: '',
        link: '',
        description: ''
      }
    ]);
  };

  const handleRemoveProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Experience CRUD Handlers
  const handleAddExperience = () => {
    setExperience(prev => [
      ...prev,
      {
        id: 'exp_' + Date.now(),
        title: '',
        company: '',
        duration: '',
        location: '',
        details: ''
      }
    ]);
  };

  const handleRemoveExperience = (id) => {
    setExperience(prev => prev.filter(ex => ex.id !== id));
  };

  // Pre-load saved resume or user profile
  useEffect(() => {
    let isMounted = true;
    async function loadResumeData() {
      try {
        const [resumes, profile] = await Promise.all([
          API.getResumes().catch(() => []),
          API.getProfile().catch(() => null)
        ]);
        if (!isMounted) return;

        const effectiveProfileRole = profile?.targetRole || profile?.role || user?.targetRole || user?.role || '';

        // Helpers to detect and filter out legacy hardcoded mock/seed data
        const isMockEdu = (item) => {
          if (!item) return true;
          const col = (item.college || '').toLowerCase();
          const deg = (item.degree || '').toLowerCase();
          const cgpa = (item.cgpa || '').trim();
          return (
            col.includes('national institute of technology') ||
            col.includes('engineering institute of technology') ||
            cgpa === '8.6 / 10.0' ||
            cgpa === '8.5 / 10.0' ||
            (deg.includes('computer science & engineering') && col.includes('national institute'))
          );
        };

        const isMockProj = (item) => {
          if (!item) return true;
          const title = (item.title || '').toLowerCase();
          const link = (item.link || '').toLowerCase();
          return title.includes('e-commerce platform with ai') || link.includes('example/ecommerce');
        };

        const isMockExp = (item) => {
          if (!item) return true;
          const comp = (item.company || '').toLowerCase();
          return comp.includes('tech solutions inc');
        };

        const isMockCert = (item) => {
          const str = (typeof item === 'string' ? item : (item?.name || item?.title || '')).toLowerCase();
          return str.includes('aws certified cloud practitioner') || str.includes('full stack web development - coursera');
        };

        if (Array.isArray(resumes) && resumes.length > 0) {
          const sorted = [...resumes].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
          setMyResumes(sorted);
          const primaryResume = resumes.find(r => r.isPrimary && r.personalInfo) ||
                               [...resumes].reverse().find(r => r.personalInfo) ||
                               resumes[resumes.length - 1];

          if (primaryResume) {
            // Only lock activeResumeId if specifically editing a requested resume via URL
            const isExplicitResumeParam = Boolean(searchParams.get('resumeId'));
            if (isExplicitResumeParam) {
              setActiveResumeId(searchParams.get('resumeId'));
            } else {
              setActiveResumeId(null);
            }
            if (primaryResume.personalInfo) {
              setPersonal(prev => ({
                ...prev,
                fullName: primaryResume.personalInfo.fullName || prev.fullName || '',
                email: primaryResume.personalInfo.email || prev.email || '',
                phone: primaryResume.personalInfo.phone || '',
                location: primaryResume.personalInfo.location || '',
                linkedin: primaryResume.personalInfo.linkedin || '',
                github: primaryResume.personalInfo.github || '',
                summary: (primaryResume.personalInfo.summary && !primaryResume.personalInfo.summary.includes('Results-driven Software Developer'))
                  ? primaryResume.personalInfo.summary
                  : ''
              }));
            }
            
            // Respect user's profile target role over legacy resume role, unless specific resume requested via URL
            if (isExplicitResumeParam && primaryResume.role) {
              setRole(primaryResume.role);
            } else if (effectiveProfileRole) {
              setRole(effectiveProfileRole);
            } else if (primaryResume.role) {
              setRole(primaryResume.role);
            }

            if (primaryResume.templateId) setTemplate(primaryResume.templateId);
            if (primaryResume.templateOptions) setTemplateOptions(primaryResume.templateOptions);

            if (Array.isArray(primaryResume.education) && primaryResume.education.length > 0) {
              const cleanEdu = primaryResume.education.filter(e => !isMockEdu(e));
              if (cleanEdu.length > 0) {
                setEducation(cleanEdu);
              }
            }
            if (Array.isArray(primaryResume.skills) && primaryResume.skills.length > 0) {
              setSkills(primaryResume.skills.map(s => typeof s === 'string' ? s : s.name));
            }
            if (Array.isArray(primaryResume.projects) && primaryResume.projects.length > 0) {
              const cleanProj = primaryResume.projects.filter(p => !isMockProj(p));
              if (cleanProj.length > 0) {
                setProjects(cleanProj);
              }
            }
            if (Array.isArray(primaryResume.certificates) && primaryResume.certificates.length > 0) {
              // Normalize: old records store strings, new records store {name, link}
              const cleanCerts = primaryResume.certificates
                .map(c => {
                  if (typeof c === 'string') return { name: c, link: '' };
                  return { name: c.name || c.title || '', link: c.link || c.url || '' };
                })
                .filter(c => !isMockCert(c.name));
              if (cleanCerts.length > 0) {
                setCertifications(cleanCerts);
              }
            }
            if (Array.isArray(primaryResume.experience) && primaryResume.experience.length > 0) {
              const cleanExp = primaryResume.experience.filter(ex => !isMockExp(ex));
              if (cleanExp.length > 0) {
                setExperience(cleanExp);
              }
            }
          }
        } else {
          // Pre-populate from user profile ONLY if user actually filled their profile
          const profile = await API.getProfile();
          if (!isMounted || !profile) return;
          setPersonal(prev => ({
            ...prev,
            fullName: profile.name || user?.name || prev.fullName || '',
            email: profile.email || user?.email || prev.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            linkedin: profile.linkedIn || '',
            github: profile.github || '',
            summary: profile.bio || ''
          }));
          if (Array.isArray(profile.skills) && profile.skills.length > 0) {
            setSkills(profile.skills);
          }
          if (profile.college || profile.branch || profile.passingYear || profile.cgpa) {
            setEducation([
              {
                id: 'edu_prof_1',
                degree: profile.degree ? `${profile.degree} in ${profile.branch || ''}`.trim() : (profile.branch || ''),
                college: profile.college || '',
                cgpa: profile.cgpa || '',
                year: profile.passingYear ? `${profile.passingYear}` : ''
              }
            ]);
          }
        }
      } catch (e) {
        console.warn('Preload resume error:', e.message);
      }
    }
    loadResumeData();
    return () => { isMounted = false; };
  }, [user]);

  // ── sessionStorage draft auto-save ─────────────────────────────────────────
  // Only active for new-resume flow (no ?resumeId param). Saves every 30s.
  const DRAFT_KEY = user?.uid ? `resume_draft_${user.uid}` : null;
  const isNewResume = !searchParams.get('resumeId');

  // Track when the draft was last auto-saved for the "Saved ✓ / Unsaved changes" indicator
  const [draftSavedAt, setDraftSavedAt] = useState(null); // Date | null

  // Restore draft on mount — runs once after loadResumeData populates state
  const draftRestoredRef = useRef(false);
  useEffect(() => {
    if (!DRAFT_KEY || !isNewResume || draftRestoredRef.current) return;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || typeof draft !== 'object') return;
      // Only restore if draft was saved within the last 2 hours
      if (!draft._savedAt || Date.now() - draft._savedAt > 2 * 60 * 60 * 1000) return;
      draftRestoredRef.current = true;
      if (draft.personal && typeof draft.personal === 'object') setPersonal(draft.personal);
      if (draft.role !== undefined) setRole(draft.role);
      if (Array.isArray(draft.education) && draft.education.length > 0) setEducation(draft.education);
      if (Array.isArray(draft.skills)) setSkills(draft.skills);
      if (Array.isArray(draft.projects) && draft.projects.length > 0) setProjects(draft.projects);
      if (Array.isArray(draft.certifications)) setCertifications(draft.certifications);
      if (Array.isArray(draft.experience) && draft.experience.length > 0) setExperience(draft.experience);
      if (draft.template) setTemplate(draft.template);
      if (draft.templateOptions && typeof draft.templateOptions === 'object') setTemplateOptions(draft.templateOptions);
      setDraftSavedAt(new Date(draft._savedAt));
    } catch {
      // Corrupt draft — silently ignore
    }
  }, [DRAFT_KEY, isNewResume]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save draft every 30s
  useEffect(() => {
    if (!DRAFT_KEY || !isNewResume) return;
    const id = setInterval(() => {
      try {
        const now = Date.now();
        const draft = {
          personal,
          role,
          education,
          skills,
          projects,
          certifications,
          experience,
          template,
          templateOptions,
          _savedAt: now
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setDraftSavedAt(new Date(now));
      } catch {
        // sessionStorage full or unavailable — silently ignore
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [DRAFT_KEY, isNewResume, personal, role, education, skills, projects, certifications, experience, template, templateOptions]);

  // Clear draft after a successful explicit save (when activeResumeId is set)
  useEffect(() => {
    if (DRAFT_KEY && activeResumeId) {
      sessionStorage.removeItem(DRAFT_KEY);
      setDraftSavedAt(null);
    }
  }, [DRAFT_KEY, activeResumeId]);
  // ─────────────────────────────────────────────────────────────────────────────

  const refreshResumesList = async () => {
    try {
      const list = await API.getResumes();
      if (Array.isArray(list)) {
        const sorted = [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
        setMyResumes(sorted);
      }
    } catch (err) {
      console.warn('Failed to refresh resumes:', err.message);
    }
  };

  const handleSetPrimary = async (resumeId) => {
    setSettingPrimaryId(resumeId);
    try {
      await API.setPrimaryResume(resumeId);
      setMyResumes(prev => prev.map(r => ({ ...r, isPrimary: r.resumeId === resumeId })));
    } catch (err) {
      console.error('Failed to set primary resume:', err);
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    setDeletingResumeId(resumeId);
    try {
      await API.deleteResume(resumeId);
      setMyResumes(prev => prev.filter(r => r.resumeId !== resumeId));
      if (activeResumeId === resumeId) {
        setActiveResumeId(null);
      }
    } catch (err) {
      console.error('Failed to delete resume:', err);
    } finally {
      setDeletingResumeId(null);
    }
  };

  const handleUploadNewResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResumeFile(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('isPrimary', 'true');

      const result = await API.uploadOnboardingResume(formData);
      if (result) {
        await refreshResumesList();
      }
    } catch (err) {
      console.error('Failed to upload resume file:', err);
      setUploadError(err.message || 'Failed to upload resume file. Please ensure it is a valid PDF or DOCX (max 5 MB).');
    } finally {
      setUploadingResumeFile(false);
      e.target.value = '';
    }
  };

  const handleCreateNewResume = async () => {
    setActiveResumeId(null);
    setShowMyResumesModal(false);
    setCurrentStep(1);
    setTemplateOptions({
      accentColor: '',
      spacing: 'normal',
      fontScale: 'medium',
      hiddenSections: []
    });

    // Pre-populate clean slate from profile
    try {
      const profile = await API.getProfile();
      if (profile) {
        setPersonal({
          fullName: profile.name || user?.name || '',
          email: profile.email || user?.email || '',
          phone: profile.phone || '',
          location: profile.location || '',
          linkedin: profile.linkedIn || '',
          github: profile.github || '',
          summary: profile.bio || '',
          photoUrl: profile.photoURL || user?.photoURL || ''
        });
        if (profile.targetRole || profile.role) {
          setRole(profile.targetRole || profile.role);
        }
        if (Array.isArray(profile.skills) && profile.skills.length > 0) {
          setSkills(profile.skills.map(s => typeof s === 'string' ? s : s.name));
        }
        if (profile.college || profile.branch || profile.passingYear) {
          setEducation([
            {
              id: 'edu_new_1',
              degree: profile.degree ? `${profile.degree} in ${profile.branch || ''}`.trim() : (profile.branch || ''),
              college: profile.college || '',
              cgpa: profile.cgpa || '',
              year: profile.passingYear ? `${profile.passingYear}` : ''
            }
          ]);
        }
      }
    } catch (e) {
      console.warn('Profile load notice for new resume:', e.message);
    }
  };

  const handleLoadResume = (resume) => {
    setActiveResumeId(resume.resumeId);
    if (resume.personalInfo) {
      setPersonal(prev => ({ ...prev, ...resume.personalInfo }));
    }
    if (resume.role) setRole(resume.role);
    if (resume.templateId) setTemplate(resume.templateId);
    if (resume.templateOptions) {
      setTemplateOptions(resume.templateOptions);
    } else {
      setTemplateOptions({
        accentColor: '',
        spacing: 'normal',
        fontScale: 'medium',
        hiddenSections: []
      });
    }
    if (Array.isArray(resume.education)) setEducation(resume.education);
    if (Array.isArray(resume.skills)) setSkills(resume.skills.map(s => typeof s === 'string' ? s : s.name));
    if (Array.isArray(resume.projects)) setProjects(resume.projects);
    if (Array.isArray(resume.certificates)) {
      setCertifications(resume.certificates.map(c => {
        if (typeof c === 'string') return { name: c, link: '' };
        return { name: c.name || c.title || '', link: c.link || c.url || '' };
      }));
    }
    if (Array.isArray(resume.experience)) setExperience(resume.experience);

    setShowMyResumesModal(false);
    setCurrentStep(2);
  };

  // AI Generators - Grounded strictly in student's verified learning & coursework
  const handleAiSummary = async () => {
    setIsAiLoading(true);
    setAiError('');
    try {
      const validExperience = Array.isArray(experience)
        ? experience.filter(e => e && ((e.title && e.title.trim()) || (e.company && e.company.trim())))
        : [];

      const realExpYears = validExperience.reduce((acc, exp) => {
        const num = parseFloat(exp.duration) || 0;
        return acc + num;
      }, 0);

      const validEducation = Array.isArray(education)
        ? education.filter(e => e && ((e.degree && e.degree.trim()) || (e.college && e.college.trim())))
        : [];

      const validProjects = Array.isArray(projects)
        ? projects.filter(p => p && p.title && p.title.trim())
        : [];

      const validSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
      const validCerts = Array.isArray(certifications)
        ? certifications.filter(c => c?.name?.trim()).map(c => c.name)
        : [];

      const summaryPayload = {
        role: role || user?.role || user?.targetRole || '',
        skills: validSkills,
        experienceYears: realExpYears,
        github: personal.github?.trim() || '',
        linkedin: personal.linkedin?.trim() || '',
        education: validEducation.map(e => ({
          degree: e.degree?.trim() || '',
          college: e.college?.trim() || '',
          year: e.year?.trim() || '',
          cgpa: e.cgpa?.trim() || ''
        })),
        projects: validProjects.map(p => ({
          title: p.title?.trim() || '',
          tech: p.tech?.trim() || '',
          description: p.description?.trim() || ''
        })),
        certifications: validCerts,
        experience: validExperience
      };

      const summaryText = await generateProfessionalSummary(summaryPayload);
      setPersonal(prev => ({ ...prev, summary: summaryText }));
    } catch (err) {
      setAiError(err.message || 'AI generation failed. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiProjectBullet = async (projId) => {
    setIsAiLoading(true);
    setAiError('');
    const proj = projects.find(p => p.id === projId);
    if (proj) {
      try {
        const bullets = await generateProjectBulletPoints(proj.title, proj.tech);
        setProjects(projects.map(p => p.id === projId ? { ...p, description: bullets.join(' ') } : p));
      } catch (err) {
        setAiError(err.message || 'AI generation failed. Please try again.');
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  // ── GitHub repo import ──────────────────────────────────────────
  const handleFetchGitHubRepos = useCallback(async () => {
    const ghUrl = personal.github?.trim();
    if (!ghUrl) {
      setGhFetchError('Please enter your GitHub URL or username in Personal Details first.');
      return;
    }
    if (ghFetchedFor === ghUrl && ghRepos.length > 0) return; // already fetched for same URL
    setGhFetching(true);
    setGhFetchError('');
    try {
      const data = await API.fetchGitHubRepos(ghUrl);
      setGhRepos(data?.repos || []);
      setGhFetchedFor(ghUrl);
      setGhSelected(new Set());
    } catch (err) {
      setGhFetchError(err.message || 'Failed to fetch GitHub repos. Check your GitHub URL and try again.');
      setGhRepos([]);
    } finally {
      setGhFetching(false);
    }
  }, [personal.github, ghFetchedFor, ghRepos.length]);

  const handleImportSelectedRepos = () => {
    if (ghSelected.size === 0) return;
    const toImport = ghRepos.filter(r => ghSelected.has(r.id));
    const newProjects = toImport.map(r => ({
      id: 'gh_' + r.id,
      title: r.name,
      tech: [r.language, ...(r.topics || [])].filter(Boolean).join(', '),
      link: r.homepage?.trim() ? r.homepage.trim() : r.htmlUrl,
      description: r.description || ''
    }));
    // Merge: avoid duplicates by id, replace empty placeholder proj_1 if present
    setProjects(prev => {
      const existing = prev.filter(p => p.id !== 'proj_1' || p.title.trim());
      const existingIds = new Set(existing.map(p => p.id));
      const fresh = newProjects.filter(p => !existingIds.has(p.id));
      return [...existing.filter(p => !(p.id === 'proj_1' && !p.title.trim())), ...fresh];
    });
    setGhSelected(new Set());
  };

  // ── Mandatory fields validation ──────────────────────────────────
  const validateBeforeStep3 = () => {
    const errors = [];
    if (!personal.fullName?.trim()) errors.push({ tab: 'personal', msg: 'Full Name is required' });
    if (!personal.email?.trim()) errors.push({ tab: 'personal', msg: 'Email Address is required' });
    if (!personal.phone?.trim()) errors.push({ tab: 'personal', msg: 'Phone Number is required' });
    const validEdu = education.filter(e => e.degree?.trim() || e.college?.trim());
    if (validEdu.length === 0) errors.push({ tab: 'education', msg: 'At least one Education entry is required' });
    if (skills.filter(Boolean).length === 0) errors.push({ tab: 'skills', msg: 'At least one Skill is required' });
    if (projects.filter(p => p.title?.trim()).length === 0) errors.push({ tab: 'projects', msg: 'At least one Project with a title is required' });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleDownloadPdf = async () => {
    if (!validateBeforeStep3()) {
      setCurrentStep(2);
      setActiveTab('personal');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    const rawName = (personal.fullName || user?.name || 'Candidate').trim();
    const rawRole = (role || 'Professional').trim();
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedRole = rawRole.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedName}_${sanitizedRole}_Resume.pdf`;

    // 1. Temporarily set document title for browser print dialog default filename
    const originalTitle = document.title;
    document.title = `${sanitizedName}_${sanitizedRole}_Resume`;

    // 2. Trigger native vector print dialog (Save as PDF)
    window.print();

    // Restore title after slight delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);

    // 3. Persist resume document & record download in backend
    try {
      const resumePayload = {
        title: `${personal.fullName || 'Candidate'}'s ${role ? `${role} ` : ''}Resume`,
        role,
        templateId: template,
        templateOptions,
        templateVersion: 1,
        personalInfo: personal,
        summary: personal.summary,
        experience,
        education,
        skills,
        projects,
        certificates: certifications
      };

      // BUG-05 fix: use activeResumeId for updates whenever it is set
      let saved;
      if (activeResumeId) {
        saved = await API.updateResume(activeResumeId, resumePayload);
      } else {
        saved = await API.saveResume(resumePayload);
        if (saved?.resumeId) setActiveResumeId(saved.resumeId);
      }

      await API.recordDownload({
        resumeId: saved?.resumeId || activeResumeId || 'res_' + Date.now(),
        fileName
      });
      refreshResumesList();
    } catch (e) {
      console.warn('Resume persist during download notice:', e.message);
    }
  };

  const handleDirectDownloadHtml2Pdf = async () => {
    if (!validateBeforeStep3()) {
      setCurrentStep(2);
      setActiveTab('personal');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    const element = previewRef.current;
    if (!element) return;
    const rawName = (personal.fullName || user?.name || 'Candidate').trim();
    const rawRole = (role || 'Professional').trim();
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedRole = rawRole.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${sanitizedName}_${sanitizedRole}_Resume.pdf`;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0,
        windowWidth: 794
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    // Generate blob so we can offer "save as profile resume".
    // If blob generation fails, fall back to a plain save and keep the banner hidden.
    try {
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
      lastPdfBlobRef.current = { blob: pdfBlob, fileName };
      // Also trigger the download
      html2pdf().from(element).set(opt).save();
      // Only show the banner when we successfully captured a blob
      setTimeout(() => {
        setShowSaveProfileBanner(true);
        setSavedProfileResumeMsg('');
      }, 800);
    } catch (_) {
      // Fallback: plain save; do NOT show the banner — no blob was captured
      lastPdfBlobRef.current = null;
      html2pdf().from(element).set(opt).save();
    }

    // Persist resume document & record download in backend
    try {
      const resumePayload = {
        title: `${personal.fullName || 'Candidate'}'s ${role ? `${role} ` : ''}Resume`,
        role,
        templateId: template,
        templateOptions,
        templateVersion: 1,
        personalInfo: personal,
        summary: personal.summary,
        experience,
        education,
        skills,
        projects,
        certificates: certifications
      };

      // BUG-05 fix: use activeResumeId for updates whenever it is set
      // (not just when the URL has a resumeId param), preventing duplicate records
      // when both download methods are used in the same session.
      let saved;
      if (activeResumeId) {
        saved = await API.updateResume(activeResumeId, resumePayload);
      } else {
        saved = await API.saveResume(resumePayload);
        if (saved?.resumeId) setActiveResumeId(saved.resumeId);
      }

      await API.recordDownload({
        resumeId: saved?.resumeId || activeResumeId || 'res_' + Date.now(),
        fileName
      });

      // Save a version snapshot to resume history (max 10 enforced by backend)
      const savedResumeId = saved?.resumeId || activeResumeId;
      if (savedResumeId) {
        try {
          await API.saveWebResumeVersion({
            resumeId: savedResumeId,
            title: `${personal.fullName || 'Candidate'}'s Resume – ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            templateId: template,
            personalInfo: personal,
            role,
            createdAt: new Date().toISOString()
          });
        } catch (vErr) {
          console.warn('Resume version save notice:', vErr.message);
        }
      }

      refreshResumesList();
    } catch (e) {
      console.warn('Resume persist during download notice:', e.message);
    }
  };

  // Upload the just-generated PDF as the user's profile resume
  const handleSaveAsProfileResume = async () => {
    const entry = lastPdfBlobRef.current;
    if (!entry?.blob) {
      setSavedProfileResumeMsg('No PDF available. Please use "Direct PDF" first.');
      return;
    }
    setSavingProfileResume(true);
    setSavedProfileResumeMsg('');
    try {
      const file = new File([entry.blob], entry.fileName, { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('resume', file);
      await API.uploadProfileResume(formData);
      setSavedProfileResumeMsg('✓ Saved as your profile resume! You can now select it in ATS Checker.');
    } catch (err) {
      setSavedProfileResumeMsg(`Failed: ${err.message || 'Please try again.'}`);
    } finally {
      setSavingProfileResume(false);
    }
  };

  // Handle Save Created Resume (Explicit User Action in Step 3)
  const handleSaveCreatedResume = async () => {
    if (!validateBeforeStep3()) {
      setCurrentStep(2);
      setActiveTab('personal');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSavingResume(true);
    setSaveSuccessMsg('');

    try {
      const resumePayload = {
        title: `${personal.fullName || 'Candidate'}'s ${role ? `${role} ` : ''}Resume`,
        role: role || user?.targetRole || user?.role || '',
        templateId: template,
        templateOptions,
        templateVersion: 1,
        personalInfo: personal,
        summary: personal.summary,
        experience,
        education,
        skills,
        projects,
        certificates: certifications
      };

      // Always save as a new resume entry so existing resumes are preserved and never overwritten
      const saved = await API.saveResume(resumePayload);
      if (saved?.resumeId) setActiveResumeId(saved.resumeId);

      await refreshResumesList();
      setSaveSuccessMsg('Resume stored in My Resumes! All your previously created resumes are kept intact.');
      setTimeout(() => setSaveSuccessMsg(''), 7000);
    } catch (err) {
      console.error('Failed to save resume:', err);
      toast.error('Failed to save resume: ' + (err.message || 'Please check all required fields.'));
    } finally {
      setIsSavingResume(false);
    }
  };

  // Handle Cancel Created Resume
  const handleCancelCreatedResume = () => {
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirmModal(false);
    if (activeResumeId) {
      const existing = myResumes.find(r => r.resumeId === activeResumeId);
      if (existing) {
        handleLoadResume(existing);
      } else {
        setCurrentStep(2);
      }
    } else {
      setCurrentStep(2);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F9FE] flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        
        {/* Top Header matching reference screen */}
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100" aria-label="Open navigation">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-outfit">Resume Builder</h1>
              {isNewResume && draftSavedAt ? (
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Draft saved at {draftSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              ) : isNewResume && currentStep >= 2 ? (
                <p className="text-[10px] text-amber-500 font-semibold mt-0.5">Unsaved changes — auto-saves every 30s</p>
              ) : (
                <p className="text-xs text-slate-500">Create a professional resume with AI assistance.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMyResumesModal(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] text-xs font-bold flex items-center gap-2 transition shadow-xs"
            >
              <FolderOpen className="w-4 h-4 text-[#7C3AED]" />
              <span>My Resumes</span>
              {myResumes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] text-[10px] font-mono">
                  {myResumes.length}
                </span>
              )}
            </button>

            {currentStep === 3 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelCreatedResume}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold text-xs items-center gap-1.5 transition"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveCreatedResume}
                  disabled={isSavingResume}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {isSavingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Step Indicator Header matching reference screen */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EAEBF4] shadow-xs">
            <div className="flex items-center justify-between overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 1, label: 'Personal Details', step: 2, tab: 'personal' },
                { id: 2, label: 'Education', step: 2, tab: 'education' },
                { id: 3, label: 'Skills', step: 2, tab: 'skills' },
                { id: 4, label: 'Projects', step: 2, tab: 'projects' },
                { id: 5, label: 'Preview & Download', step: 3, tab: null },
              ].map((s, idx, arr) => {
                const currentActiveStepId = currentStep === 3 ? 5 : (
                  activeTab === 'personal' ? 1 :
                  activeTab === 'education' ? 2 :
                  activeTab === 'skills' ? 3 :
                  4
                );
                const isCurrent = currentActiveStepId === s.id;
                const isCompleted = currentActiveStepId > s.id;

                return (
                  <React.Fragment key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (s.step === 3) {
                          if (validateBeforeStep3()) setCurrentStep(3);
                        } else {
                          setCurrentStep(2);
                          setActiveTab(s.tab);
                        }
                      }}
                      className="flex items-center gap-2.5 group cursor-pointer shrink-0"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-[#7C3AED] text-white shadow-sm ring-4 ring-purple-100'
                          : isCompleted
                          ? 'bg-purple-100 text-[#7C3AED]'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                      }`}>
                        {isCompleted ? '✓' : s.id}
                      </div>
                      <span className={`text-xs font-bold whitespace-nowrap ${
                        isCurrent ? 'text-[#7C3AED]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </button>
                    {idx < arr.length - 1 && (
                      <div className={`h-0.5 w-6 sm:w-12 mx-2 shrink-0 ${isCompleted ? 'bg-[#7C3AED]' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* STEP 1: ROLE & TEMPLATE */}
          {currentStep === 1 && (
            <div className="space-y-8">
              
              {/* MY RESUMES BOX / FIELD */}
              {myResumes.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAEBF4] pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-outfit">My Saved Resumes</h3>
                        <p className="text-xs text-slate-500">Pick any saved resume to edit or customize</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMyResumesModal(true)}
                      className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition"
                    >
                      <span>Manage All ({myResumes.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {myResumes.map(r => (
                      <div
                        key={r.resumeId}
                        onClick={() => handleLoadResume(r)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                          activeResumeId === r.resumeId
                            ? 'border-[#7C3AED] bg-purple-50/40 shadow-xs ring-2 ring-[#7C3AED]/20'
                            : 'border-[#EAEBF4] bg-[#F8F9FE] hover:border-purple-200 hover:bg-purple-50/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {r.title || 'Untitled Resume'}
                          </div>
                          {r.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] text-[10px] font-extrabold shrink-0">
                              ⭐ Primary
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 truncate">
                          {r.role || role} · {resolveTemplate(r.templateId).name}
                        </p>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Saved'}</span>
                          <span className="text-[#7C3AED] font-bold">Edit →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Select Target Job Role</h3>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full max-w-md p-3 rounded-xl border border-[#EAEBF4] bg-white text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                >
                  <option value="">Select Target Job Role</option>
                  {role && !['Machine Learning', 'Machine Learning Engineer', 'ML Engineer', 'Data Scientist', 'Software Developer', 'Full Stack Engineer', 'Mobile App Developer', 'Product Manager', 'UI/UX Designer', 'Cloud / DevOps Engineer'].includes(role) && (
                    <option value={role}>{role}</option>
                  )}
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                </select>
              </div>

              <TemplatePicker
                selectedTemplateId={template}
                onSelectTemplate={setTemplate}
                userResumeData={{
                  personalInfo: personal,
                  role,
                  summary: personal.summary,
                  experience,
                  education,
                  skills,
                  projects,
                  certificates: certifications
                }}
                currentRole={role}
                selectedAccent={templateOptions.accentColor}
                onSelectAccent={(color) => setTemplateOptions(prev => ({ ...prev, accentColor: color }))}
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg transition flex items-center gap-2"
                >
                  <span>Next: Fill Information</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: INFORMATION FORM (Screen 6 in Collage) */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Sub-Navigation Tabs */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-[#EAEBF4] shadow-xs space-y-1 h-fit">
                {SECTION_TABS.map(t => {
                    const Icon = t.icon;
                    const hasError = validationErrors.some(e => e.tab === t.key);
                    return (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                          activeTab === t.key ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{t.label}</span>
                        {hasError && (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="This section has errors" />
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Form Input Area */}
              <div className="lg:col-span-9 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                
                {/* Personal Details */}
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          value={personal.fullName}
                          onChange={e => setPersonal({ ...personal, fullName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          placeholder="e.g. user@example.com"
                          value={personal.email}
                          onChange={e => setPersonal({ ...personal, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +91 98765 43210"
                          value={personal.phone}
                          onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore, India"
                          value={personal.location}
                          onChange={e => setPersonal({ ...personal, location: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          placeholder="e.g. https://linkedin.com/in/yourname"
                          value={personal.linkedin || ''}
                          onChange={e => setPersonal({ ...personal, linkedin: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase">GitHub / Portfolio</label>
                          {personal.github && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ● Auto-analyzes repos
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. https://github.com/yourname"
                          value={personal.github || ''}
                          onChange={e => setPersonal({ ...personal, github: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          AI reads your public repositories and bio to ground your summary in your actual coding work.
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Professional Summary</label>
                        <button
                          type="button"
                          onClick={handleAiSummary}
                          disabled={isAiLoading}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 transition px-2.5 py-1 rounded-lg disabled:opacity-50"
                          title="Generate a truthful summary matching your actual GitHub repos, coursework & learning"
                        >
                          <Wand2 className="w-3.5 h-3.5" /> {isAiLoading ? 'Analyzing...' : 'AI Generate Summary'}
                        </button>
                      </div>

                      {aiError && (
                        <div className="mb-2 p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                          {aiError}
                        </div>
                      )}

                      <textarea
                        rows={4}
                        placeholder="Write a concise overview of your professional background, key technical strengths, and career ambitions..."
                        value={personal.summary}
                        onChange={e => setPersonal({ ...personal, summary: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                      />

                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {personal.github ? (
                            <span className="text-purple-600 font-medium">🐙 Incorporates your GitHub bio, repositories & tech stack.</span>
                          ) : skills.length === 0 && (!education.some(e => e.degree || e.college)) ? (
                            '💡 Tip: Add your GitHub link or details in Education & Skills to tailor this summary.'
                          ) : (
                            '✨ Summary grounded strictly in your coursework, projects & learning.'
                          )}
                        </span>
                        <span>{personal.summary ? `${personal.summary.trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Education */}
                {activeTab === 'education' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-outfit">Education Details</h3>
                        <p className="text-xs text-slate-500">Add your degrees, schools, GPA, and graduation years</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddEducation}
                        className="px-3.5 py-2 rounded-xl bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Education
                      </button>
                    </div>

                    {education.length === 0 ? (
                      <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">No Education Added Yet</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                            Add your degree, university or college, CGPA, and passing year to showcase your academic background.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddEducation}
                          className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white font-bold text-xs shadow hover:bg-[#6D28D9] transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Education
                        </button>
                      </div>
                    ) : (
                      education.map((edu, idx) => (
                        <div key={edu.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 relative group">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                              </span>
                              {edu.degree || `Education #${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEducation(edu.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                              title="Delete this education"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree / Course</label>
                              <input
                                type="text"
                                placeholder="e.g. B.Tech Computer Science & Engineering"
                                value={edu.degree}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College / University Name</label>
                              <input
                                type="text"
                                placeholder="e.g. National Institute of Technology"
                                value={edu.college}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, college: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CGPA / Score</label>
                              <input
                                type="text"
                                placeholder="e.g. 8.6 / 10.0 or 84%"
                                value={edu.cgpa}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, cgpa: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Passing Year / Duration</label>
                              <input
                                type="text"
                                placeholder="e.g. 2022 - 2026"
                                value={edu.year}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, year: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Skills */}
                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-outfit">Technical & Soft Skills</h3>
                        <p className="text-xs text-slate-500">List core programming languages, frameworks, and modern tools</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new skill (e.g. Docker, TypeScript, GraphQL)"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                              setSkills([...skills, newSkill.trim()]);
                              setNewSkill('');
                            }
                          }
                        }}
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                            setSkills([...skills, newSkill.trim()]);
                            setNewSkill('');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition"
                      >
                        Add Skill
                      </button>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested for {role}:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['TypeScript', 'TailwindCSS', 'Next.js', 'Redux', 'MongoDB', 'AWS', 'System Design'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              if (!skills.includes(s)) setSkills([...skills, s]);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                              skills.includes(s)
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#7C3AED] hover:text-[#7C3AED]'
                            }`}
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {skills.map((sk, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-xs font-semibold flex items-center gap-2">
                          {sk}
                          <button
                            type="button"
                            onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                            className="hover:text-red-500 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-outfit">Projects</h3>
                        <p className="text-xs text-slate-500">Showcase your notable technical, academic, or personal projects</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-3.5 py-2 rounded-xl bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Project
                      </button>
                    </div>

                    {/* ── GitHub Import Panel ───────────────────────────────── */}
                    {personal.github?.trim() && (
                      <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4 text-slateald-700 shrink-0" />
                            <span className="text-xs font-bold text-slate-700">Import from GitHub</span>
                            {ghFetchedFor && ghRepos.length > 0 && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {ghRepos.length} repos found
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleFetchGitHubRepos}
                            disabled={ghFetching}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                          >
                            {ghFetching ? (
                              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching...</>
                            ) : (
                              <><GitBranch className="w-3.5 h-3.5" /> {ghRepos.length > 0 ? 'Refresh Repos' : 'Fetch Repos'}</>
                            )}
                          </button>
                        </div>

                        {ghFetchError && (
                          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{ghFetchError}</span>
                          </div>
                        )}

                        {ghRepos.length > 0 && (
                          <>
                            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                              {ghRepos.map(r => (
                                <label
                                  key={r.id}
                                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                                    ghSelected.has(r.id)
                                      ? 'border-emerald-400 bg-emerald-50'
                                      : 'border-slate-200 bg-white hover:border-emerald-300'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={ghSelected.has(r.id)}
                                    onChange={e => {
                                      setGhSelected(prev => {
                                        const next = new Set(prev);
                                        if (e.target.checked) next.add(r.id);
                                        else next.delete(r.id);
                                        return next;
                                      });
                                    }}
                                    className="mt-0.5 accent-emerald-600 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-slate-800">{r.name}</span>
                                      {r.language && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-semibold">{r.language}</span>
                                      )}
                                      {r.stars > 0 && (
                                        <span className="flex items-center gap-0.5 text-amber-600 text-[10px]">
                                          <Star className="w-3 h-3" />{r.stars}
                                        </span>
                                      )}
                                      {(r.homepage || r.htmlUrl) && (
                                        <a
                                          href={r.homepage?.trim() || r.htmlUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={e => e.stopPropagation()}
                                          className="text-[#7C3AED] hover:text-[#6D28D9]"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                    {r.description && (
                                      <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-1">{r.description}</p>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-500">
                                {ghSelected.size > 0 ? `${ghSelected.size} selected` : 'Select repos to import'}
                              </span>
                              <button
                                type="button"
                                onClick={handleImportSelectedRepos}
                                disabled={ghSelected.size === 0}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition disabled:opacity-40 flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Import Selected ({ghSelected.size})
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Validation banner for projects */}
                    {validationErrors.some(e => e.tab === 'projects') && (
                      <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{validationErrors.find(e => e.tab === 'projects')?.msg}</span>
                      </div>
                    )}

                    {projects.length === 0 ? (
                      <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">No Projects Added Yet</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                            Projects demonstrate practical knowledge and problem-solving skills to recruiters.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddProject}
                          className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white font-bold text-xs shadow hover:bg-[#6D28D9] transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Project
                        </button>
                      </div>
                    ) : (
                      projects.map((p, idx) => (
                        <div key={p.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 relative group">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                              </span>
                              {p.title || `Project #${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProject(p.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                              title="Delete this project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Title</label>
                              <input
                                type="text"
                                placeholder="e.g. PlacementAI — AI Prep Portal"
                                value={p.title}
                                onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, title: e.target.value } : pr))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technologies Used</label>
                              <input
                                type="text"
                                placeholder="e.g. React, Node.js, Express, PostgreSQL, Docker"
                                value={p.tech}
                                onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, tech: e.target.value } : pr))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Live Demo / GitHub Link</label>
                            <input
                              type="text"
                              placeholder="e.g. https://github.com/myusername/project-repo"
                              value={p.link || ''}
                              onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, link: e.target.value } : pr))}
                              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-slate-700 uppercase">Description & Key Highlights</label>
                              <button
                                type="button"
                                onClick={() => handleAiProjectBullet(p.id)}
                                disabled={isAiLoading}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 hover:bg-purple-100 transition"
                              >
                                <Wand2 className="w-3.5 h-3.5" /> {isAiLoading ? 'Enhancing...' : 'AI Enhance Bullet'}
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              placeholder="• Built a scalable full-stack application serving over 1,000 active students...&#10;• Implemented automated resume score feedback using an intelligent matching engine..."
                              value={p.description}
                              onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, description: e.target.value } : pr))}
                              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Certifications */}
                {activeTab === 'certifications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-outfit">Certifications</h3>
                        <p className="text-xs text-slate-500">List industry recognized certifications, credentials, and achievements</p>
                      </div>
                    </div>

                    {/* Add new certification */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add New Certification</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Certification Name (e.g. AWS Certified Solutions Architect)*"
                          value={newCertName}
                          onChange={e => setNewCertName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newCertName.trim()) {
                                setCertifications(prev => [...prev, { name: newCertName.trim(), link: newCertLink.trim() }]);
                                setNewCertName('');
                                setNewCertLink('');
                              }
                            }
                          }}
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                        />
                        <input
                          type="url"
                          placeholder="Certificate URL (optional)"
                          value={newCertLink}
                          onChange={e => setNewCertLink(e.target.value)}
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newCertName.trim()) {
                              setCertifications(prev => [...prev, { name: newCertName.trim(), link: newCertLink.trim() }]);
                              setNewCertName('');
                              setNewCertLink('');
                            }
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition whitespace-nowrap"
                        >
                          Add Cert
                        </button>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {certifications.map((c, i) => (
                        <li key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold flex justify-between items-center gap-3">
                          <span className="flex items-center gap-2 text-slate-800 min-w-0">
                            <Award className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="truncate">{c.name}</span>
                            {c.link && (
                              <a
                                href={c.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1"
                                title="View Certificate"
                              >
                                <LinkIcon className="w-3 h-3" />
                                <span className="hidden sm:inline text-[10px]">View</span>
                              </a>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Experience */}
                {activeTab === 'experience' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-outfit">Internships & Work Experience</h3>
                        <p className="text-xs text-slate-500">Add internships, full-time jobs, freelance, or research roles</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="px-3.5 py-2 rounded-xl bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Experience
                      </button>
                    </div>

                    {experience.length === 0 ? (
                      <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">No Experience Added Yet</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                            If you have internship experience, freelancing, or technical roles, add them here.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddExperience}
                          className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white font-bold text-xs shadow hover:bg-[#6D28D9] transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Experience
                        </button>
                      </div>
                    ) : (
                      experience.map((exp, idx) => (
                        <div key={exp.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 relative group">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                              </span>
                              {exp.title ? `${exp.title} at ${exp.company || 'Company'}` : `Experience #${idx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                              title="Delete this experience"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job / Role Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Software Developer Intern"
                                value={exp.title}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, title: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Organization</label>
                              <input
                                type="text"
                                placeholder="e.g. Google India / Tech Corp"
                                value={exp.company}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, company: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration / Dates</label>
                              <input
                                type="text"
                                placeholder="e.g. Jun 2025 - Aug 2025"
                                value={exp.duration || ''}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, duration: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                              <input
                                type="text"
                                placeholder="e.g. Bangalore, India (Remote)"
                                value={exp.location || ''}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, location: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Responsibilities & Achievements</label>
                            <textarea
                              rows={3}
                              placeholder="• Engineered RESTful APIs and integrated frontend React components...&#10;• Collaborated with cross-functional agile teams to deliver features on schedule..."
                              value={exp.details}
                              onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, details: e.target.value } : ex))}
                              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Validation error summary — shown on the Experience tab before advancing */}
                {activeTab === 'experience' && validationErrors.length > 0 && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Please fix the following before previewing:</span>
                    </div>
                    <ul className="space-y-1">
                      {validationErrors.map((err, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          <button
                            type="button"
                            className="underline hover:text-red-800 text-left"
                            onClick={() => setActiveTab(err.tab)}
                          >
                            {err.msg}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleBackSection}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSection}
                    className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow transition flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9]"
                  >
                    {activeTab === 'experience' ? (
                      <>Next: Preview Resume <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Next: {nextTab?.label} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: PREVIEW & DOWNLOAD */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5 self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Information</span>
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={handleSaveCreatedResume}
                    disabled={isSavingResume}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isSavingResume ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Resume</span>
                      </>
                    )}
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancelCreatedResume}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

                  <button
                    type="button"
                    onClick={handleDirectDownloadHtml2Pdf}
                    className="px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition flex items-center gap-1.5"
                    title="Direct instant file download"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Direct PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Vector PDF</span>
                  </button>
                </div>
              </div>

              {/* Save Success Alert Banner */}
              {saveSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowMyResumesModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>View in My Resumes ({myResumes.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSaveSuccessMsg('')}
                      className="p-1 text-emerald-600 hover:text-emerald-800 rounded-lg hover:bg-emerald-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* "Save as Profile Resume" Banner — appears after Direct PDF download */}
              {showSaveProfileBanner && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-purple-50 border border-purple-200 rounded-2xl p-4 no-print">
                  <div className="flex-1 min-w-0">
                    {savedProfileResumeMsg ? (
                      <p className={`text-xs font-semibold ${savedProfileResumeMsg.startsWith('✓') ? 'text-emerald-700' : 'text-red-600'}`}>
                        {savedProfileResumeMsg}
                      </p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-purple-800">Replace your profile resume with this version?</p>
                        <p className="text-[11px] text-purple-600 mt-0.5">It will be available in ATS Checker and stored in your profile.</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!savedProfileResumeMsg.startsWith('✓') && (
                      <button
                        type="button"
                        onClick={handleSaveAsProfileResume}
                        disabled={savingProfileResume}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {savingProfileResume ? (
                          <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                        ) : (
                          <><FileCheck className="w-3.5 h-3.5" /> Save as Profile Resume</>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { setShowSaveProfileBanner(false); lastPdfBlobRef.current = null; }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Two Column Layout: Customizer on Left, Live Document on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Customizer Panel */}
                <div className="lg:col-span-4 no-print space-y-4">
                  <CustomizerPanel
                    templateId={template}
                    onChangeTemplate={setTemplate}
                    options={templateOptions}
                    onChangeOptions={setTemplateOptions}
                  />
                </div>

                {/* Right: Live Rendered A4 Document */}
                <div className="lg:col-span-8 flex justify-center overflow-x-auto p-2 sm:p-6 bg-slate-200/50 rounded-3xl border border-slate-200/60 shadow-inner">
                  <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-none border border-slate-300 overflow-hidden">
                    <div
                      id="resume-print-area"
                      ref={previewRef}
                      className="w-full bg-white"
                      style={{
                        width: '100%',
                        minHeight: '297mm',
                        boxSizing: 'border-box'
                      }}
                    >
                      {React.createElement(resolveTemplate(template).component, {
                        data: {
                          personalInfo: personal,
                          role,
                          summary: personal.summary,
                          experience,
                          education,
                          skills,
                          projects,
                          certificates: certifications
                        },
                        options: templateOptions
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Action Footer for Step 3 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EAEBF4] shadow-xs no-print">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{personal.fullName || 'Candidate'}'s Resume</h4>
                    <p className="text-[11px] text-slate-500">Target Role: <span className="font-semibold text-[#7C3AED]">{role}</span> · {resolveTemplate(template).name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancelCreatedResume}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCreatedResume}
                    disabled={isSavingResume}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {isSavingResume ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* My Resumes Drawer / Modal */}
      {showMyResumesModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">My Resumes</h3>
                  <p className="text-xs text-slate-500">Manage your uploaded and builder-generated resumes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMyResumesModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions Toolbar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {myResumes.length} {myResumes.length === 1 ? 'resume' : 'resumes'} saved
              </span>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>Upload PDF/DOCX</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={handleUploadNewResume}
                    disabled={uploadingResumeFile}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleCreateNewResume}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Resume</span>
                </button>
              </div>
            </div>

            {/* Modal Body / List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {uploadingResumeFile && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center space-y-2">
                  <RefreshCw className="w-5 h-5 text-purple-600 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-purple-800">Uploading and processing resume file...</p>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center justify-between">
                  <span>{uploadError}</span>
                  <button onClick={() => setUploadError('')}><X className="w-3.5 h-3.5" /></button>
                </div>
              )}

              {myResumes.length > 0 ? (
                myResumes.map((resume) => {
                  const isPrimary = !!resume.isPrimary;
                  const isUploaded = resume.source === 'uploaded';

                  return (
                    <div
                      key={resume.resumeId}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isPrimary
                          ? 'border-purple-300 bg-purple-50/40 shadow-xs ring-1 ring-purple-400/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${isUploaded ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'bg-[#EDE9FE] text-[#7C3AED]'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-slate-900">
                                {resume.title || (isUploaded ? 'Uploaded Resume' : 'PlacementAI Resume')}
                              </h4>
                              {isPrimary && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-white" /> Primary
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isUploaded ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {isUploaded ? 'Uploaded file' : 'Built in Builder'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Role: <span className="font-medium text-slate-700">{resume.role || 'Not specified'}</span>
                              {!isUploaded && (
                                <span> • Template: <span className="font-semibold text-purple-700">{resolveTemplate(resume.templateId).name}</span></span>
                              )}
                              {resume.createdAt && (
                                <span> • {new Date(resume.createdAt).toLocaleDateString()}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteResume(resume.resumeId)}
                          disabled={deletingResumeId === resume.resumeId}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Resume Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                        {!isPrimary ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(resume.resumeId)}
                            disabled={settingPrimaryId === resume.resumeId}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>Set as Primary</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-purple-100/70 text-purple-800 text-xs font-bold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-purple-600" />
                            <span>Active Primary</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setShowMyResumesModal(false);
                            navigate(`/ats-checker?resumeId=${resume.resumeId}`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7C3AED] text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Run ATS Check</span>
                        </button>

                        {(resume.downloadUrl || resume.pdfUrl) && (
                          <a
                            href={resume.downloadUrl || resume.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </a>
                        )}

                        {!isUploaded && (
                          <button
                            type="button"
                            onClick={() => handleLoadResume(resume)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit in Builder</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-3 text-slate-400">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs">No resumes saved yet. Build your first resume or upload a file above!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Resume Creation Confirmation Modal */}
      {showCancelConfirmModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#EAEBF4] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">Discard Unsaved Changes?</h3>
                <p className="text-xs text-slate-500">Cancel resume creation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If you cancel now, any unsaved information will not be saved to your <strong className="text-slate-800">My Resumes</strong> list.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCancelConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
              >
                Discard & Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
