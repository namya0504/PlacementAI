import React, { useState, useEffect } from 'react';
import { User, Lock, Shield, Save, Menu, Eye, EyeOff, ShieldCheck, Database, FileText, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { useSidebar } from '../context/SidebarContext';

export default function Settings() {
  const { currentUser, updateProfileData } = useAuth();
  const { isCollapsed } = useSidebar();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');

  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSavedMsg, setPwSavedMsg] = useState(false);
  const [pwErrorMsg, setPwErrorMsg] = useState('');

  useEffect(() => {
    API.getProfile()
      .then(profile => {
        if (profile) {
          if (profile.name) setName(profile.name);
          if (profile.email) setEmail(profile.email);
          if (profile.phone) setPhone(profile.phone);
          if (profile.location) setLocation(profile.location);
        }
      })
      .catch(err => console.warn('Settings profile load error:', err.message));
  }, [currentUser]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwErrorMsg('');
    setPwSavedMsg(false);

    if (!currentPassword.trim()) {
      setPwErrorMsg('Please enter your current password.');
      return;
    }
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
    if (!pwRegex.test(newPassword)) {
      setPwErrorMsg('New password must be at least 8 characters and contain uppercase, lowercase, a number, and a special character.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwErrorMsg('New passwords do not match.');
      return;
    }
    try {
      await API.updateProfile({ currentPassword, newPassword });
      setPwSavedMsg(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPwSavedMsg(false), 3000);
    } catch (err) {
      setPwErrorMsg(err.message || 'Unable to update password. Please check your current password.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name?.trim()) {
      setErrorMsg('Full name is required and cannot be empty.');
      return;
    }

    if (!phone?.trim()) {
      setErrorMsg('Phone number is a compulsory field and cannot be deleted. You can update it with a new number.');
      return;
    }

    try {
      await API.updateProfile({ name, email, phone, location });
      updateProfileData({ name, email, phone, location });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to update account settings.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Settings</h1>
              <p className="text-xs text-slate-500">Configure your account, security, and privacy preferences</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Settings Sub-Navigation & Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sub-Tabs */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-[#EAEBF4] shadow-xs space-y-1 h-fit">
              {[
                { id: 'account', label: 'Account Settings', icon: User },
                { id: 'password', label: 'Change Password', icon: Lock },
                { id: 'privacy', label: 'Privacy', icon: Shield }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                      activeTab === t.id ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-500/20' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Main Settings Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-6">
              
              {savedMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  ✓ Settings saved successfully!
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {activeTab === 'account' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Account Settings</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="e.g. user@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore, India"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full p-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Change Password</h3>

                  {pwSavedMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      ✓ Password updated successfully!
                    </div>
                  )}
                  {pwErrorMsg && (
                    <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                      {pwErrorMsg}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                          placeholder="Enter current password"
                          required
                        />
                        <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                          placeholder="Min 8 chars, upper, lower, number, special"
                          required
                        />
                        <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={e => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#EAEBF4] bg-[#F8F9FE] text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-slate-800"
                          placeholder="Re-enter new password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Update Password
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Privacy Overview</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      A brief summary of how PlacementAI secures your personal information, interview recordings, and coding submissions.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center border border-purple-100">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Encrypted & Secure Storage</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Your account credentials, contact info, and practice session histories are protected with enterprise-grade encryption via Firebase Authentication and Firestore security rules.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center border border-purple-100">
                        <Database className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Code Sandbox Isolation</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        All code submissions and AI coaching chats execute inside isolated sandbox containers. Your solution logic is evaluated privately and never exposed to other candidates.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center border border-purple-100">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Resume & ATS Confidentiality</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Resume drafts, ATS match reports, and HR mock interview transcripts remain strictly confidential to your account and are never shared or sold to third parties without your consent.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center border border-purple-100">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Student Ownership & Control</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        You have complete ownership over your account data. You can view, update, or remove your profile information and career prep records directly at any time.
                      </p>
                    </div>
                  </div>

                  {/* Summary Callout Banner */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-[#7C3AED]">Our Commitment:</span> PlacementAI is designed for student placement preparation. We adhere to responsible data privacy standards, never monetize candidate personal information, and only use your data to power your personalized readiness scores.
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
