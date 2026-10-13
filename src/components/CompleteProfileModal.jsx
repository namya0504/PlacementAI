import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Briefcase,
  MapPin,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TARGET_ROLES = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'Cloud / DevOps Engineer',
  'Cybersecurity Analyst',
  'Mobile App Developer',
  'Custom'
];

const PASSING_YEARS = [
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
  'Custom'
];

export default function CompleteProfileModal() {
  const { currentUser, completeProfile, logout } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [customPassingYear, setCustomPassingYear] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync initial data from currentUser (e.g. from Google login)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.location) setLocation(currentUser.location);
      if (currentUser.college) setCollege(currentUser.college);
      if (currentUser.branch) setBranch(currentUser.branch);
      if (currentUser.passingYear) {
        if (PASSING_YEARS.includes(currentUser.passingYear)) {
          setPassingYear(currentUser.passingYear);
        } else {
          setPassingYear('Custom');
          setCustomPassingYear(currentUser.passingYear);
        }
      }
      if (currentUser.targetRole || currentUser.role) {
        const r = currentUser.targetRole || currentUser.role;
        if (TARGET_ROLES.includes(r)) {
          setTargetRole(r);
        } else {
          setTargetRole('Custom');
          setCustomRole(r);
        }
      }
    }
  }, [currentUser]);

  // Determine if compulsory profile data is missing
  const hasExistingCompulsory = Boolean(
    currentUser?.phone?.trim() &&
    currentUser?.college?.trim() &&
    currentUser?.branch?.trim() &&
    currentUser?.passingYear?.trim() &&
    (currentUser?.targetRole?.trim() || currentUser?.role?.trim())
  );

  const shouldShow = Boolean(
    currentUser &&
    (currentUser.needsProfileCompletion === true || !hasExistingCompulsory)
  );

  if (!shouldShow) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is compulsory and cannot be empty');
      return;
    }

    if (phone.trim().replace(/\D/g, '').length < 7) {
      setError('Please provide a valid phone number (at least 7 digits)');
      return;
    }

    if (!college.trim()) {
      setError('College / University name is compulsory');
      return;
    }

    if (!branch.trim()) {
      setError('Branch / Stream is compulsory');
      return;
    }

    const resolvedYear = passingYear === 'Custom' ? customPassingYear.trim() : passingYear.trim();
    if (!resolvedYear) {
      setError('Please select or specify your graduation / passing year');
      return;
    }

    const resolvedRole = targetRole === 'Custom' ? customRole.trim() : targetRole.trim();
    if (!resolvedRole) {
      setError('Please select or specify your target placement role');
      return;
    }

    try {
      setLoading(true);
      await completeProfile({
        name: name.trim(),
        phone: phone.trim(),
        college: college.trim(),
        branch: branch.trim(),
        passingYear: resolvedYear,
        targetRole: resolvedRole,
        location: location.trim()
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Unable to save profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6 relative">
        {/* Header / Brand */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={currentUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'Student')}`}
              alt="Student Avatar"
              className="w-14 h-14 rounded-2xl ring-4 ring-purple-100 object-cover shadow-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'Student')}`;
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1">
              Compulsory Setup
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit truncate">
              Complete Your Profile
            </h2>
            <p className="text-xs text-slate-500">
              Welcome, <span className="font-semibold text-slate-700">{currentUser?.name || 'Student'}</span>! Please provide your academic and contact details to proceed.
            </p>
          </div>
        </div>

        {/* Notice Card */}
        <div className="p-3.5 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-2xl border border-purple-100/80 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-purple-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            Why are these details compulsory?
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            PlacementAI personalizes your mock interview questions, AI resume review, ATS scoring metrics, and study roadmap based on your college, branch, and target placement role.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Profile details saved successfully! Loading your workspace...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  placeholder="e.g. Bengaluru, Karnataka"
                />
              </div>
            </div>
          </div>

          {/* College & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                College / University <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  placeholder="e.g. National Institute of Tech"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Branch / Stream <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
            </div>
          </div>

          {/* Passing Year & Target Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Passing Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm bg-white"
                  required
                >
                  <option value="">Select Passing Year</option>
                  {PASSING_YEARS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
              {passingYear === 'Custom' && (
                <input
                  type="text"
                  value={customPassingYear}
                  onChange={(e) => setCustomPassingYear(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Specify year (e.g. 2026)"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm bg-white"
                  required
                >
                  <option value="">Select Target Role</option>
                  {TARGET_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              {targetRole === 'Custom' && (
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Specify role (e.g. AI Engineer)"
                  required
                />
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>Saving Details...</>
              ) : success ? (
                <>✓ Setup Completed!</>
              ) : (
                <>Save & Continue to PlacementAI <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={logout}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1 transition"
              >
                <LogOut className="w-3 h-3" /> Log out of this account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
