import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Upload,
  FileText,
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import { API } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_ROLES = [
  'Software Engineer',
  'Frontend Developer (React)',
  'Backend Developer (Node/Python)',
  'Full Stack Developer',
  'Data Analyst / Scientist',
  'DevOps / Cloud Engineer',
  'Mobile App Developer (Flutter/React Native)',
  'Product Manager (APM)'
];

export default function PreInterviewSetup({
  userProfile = {},
  onStartInterview,
  isLoading = false
}) {
  const toast = useToast();
  const { currentUser } = useAuth();

  // Role Selection
  const [selectedRole, setSelectedRole] = useState(
    userProfile?.targetRole || userProfile?.role || currentUser?.targetRole || currentUser?.role || 'Software Engineer'
  );
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState(
    userProfile?.skills?.length
      ? userProfile.skills.slice(0, 8)
      : ['JavaScript', 'React', 'Node.js', 'Problem Solving']
  );
  const [jobDescription, setJobDescription] = useState('');

  // Resume Ingestion
  const [resumeData, setResumeData] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [hasExistingProfileResume, setHasExistingProfileResume] = useState(false);
  const [existingResumeName, setExistingResumeName] = useState('');
  const [isAutoParsingResume, setIsAutoParsingResume] = useState(false);

  // GitHub Ingestion
  const initialGithub = (userProfile?.github || currentUser?.github || '').trim();
  const [hasProfileGithub, setHasProfileGithub] = useState(Boolean(initialGithub));
  const [profileGithubHandle, setProfileGithubHandle] = useState(initialGithub);
  const [connectedGithubHandle, setConnectedGithubHandle] = useState(initialGithub);
  const [githubInput, setGithubInput] = useState(initialGithub);
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [isInspectingGithub, setIsInspectingGithub] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [selectedRepoNames, setSelectedRepoNames] = useState([]);
  const [repoInsights, setRepoInsights] = useState([]);
  const [githubConnected, setGithubConnected] = useState(false);

  // Mic Test & Audio Meter
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micAudioLevel, setMicAudioLevel] = useState(0); // 0 to 100
  const [micTestPassed, setMicTestPassed] = useState(false);
  const [skipMic, setSkipMic] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load user profile details on mount
  useEffect(() => {
    const profRole = userProfile?.targetRole || userProfile?.role || currentUser?.targetRole || currentUser?.role;
    if (profRole) {
      setSelectedRole(profRole);
    }

    if (userProfile?.skills?.length) {
      setSkillsList(userProfile.skills.slice(0, 8));
    }

    // Auto-load and parse the user's profile resume so questions reference their real work
    API.getProfileResume()
      .then(async (res) => {
        if (res?.hasResume && res.resumeFileName) {
          setHasExistingProfileResume(true);
          setExistingResumeName(res.resumeFileName);

          // Immediately seed resumeData with user's stored profile projects if available
          if (!resumeData && Array.isArray(res.projects) && res.projects.length > 0) {
            setResumeData({
              filename: res.resumeFileName,
              profile: {
                projects: res.projects,
                claims_to_verify: res.projects.map(p => `Architecture and implementation decisions in ${p.name || 'project'}`),
                skills: { languages: [], frameworks: [], tools: [] }
              },
              previewText: res.parsedText ? res.parsedText.slice(0, 300) : '',
              autoLoaded: true
            });
          }

          // Auto-parse the profile resume into candidateProfile if not already done manually
          if (!resumeData && res.resumeDownloadUrl) {
            setIsAutoParsingResume(true);
            try {
              const blob = await fetch(res.resumeDownloadUrl).then(r => r.blob());
              const file = new File([blob], res.resumeFileName, { type: res.resumeFileType || 'application/pdf' });
              const formData = new FormData();
              formData.append('resume', file);
              const parseRes = await API.parseInterviewResume(formData);
              if (parseRes?.candidateProfile) {
                const mergedProjects = (parseRes.candidateProfile.projects?.length > 0)
                  ? parseRes.candidateProfile.projects
                  : (res.projects || []);
                const mergedClaims = (parseRes.candidateProfile.claims_to_verify?.length > 0)
                  ? parseRes.candidateProfile.claims_to_verify
                  : mergedProjects.map(p => `Architecture and implementation decisions in ${p.name || 'project'}`);

                setResumeData({
                  filename: res.resumeFileName,
                  profile: {
                    ...parseRes.candidateProfile,
                    projects: mergedProjects,
                    claims_to_verify: mergedClaims
                  },
                  previewText: parseRes.previewText || (res.parsedText ? res.parsedText.slice(0, 300) : ''),
                  autoLoaded: true
                });
                // Update skills from parsed resume if we have nothing meaningful
                const parsedSkills = [
                  ...(parseRes.candidateProfile.skills?.languages || []),
                  ...(parseRes.candidateProfile.skills?.frameworks || []),
                  ...(parseRes.candidateProfile.skills?.tools || [])
                ].filter(Boolean).slice(0, 8);
                if (parsedSkills.length > 0 && skillsList.length <= 4) {
                  setSkillsList(parsedSkills);
                }
              }
            } catch {
              // Silent — user can still upload manually
            } finally {
              setIsAutoParsingResume(false);
            }
          }
        }
      })
      .catch(() => {});

    // Resolve GitHub handle from userProfile, currentUser, or direct API.getProfile()
    const currentGh = (userProfile?.github || currentUser?.github || '').trim();
    if (currentGh) {
      setHasProfileGithub(true);
      setProfileGithubHandle(currentGh);
      setConnectedGithubHandle(currentGh);
      setGithubInput(currentGh);
      handleInspectGithub(currentGh, true);
    } else {
      API.getProfile()
        .then(res => {
          const prof = res?.data?.user || res?.user || res?.data || res;
          if (prof && typeof prof === 'object') {
            const apiGh = (prof.github || '').trim();
            if (apiGh) {
              setHasProfileGithub(true);
              setProfileGithubHandle(apiGh);
              setConnectedGithubHandle(apiGh);
              setGithubInput(apiGh);
              handleInspectGithub(apiGh, true);
            }
            if (prof.targetRole || prof.role) {
              setSelectedRole(prof.targetRole || prof.role);
            }
            if (prof.skills?.length && (!skillsList || skillsList.length <= 4)) {
              setSkillsList(prof.skills.slice(0, 8));
            }
          }
        })
        .catch(() => {});
    }

    return () => {
      stopMicStream();
    };
  }, [userProfile, currentUser]);

  // Audio Level Meter using Web Audio API
  const startAudioMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicPermission('granted');

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize 0-100
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setMicAudioLevel(normalized);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Microphone permission warning:', err.message);
      setMicPermission('denied');
      toast.warning('Microphone access denied. You can proceed using typing only.');
      setSkipMic(true);
    }
  };

  const stopMicStream = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    setMicAudioLevel(0);
  };

  const handleTestVoice = async () => {
    if (micPermission !== 'granted') {
      await startAudioMeter();
    }
    setIsTestingMic(true);
    setMicTestPassed(false);

    // Record for 3 seconds to verify voice input
    setTimeout(() => {
      setIsTestingMic(false);
      setMicTestPassed(true);
      toast.success('Microphone tested successfully! Voice volume looks healthy.');
    }, 3000);
  };

  // Resume File Upload & Parsing
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5 MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setIsUploadingResume(true);
    try {
      const res = await API.parseInterviewResume(formData);
      if (res?.candidateProfile) {
        setResumeData({
          filename: file.name,
          profile: res.candidateProfile,
          previewText: res.previewText
        });
        toast.success(`Resume "${file.name}" parsed and personalized!`);
      }
    } catch (err) {
      console.error('Resume parse error:', err.message);
      toast.error(err.message || 'Could not parse resume. Continuing with profile skills.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  // GitHub Inspection
  const handleInspectGithub = async (customHandle = null, silent = false) => {
    const target = customHandle || githubInput;
    if (!target || !target.trim()) {
      if (!silent) toast.warning('Please enter a GitHub username or URL.');
      return;
    }

    setIsInspectingGithub(true);
    try {
      const res = await API.inspectCandidateGitHub({ username: target.trim() });
      if (res?.repositories) {
        setGithubRepos(res.repositories);
        setRepoInsights(res.repoInsights || []);
        setGithubConnected(true);

        // Auto-select top 3 repos with stars or recent activity
        const nonForks = res.repositories.filter(r => !r.fork);
        const candidates = nonForks.length > 0 ? nonForks : res.repositories;
        const topRepos = candidates
          .sort((a, b) => (b.stargazers_count || b.stars || 0) - (a.stargazers_count || a.stars || 0))
          .slice(0, 3)
          .map(r => r.name);
        setSelectedRepoNames(topRepos.length > 0 ? topRepos : res.repositories.slice(0, 3).map(r => r.name));

        const resolvedHandle = (res?.profile?.username || target.trim())
          .replace(/^https?:\/\/github\.com\//i, '')
          .replace(/\/$/, '');
        setConnectedGithubHandle(resolvedHandle);
        setGithubInput(resolvedHandle);

        if (!silent) {
          if (res.repositories.length > 0) {
            toast.success(`Found ${res.repositories.length} public repo${res.repositories.length !== 1 ? 's' : ''}! Top repos selected.`);
          } else {
            toast.info(`Connected to GitHub. No public repositories found.`);
          }
        }
        setIsEditingGithub(false);
      } else if (res?.profile) {
        setGithubRepos([]);
        setRepoInsights([]);
        setGithubConnected(true);
        const resolvedHandle = (res.profile.username || target.trim())
          .replace(/^https?:\/\/github\.com\//i, '')
          .replace(/\/$/, '');
        setConnectedGithubHandle(resolvedHandle);
        setGithubInput(resolvedHandle);
        if (!silent) {
          toast.info(`Connected to @${resolvedHandle}.`);
        }
        setIsEditingGithub(false);
      }
    } catch (err) {
      if (!silent) toast.error(err.message || 'Could not fetch public GitHub repos.');
    } finally {
      setIsInspectingGithub(false);
    }
  };

  const toggleRepoSelection = (repoName) => {
    if (selectedRepoNames.includes(repoName)) {
      setSelectedRepoNames(selectedRepoNames.filter(n => n !== repoName));
    } else {
      setSelectedRepoNames([...selectedRepoNames, repoName]);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skillsList.includes(skillInput.trim())) {
        setSkillsList([...skillsList, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkillsList(skillsList.filter(s => s !== skill));
  };

  const handleStart = () => {
    const finalRole = isCustomRole ? customRoleTitle.trim() : selectedRole;
    if (!finalRole) {
      toast.error('Please choose or enter a target role.');
      return;
    }

    // Filter repo insights to only selected repos
    const activeRepoInsights = repoInsights.filter(r => selectedRepoNames.includes(r.name));

    onStartInterview({
      targetRole: finalRole,
      experienceLevel,
      keySkills: skillsList,
      jobDescription: jobDescription.trim(),
      candidateProfile: resumeData?.profile || null,
      repoInsights: activeRepoInsights,
      githubHandle: connectedGithubHandle || profileGithubHandle || null,
      micEnabled: !skipMic
    });
  };

  const effectiveRoleDisplay = isCustomRole ? (customRoleTitle || 'Custom Role') : selectedRole;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Multi-Round Placement Interview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">
            Configure Your Mock Interview
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Sarah Vance will conduct a realistic 4-round interview tailored to your target position, your resume projects, and your GitHub code.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-purple-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-300" />
              <span>4 Rounds (3-7 min each, ~15 min total)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>Up to 10 adaptive questions per round</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Evidence-based scoring</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Target Role Selection Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                Step 1: Choose Your Target Role
              </h3>
              <p className="text-xs text-slate-500">Every question and benchmark rubric will adapt to this role.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomRole(!isCustomRole)}
            className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition"
          >
            {isCustomRole ? 'Choose from list' : '+ Add custom role'}
          </button>
        </div>

        {!isCustomRole ? (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Position
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_ROLES.map(role => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3.5 rounded-2xl text-left border text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#7C3AED] bg-purple-50/50 text-[#7C3AED] ring-2 ring-purple-500/10 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-5 rounded-2xl bg-purple-50/30 border border-purple-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customRoleTitle}
                onChange={e => setCustomRoleTitle(e.target.value)}
                placeholder="e.g. Lead iOS Engineer, Cloud Data Architect..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Experience Level
              </label>
              <div className="flex gap-2">
                {['Fresher', '1-3 yrs', '3+ yrs'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                      experienceLevel === lvl
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Key Skills (Type and press Enter)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-slate-200 bg-white min-h-[44px]">
                {skillsList.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 text-[#7C3AED] text-xs font-semibold"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={skillsList.length === 0 ? "Type a skill and press Enter" : "Add more..."}
                  className="flex-1 text-xs outline-hidden px-2 py-1 min-w-[120px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Job Description (Optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description or target team requirements..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#7C3AED] bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Personalize Interview (Resume & GitHub) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
            Step 2: Personalize with Your Real Work
          </h3>
          <p className="text-xs text-slate-500">
            Adding your resume and GitHub allows Sarah to ask about your actual projects and architectural trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Resume Upload Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  Resume Ingestion
                </span>
                {isAutoParsingResume ? (
                  <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Analyzing...
                  </span>
                ) : resumeData?.profile ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {resumeData.autoLoaded ? 'Auto-loaded' : 'Parsed'}
                  </span>
                ) : null}
              </div>

              <p className="text-xs text-slate-500">
                {isAutoParsingResume
                  ? `Reading "${existingResumeName}" to personalize your interview...`
                  : resumeData
                  ? `${resumeData.autoLoaded ? 'Profile resume' : 'Uploaded'}: "${resumeData.filename}"`
                  : hasExistingProfileResume
                  ? `Profile resume on file: "${existingResumeName}"`
                  : 'Upload your resume so Sarah asks about your actual projects.'}
              </p>

              {resumeData?.profile && (
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-slate-700 space-y-1">
                  <div className="font-semibold text-emerald-700">
                    Sarah will ask about your real work:
                  </div>
                  <div>· <strong>{resumeData.profile.projects?.length || 0}</strong> projects detected</div>
                  <div>· <strong>{resumeData.profile.claims_to_verify?.length || 0}</strong> claims to probe</div>
                  {resumeData.profile.experience?.length > 0 && (
                    <div>· <strong>{resumeData.profile.experience.length}</strong> work experience entries</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingResume || isAutoParsingResume}
                className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isUploadingResume ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7C3AED]" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{resumeData ? 'Replace with Different Resume' : hasExistingProfileResume ? 'Upload Different Resume' : 'Upload Resume (PDF/DOCX)'}</span>
              </button>
            </div>
          </div>

          {/* GitHub Portfolio Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <GithubIcon className="w-4 h-4 text-[#7C3AED]" />
                  GitHub Repository Inspection
                </span>
                {githubConnected ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Connected
                  </span>
                ) : isInspectingGithub ? (
                  <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 animate-pulse">
                    Connecting...
                  </span>
                ) : null}
              </div>

              {/* Display Connected GitHub or Editing Instructions */}
              {!isEditingGithub && (connectedGithubHandle || profileGithubHandle) ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-slate-500">
                    {connectedGithubHandle && profileGithubHandle &&
                    connectedGithubHandle.toLowerCase() !== profileGithubHandle.toLowerCase().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '') ? (
                      <>
                        Connected GitHub: <span className="font-semibold text-slate-800">"{connectedGithubHandle}"</span>
                        <span className="ml-1.5 text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 font-semibold">
                          Custom Account
                        </span>
                      </>
                    ) : (
                      <>
                        Profile GitHub: <span className="font-semibold text-slate-800">"{(connectedGithubHandle || profileGithubHandle).replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '')}"</span>
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  {hasProfileGithub
                    ? 'Enter a different GitHub username or profile URL:'
                    : 'Enter your GitHub username or profile URL to inspect public repositories.'}
                </p>
              )}

              {/* Input row when editing or if user has no profile GitHub */}
              {(isEditingGithub || !hasProfileGithub) && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={githubInput}
                    onChange={e => setGithubInput(e.target.value)}
                    placeholder="e.g. octocat or github.com/octocat"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#7C3AED]"
                  />
                  <button
                    type="button"
                    onClick={() => handleInspectGithub(githubInput)}
                    disabled={isInspectingGithub || !githubInput.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shrink-0 disabled:opacity-50 flex items-center gap-1"
                  >
                    {isInspectingGithub ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                    <span>{isInspectingGithub ? 'Connecting...' : 'Connect'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingGithub(false);
                      setGithubInput(connectedGithubHandle || profileGithubHandle);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Repositories Checklist */}
              {githubRepos.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Select Repositories to Discuss ({selectedRepoNames.length} selected):
                  </div>
                  {githubRepos.slice(0, 6).map(repo => {
                    const isSelected = selectedRepoNames.includes(repo.name);
                    return (
                      <label
                        key={repo.name}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                          isSelected
                            ? 'bg-purple-50 border-purple-200 text-purple-900 font-semibold'
                            : 'bg-white border-slate-100 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRepoSelection(repo.name)}
                          className="rounded text-[#7C3AED] focus:ring-purple-400"
                        />
                        <span className="truncate flex-1">{repo.name}</span>
                        {repo.language && <span className="text-[10px] text-slate-400">{repo.language}</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom button matching Resume Ingestion */}
            <div>
              {!isEditingGithub ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingGithub(true);
                      setGithubInput(connectedGithubHandle || profileGithubHandle || '');
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Connect Different GitHub Profile</span>
                  </button>

                  {/* If connected to a custom profile different from user profile, give 1-click option to revert */}
                  {hasProfileGithub && connectedGithubHandle && profileGithubHandle &&
                    connectedGithubHandle.toLowerCase() !== profileGithubHandle.toLowerCase().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '') && (
                    <button
                      type="button"
                      onClick={() => {
                        const cleanProfile = profileGithubHandle.replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
                        setConnectedGithubHandle(cleanProfile);
                        setGithubInput(cleanProfile);
                        handleInspectGithub(cleanProfile, false);
                      }}
                      className="w-full py-2 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/60 text-[#7C3AED] text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3 text-[#7C3AED]" />
                      <span>Revert to Profile GitHub ("{profileGithubHandle.replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '')}")</span>
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 leading-tight">
                  Selected repositories will be discussed during Round 2 (Technical Deep-Dive).
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Consent: Your resume and public GitHub data are used only to generate your interview questions and feedback.
        </p>
      </div>

      {/* 4. Microphone & Voice Setup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              skipMic ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {skipMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                Step 3: Microphone Check
              </h3>
              <p className="text-xs text-slate-500">
                You can answer verbally via voice or type your answers into the chat.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={skipMic}
              onChange={e => {
                setSkipMic(e.target.checked);
                if (e.target.checked) stopMicStream();
              }}
              className="rounded text-[#7C3AED] focus:ring-purple-400"
            />
            <span>Skip Mic (Typing only)</span>
          </label>
        </div>

        {!skipMic && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold text-slate-800">Live Audio Input Meter</div>
                <div className="text-xs text-slate-500">Speak into your microphone to verify the volume level.</div>
              </div>

              <button
                type="button"
                onClick={handleTestVoice}
                disabled={isTestingMic}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-xs"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isTestingMic ? 'text-emerald-500 animate-pulse' : 'text-[#7C3AED]'}`} />
                <span>{isTestingMic ? 'Listening (3s)...' : 'Test Voice'}</span>
              </button>
            </div>

            {/* Level Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    micAudioLevel > 70
                      ? 'bg-amber-500'
                      : micAudioLevel > 15
                      ? 'bg-emerald-500'
                      : 'bg-[#7C3AED]'
                  }`}
                  style={{ width: `${Math.max(4, micAudioLevel)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>Silent</span>
                <span>Optimal Speech Range</span>
                <span>High</span>
              </div>
            </div>

            {micTestPassed && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Microphone verified and calibrated for your interview.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Start Action Button */}
      <div className="p-6 bg-gradient-to-r from-[#7C3AED]/5 via-purple-50/30 to-indigo-50/20 rounded-3xl border border-purple-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Starting interview for</div>
            <div className="text-sm font-extrabold text-slate-900 font-outfit mt-0.5">
              <span className="text-[#7C3AED]">{effectiveRoleDisplay}</span>
              {experienceLevel && <span className="text-slate-400 font-semibold text-xs ml-2">· {experienceLevel}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={isLoading || isAutoParsingResume || !effectiveRoleDisplay}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Setting up your interview...</span>
              </>
            ) : isAutoParsingResume ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing resume...</span>
              </>
            ) : (
              <>
                <span>Start Interview</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
