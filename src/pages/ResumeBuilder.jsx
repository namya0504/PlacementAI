import React, { useState, useEffect, useRef } from 'react';
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
  Check
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('personal');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const currentTabIndex = SECTION_TABS.findIndex(t => t.key === activeTab);
  const nextTab = currentTabIndex >= 0 && currentTabIndex < SECTION_TABS.length - 1 ? SECTION_TABS[currentTabIndex + 1] : null;

  const handleNextSection = () => {
    if (activeTab === 'experience') {
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

  const previewRef = useRef(null);

  // Resume State - Dynamic to authenticated user
  const [role, setRole] = useState(user?.role || user?.targetRole || '');
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
  const [certifications, setCertifications] = useState([]);
  const [newCert, setNewCert] = useState('');
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
        const resumes = await API.getResumes();
        if (!isMounted) return;

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
          setMyResumes(resumes);
          const primaryResume = resumes.find(r => r.isPrimary && r.personalInfo) ||
                               [...resumes].reverse().find(r => r.personalInfo) ||
                               resumes[resumes.length - 1];

          if (primaryResume) {
            setActiveResumeId(primaryResume.resumeId);
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
            if (primaryResume.role) setRole(primaryResume.role);
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
              const cleanCerts = primaryResume.certificates
                .map(c => typeof c === 'string' ? c : (c.name || c.title))
                .filter(c => !isMockCert(c));
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

  const refreshResumesList = async () => {
    try {
      const list = await API.getResumes();
      if (Array.isArray(list)) {
        setMyResumes(list);
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
      setCertifications(resume.certificates.map(c => typeof c === 'string' ? c : (c.name || c.title)));
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
      const validCerts = Array.isArray(certifications) ? certifications.filter(Boolean) : [];

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

  const handleDownloadPdf = async () => {
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
        title: `${personal.fullName || 'Candidate'}'s Resume`,
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
    html2pdf().from(element).set(opt).save();

    // Persist resume document & record download in backend
    try {
      const resumePayload = {
        title: `${personal.fullName || 'Candidate'}'s Resume`,
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


  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">AI Resume Builder</h1>
              <p className="text-xs text-slate-500">Step {currentStep} of 3</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMyResumesModal(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-bold flex items-center gap-2 transition shadow-xs"
            >
              <FolderOpen className="w-4 h-4 text-purple-600" />
              <span>My Resumes</span>
              {myResumes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-mono">
                  {myResumes.length}
                </span>
              )}
            </button>

            {currentStep === 3 && (
              <button
                onClick={handleDownloadPdf}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Step Indicator Header (Screen 5/6/7 Wizard Header) */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            
            <div className={`flex items-center gap-3 ${currentStep >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                1
              </div>
              <span className="text-xs sm:text-sm hidden sm:inline">Role & Template</span>
            </div>
            
            <div className="h-0.5 bg-slate-200 flex-1 mx-4"></div>

            <div className={`flex items-center gap-3 ${currentStep >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                2
              </div>
              <span className="text-xs sm:text-sm hidden sm:inline">Information</span>
            </div>

            <div className="h-0.5 bg-slate-200 flex-1 mx-4"></div>

            <div className={`flex items-center gap-3 ${currentStep >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                3
              </div>
              <span className="text-xs sm:text-sm hidden sm:inline">Preview & Download</span>
            </div>

          </div>

          {/* STEP 1: ROLE & TEMPLATE */}
          {currentStep === 1 && (
            <div className="space-y-8">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Select Target Job Role</h3>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full max-w-md p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="">Select Target Job Role</option>
                  {role && !['Software Developer', 'Data Scientist', 'Product Manager', 'Full Stack Engineer', 'UI/UX Designer'].includes(role) && (
                    <option value={role}>{role}</option>
                  )}
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
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
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"
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
              <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1 h-fit">
                {SECTION_TABS.map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                        activeTab === t.key ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
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
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          placeholder="e.g. user@example.com"
                          value={personal.email}
                          onChange={e => setPersonal({ ...personal, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +91 98765 43210"
                          value={personal.phone}
                          onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore, India"
                          value={personal.location}
                          onChange={e => setPersonal({ ...personal, location: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          placeholder="e.g. https://linkedin.com/in/yourname"
                          value={personal.linkedin || ''}
                          onChange={e => setPersonal({ ...personal, linkedin: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Education
                      </button>
                    </div>

                    {education.length === 0 ? (
                      <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
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
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Education
                        </button>
                      </div>
                    ) : (
                      education.map((edu, idx) => (
                        <div key={edu.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 relative group">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
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
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College / University Name</label>
                              <input
                                type="text"
                                placeholder="e.g. National Institute of Technology"
                                value={edu.college}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, college: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CGPA / Score</label>
                              <input
                                type="text"
                                placeholder="e.g. 8.6 / 10.0 or 84%"
                                value={edu.cgpa}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, cgpa: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Passing Year / Duration</label>
                              <input
                                type="text"
                                placeholder="e.g. 2022 - 2026"
                                value={edu.year}
                                onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, year: e.target.value } : ed))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                            setSkills([...skills, newSkill.trim()]);
                            setNewSkill('');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
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
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                            }`}
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {skills.map((sk, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-2">
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
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Project
                      </button>
                    </div>

                    {projects.length === 0 ? (
                      <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
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
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Project
                        </button>
                      </div>
                    ) : (
                      projects.map((p, idx) => (
                        <div key={p.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 relative group">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
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
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technologies Used</label>
                              <input
                                type="text"
                                placeholder="e.g. React, Node.js, Express, PostgreSQL, Docker"
                                value={p.tech}
                                onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, tech: e.target.value } : pr))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add Certification (e.g. AWS Certified Solutions Architect, Google Cloud Associate)"
                        value={newCert}
                        onChange={e => setNewCert(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newCert.trim() && !certifications.includes(newCert.trim())) {
                              setCertifications([...certifications, newCert.trim()]);
                              setNewCert('');
                            }
                          }
                        }}
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCert.trim() && !certifications.includes(newCert.trim())) {
                            setCertifications([...certifications, newCert.trim()]);
                            setNewCert('');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                      >
                        Add Cert
                      </button>
                    </div>

                    <ul className="space-y-2">
                      {certifications.map((c, i) => (
                        <li key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold flex justify-between items-center">
                          <span className="flex items-center gap-2 text-slate-800">
                            <Award className="w-4 h-4 text-amber-500 shrink-0" />
                            {c}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-700 text-xs font-bold"
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
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Experience
                      </button>
                    </div>

                    {experience.length === 0 ? (
                      <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
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
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Your First Experience
                        </button>
                      </div>
                    ) : (
                      experience.map((exp, idx) => (
                        <div key={exp.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 relative group">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
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
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Organization</label>
                              <input
                                type="text"
                                placeholder="e.g. Google India / Tech Corp"
                                value={exp.company}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, company: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration / Dates</label>
                              <input
                                type="text"
                                placeholder="e.g. Jun 2025 - Aug 2025"
                                value={exp.duration || ''}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, duration: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                              <input
                                type="text"
                                placeholder="e.g. Bangalore, India (Remote)"
                                value={exp.location || ''}
                                onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, location: e.target.value } : ex))}
                                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                      ))
                    )}
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
                    className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow transition flex items-center gap-2 ${
                      activeTab === 'experience'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md shadow-purple-500/20'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
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

                <div className="flex flex-wrap items-center gap-3">
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
                    <span>Download Vector PDF (Print / Save A4)</span>
                  </button>
                </div>
              </div>

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

            </div>
          )}

        </div>
      </main>

      {/* My Resumes Drawer / Modal */}
      {showMyResumesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
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
                          <div className={`p-2.5 rounded-xl shrink-0 ${isUploaded ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-slate-900">
                                {resume.title || (isUploaded ? 'Uploaded Resume' : 'PlacementAI Resume')}
                              </h4>
                              {isPrimary && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-white" /> Primary
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isUploaded ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
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
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1.5"
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
    </div>
  );
}
