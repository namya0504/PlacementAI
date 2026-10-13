import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Code2,
  Trash2,
  Plus,
  RefreshCw,
  X,
  FileCheck,
  Shield,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';

const Github = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const Linkedin = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TARGET_ROLES = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Cloud / DevOps Engineer',
  'Machine Learning Engineer',
  'Cybersecurity Analyst',
  'Custom'
];

export default function Onboarding() {
  const { currentUser, updateOnboardingState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard state: 1: Resume, 2: Online Profiles, 3: AI Analyzing, 4: Review & Results
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Resume choices
  const [resumeMode, setResumeMode] = useState('upload'); // 'upload' | 'manual'
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploadResult, setResumeUploadResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Step 1: Manual form
  const [manualData, setManualData] = useState({
    fullName: currentUser?.name || '',
    college: currentUser?.college || '',
    branch: currentUser?.branch || '',
    passingYear: currentUser?.passingYear || '',
    targetRole: currentUser?.role || currentUser?.targetRole || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    skills: '',
    projects: [
      { title: '', technologies: '', description: '' }
    ]
  });

  // Step 2: Online profiles
  const [githubInput, setGithubInput] = useState('');
  const [linkedinInput, setLinkedinInput] = useState('');
  const [targetRole, setTargetRole] = useState(currentUser?.role || currentUser?.targetRole || '');
  const [customRole, setCustomRole] = useState('');
  const [linkedinText, setLinkedinText] = useState('');
  const [showLinkedInTextarea, setShowLinkedInTextarea] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Step 3: Analysis status & progress simulation
  const [analysisProgress, setAnalysisProgress] = useState(10);
  const [analysisMessage, setAnalysisMessage] = useState('Reading your background...');
  const [analysisFailed, setAnalysisFailed] = useState(false);

  // Step 4: AI Analysis Results & Review
  const [analysisResults, setAnalysisResults] = useState(null);
  const [sourceStatus, setSourceStatus] = useState(null);
  const [reviewedSkills, setReviewedSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [reviewedProjects, setReviewedProjects] = useState([]);
  const [editingSummary, setEditingSummary] = useState('');

  // Pre-load saved progress on mount
  useEffect(() => {
    API.getOnboardingState()
      .then(res => {
        if (res && res.onboarding) {
          const ob = res.onboarding;
          if (ob.status === 'completed' && !searchParams.get('force')) {
            navigate('/dashboard');
            return;
          }
          if (ob.currentStep && ob.currentStep > 1 && ob.currentStep <= 4) {
            setStep(ob.currentStep);
          }
          if (ob.draft) {
            if (ob.draft.github) setGithubInput(ob.draft.github);
            if (ob.draft.linkedin) setLinkedinInput(ob.draft.linkedin);
            if (ob.draft.targetRole) setTargetRole(ob.draft.targetRole);
            if (ob.draft.manualData) setManualData(ob.draft.manualData);
            if (ob.draft.resumeUploadResult) setResumeUploadResult(ob.draft.resumeUploadResult);
          }
        }
        if (res && res.latestAnalysis && res.latestAnalysis.analysis) {
          populateAnalysisState(res.latestAnalysis.analysis, res.latestAnalysis.sourcesUsed);
        }
      })
      .catch(err => console.warn('[Onboarding] State load notice:', err.message));
  }, [navigate, searchParams]);

  const populateAnalysisState = (analysis, sources) => {
    setAnalysisResults(analysis);
    setSourceStatus(sources || null);
    setReviewedSkills(Array.isArray(analysis.detectedSkills) ? [...analysis.detectedSkills] : []);
    setReviewedProjects(Array.isArray(analysis.detectedProjects) ? [...analysis.detectedProjects] : []);
    setEditingSummary(analysis.profileSummary || '');
  };

  // Persist draft progress helper
  const saveDraft = async (nextStep, extraDraft = {}) => {
    try {
      const draftPayload = {
        github: githubInput,
        linkedin: linkedinInput,
        targetRole: targetRole === 'Custom' ? customRole : targetRole,
        manualData,
        resumeUploadResult,
        ...extraDraft
      };
      await API.saveOnboardingStep({ step: nextStep, draftData: draftPayload });
      updateOnboardingState({ currentStep: nextStep, draft: draftPayload });
    } catch (e) {
      console.warn('Draft save notice:', e.message);
    }
  };

  // Skip onboarding handler
  const handleSkip = async () => {
    try {
      await API.skipOnboarding();
      updateOnboardingState({ status: 'skipped' });
      navigate('/dashboard');
    } catch (e) {
      navigate('/dashboard');
    }
  };

  // Step 1: File selection & upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!allowed.includes(file.mimetype) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      setErrorMessage('Please upload a valid PDF or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 5 MB limit. Please select a smaller resume.');
      return;
    }

    setErrorMessage('');
    setResumeFile(file);
    setUploadProgress(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole === 'Custom' ? customRole : targetRole);

      const res = await API.uploadOnboardingResume(formData);
      setResumeUploadResult(res);
      setUploadProgress(false);
    } catch (err) {
      console.error('Resume upload error:', err);
      setErrorMessage(err.message || 'Could not parse resume. Try a text-based PDF or use the manual entry form.');
      setUploadProgress(false);
    }
  };

  // Remove resume file
  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeUploadResult(null);
    setErrorMessage('');
  };

  // Manual project list handlers
  const handleAddManualProject = () => {
    setManualData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', technologies: '', description: '' }]
    }));
  };

  const handleUpdateManualProject = (index, field, value) => {
    setManualData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleRemoveManualProject = (index) => {
    setManualData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Step 1 -> Step 2 validation
  const handleContinueFromStep1 = async () => {
    setErrorMessage('');
    if (resumeMode === 'upload') {
      if (!resumeUploadResult) {
        setErrorMessage('Please upload a resume file or switch to manual details.');
        return;
      }
    } else {
      if (!manualData.fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!manualData.skills.trim()) {
        setErrorMessage('Please enter at least 2-3 key skills.');
        return;
      }
    }
    await saveDraft(2);
    setStep(2);
  };

  // Open Resume Builder from Onboarding
  const handleBuildWithResumeBuilder = async () => {
    await saveDraft(1, { fromOnboarding: true });
    navigate('/resume-builder?from=onboarding');
  };

  // Step 2 -> Step 3: Trigger Profile Analysis
  const handleStartAnalysis = async () => {
    setErrorMessage('');
    if (!consentAgreed) {
      setErrorMessage('Please accept the consent checkbox to allow AI profile analysis.');
      return;
    }

    const selectedRole = targetRole === 'Custom' ? customRole.trim() : targetRole;

    setStep(3);
    setAnalysisFailed(false);
    setAnalysisProgress(15);
    setAnalysisMessage('Reading and parsing resume details...');

    // Progress ticker simulation
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev < 40) {
          setAnalysisMessage('Analyzing GitHub activity & repositories...');
          return prev + 12;
        } else if (prev < 75) {
          setAnalysisMessage('Evaluating profile alignment & industry benchmarks...');
          return prev + 10;
        } else if (prev < 90) {
          setAnalysisMessage('Synthesizing 4-week study plan & questions...');
          return prev + 4;
        }
        return prev;
      });
    }, 1200);

    try {
      const payload = {
        targetRole: selectedRole,
        resumeText: resumeUploadResult?.parsedText || '',
        resumeId: resumeUploadResult?.resumeId || '',
        github: githubInput.trim(),
        linkedin: linkedinInput.trim(),
        linkedinText: linkedinText.trim(),
        manualData: resumeMode === 'manual' ? manualData : null
      };

      const res = await API.analyzeOnboarding(payload);
      clearInterval(interval);
      setAnalysisProgress(100);
      setAnalysisMessage('Analysis complete!');

      if (res && res.analysis) {
        populateAnalysisState(res.analysis, res.sourceStatus);
        await saveDraft(4, { analysisComplete: true });
        setTimeout(() => {
          setStep(4);
        }, 600);
      } else {
        throw new Error('Analysis response was empty.');
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Onboarding analysis error:', err);
      setAnalysisFailed(true);
      setErrorMessage(err.message || 'AI analysis experienced a temporary delay. You can retry or continue with your verified profile.');
    }
  };

  // Step 4 Review: Add/Remove skills
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (!reviewedSkills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setReviewedSkills(prev => [
        ...prev,
        { name: newSkillName.trim(), level: 'Intermediate', evidence: 'manual' }
      ]);
    }
    setNewSkillName('');
  };

  const handleRemoveSkill = (index) => {
    setReviewedSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveProject = (index) => {
    setReviewedProjects(prev => prev.filter((_, i) => i !== index));
  };

  // Step 4: Confirm and enter Dashboard
  const handleConfirmAndComplete = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const selectedRole = targetRole === 'Custom' ? customRole.trim() : targetRole;

      await API.confirmOnboarding({
        confirmedSkills: reviewedSkills,
        confirmedProjects: reviewedProjects,
        targetRole: selectedRole,
        github: githubInput.trim(),
        linkedin: linkedinInput.trim(),
        bio: editingSummary,
        education: resumeMode === 'manual' ? {
          college: manualData.college,
          branch: manualData.branch,
          passingYear: manualData.passingYear
        } : null
      });

      updateOnboardingState({ status: 'completed', currentStep: 4 });
      navigate('/dashboard');
    } catch (err) {
      console.error('Confirm onboarding error:', err);
      setErrorMessage(err.message || 'Could not complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Wizard Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            P
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 font-outfit">Personalized Onboarding</h1>
            <p className="text-[11px] text-slate-500">Step {step} of 4</p>
          </div>
        </div>

        {/* Wizard Stepper Progress Dots */}
        <div className="hidden sm:flex items-center gap-2">
          {[
            { num: 1, label: 'Resume' },
            { num: 2, label: 'Profiles' },
            { num: 3, label: 'AI Scan' },
            { num: 4, label: 'Review' }
          ].map((st) => (
            <div key={st.num} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === st.num
                    ? 'bg-purple-600 text-white shadow'
                    : step > st.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > st.num ? '✓' : st.num}
              </div>
              <span className={`text-xs ${step === st.num ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                {st.label}
              </span>
              {st.num < 4 && <div className="w-4 h-0.5 bg-slate-200 mx-1"></div>}
            </div>
          ))}
        </div>

        {/* Skip button - student is never trapped */}
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          Skip for now
        </button>
      </header>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3 shadow-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold">Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: RESUME (Upload or Manual) */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Step 1: Your Baseline Resume</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                How would you like to start?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Upload your existing resume file, or enter your education and projects manually if you're building from scratch.
              </p>
            </div>

            {/* Toggle: Upload vs Manual */}
            <div className="flex rounded-2xl bg-slate-100 p-1.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setResumeMode('upload')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  resumeMode === 'upload'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4 text-purple-600" />
                I have a resume (PDF/DOCX)
              </button>
              <button
                type="button"
                onClick={() => setResumeMode('manual')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  resumeMode === 'manual'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-600" />
                I don't have one yet
              </button>
            </div>

            {/* OPTION A: UPLOAD RESUME */}
            {resumeMode === 'upload' && (
              <div className="space-y-6">
                {!resumeUploadResult ? (
                  <div className="border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-3xl p-8 text-center bg-purple-50/30 hover:bg-purple-50/60 transition group cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      disabled={uploadProgress}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                      {uploadProgress ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                      ) : (
                        <Upload className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {uploadProgress ? 'Processing & validating resume...' : 'Drop your resume file here or click to browse'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF and DOCX formats (up to 5 MB)
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{resumeUploadResult.fileName}</p>
                        <p className="text-[11px] text-emerald-700 font-medium">
                          ✓ Verified & text extracted ({resumeUploadResult.extractedTextLength} characters)
                        </p>
                        {resumeUploadResult.atsReport?.overallScore > 0 && (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                            Baseline ATS Score: {resumeUploadResult.atsReport.overallScore}%
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* OPTION B: MANUAL ENTRY FORM */}
            {resumeMode === 'manual' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      value={manualData.fullName}
                      onChange={(e) => setManualData({ ...manualData, fullName: e.target.value })}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">College / University</label>
                    <input
                      type="text"
                      value={manualData.college}
                      onChange={(e) => setManualData({ ...manualData, college: e.target.value })}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Branch / Major</label>
                    <input
                      type="text"
                      value={manualData.branch}
                      onChange={(e) => setManualData({ ...manualData, branch: e.target.value })}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Passing Year</label>
                    <input
                      type="text"
                      value={manualData.passingYear}
                      onChange={(e) => setManualData({ ...manualData, passingYear: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Technical Skills (comma-separated) *</label>
                  <input
                    type="text"
                    value={manualData.skills}
                    onChange={(e) => setManualData({ ...manualData, skills: e.target.value })}
                    placeholder="e.g. React.js, Python, SQL, Git, Tailwind"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                {/* Projects section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Notable Projects</label>
                    <button
                      type="button"
                      onClick={handleAddManualProject}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>
                  {manualData.projects.map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 relative">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleUpdateManualProject(idx, 'title', e.target.value)}
                          placeholder="Project title (e.g. PlacementAI PWA)"
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => handleUpdateManualProject(idx, 'technologies', e.target.value)}
                          placeholder="Tech stack (e.g. React, Node.js)"
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={proj.description}
                        onChange={(e) => handleUpdateManualProject(idx, 'description', e.target.value)}
                        placeholder="Short description of what you built and the impact"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                      />
                      {manualData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveManualProject(idx)}
                          className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Option to jump to Resume Builder */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-xs font-bold text-purple-900">Prefer a structured builder?</p>
                    <p className="text-[11px] text-purple-700">Open our Resume Builder with this data pre-filled, then return here.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBuildWithResumeBuilder}
                    className="px-4 py-2 bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 rounded-xl text-xs font-bold transition shrink-0"
                  >
                    Build one with Resume Builder
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleContinueFromStep1}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
              >
                Continue to Profiles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ONLINE PROFILES & TARGET ROLE */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/60">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Step 2: Connect Online Profiles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                Ground Your Personal Plan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                We'll examine your real public GitHub code and target role to create an actionable study roadmap.
              </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              
              {/* Target Role Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Target Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  {TARGET_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {targetRole === 'Custom' && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter custom role (e.g. SRE / Platform Engineer)"
                    className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                )}
              </div>

              {/* GitHub Username / Profile */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-900" /> GitHub Profile or Username (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="e.g. namya0504 or github.com/namya0504"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none pl-9"
                  />
                  <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-400">
                  We'll check your public repositories and languages to ground technical questions in your real code.
                </p>
              </div>

              {/* LinkedIn Profile */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile URL (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={linkedinInput}
                    onChange={(e) => setLinkedinInput(e.target.value)}
                    placeholder="https://linkedin.com/in/your-slug"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 outline-none pl-9"
                  />
                  <Linkedin className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                </div>

                {/* LinkedIn text fallback explanation */}
                <div className="pt-1">
                  {!showLinkedInTextarea ? (
                    <button
                      type="button"
                      onClick={() => setShowLinkedInTextarea(true)}
                      className="text-[11px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Paste your LinkedIn About / Experience text (Recommended)
                    </button>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-600">
                          Paste LinkedIn Profile Text
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowLinkedInTextarea(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600"
                        >
                          Hide
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={linkedinText}
                        onChange={(e) => setLinkedinText(e.target.value)}
                        placeholder="Copy and paste your LinkedIn About, headline, and recent experience text here..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <p className="text-[10px] text-slate-400">
                        LinkedIn restricts automatic web reading without login, so pasting your text ensures complete career insights.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                  <span className="font-semibold text-slate-900">Candidate AI Consent: </span>
                  I agree to let PlacementAI analyze my resume and public profile information using AI to personalize my preparation roadmap.
                </label>
              </div>

            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" /> Start AI Analysis
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ANIMATED ANALYSIS PROGRESS */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-8 animate-fadeIn">
            {!analysisFailed ? (
              <>
                <div className="w-20 h-20 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner relative">
                  <Sparkles className="w-10 h-10 animate-pulse text-purple-600" />
                  <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/20 animate-ping pointer-events-none"></div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit">
                    Synthesizing Your Profile
                  </h3>
                  <p className="text-xs font-semibold text-purple-600 animate-pulse">
                    {analysisMessage}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 transition-all duration-700 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Processing verified skills, public repository metadata, and target role criteria...
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Analysis Paused</h3>
                <p className="text-xs text-slate-500">{errorMessage}</p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Retry Analysis
                  </button>
                  <button
                    onClick={() => {
                      // Fallback: populate basic state and continue
                      populateAnalysisState({
                        profileSummary: `${manualData.fullName || 'Candidate'} preparing for campus placement as a ${targetRole}.`,
                        detectedSkills: manualData.skills ? manualData.skills.split(',').map(s => ({ name: s.trim(), level: 'Intermediate', evidence: 'manual' })) : [],
                        detectedProjects: manualData.projects || [],
                        strengths: ['Self-motivated learner', 'Demonstrated commitment to career preparation'],
                        skillGaps: [{ skill: 'System Design Fundamentals', whyItMatters: 'Key for technical rounds', priority: 'High' }],
                        studyPlan: { durationWeeks: 4, weeks: [] }
                      }, { github: 'skipped', linkedin: 'skipped' });
                      setStep(4);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                  >
                    Continue Without Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRMATION */}
        {step === 4 && analysisResults && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Analysis Ready for Review
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                  Your Personalized Plan & Profile
                </h2>
                <p className="text-xs text-slate-500">
                  Review the detected skills and projects below. You can edit or add items before saving to your profile.
                </p>
              </div>

              {/* Source Transparency Badge */}
              {sourceStatus && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 shrink-0">
                  <p className="font-bold text-slate-700">Verified Sources:</p>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>GitHub: <strong className={sourceStatus.github === 'read' ? 'text-emerald-600' : 'text-slate-600'}>{sourceStatus.github}</strong></span>
                    <span>•</span>
                    <span>LinkedIn: <strong className={sourceStatus.linkedin === 'read' ? 'text-emerald-600' : 'text-slate-600'}>{sourceStatus.linkedin}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Summary Card */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Profile Summary</span>
                <span className="text-[11px] text-purple-500 font-medium">Editable</span>
              </div>
              <textarea
                rows={3}
                value={editingSummary}
                onChange={(e) => setEditingSummary(e.target.value)}
                className="w-full p-3 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Detected Skills Review */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-600" /> Detected Skills ({reviewedSkills.length})
                </h3>
                <span className="text-[11px] text-slate-400">Click &times; to remove unverified skills</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {reviewedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <span>{skill.name}</span>
                    {skill.evidence && (
                      <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-100/80 px-1.5 py-0.5 rounded">
                        {skill.evidence}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-slate-400 hover:text-red-600 ml-0.5"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex items-center gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  placeholder="Add another skill..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Strengths & Skill Gaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
                </h4>
                <ul className="space-y-2">
                  {(analysisResults.strengths || []).map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skill Gaps */}
              <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/30 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Target Role Gaps
                </h4>
                <div className="space-y-2">
                  {(analysisResults.skillGaps || []).map((gap, idx) => (
                    <div key={idx} className="text-xs p-2 rounded-xl bg-white border border-amber-200/60">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{gap.skill}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${gap.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {gap.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{gap.whyItMatters}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Study Plan Preview */}
            {analysisResults.studyPlan?.weeks && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600" /> Personalized 4-Week Study Plan
                  </h3>
                  <span className="text-[11px] text-slate-400">Available on your Dashboard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {analysisResults.studyPlan.weeks.map((w, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Week {w.week}
                      </span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{w.focus}</p>
                      <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                        {(w.tasks || []).slice(0, 2).map((t, tidx) => (
                          <li key={tidx} className="truncate">• {t.title}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Edit Profiles
              </button>
              <button
                type="button"
                onClick={handleConfirmAndComplete}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving Your Profile...
                  </>
                ) : (
                  <>
                    Confirm & Enter Dashboard <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
