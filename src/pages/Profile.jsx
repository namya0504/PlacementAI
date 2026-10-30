import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Award, Edit3, CheckCircle, Menu, Upload, X, Save,
  Loader2, FileText, Download, Trash2, Eye, AlertTriangle, RefreshCw, FileUp
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
    } catch (err) {
      setResumeError(err.message || 'Upload failed. Please try again.');
    } finally {
      setResumeUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
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
      const updated = await API.updateProfile(profileData);
      updateProfileData(updated);
      setIsEditing(false);
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
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
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

          {/* Profile Card Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={profileData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || 'Student')}`}
                  alt="Avatar"
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || 'Student')}`; }}
                  className="w-20 h-20 rounded-full ring-4 ring-blue-500/20 object-cover shadow-md"
                />
                <label className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center ${avatarUploading ? 'opacity-100 cursor-wait' : 'opacity-0 group-hover:opacity-100 cursor-pointer'} transition`}>
                  {avatarUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Upload className="w-5 h-5 text-white" />}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={avatarUploading} onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">{profileData.name}</h2>
                <p className="text-xs font-semibold text-blue-600">{profileData.email}</p>
                <p className="text-xs text-slate-500">{profileData.role} Candidate</p>
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Resumes Created', sub: 'ATS Approved', val: currentUser?.stats?.resumesCreated || 0, color: 'blue' },
                { label: 'Tests Completed', sub: 'Quant & Coding', val: currentUser?.stats?.testsCompleted || 0, color: 'purple' },
                { label: 'Certificates Earned', sub: 'Verified', val: currentUser?.stats?.certificatesEarned || 0, color: 'emerald' },
                { label: 'Mock Interviews', sub: 'Completed', val: currentUser?.stats?.mockInterviews || 0, color: 'amber' }
              ].map(({ label, sub, val, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center font-bold`}>{val}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{label}</div>
                    <div className="text-[11px] text-slate-400">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
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
                <div key={label} className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-semibold block">{label}</span>
                  <span className="font-bold text-slate-800">{val || <span className="text-slate-400 font-normal italic">Not set</span>}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Resume Section ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">My Resume</h3>
                <p className="text-xs text-slate-500 mt-0.5">
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
                <Loader2 className="w-4 h-4 animate-spin" /> Loading resume info…
              </div>
            ) : resume?.hasResume ? (
              /* ── Resume exists: view + re-upload + delete ── */
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 text-xs font-bold hover:bg-blue-50 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </a>
                  <a
                    href={resume.resumeDownloadUrl}
                    download={resume.resumeFileName || 'resume.pdf'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  {/* Re-upload */}
                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold cursor-pointer hover:bg-purple-700 transition ${resumeUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {resumeUploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</> : <><RefreshCw className="w-3.5 h-3.5" /> Replace</>}
                    <input ref={resumeInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
                  </label>
                  {/* Delete */}
                  <button
                    onClick={handleResumeDelete}
                    disabled={resumeDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {resumeDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* ── No resume: upload prompt ── */
              <label className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 transition ${resumeUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                {resumeUploading ? (
                  <><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /><p className="text-xs text-slate-500 font-medium">Uploading resume…</p></>
                ) : (
                  <>
                    <FileUp className="w-8 h-8 text-slate-400" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Upload your resume</p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF or DOCX · max 5 MB</p>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">Choose File</span>
                  </>
                )}
                <input ref={resumeInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
              </label>
            )}
          </div>

          {/* ── Danger Zone ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-red-700 font-outfit">Danger Zone</h3>
            <p className="text-xs text-slate-500">
              Deactivating your account will prevent any login with these credentials for <strong>30 days</strong>.
              After 30 days you can re-register with the same email as a fresh account.
              Your data is preserved but inaccessible during this period.
            </p>
            <button
              onClick={() => { setShowDeactivateDialog(true); setDeactivateStep(1); setDeactivateInput(''); setDeactivateError(''); }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
            >
              Deactivate Account
            </button>
          </div>

        </div>
      </main>

      {/* ── Edit Profile Modal ─────────────────────────────────── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
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
                  <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Role <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.role} onChange={e => setProfileData({ ...profileData, role: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">College <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.college} onChange={e => setProfileData({ ...profileData, college: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.branch} onChange={e => setProfileData({ ...profileData, branch: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Year <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.passingYear} onChange={e => setProfileData({ ...profileData, passingYear: e.target.value })} placeholder="2026" className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone <span className="text-red-500">*</span></label>
                  <input type="text" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full p-2.5 bg-slate-50 border rounded-xl" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input type="text" value={profileData.location} onChange={e => setProfileData({ ...profileData, location: e.target.value })} placeholder="Bangalore, India" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bio</label>
                <textarea rows="3" value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </form>
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
