import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
  FileText,
  Menu,
  RefreshCw,
  ChevronDown,
  User,
  ArrowRight,
  ShieldCheck,
  Target,
  Award,
  BookOpen,
  Layers,
  Edit3,
  Check,
  X,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ArrowUpRight,
  BarChart3,
  Clock,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { ROUTES } from '../routes/paths';
import { useToast } from '../context/ToastContext';
import { useSidebar } from '../context/SidebarContext';

export default function ATSChecker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, updateProfileData } = useAuth();
  const toast = useToast();
  const { isCollapsed } = useSidebar();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Scanning & Result state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [analyzedSource, setAnalyzedSource] = useState(null); // { name: 'my_resume.pdf', type: 'upload' | 'saved' | 'profile', timestamp: Date }
  const [targetRole, setTargetRole] = useState(currentUser?.targetRole || currentUser?.role || 'Machine Learning');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Input Selection Mode: 'upload' | 'saved' | 'profile'
  const [scanMode, setScanMode] = useState('upload');

  // Staged upload file
  const [stagedFile, setStagedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Saved resumes + profile resume
  const [savedResumes, setSavedResumes] = useState([]);
  const [savedResumesLoaded, setSavedResumesLoaded] = useState(false);
  const [profileResume, setProfileResume] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  // PDF Download state
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const reportPrintRef = useRef(null);

  // Sync target role with currentUser or profile
  useEffect(() => {
    const activeRole = currentUser?.targetRole || currentUser?.role;
    if (activeRole) {
      setTargetRole(activeRole);
    } else {
      API.getProfile().then(p => {
        const pRole = p?.targetRole || p?.role;
        if (pRole) setTargetRole(pRole);
      }).catch(() => {});
    }

    // Load saved resumes & profile-uploaded resume
    API.getResumes().then(list => {
      const resumes = Array.isArray(list) ? list : [];
      setSavedResumes(resumes);
      if (resumes.length > 0 && !selectedResumeId) {
        const primary = resumes.find(r => r.isPrimary) || resumes[0];
        setSelectedResumeId(primary.resumeId);
      }
    }).catch(() => {}).finally(() => setSavedResumesLoaded(true));

    API.getProfileResume().then(r => {
      if (r?.hasResume) setProfileResume(r);
    }).catch(() => {});
  }, [currentUser]);

  // Handle URL query parameter ?resumeId=...
  // Gate analysis behind savedResumesLoaded so the resume list is available before we run.
  useEffect(() => {
    const resumeId = searchParams.get('resumeId');
    if (resumeId && savedResumesLoaded) {
      setSelectedResumeId(resumeId);
      setScanMode('saved');
      handleAnalyzeSavedResume(resumeId);
    }
  }, [searchParams, savedResumesLoaded]);

  // Handle Role Save & Sync across Profile and Resume Builder
  const handleSaveRole = async (newRole) => {
    const trimmed = (newRole || customRoleInput).trim();
    if (!trimmed) return;
    setTargetRole(trimmed);
    setIsSavingRole(true);
    try {
      const updated = await API.updateProfile({ role: trimmed, targetRole: trimmed });
      updateProfileData(updated || { role: trimmed, targetRole: trimmed });
    } catch (err) {
      console.warn('Failed to sync target role to profile:', err);
    } finally {
      setIsSavingRole(false);
      setIsEditingRole(false);
      setCustomRoleInput('');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setStagedFile(file);
      setErrorMessage('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setStagedFile(file);
      setErrorMessage('');
    }
  };

  // Execute scan for uploaded or staged file
  const handleAnalyzeFile = async (fileToScan = stagedFile) => {
    if (!fileToScan) {
      setErrorMessage('Please select a PDF or DOCX resume file to upload.');
      return;
    }

    setIsScanning(true);
    setErrorMessage('');
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', fileToScan);
      formData.append('targetRole', targetRole);

      const result = await API.analyzeATS(formData, true);
      if (result && typeof result.overallScore === 'number') {
        setScanResult({
          score: result.overallScore,
          goodPoints: result.summary?.goodPoints || [],
          needsImprovement: result.summary?.needsImprovement || [],
          metrics: result.metrics || { keywordMatch: 0, contentQuality: 0, formatting: 0, readability: 0 },
          missingKeywords: result.missingKeywords || [],
          actionableSuggestions: result.actionableSuggestions || []
        });
        setAnalyzedSource({
          name: fileToScan.name,
          type: 'Uploaded File',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        throw new Error('Invalid analysis response received from server.');
      }
    } catch (err) {
      console.error('ATS API Error:', err.message);
      setErrorMessage(err.message || 'Failed to analyze resume. Please ensure the file is readable and not password-protected.');
    } finally {
      setIsScanning(false);
    }
  };

  // Execute scan for saved resume
  const handleAnalyzeSavedResume = async (specificResumeId = selectedResumeId) => {
    if (!specificResumeId) {
      setErrorMessage('Please select a saved resume to analyze.');
      return;
    }

    setIsScanning(true);
    setErrorMessage('');
    setScanResult(null);

    try {
      const payload = { targetRole, resumeId: specificResumeId };
      const result = await API.analyzeATS(payload);
      if (result && typeof result.overallScore === 'number') {
        const found = savedResumes.find(r => r.resumeId === specificResumeId);
        setScanResult({
          score: result.overallScore,
          goodPoints: result.summary?.goodPoints || [],
          needsImprovement: result.summary?.needsImprovement || [],
          metrics: result.metrics || { keywordMatch: 0, contentQuality: 0, formatting: 0, readability: 0 },
          missingKeywords: result.missingKeywords || [],
          actionableSuggestions: result.actionableSuggestions || []
        });
        setAnalyzedSource({
          name: found?.title || 'PlacementAI Saved Resume',
          type: 'PlacementAI Resume',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        throw new Error('Invalid analysis response received from server.');
      }
    } catch (err) {
      console.error('ATS API Error:', err.message);
      setErrorMessage(err.message || 'Failed to analyze resume. Please ensure the resume content is complete.');
    } finally {
      setIsScanning(false);
    }
  };

  // Execute scan for profile resume
  const handleAnalyzeProfileResume = async () => {
    if (!profileResume?.resumeDownloadUrl) {
      setErrorMessage('Your profile resume could not be located. You can upload one in your Profile.');
      return;
    }

    setIsScanning(true);
    setErrorMessage('');
    setScanResult(null);

    try {
      const resp = await fetch(profileResume.resumeDownloadUrl);
      const blob = await resp.blob();
      const file = new File([blob], profileResume.resumeFileName || 'profile_resume.pdf', { type: blob.type });

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);

      const result = await API.analyzeATS(formData, true);
      if (result && typeof result.overallScore === 'number') {
        setScanResult({
          score: result.overallScore,
          goodPoints: result.summary?.goodPoints || [],
          needsImprovement: result.summary?.needsImprovement || [],
          metrics: result.metrics || { keywordMatch: 0, contentQuality: 0, formatting: 0, readability: 0 },
          missingKeywords: result.missingKeywords || [],
          actionableSuggestions: result.actionableSuggestions || []
        });
        setAnalyzedSource({
          name: profileResume.resumeFileName || 'Profile Resume',
          type: 'Profile Upload',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        throw new Error('Invalid analysis response received.');
      }
    } catch (err) {
      console.error('Profile ATS error:', err);
      setErrorMessage(err.message || 'Failed to analyze profile resume.');
    } finally {
      setIsScanning(false);
    }
  };

  // Generate and download PDF ATS report using html2pdf.js
  const handleDownloadPdfReport = async () => {
    if (!scanResult) return;
    setIsDownloadingPdf(true);

    try {
      const reportElement = document.getElementById('ats-report-pdf-template');
      if (!reportElement) {
        throw new Error('Report template container not found in DOM.');
      }

      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const candidateName = (currentUser?.name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
      const roleSlug = (targetRole || 'Role').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `PlacementAI_ATS_Report_${candidateName}_${roleSlug}.pdf`;

      const opt = {
        margin: [10, 10, 10, 10],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(reportElement).set(opt).save();
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Could not export report as PDF: ' + err.message);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Computed Score Metrics
  const score = scanResult ? scanResult.score : 0;
  const scoreLabel = score >= 80 ? 'Exceptional Fit' : score >= 65 ? 'Competitive Match' : 'Needs Optimization';
  const scoreBadgeColor = score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : score >= 65 ? 'text-[#7C3AED] bg-[#EDE9FE] border-[#DDD6FE]' : 'text-amber-700 bg-amber-50 border-amber-200';
  const strokeColor = score >= 80 ? '#10B981' : score >= 65 ? '#7C3AED' : '#F59E0B';
  const strokeOffset = Math.round(427 - (427 * score) / 100);

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">ATS Resume Analysis</h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                  <Sparkles className="w-3 h-3" /> AI Diagnostic
                </span>
              </div>
              <p className="text-xs text-slate-500">Benchmark your resume formatting, keywords, and recruiter parseability</p>
            </div>
          </div>

          {/* Target Role Indicator / Quick Selector */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] text-xs">
              <Target className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="text-slate-500 font-medium">Target Role:</span>
              <span className="font-bold text-slate-800">{targetRole || 'Not Set'}</span>
              <button
                onClick={() => { setIsEditingRole(!isEditingRole); setCustomRoleInput(targetRole); }}
                className="ml-1 p-1 text-[#7C3AED] hover:text-[#6D28D9] rounded-md hover:bg-purple-50 transition"
                title="Change Target Role"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Inline Target Role Editor Modal / Dropdown */}
        {isEditingRole && (
          <div className="bg-white border-b border-[#EAEBF4] px-4 sm:px-8 py-3.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-bold text-slate-800">Set Target Role for Resume Benchmarking:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={['Machine Learning', 'Machine Learning Engineer', 'Data Scientist', 'Software Developer', 'Full Stack Engineer', 'Mobile App Developer', 'Product Manager', 'UI/UX Designer', 'Cloud / DevOps Engineer'].includes(customRoleInput) ? customRoleInput : 'Custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'Custom') {
                      setCustomRoleInput(e.target.value);
                      handleSaveRole(e.target.value);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#EAEBF4] text-xs font-semibold text-slate-800 bg-[#F8F9FE] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                >
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Mobile App Developer">Mobile App Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                  <option value="Custom">Custom Role...</option>
                </select>
                <input
                  type="text"
                  placeholder="Or enter custom role..."
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRole(customRoleInput); }}
                  className="px-3 py-1.5 rounded-xl border border-[#EAEBF4] text-xs text-slate-800 bg-white focus:ring-2 focus:ring-[#7C3AED] focus:outline-none w-48"
                />
                <button
                  onClick={() => handleSaveRole(customRoleInput)}
                  disabled={isSavingRole}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSavingRole ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isSavingRole ? 'Saving…' : 'Apply'}</span>
                </button>
                <button
                  onClick={() => setIsEditingRole(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* SCANNER CONTROLLER CARD                                         */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-sm space-y-6">
            
            {/* Top Bar inside Scanner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEBF4] pb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit">Choose Resume Source to Benchmark</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analyze against hiring algorithms tailored for <span className="font-bold text-[#7C3AED]">{targetRole}</span>
                </p>
              </div>

              {/* Segmented Mode Selector */}
              <div className="flex items-center p-1 bg-[#F8F9FE] border border-[#EAEBF4] rounded-2xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => { setScanMode('upload'); setErrorMessage(''); }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    scanMode === 'upload'
                      ? 'bg-white text-[#7C3AED] shadow-sm border border-[#EAEBF4]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setScanMode('saved'); setErrorMessage(''); }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    scanMode === 'saved'
                      ? 'bg-white text-[#7C3AED] shadow-sm border border-[#EAEBF4]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Saved Resumes ({savedResumes.length})
                </button>
                {/* Profile Resume tab — always shown; disabled with tooltip when no resume uploaded */}
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => { if (profileResume) { setScanMode('profile'); setErrorMessage(''); } }}
                    disabled={!profileResume}
                    aria-disabled={!profileResume}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      !profileResume
                        ? 'text-slate-400 cursor-not-allowed opacity-60'
                        : scanMode === 'profile'
                          ? 'bg-white text-[#7C3AED] shadow-sm border border-[#EAEBF4]'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Profile Resume
                  </button>
                  {!profileResume && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 text-center text-[10px] font-semibold bg-slate-800 text-white rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-normal leading-snug">
                      No resume uploaded yet — go to Profile to upload
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ── MODE 1: UPLOAD FILE ── */}
            {scanMode === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? 'border-[#7C3AED] bg-[#EDE9FE]/40 scale-[1.01]'
                      : stagedFile
                      ? 'border-purple-300 bg-purple-50/20'
                      : 'border-purple-200 bg-[#F8F9FE] hover:border-purple-400 hover:bg-purple-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isScanning}
                  />

                  <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shadow-inner">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800 font-outfit">
                      {stagedFile ? stagedFile.name : 'Drag & drop your resume file here'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {stagedFile
                        ? `${(stagedFile.size / 1024).toFixed(1)} KB · Click to replace file`
                        : 'Supports PDF, DOCX, DOC, or TXT (Max 10 MB)'}
                    </p>
                  </div>

                  {!stagedFile && (
                    <span className="px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-purple-500/20 hover:bg-[#6D28D9] transition">
                      Browse Computer
                    </span>
                  )}
                </div>

                {stagedFile && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-purple-50/70 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED]">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{stagedFile.name}</p>
                        <p className="text-[11px] text-slate-500">{(stagedFile.size / 1024).toFixed(1)} KB · Ready to scan for {targetRole}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setStagedFile(null)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-[#EAEBF4] text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        disabled={isScanning}
                        onClick={() => handleAnalyzeFile(stagedFile)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25 transition disabled:opacity-50"
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Analyzing Resume…</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Run ATS Scan Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── MODE 2: SAVED RESUMES ── */}
            {scanMode === 'saved' && (
              <div className="space-y-4">
                {savedResumes.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-[#F8F9FE] border border-[#EAEBF4] rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No PlacementAI Resumes Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      You haven’t built a resume in PlacementAI yet. Create one tailored for {targetRole} in minutes.
                    </p>
                    <button
                      onClick={() => navigate(ROUTES.resumeBuilder)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-purple-500/20 hover:bg-[#6D28D9] transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Go to Resume Builder
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedResumes.map((resume) => {
                      const isSelected = selectedResumeId === resume.resumeId;
                      return (
                        <div
                          key={resume.resumeId}
                          onClick={() => setSelectedResumeId(resume.resumeId)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#7C3AED] bg-purple-50/40 shadow-sm ring-2 ring-[#7C3AED]/20'
                              : 'border-[#EAEBF4] bg-white hover:border-purple-200 hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            {resume.isPrimary && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200">
                                ⭐ Primary
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {resume.title || 'Untitled Resume'}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {resume.role || targetRole} · {resume.templateId || 'modern'}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">
                              {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Active'}
                            </span>
                            <button
                              type="button"
                              disabled={isScanning}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedResumeId(resume.resumeId);
                                handleAnalyzeSavedResume(resume.resumeId);
                              }}
                              className="px-3 py-1 rounded-xl bg-[#7C3AED] text-white text-[11px] font-bold hover:bg-[#6D28D9] transition flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              {isScanning && selectedResumeId === resume.resumeId ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              Scan
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── MODE 3: PROFILE RESUME ── */}
            {scanMode === 'profile' && profileResume && (
              <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{profileResume.resumeFileName || 'Profile Resume'}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Verified Profile File
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {profileResume.resumeFileSize ? `${(profileResume.resumeFileSize / 1024).toFixed(1)} KB · ` : ''}
                      Uploaded from your student profile
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {profileResume.resumeDownloadUrl && (
                    <a
                      href={profileResume.resumeDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#EAEBF4] text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" /> View File
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={handleAnalyzeProfileResume}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Profile Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* ANALYSIS RESULTS DASHBOARD (SHOWN WHEN SCAN RESULT IS READY)  */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {scanResult ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Results Top Header & Action Controls */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAEBF4] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                        {analyzedSource?.name || 'Resume'} Evaluation
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${scoreBadgeColor}`}>
                        {scoreLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target Role: <span className="font-bold text-slate-800">{targetRole}</span> · Evaluated at {analyzedSource?.timestamp || 'Just now'}
                    </p>
                  </div>
                </div>

                {/* Main Action Buttons: Download Report & Open Builder */}
                <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadPdfReport}
                    disabled={isDownloadingPdf}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF Report…</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download ATS Report (PDF)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.resumeBuilder)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-[#EAEBF4] hover:bg-purple-50 hover:border-purple-200 text-slate-800 text-xs font-bold transition shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Open in Builder</span>
                  </button>
                </div>
              </div>

              {/* Main Score Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                
                {/* Radial Gauge Meter */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Overall Recruiter Compatibility
                  </span>

                  <div className="relative w-44 h-44 flex items-center justify-center my-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="88" cy="88" r="68" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                      <circle
                        cx="88"
                        cy="88"
                        r="68"
                        stroke={strokeColor}
                        strokeWidth="12"
                        strokeDasharray="427"
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-slate-900 font-outfit">
                        {score}<span className="text-base font-semibold text-slate-400">/100</span>
                      </span>
                      <span className={`text-xs font-bold mt-0.5 ${score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-[#7C3AED]' : 'text-amber-600'}`}>
                        {scoreLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F9FE] rounded-2xl border border-[#EAEBF4] w-full text-center">
                    <p className="text-xs text-slate-600">
                      {score >= 80
                        ? `🎉 Exceptional candidate match for ${targetRole}. Passes automated screening algorithms.`
                        : score >= 65
                        ? `Good foundation for ${targetRole}. Recommended keyword adjustments below will push it past 80+.`
                        : `Needs structural and keyword optimization to safely pass ${targetRole} recruiter screening.`}
                    </p>
                  </div>
                </div>

                {/* 4 Performance Metric Bars */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-sm space-y-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-[#EAEBF4] pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-outfit">Core ATS Scoring Dimensions</h3>
                      <p className="text-xs text-slate-500">Evaluated across industry benchmarks for {targetRole}</p>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-1 rounded-full border border-[#DDD6FE]">
                      4 Pillars Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Metric 1 */}
                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">Keyword Relevance</span>
                        <span className="text-[#7C3AED] font-extrabold">{scanResult.metrics.keywordMatch || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7C3AED] rounded-full transition-all duration-1000"
                          style={{ width: `${scanResult.metrics.keywordMatch || 0}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Overlap with {targetRole} job descriptions</p>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">Content Quality & Impact</span>
                        <span className="text-[#7C3AED] font-extrabold">{scanResult.metrics.contentQuality || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7C3AED] rounded-full transition-all duration-1000"
                          style={{ width: `${scanResult.metrics.contentQuality || 0}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Action verbs and quantifiable metrics</p>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">ATS Formatting & Layout</span>
                        <span className="text-emerald-600 font-extrabold">{scanResult.metrics.formatting || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${scanResult.metrics.formatting || 0}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Headers, fonts, tables, and parseability</p>
                    </div>

                    {/* Metric 4 */}
                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">Readability & Structure</span>
                        <span className="text-amber-600 font-extrabold">{scanResult.metrics.readability || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                          style={{ width: `${scanResult.metrics.readability || 0}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Bullet length, section order, and clarity</p>
                    </div>

                  </div>
                </div>

              </div>

              {/* Strengths & Improvements Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                
                {/* Good Points */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAEBF4] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#EAEBF4] pb-3.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-outfit">Validated Strengths</h3>
                    <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {scanResult.goodPoints.length} Positive Matches
                    </span>
                  </div>

                  {scanResult.goodPoints.length > 0 ? (
                    <div className="space-y-3">
                      {scanResult.goodPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">No explicit strengths highlighted.</p>
                  )}
                </div>

                {/* Needs Improvement */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAEBF4] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#EAEBF4] pb-3.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-outfit">Areas for Improvement</h3>
                    <span className="ml-auto text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {scanResult.needsImprovement.length} Optimization Flags
                    </span>
                  </div>

                  {scanResult.needsImprovement.length > 0 ? (
                    <div className="space-y-3">
                      {scanResult.needsImprovement.map((pt, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-slate-800">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-medium leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 py-4 text-center font-bold">Awesome! No major red flags identified.</p>
                  )}
                </div>

              </div>

              {/* Missing Keywords & Actionable Suggestions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                
                {/* Missing Keywords Cloud */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#EAEBF4] shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAEBF4] pb-3.5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-outfit">Missing Keywords for {targetRole}</h3>
                      <p className="text-xs text-slate-500">Recruiter search phrases absent from your current resume</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {scanResult.missingKeywords.length > 0 ? (
                      scanResult.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] text-[#7C3AED] text-xs font-bold border border-[#DDD6FE] flex items-center gap-1.5 shadow-sm"
                        >
                          <Sparkles className="w-3 h-3 text-[#7C3AED]" /> {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 py-4">No critical keywords missing!</span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    💡 <span className="font-semibold text-slate-700">Pro tip:</span> Integrate these terms naturally under your technical skills or project descriptions to increase recruiter filter match rate.
                  </p>
                </div>

                {/* Actionable Suggestions */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#EAEBF4] shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EAEBF4] pb-3.5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-outfit">Actionable AI Recommendations</h3>
                      <p className="text-xs text-slate-500">Prioritized checklist to boost your resume score</p>
                    </div>
                  </div>

                  {scanResult.actionableSuggestions?.length > 0 ? (
                    <div className="space-y-2.5">
                      {scanResult.actionableSuggestions.map((sug, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-[#F8F9FE] border border-[#EAEBF4]">
                          <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{sug}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">Resume meets standard criteria.</p>
                  )}
                </div>

              </div>

            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════ */
            /* PRE-SCAN INFORMATIVE EDUCATIONAL CARDS                          */
            /* ═══════════════════════════════════════════════════════════════ */
            <div className="space-y-8">
              
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
                  Industry Recruiter Standards
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">
                  What Our ATS Diagnostic Analyzes
                </h3>
                <p className="text-xs text-slate-500">
                  Leading companies (Google, Microsoft, Amazon) filter over 75% of applications through automated parsing engines. We test your resume against these exact criteria.
                </p>
              </div>

              {/* 4 Diagnostic Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-sm space-y-3 hover:border-purple-300 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-outfit">ATS Parseability</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Validates that multi-column layouts, custom icons, and tables don’t cause parsing errors in systems like Workday or Taleo.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-sm space-y-3 hover:border-purple-300 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition">
                    <Target className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-outfit">Target Role Keywords</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Compares your skills and stack with real-world job postings for <span className="font-semibold text-slate-800">{targetRole}</span> to ensure strong keyword density.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-sm space-y-3 hover:border-purple-300 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-outfit">Quantified Impact</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Checks for numerical data, percentage improvements, and active STAR bullet points over generic task descriptions.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-sm space-y-3 hover:border-purple-300 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-outfit">Section Hierarchy</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Audits standard heading conventions (Experience, Education, Projects) for instant recruiter scan speed under 6 seconds.
                  </p>
                </div>

              </div>

              {/* Benchmarking Tier Guide */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 font-outfit">ATS Readiness Score Tiers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span>80 – 100 Score</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">Interview Ready</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Top 10% candidate fit. Guaranteed to pass standard automated filters and land recruiter review.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                      <span>65 – 79 Score</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px]">Competitive</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Solid foundation. Minor additions to missing keywords and metrics will push it into the top bracket.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                      <span>Below 65 Score</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">Needs Optimization</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      High risk of automated filter drop. Requires keyword injection and action-oriented bullet points.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HIDDEN PRINT CONTAINER FOR PDF REPORT GENERATION                */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {scanResult && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            id="ats-report-pdf-template"
            ref={reportPrintRef}
            style={{
              width: '794px',
              minHeight: '1123px',
              padding: '36px 44px',
              backgroundColor: '#FFFFFF',
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: '#1E293B',
              boxSizing: 'border-box'
            }}
          >
            {/* PDF Header with PlacementAI Logo */}
            <div style={{ borderBottom: '2px solid #7C3AED', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7C3AED', letterSpacing: '-0.5px' }}>
                  PlacementAI
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Applicant Tracking System (ATS) Diagnostic & Benchmark Report
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748B' }}>
                <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                <div>Candidate: <strong style={{ color: '#0F172A' }}>{currentUser?.name || 'Student Candidate'}</strong></div>
                <div>Target Role: <strong style={{ color: '#7C3AED' }}>{targetRole}</strong></div>
              </div>
            </div>

            {/* Score Executive Banner */}
            <div style={{ margin: '24px 0', padding: '18px 24px', backgroundColor: '#F8F9FE', border: '1px solid #EAEBF4', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>
                  Overall ATS Compatibility Score
                </div>
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px', maxWidth: '440px' }}>
                  Evaluated against hiring standards for <strong>{targetRole}</strong>. Measures keyword presence, formatting integrity, and impact quantification.
                </div>
              </div>
              <div style={{ textAlign: 'center', backgroundColor: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', border: '1px solid #DDD6FE' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: strokeColor, lineHeight: '1' }}>
                  {score}<span style={{ fontSize: '16px', color: '#94A3B8' }}>/100</span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: strokeColor, marginTop: '4px' }}>
                  {scoreLabel}
                </div>
              </div>
            </div>

            {/* 4 Pillars Breakdown Table */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0F172A', marginBottom: '10px' }}>
                Core Dimension Breakdown
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', padding: '8px 0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#334155' }}>Keyword Relevance Match</td>
                    <td style={{ padding: '8px 12px', color: '#64748B' }}>Terminology & skills for {targetRole}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#7C3AED' }}>
                      {scanResult.metrics.keywordMatch || 0}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#334155' }}>Content Quality & Impact</td>
                    <td style={{ padding: '8px 12px', color: '#64748B' }}>Action verbs & quantifiable metrics</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#7C3AED' }}>
                      {scanResult.metrics.contentQuality || 0}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#334155' }}>ATS Formatting & Parseability</td>
                    <td style={{ padding: '8px 12px', color: '#64748B' }}>Hierarchy, fonts, section labels</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#10B981' }}>
                      {scanResult.metrics.formatting || 0}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#334155' }}>Readability & Flow</td>
                    <td style={{ padding: '8px 12px', color: '#64748B' }}>Bullet structure and linear flow</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'bold', color: '#F59E0B' }}>
                      {scanResult.metrics.readability || 0}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              
              {/* Validated Strengths */}
              <div style={{ padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534', marginBottom: '10px' }}>
                  ✓ Validated Resume Strengths
                </div>
                <div style={{ fontSize: '11px', color: '#1E293B', lineHeight: '1.6' }}>
                  {scanResult.goodPoints.length > 0 ? (
                    scanResult.goodPoints.map((pt, i) => (
                      <div key={i} style={{ marginBottom: '6px' }}>• {pt}</div>
                    ))
                  ) : (
                    <div>No major strengths noted.</div>
                  )}
                </div>
              </div>

              {/* Optimization Opportunities */}
              <div style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF3C7' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#92400E', marginBottom: '10px' }}>
                  ⚠ Critical Optimization Areas
                </div>
                <div style={{ fontSize: '11px', color: '#1E293B', lineHeight: '1.6' }}>
                  {scanResult.needsImprovement.length > 0 ? (
                    scanResult.needsImprovement.map((pt, i) => (
                      <div key={i} style={{ marginBottom: '6px' }}>• {pt}</div>
                    ))
                  ) : (
                    <div>No red flags found.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Recommended Keywords for Target Role */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#F8F9FE', borderRadius: '12px', border: '1px solid #EAEBF4' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>
                Recommended High-Frequency Keywords for {targetRole}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
                Integrate these industry keywords into your Projects or Skills section to maximize ATS ranking:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {scanResult.missingKeywords.length > 0 ? (
                  scanResult.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#EDE9FE',
                        color: '#7C3AED',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid #DDD6FE'
                      }}
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '11px', color: '#10B981' }}>All core role keywords present.</span>
                )}
              </div>
            </div>

            {/* Actionable Next Steps */}
            {scanResult.actionableSuggestions?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>
                  Actionable Steps to Increase ATS Score
                </div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.6' }}>
                  {scanResult.actionableSuggestions.map((sug, i) => (
                    <div key={i} style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 'bold', color: '#7C3AED', marginRight: '6px' }}>{i + 1}.</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Report Verification Footer */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94A3B8' }}>
              <div>PlacementAI Intelligent Career Engine · Proprietary Diagnostic Report</div>
              <div>Report ID: ATS-{Date.now().toString(36).toUpperCase()}</div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
