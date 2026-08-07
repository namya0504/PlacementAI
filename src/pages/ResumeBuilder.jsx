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
import { generateProfessionalSummary, generateProjectBulletPoints } from '../services/aiService';
import html2pdf from 'html2pdf.js';

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('personal');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const previewRef = useRef(null);

  // Resume State
  const [role, setRole] = useState('Software Developer');
  const [template, setTemplate] = useState(searchParams.get('template') || 'modern');

  const [personal, setPersonal] = useState({
    fullName: 'Namya Shah',
    email: 'namya@example.com',
    phone: '+91 98765 43210',
    location: 'Surat, Gujarat, India',
    linkedin: 'https://linkedin.com/in/namya',
    github: 'https://github.com/namya',
    summary: 'Motivated and detail-oriented Software Developer with core expertise in building modern, scalable web applications using React, Node.js, and SQL. Passionate about writing clean code, solving complex algorithms, and implementing high-performance responsive web interfaces.'
  });

  const [education, setEducation] = useState([
    { id: 1, degree: 'Diploma in Information Technology', college: 'Government Polytechnic, Surat', cgpa: '8.5 CGPA', year: '2023 - 2026' }
  ]);

  const [skills, setSkills] = useState([
    'JavaScript (ES6+)', 'React.js', 'Node.js', 'Python', 'SQL & PostgreSQL', 'Tailwind CSS', 'Git & GitHub', 'Data Structures & Algorithms'
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Grocery Store App (Flutter)',
      tech: 'Flutter, Firebase',
      description: 'Built a cross-platform grocery app with Firebase authentication, product management, cart and order placement.'
    },
    {
      id: 2,
      title: 'Notes App (Android)',
      tech: 'Android, Kotlin, Room DB',
      description: 'Created a simple local notes app for Android with CRUD operations and local storage.'
    }
  ]);

  const [certifications, setCertifications] = useState([
    'IBM AI Internship Certificate',
    'Google Data Analytics Certificate'
  ]);
  const [newCert, setNewCert] = useState('');

  const [experience, setExperience] = useState([
    { id: 1, title: 'Software Developer Intern', company: 'TechSolutions Pvt Ltd', duration: 'May 2025 - Jul 2025', details: 'Assisted in building REST APIs and frontend React components.' }
  ]);

  // AI Generators
  const handleAiSummary = async () => {
    setIsAiLoading(true);
    const summaryText = await generateProfessionalSummary(role, skills.join(', '), 1);
    setPersonal(prev => ({ ...prev, summary: summaryText }));
    setIsAiLoading(false);
  };

  const handleAiProjectBullet = async (projId) => {
    setIsAiLoading(true);
    const proj = projects.find(p => p.id === projId);
    if (proj) {
      const bullets = await generateProjectBulletPoints(proj.title, proj.tech);
      setProjects(projects.map(p => p.id === projId ? { ...p, description: bullets.join(' ') } : p));
    }
    setIsAiLoading(false);
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
                          value={personal.fullName}
                          onChange={e => setPersonal({ ...personal, fullName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          value={personal.email}
                          onChange={e => setPersonal({ ...personal, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={personal.phone}
                          onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                        <input
                          type="text"
                          value={personal.location}
                          onChange={e => setPersonal({ ...personal, location: e.target.value })}
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
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Education Details</h3>
                    {education.map((edu, idx) => (
                      <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed))}
                            className="p-2.5 rounded-lg border border-slate-200 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="College Name"
                            value={edu.college}
                            onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, college: e.target.value } : ed))}
                            className="p-2.5 rounded-lg border border-slate-200 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="CGPA / Score"
                            value={edu.cgpa}
                            onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, cgpa: e.target.value } : ed))}
                            className="p-2.5 rounded-lg border border-slate-200 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Passing Year"
                            value={edu.year}
                            onChange={e => setEducation(education.map(ed => ed.id === edu.id ? { ...ed, year: e.target.value } : ed))}
                            className="p-2.5 rounded-lg border border-slate-200 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Technical & Soft Skills</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new skill (e.g. Docker, TypeScript)"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm"
                      />
                      <button
                        onClick={() => { if (newSkill) { setSkills([...skills, newSkill]); setNewSkill(''); } }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                      >
                        Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((sk, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-2">
                          {sk}
                          <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Projects</h3>
                    {projects.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={p.title}
                          onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, title: e.target.value } : pr))}
                          className="w-full p-2.5 rounded-lg border border-slate-200 text-sm font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Technologies Used"
                          value={p.tech}
                          onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, tech: e.target.value } : pr))}
                          className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600"
                        />
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-600">Description</label>
                          <button
                            onClick={() => handleAiProjectBullet(p.id)}
                            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded"
                          >
                            <Wand2 className="w-3 h-3" /> AI Enhance Bullet
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={p.description}
                          onChange={e => setProjects(projects.map(pr => pr.id === p.id ? { ...pr, description: e.target.value } : pr))}
                          className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {activeTab === 'certifications' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit font-outfit">Certifications</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add Certification (e.g. AWS Cloud Practitioner)"
                        value={newCert}
                        onChange={e => setNewCert(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 text-sm"
                      />
                      <button
                        onClick={() => { if (newCert) { setCertifications([...certifications, newCert]); setNewCert(''); } }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                      >
                        Add Cert
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {certifications.map((c, i) => (
                        <li key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold flex justify-between items-center">
                          <span>{c}</span>
                          <button onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))} className="text-red-500 hover:underline text-xs">Remove</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Experience */}
                {activeTab === 'experience' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Internships & Work Experience</h3>
                    {experience.map(exp => (
                      <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, title: e.target.value } : ex))}
                            className="p-2.5 rounded-lg border border-slate-200 text-sm font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, company: e.target.value } : ex))}
                            className="p-2.5 rounded-lg border border-slate-200 text-sm"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={exp.details}
                          onChange={e => setExperience(experience.map(ex => ex.id === exp.id ? { ...ex, details: e.target.value } : ex))}
                          className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                    ))}
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
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase">{personal.fullName}</h1>
                      <p className="text-sm font-bold text-blue-600 tracking-wider uppercase mt-0.5">{role}</p>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5 text-left sm:text-right">
                      <div>{personal.email} | {personal.phone}</div>
                      <div>{personal.location}</div>
                      <div className="text-blue-600">{personal.linkedin}</div>
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
                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Projects</h2>
                      {projects.map(p => (
                        <div key={p.id} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                            <span>{p.title} <span className="font-normal text-slate-500">({p.tech})</span></span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">• {p.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">Education</h2>
                      {education.map(ed => (
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
