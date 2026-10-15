import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  CheckCircle2,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
  Briefcase
} from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PasswordValidator, { validatePasswordCriteria } from '../components/PasswordValidator';

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

export default function Signup() {
  // Stepper state: 1: Account credentials, 2: Personal & Academic information
  const [step, setStep] = useState(1);

  // Step 1: Account fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Personal Information fields (matching student profile section)
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [customPassingYear, setCustomPassingYear] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');

  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, signup, loginWithSocial } = useAuth();
  const navigate = useNavigate();
  const locationState = useLocation();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const { isValid: isPasswordValid } = validatePasswordCriteria(password);

  const isStep1Valid = Boolean(
    name.trim() &&
    email.trim() &&
    isEmailValid &&
    isPasswordValid &&
    password === confirmPassword
  );

  // Smooth redirect if already authenticated
  useEffect(() => {
    if (currentUser && !loading && !isSubmitting) {
      if (currentUser.onboarding?.status === 'not_started' || currentUser.onboarding?.status === 'in_progress') {
        navigate('/onboarding', { replace: true });
        return;
      }
      const fromPath = locationState.state?.from?.pathname
        ? `${locationState.state.from.pathname}${locationState.state.from.search || ''}`
        : null;
      const isAuthRoute = fromPath && (fromPath.startsWith('/login') || fromPath.startsWith('/signup'));
      if (fromPath && !isAuthRoute) {
        navigate(fromPath, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, loading, isSubmitting]);

  // Handle transition from Step 1 to Step 2
  const handleProceedToStep2 = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }

    if (!email.trim() || !isEmailValid) {
      setError('Please provide a valid email address (e.g., student@university.edu)');
      return;
    }

    if (!isPasswordValid) {
      setError('Please ensure your password satisfies all 5 security criteria');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Handle final submission in Step 2
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    // Re-verify Step 1 essentials
    if (!name.trim() || !email.trim() || !password) {
      setStep(1);
      setError('Please complete all account credentials');
      return;
    }

    // Verify Step 2 fields
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!location.trim()) {
      setError('Please enter your location / city');
      return;
    }

    if (!college.trim()) {
      setError('Please enter your college / university');
      return;
    }

    if (!branch.trim()) {
      setError('Please enter your branch / stream');
      return;
    }

    const resolvedYear = passingYear === 'Custom' ? customPassingYear.trim() : passingYear.trim();
    if (!resolvedYear) {
      setError('Please select or enter your passing year');
      return;
    }

    const resolvedRole = targetRole === 'Custom' ? customRole.trim() : targetRole.trim();
    if (!resolvedRole) {
      setError('Please select or specify your target role');
      return;
    }

    if (!agreed) {
      setError('Please agree to Terms & Conditions');
      return;
    }

    try {
      setLoading(true);
      setIsSubmitting(true);
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        location: location.trim(),
        college: college.trim(),
        branch: branch.trim(),
        passingYear: resolvedYear,
        targetRole: resolvedRole
      });

      setSuccessNotice('Account created successfully! Preparing your personalized onboarding workspace...');
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError('');
      setLoading(true);
      const user = await loginWithSocial(provider);
      const fromPath = locationState.state?.from?.pathname
        ? `${locationState.state.from.pathname}${locationState.state.from.search || ''}`
        : null;
      const isAuthRoute = fromPath && (fromPath.startsWith('/login') || fromPath.startsWith('/signup'));

      if (user?.isNewUser || user?.onboarding?.status === 'not_started' || user?.onboarding?.status === 'in_progress') {
        navigate('/onboarding', { replace: true });
      } else if (fromPath && !isAuthRoute) {
        navigate(fromPath, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Social authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 relative z-10 space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Create Your Account</h2>
            <p className="text-xs text-slate-500">Join thousands of students preparing for top placements</p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                step === 1
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {step === 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              )}
              <span>1. Account</span>
            </button>

            <div className={`h-0.5 w-8 transition-colors ${step === 2 ? 'bg-purple-600' : 'bg-slate-200'}`} />

            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  handleProceedToStep2();
                } else {
                  setStep(2);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                step === 2
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isStep1Valid
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>2. Personal Info</span>
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* STEP 1: Account Credentials */}
          {step === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                    placeholder="e.g. Raj Sharma"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  {email && (
                    <span className={`text-[11px] font-medium ${isEmailValid ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isEmailValid ? '✓ Valid format' : 'Invalid email'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      email && !isEmailValid ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm`}
                    placeholder="e.g. raj@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Password Validator Widget */}
              <PasswordValidator password={password} confirmPassword={confirmPassword} showAlways={password.length > 0} />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                Continue to Personal Info <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase">or continue with</span>
              </div>

              <div className="w-full">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-2.5 transition shadow-sm"
                >
                  <FaGoogle className="text-red-500 text-sm" /> Continue with Google
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Already have an account? <Link to="/login" state={locationState.state} className="text-purple-600 font-bold hover:underline">Login</Link>
              </p>
            </form>
          )}

          {/* STEP 2: Personal Information (Phone, Location, College, Branch, Passing Year, Target Role) */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mb-2">
                <div className="text-xs font-bold text-slate-800">Personal & Academic Details</div>
                <p className="text-[11px] text-slate-500">
                  Please enter this information to populate your student profile and personalize practice interviews.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                      placeholder="e.g. Bangalore, India"
                      required
                    />
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                      placeholder="e.g. IIT Bombay / VIT"
                      required
                    />
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>
                </div>

                {/* Passing Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Passing Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="">Select Passing Year</option>
                      {PASSING_YEARS.map(y => (
                        <option key={y} value={y}>{y === 'Custom' ? 'Other (Enter Year)' : y}</option>
                      ))}
                    </select>
                  </div>
                  {passingYear === 'Custom' && (
                    <input
                      type="text"
                      value={customPassingYear}
                      onChange={(e) => setCustomPassingYear(e.target.value)}
                      className="mt-2 w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                      placeholder="e.g. 2023 or 2031"
                      required
                    />
                  )}
                </div>

                {/* Target Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-white"
                      required
                    >
                      <option value="">Select Target Role</option>
                      {TARGET_ROLES.map(r => (
                        <option key={r} value={r}>{r === 'Custom' ? 'Other (Custom Role)' : r}</option>
                      ))}
                    </select>
                  </div>
                  {targetRole === 'Custom' && (
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="mt-2 w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                      placeholder="e.g. Blockchain Developer"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className="text-purple-600 focus:outline-none"
                >
                  {agreed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                </button>
                <span className="text-xs text-slate-500">I agree to the <a href="#" className="text-purple-600 hover:underline">Terms & Conditions</a></span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Setting up workspace...</>
                  ) : loading ? (
                    <>Creating Account...</>
                  ) : (
                    <>Complete Registration <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Already have an account? <Link to="/login" state={locationState.state} className="text-purple-600 font-bold hover:underline">Login</Link>
              </p>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
