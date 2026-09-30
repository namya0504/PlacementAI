import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Wand2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { generateProfessionalSummary, generateProjectBulletPoints } from '../services/aiService';
import html2pdf from 'html2pdf.js';

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('personal');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const previewRef = useRef(null);

  // Resume State - Dynamic to authenticated user
  const [role, setRole] = useState(user?.role || 'Software Developer');
  const [template, setTemplate] = useState(searchParams.get('template') || 'modern');

  const [personal, setPersonal] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: ''
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
          const latest = resumes[resumes.length - 1];
          if (latest.personalInfo) {
            setPersonal(prev => ({
              ...prev,
              fullName: latest.personalInfo.fullName || prev.fullName || '',
              email: latest.personalInfo.email || prev.email || '',
              phone: latest.personalInfo.phone || '',
              location: latest.personalInfo.location || '',
              linkedin: latest.personalInfo.linkedin || '',
              github: latest.personalInfo.github || '',
              summary: (latest.personalInfo.summary && !latest.personalInfo.summary.includes('Results-driven Software Developer'))
                ? latest.personalInfo.summary
                : ''
            }));
          }
          if (latest.role) setRole(latest.role);
          if (latest.templateId) setTemplate(latest.templateId);

          if (Array.isArray(latest.education) && latest.education.length > 0) {
            const cleanEdu = latest.education.filter(e => !isMockEdu(e));
            if (cleanEdu.length > 0) {
              setEducation(cleanEdu);
            }
          }
          if (Array.isArray(latest.skills) && latest.skills.length > 0) {
            setSkills(latest.skills.map(s => typeof s === 'string' ? s : s.name));
          }
          if (Array.isArray(latest.projects) && latest.projects.length > 0) {
            const cleanProj = latest.projects.filter(p => !isMockProj(p));
            if (cleanProj.length > 0) {
              setProjects(cleanProj);
            }
          }
          if (Array.isArray(latest.certificates) && latest.certificates.length > 0) {
            const cleanCerts = latest.certificates
              .map(c => typeof c === 'string' ? c : (c.name || c.title))
              .filter(c => !isMockCert(c));
            if (cleanCerts.length > 0) {
              setCertifications(cleanCerts);
            }
          }
          if (Array.isArray(latest.experience) && latest.experience.length > 0) {
            const cleanExp = latest.experience.filter(ex => !isMockExp(ex));
            if (cleanExp.length > 0) {
              setExperience(cleanExp);
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
                degree: profile.branch ? `B.Tech in ${profile.branch}` : '',
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

  // AI Generators with Grok
  const handleAiSummary = async () => {
    setIsAiLoading(true);
    setAiError('');
    try {
      const summaryText = await generateProfessionalSummary(role, skills, 1);
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
    const element = previewRef.current;
    if (!element) return;
    const fileName = `${personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    const opt = {
      margin: 0.3,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();

    // Persist resume document & record download in backend
    try {
      const resumePayload = {
        title: `${personal.fullName}'s Resume`,
        role,
        templateId: template,
        personalInfo: personal,
        summary: personal.summary,
        experience,
        education,
        skills,
        projects,
        certificates: certifications
      };

      const saved = await API.saveResume(resumePayload);
      await API.recordDownload({
        resumeId: saved?.resumeId || 'res_' + Date.now(),
        fileName
      });
    } catch (err) {
      console.warn('Backend sync notice:', err.message);
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

          {currentStep === 3 && (
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          )}
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
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Select Resume Template</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'modern', name: 'Modern' },
                    { id: 'professional', name: 'Professional' },
                    { id: 'minimal', name: 'Minimal' },
                    { id: 'creative', name: 'Creative' }
                  ].map(t => (
                    <div
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between h-44 ${
                        template === t.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-full h-24 bg-white rounded border border-slate-200 p-2 space-y-1">
                        <div className="w-1/2 h-2 bg-blue-500 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 rounded"></div>
                        <div className="w-3/4 h-1 bg-slate-200 rounded"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{t.name}</span>
                        {template === t.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Next: Fill Information <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: INFORMATION FORM (Screen 6 in Collage) */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Sub-Navigation Tabs */}
              <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1 h-fit">
                {[
                  { key: 'personal', label: 'Personal Details', icon: User },
                  { key: 'education', label: 'Education', icon: GraduationCap },
                  { key: 'skills', label: 'Skills', icon: Code },
                  { key: 'projects', label: 'Projects', icon: FileText },
                  { key: 'certifications', label: 'Certifications', icon: Award },
                  { key: 'experience', label: 'Experience', icon: Briefcase }
                ].map(t => {
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
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GitHub / Portfolio</label>
                        <input
                          type="text"
                          placeholder="e.g. https://github.com/yourname"
                          value={personal.github || ''}
                          onChange={e => setPersonal({ ...personal, github: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Professional Summary</label>
                        <button
                          onClick={handleAiSummary}
                          disabled={isAiLoading}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg"
                        >
                          <Wand2 className="w-3.5 h-3.5" /> {isAiLoading ? 'Generating...' : 'AI Generate Summary'}
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Write a concise overview of your professional background, key technical strengths, and career ambitions..."
                        value={personal.summary}
                        onChange={e => setPersonal({ ...personal, summary: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
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
                                placeholder="e.g. React, Node.js, Express, Firebase, Grok API"
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
                              placeholder="• Built a scalable full-stack application serving over 1,000 active students...&#10;• Implemented automated resume score feedback using Grok AI engine..."
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

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    Next: Preview Resume <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: PREVIEW & DOWNLOAD (Screen 7 in Collage) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  ← Edit Information
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF Resume
                </button>
              </div>

              {/* Rendered Live Resume Document */}
              <div className="flex justify-center">
                <div
                  ref={previewRef}
                  className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 p-8 sm:p-12 space-y-6 text-slate-800 font-sans print-area"
                >
                  {/* Resume Header */}
                  <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase">{personal.fullName || 'YOUR NAME'}</h1>
                      {role && <p className="text-sm font-bold text-blue-600 tracking-wider uppercase mt-0.5">{role}</p>}
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5 text-left sm:text-right">
                      <div>{[personal.email, personal.phone].filter(Boolean).join(' | ')}</div>
                      {personal.location && <div>{personal.location}</div>}
                      {personal.linkedin && <div className="text-blue-600">{personal.linkedin}</div>}
                    </div>
                  </div>

                  {/* Summary */}
                  {personal.summary && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Professional Summary</h2>
                      <p className="text-xs leading-relaxed text-slate-700">{personal.summary}</p>
                    </div>
                  )}

                  {/* Projects */}
                  {projects.filter(p => p.title || p.description).length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Projects</h2>
                      {projects.filter(p => p.title || p.description).map(p => (
                        <div key={p.id} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                            <span>{p.title} {p.tech && <span className="font-normal text-slate-500">({p.tech})</span>}</span>
                          </div>
                          {p.description && <p className="text-xs text-slate-700 leading-relaxed">• {p.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {experience.filter(exp => exp.title || exp.company).length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Experience</h2>
                      {experience.filter(exp => exp.title || exp.company).map(exp => (
                        <div key={exp.id} className="space-y-0.5">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                            <span>{exp.title} {exp.company && <span className="font-semibold text-slate-600">at {exp.company}</span>}</span>
                            <span className="text-slate-500 font-normal text-[11px]">{exp.duration} {exp.location ? `• ${exp.location}` : ''}</span>
                          </div>
                          {exp.details && <p className="text-xs text-slate-700 leading-relaxed">• {exp.details}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {education.filter(ed => ed.degree || ed.college).length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Education</h2>
                      {education.filter(ed => ed.degree || ed.college).map(ed => (
                        <div key={ed.id} className="flex justify-between text-xs font-bold text-slate-900">
                          <div>
                            <div>{ed.degree}</div>
                            <div className="font-normal text-slate-600">{ed.college}</div>
                          </div>
                          <div className="text-right">
                            <div>{ed.year}</div>
                            <div className="text-blue-600">{ed.cgpa}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Skills</h2>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {skills.join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Certificates</h2>
                      <ul className="text-xs text-slate-700 list-disc pl-4 space-y-0.5">
                        {certifications.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
