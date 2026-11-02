import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Award, Edit3, CheckCircle, Menu, Upload, X, Save,
  Loader2, FileText, Download, Trash2, Eye, AlertTriangle, RefreshCw, FileUp,
  Code, Globe, ExternalLink, Sparkles, Check, CheckSquare, Square, Plus
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Profile() {
  const { currentUser, updateProfileData, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editError, setEditError] = useState('');

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || currentUser?.targetRole || '',
    photoURL: currentUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'Student')}`,
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    college: currentUser?.college || '',
    branch: currentUser?.branch || '',
    passingYear: currentUser?.passingYear || '',
    bio: currentUser?.bio || '',
    linkedIn: currentUser?.linkedIn || '',
    github: currentUser?.github || '',
    skills: currentUser?.skills || []
  });

  // ── Resume state ──────────────────────────────────────────────
  const [resume, setResume] = useState(null); // { hasResume, resumeDownloadUrl, resumeFileName, resumeFileSize, resumeUploadedAt }
  const [resumeLoading, setResumeLoading] = useState(true);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeDeleting, setResumeDeleting] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);

  // ── Deactivate dialog state ───────────────────────────────────
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [deactivateStep, setDeactivateStep] = useState(1); // 1=confirm, 2=type-confirm
  const [deactivateInput, setDeactivateInput] = useState('');
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState('');

  // ── AI Insights State (Resume / GitHub / LinkedIn sync) ─────────
  const [insightModalOpen, setInsightModalOpen] = useState(false);
  const [insightSource, setInsightSource] = useState('resume'); // 'resume' | 'github' | 'combined'
  const [insightSourcesUsed, setInsightSourcesUsed] = useState([]);
  const [suggestedBio, setSuggestedBio] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [scanningGitHub, setScanningGitHub] = useState(false);
  const [applyingInsights, setApplyingInsights] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    API.getProfile()
      .then(data => {
        if (data) {
          setProfileData(prev => ({
            ...prev,
            ...data,
            phone: data.phone || currentUser?.phone || prev.phone || '',
            location: data.location || currentUser?.location || prev.location || '',
            college: data.college || currentUser?.college || prev.college || '',
            branch: data.branch || currentUser?.branch || prev.branch || '',
            passingYear: data.passingYear || currentUser?.passingYear || prev.passingYear || '',
            role: data.role || data.targetRole || currentUser?.role || prev.role || ''
          }));
        }
      })
      .catch(err => console.warn('Profile fetch notice:', err.message));

    // Load profile resume
    API.getProfileResume()
      .then(data => setResume(data))
      .catch(() => setResume({ hasResume: false }))
      .finally(() => setResumeLoading(false));

  }, [currentUser]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Unsupported format. Use JPEG, PNG, or WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB.');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      setAvatarUploading(true);
      const res = await API.uploadAvatar(formData);
      if (res?.photoURL) {
        setProfileData(prev => ({ ...prev, photoURL: res.photoURL }));
        updateProfileData({ photoURL: res.photoURL });
      }
    } catch (err) {
      alert(err.message || 'Avatar upload failed.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // ── Resume handlers ──────────────────────────────────────────
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setResumeError('Only PDF or DOCX files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File must be under 5 MB.');
      return;
    }
    setResumeError('');
    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await API.uploadProfileResume(formData);
      setResume({ hasResume: true, ...res });

      // If AI extracted skills or suggested summary, prompt user to update profile
      if (res?.extracted && (res.extracted.skills?.length || res.extracted.aboutMe)) {
        setInsightSource('resume');
        setSuggestedBio(res.extracted.aboutMe || profileData.bio || '');
        // Fresh replacement list from combined sources — NOT appending to old saved skills
        const freshSkills = Array.isArray(res.extracted.skills) ? res.extracted.skills : [];
        setSuggestedSkills(freshSkills);
        setSelectedSkills(new Set(freshSkills));
        setInsightSourcesUsed(res.extracted.sourcesUsed || ['Resume']);
        setInsightModalOpen(true);
      }
    } catch (err) {
      setResumeError(err.message || 'Upload failed. Please try again.');
    } finally {
      setResumeUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const handleScanCombinedSources = async (overrides = {}) => {
    setScanningGitHub(true);
    try {
      const payload = {
        github: overrides.github !== undefined ? overrides.github : (profileData.github || ''),
        linkedin: overrides.linkedin !== undefined ? overrides.linkedin : (profileData.linkedIn || '')
      };
      const res = await API.syncProfileSources(payload);
      if (res?.extracted && (res.extracted.skills?.length || res.extracted.aboutMe)) {
        setInsightSource('combined');
        setSuggestedBio(res.extracted.aboutMe || profileData.bio || '');
        // Fresh replacement list from combined sources — NOT appending to old saved skills
        const freshSkills = Array.isArray(res.extracted.skills) ? res.extracted.skills : [];
        setSuggestedSkills(freshSkills);
        setSelectedSkills(new Set(freshSkills));
        setInsightSourcesUsed(res.extracted.sourcesUsed || ['Combined Evidence']);
        setInsightModalOpen(true);
      } else {
        alert('Profile sources scanned, but no new skills or bio could be extracted.');
      }
    } catch (err) {
      alert(err.message || 'Could not synthesize profile sources. Please check your links.');
    } finally {
      setScanningGitHub(false);
    }
  };

  const handleScanGitHub = (url) => handleScanCombinedSources({ github: url });

  const handleApplyInsights = async () => {
    setApplyingInsights(true);
    try {
      const finalSkills = Array.from(selectedSkills);
      const updatedFields = {
        ...profileData,
        targetRole: profileData.role,
        bio: suggestedBio.trim(),
        skills: finalSkills // Sets/replaces the saved skills with verified selection
      };
      const saved = await API.updateProfile(updatedFields);
      setProfileData(prev => ({
        ...prev,
        ...saved,
        bio: suggestedBio.trim(),
        skills: finalSkills
      }));
      updateProfileData(saved);
      setInsightModalOpen(false);
      setSuccessNotice(`✓ Saved skills updated to ${finalSkills.length} verified competencies and personalized About Me!`);
      setTimeout(() => setSuccessNotice(''), 6000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setApplyingInsights(false);
    }
  };

  const handleToggleSkill = (skill) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const handleSelectAllSkills = () => {
    setSelectedSkills(new Set(suggestedSkills));
  };

  const handleClearAllSkills = () => {
    setSelectedSkills(new Set());
  };

  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!suggestedSkills.includes(trimmed)) {
      setSuggestedSkills(prev => [...prev, trimmed]);
    }
    setSelectedSkills(prev => new Set(prev).add(trimmed));
    setCustomSkillInput('');
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Remove your uploaded resume? This cannot be undone.')) return;
    setResumeDeleting(true);
    setResumeError('');
    try {
      await API.deleteProfileResume();
      setResume({ hasResume: false });
    } catch (err) {
      setResumeError(err.message || 'Delete failed. Please try again.');
    } finally {
      setResumeDeleting(false);
    }
  };

  // ── Profile save ─────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    if (!profileData.name?.trim()) { setEditError('Full name is required.'); return; }
    if (!profileData.phone?.trim()) { setEditError('Phone number cannot be removed.'); return; }
    if (!profileData.college?.trim()) { setEditError('College is required.'); return; }
    if (!profileData.branch?.trim()) { setEditError('Branch is required.'); return; }
    if (!profileData.passingYear?.trim()) { setEditError('Passing year is required.'); return; }
    if (!profileData.role?.trim()) { setEditError('Target role is required.'); return; }
    try {
      setLoading(true);
      const prevGithub = (currentUser?.github || '').trim().toLowerCase();
      const newGithub = (profileData.github || '').trim();
      const prevLinkedIn = (currentUser?.linkedIn || '').trim().toLowerCase();
      const newLinkedIn = (profileData.linkedIn || '').trim();
      const payload = {
        ...profileData,
        targetRole: profileData.role
      };
      const updated = await API.updateProfile(payload);
      updateProfileData(updated);
      setIsEditing(false);

      // If user added or changed their GitHub or LinkedIn handle, offer to scan and update skills & bio
      const githubChanged = newGithub && newGithub.toLowerCase() !== prevGithub;
      const linkedinChanged = newLinkedIn && newLinkedIn.toLowerCase() !== prevLinkedIn;
      if (githubChanged || linkedinChanged) {
        handleScanCombinedSources({ github: newGithub, linkedin: newLinkedIn });
      }
    } catch (err) {
      setEditError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Deactivate handlers ──────────────────────────────────────
  const handleDeactivate = async () => {
    if (deactivateInput.trim().toLowerCase() !== 'deactivate') {
      setDeactivateError('Please type "deactivate" exactly to confirm.');
      return;
    }
    setDeactivating(true);
    setDeactivateError('');
    try {
      await API.deactivateAccount();
      logout();
    } catch (err) {
      setDeactivateError(err.message || 'Deactivation failed. Please try again.');
      setDeactivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">User Profile</h1>
              <p className="text-xs text-slate-500">Manage your account information, resume, and settings</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">

          {/* Success Notice Banner */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
              <button onClick={() => setSuccessNotice('')} className="text-emerald-600 hover:text-emerald-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={profileData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || 'Student')}`}
                  alt="Avatar"
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || 'Student')}`; }}
                  className="w-20 h-20 rounded-full ring-4 ring-purple-500/20 object-cover shadow-md"
                />
                <label className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center ${avatarUploading ? 'opacity-100 cursor-wait' : 'opacity-0 group-hover:opacity-100 cursor-pointer'} transition`}>
                  {avatarUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Upload className="w-5 h-5 text-white" />}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={avatarUploading} onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">{profileData.name}</h2>
                <p className="text-xs font-semibold text-[#7C3AED]">{profileData.email}</p>
                <p className="text-xs text-slate-500 font-medium">{profileData.role} Candidate</p>
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Resumes Created', sub: 'ATS Approved', val: currentUser?.stats?.resumesCreated || 0, color: 'purple' },
                { label: 'Tests Completed', sub: 'Quant & Coding', val: currentUser?.stats?.testsCompleted || 0, color: 'pink' },
                { label: 'Certificates Earned', sub: 'Verified', val: currentUser?.stats?.certificatesEarned || 0, color: 'emerald' },
                { label: 'Mock Interviews', sub: 'Completed', val: currentUser?.stats?.mockInterviews || 0, color: 'indigo' }
              ].map(({ label, sub, val, color }) => (
                <div key={label} className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center font-bold text-lg font-outfit`}>{val}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{label}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {[
                ['Phone', profileData.phone],
                ['Location', profileData.location],
                ['College', profileData.college],
                ['Branch', profileData.branch],
                ['Passing Year', profileData.passingYear],
                ['Target Role', profileData.role]
              ].map(([label, val]) => (
                <div key={label} className="p-3.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-2xl space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">{label}</span>
                  <span className="font-bold text-slate-800">{val || <span className="text-slate-400 font-normal italic">Not set</span>}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About Me / Bio */}
          {profileData.bio && (
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-2">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">About Me</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {profileData.bio}
              </p>
            </div>
          )}

          {/* Skills & Competencies */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Skills & Competencies</h3>
                {Array.isArray(profileData.skills) && profileData.skills.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-[#7C3AED] rounded-full border border-purple-100">
                    {profileData.skills.length} Skills
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleScanCombinedSources()}
                disabled={scanningGitHub}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C3AED] text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {scanningGitHub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                Refresh Skills from All Sources
              </button>
            </div>

            {Array.isArray(profileData.skills) && profileData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#F8F9FE] border border-[#EAEBF4] text-slate-800 text-xs font-semibold hover:border-purple-300 transition"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills saved yet. Upload a resume or sync from GitHub & LinkedIn to auto-detect skills.</p>
            )}
          </div>

          {/* Online Profiles & Links */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Online Profiles</h3>
                <p className="text-xs text-slate-500 mt-0.5">Connect your developer and professional links (GitHub, LinkedIn)</p>
              </div>
              {(profileData.github || profileData.linkedIn) && (
                <button
                  onClick={() => handleScanCombinedSources()}
                  disabled={scanningGitHub}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C3AED] text-xs font-bold flex items-center gap-2 transition shadow-2xs disabled:opacity-60"
                >
                  {scanningGitHub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                  Sync Skills & Bio from All Sources
                </button>
              )}
            </div>

            {(profileData.github || profileData.linkedIn) ? (
              <div className="flex flex-wrap gap-3">
                {profileData.github && (
                  <a
                    href={profileData.github.startsWith('http') ? profileData.github : `https://github.com/${profileData.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs"
                  >
                    <Code className="w-4 h-4 text-purple-300" />
                    GitHub: {profileData.github.replace(/^https?:\/\/github\.com\//, '')}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {profileData.linkedIn && (
                  <a
                    href={profileData.linkedIn.startsWith('http') ? profileData.linkedIn : `https://linkedin.com/in/${profileData.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-xs font-bold hover:bg-[#084e96] transition shadow-xs"
                  >
                    <Globe className="w-4 h-4 text-blue-200" />
                    LinkedIn: {profileData.linkedIn.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, '')}
                    <ExternalLink className="w-3 h-3 text-blue-200" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <Code className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Add GitHub & LinkedIn profiles</p>
                    <p className="text-[11px] text-slate-500">PlacementAI will combine your public code repositories and professional profile to synthesize skills and bio.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition shadow-xs shrink-0"
                >
                  + Add Profiles
                </button>
              </div>
            )}
          </div>

          {/* ── Resume Section ─────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">My Resume</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Upload your resume for ATS analysis and profile review. PDF or DOCX, max 5 MB.
                </p>
              </div>
            </div>

            {resumeError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resumeError}</span>
              </div>
            )}

            {resumeLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#7C3AED]" /> Loading resume info…
              </div>
            ) : resume?.hasResume ? (
              /* ── Resume exists: view + re-upload + delete ── */
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-purple-50/60 border border-purple-100 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{resume.resumeFileName || 'Uploaded Resume'}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatFileSize(resume.resumeFileSize)}
                    {resume.resumeUploadedAt ? ` · Uploaded ${new Date(resume.resumeUploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* View / Download */}
                  <a
                    href={resume.resumeDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-[#7C3AED] text-xs font-bold hover:bg-purple-50 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </a>
                  <a
                    href={resume.resumeDownloadUrl}
                    download={resume.resumeFileName || 'resume.pdf'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAEBF4] text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  {/* Re-upload */}
                  <label className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold cursor-pointer hover:bg-[#6D28D9] transition shadow-md shadow-purple-500/20 ${resumeUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {resumeUploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</> : <><RefreshCw className="w-3.5 h-3.5" /> Replace</>}
                    <input ref={resumeInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
                  </label>
                  {/* Delete */}
                  <button
                    onClick={handleResumeDelete}
                    disabled={resumeDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {resumeDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* ── No resume: upload prompt ── */
              <label className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-purple-200 rounded-2xl bg-[#F8F9FE] cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition ${resumeUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                {resumeUploading ? (
                  <><Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" /><p className="text-xs text-slate-500 font-medium">Uploading resume…</p></>
                ) : (
                  <>
                    <FileUp className="w-8 h-8 text-purple-400" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-800">Upload your resume</p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF or DOCX · max 5 MB</p>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-purple-500/20">Choose File</span>
                  </>
                )}
                <input ref={resumeInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
              </label>
            )}
          </div>

          {/* ── Danger Zone ───────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-xs space-y-3">
            <h3 className="text-lg font-bold text-red-700 font-outfit">Danger Zone</h3>
            <p className="text-xs text-slate-500">
              Deactivating your account will prevent any login with these credentials for <strong>30 days</strong>.
              After 30 days you can re-register with the same email as a fresh account.
              Your data is preserved but inaccessible during this period.
            </p>
            <button
              onClick={() => { setShowDeactivateDialog(true); setDeactivateStep(1); setDeactivateInput(''); setDeactivateError(''); }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm"
            >
              Deactivate Account
            </button>
          </div>

        </div>
      </main>

      {/* ── Edit Profile Modal ─────────────────────────────────── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-[#EAEBF4]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Edit Profile</h3>
                <p className="text-[11px] text-slate-500">Compulsory fields cannot be emptied once set</p>
              </div>
              <button onClick={() => { setIsEditing(false); setEditError(''); }} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            {editError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{editError}</div>}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Role <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.role} onChange={e => setProfileData({ ...profileData, role: e.target.value })} className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">College <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.college} onChange={e => setProfileData({ ...profileData, college: e.target.value })} className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.branch} onChange={e => setProfileData({ ...profileData, branch: e.target.value })} className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Year <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.passingYear} onChange={e => setProfileData({ ...profileData, passingYear: e.target.value })} placeholder="2026" className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input type="text" value={profileData.location} onChange={e => setProfileData({ ...profileData, location: e.target.value })} placeholder="Bangalore, India" className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">GitHub Profile / URL</label>
                  </div>
                  <input
                    type="text"
                    value={profileData.github || ''}
                    onChange={e => setProfileData({ ...profileData, github: e.target.value })}
                    placeholder="e.g. octocat or https://github.com/octocat"
                    className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">LinkedIn Profile URL</label>
                  </div>
                  <input
                    type="text"
                    value={profileData.linkedIn || ''}
                    onChange={e => setProfileData({ ...profileData, linkedIn: e.target.value })}
                    placeholder="e.g. https://linkedin.com/in/username"
                    className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>
              {(profileData.github?.trim() || profileData.linkedIn?.trim()) && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                  <div className="flex items-center gap-2 text-xs text-purple-900 font-medium">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Auto-detect skills & bio from combined Resume, GitHub, & LinkedIn</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleScanCombinedSources({ github: profileData.github, linkedin: profileData.linkedIn })}
                    disabled={scanningGitHub}
                    className="px-3 py-1 rounded-lg bg-[#7C3AED] text-white text-[11px] font-bold hover:bg-[#6D28D9] transition shadow-xs disabled:opacity-50 shrink-0"
                  >
                    {scanningGitHub ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Scan Sources'}
                  </button>
                </div>
              )}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(profileData.skills) ? profileData.skills.join(', ') : (profileData.skills || '')}
                  onChange={e => setProfileData({
                    ...profileData,
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. Python, SQL, Cybersecurity, Network Defense"
                  className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bio</label>
                <textarea rows="3" value={profileData.bio || ''} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} className="w-full p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-purple-500/20 transition">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── AI Insights Review Modal (Combined Resume / GitHub / LinkedIn) ── */}
      {insightModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-[#EAEBF4]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold text-slate-900 font-outfit">Update Skills & About Me</h3>
                    {insightSourcesUsed.map(src => (
                      <span key={src} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200">
                        {src}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Synthesized from your {insightSourcesUsed.length > 0 ? insightSourcesUsed.join(' + ') : 'provided evidence'}.
                    Applying will <strong>update and replace</strong> your saved skills with this verified selection.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInsightModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* About Me Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7C3AED]" /> Suggested About Me / Bio
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Editable</span>
              </div>
              <textarea
                rows="4"
                value={suggestedBio}
                onChange={e => setSuggestedBio(e.target.value)}
                placeholder="Personalized bio summary highlighting your background, expertise, and career focus..."
                className="w-full p-3.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white transition"
              />
            </div>

            {/* Skills Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#7C3AED]" /> Skills Detected ({selectedSkills.size} Selected)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Selected skills will update and replace your current saved skills list.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllSkills}
                    className="text-[11px] font-bold text-[#7C3AED] hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={handleClearAllSkills}
                    className="text-[11px] font-bold text-slate-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {suggestedSkills.map(skill => {
                  const isSelected = selectedSkills.has(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => handleToggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-[#F8F9FE] text-slate-600 hover:bg-slate-200/80 border border-[#EAEBF4]'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill input */}
              <form onSubmit={handleAddCustomSkill} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  placeholder="Add another skill (e.g. Docker, Redux, Kali Linux)..."
                  className="flex-1 p-2.5 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  type="submit"
                  disabled={!customSkillInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-50 text-[#7C3AED] hover:bg-purple-100 border border-purple-200 text-xs font-bold transition disabled:opacity-50"
                >
                  + Add
                </button>
              </form>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInsightModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
              >
                Keep Current Profile
              </button>
              <button
                type="button"
                onClick={handleApplyInsights}
                disabled={applyingInsights}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition disabled:opacity-50"
              >
                {applyingInsights ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Updating Profile…</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Update Profile Skills & About Me</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Deactivate Account Dialog ──────────────────────────── */}
      {showDeactivateDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Deactivate Account</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone for 30 days</p>
                </div>
              </div>
              <button onClick={() => setShowDeactivateDialog(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {deactivateStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs text-red-800">
                  <p className="font-bold">What happens when you deactivate:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>You will be immediately logged out</li>
                    <li>Login with these credentials will be blocked</li>
                    <li>Your data is preserved but inaccessible</li>
                    <li>You <strong>cannot</strong> re-register for <strong>30 days</strong></li>
                    <li>After 30 days you can sign up fresh with the same email</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeactivateDialog(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">Cancel</button>
                  <button onClick={() => setDeactivateStep(2)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition">
                    I understand, continue
                  </button>
                </div>
              </div>
            )}

            {deactivateStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  To confirm deactivation, type <strong className="text-red-600 font-mono">deactivate</strong> in the box below:
                </p>
                <input
                  type="text"
                  value={deactivateInput}
                  onChange={e => { setDeactivateInput(e.target.value); setDeactivateError(''); }}
                  placeholder="Type deactivate"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  autoFocus
                />
                {deactivateError && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {deactivateError}
                  </p>
                )}
                <div className="flex gap-3">
                  <button onClick={() => { setDeactivateStep(1); setDeactivateInput(''); setDeactivateError(''); }} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">Back</button>
                  <button
                    onClick={handleDeactivate}
                    disabled={deactivating || deactivateInput.trim().toLowerCase() !== 'deactivate'}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deactivating ? <><Loader2 className="w-4 h-4 animate-spin" /> Deactivating…</> : 'Deactivate My Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
