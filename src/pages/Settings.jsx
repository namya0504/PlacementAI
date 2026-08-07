import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Moon, Globe, Save, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { currentUser, updateProfileData } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  const [name, setName] = useState(currentUser?.name || 'Namya Shah');
  const [email, setEmail] = useState(currentUser?.email || 'namya@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Surat, Gujarat, India');
  const [language, setLanguage] = useState('English');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfileData({ name, email });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Settings</h1>
              <p className="text-xs text-slate-500">Configure your account, security preferences, and app appearance</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Settings Sub-Navigation & Form Layout (Screen 15 in Collage) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sub-Tabs */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-1 h-fit">
              {[
                { id: 'account', label: 'Account Settings', icon: User },
                { id: 'password', label: 'Change Password', icon: Lock },
                { id: 'notifications', label: 'Notification Settings', icon: Bell },
                { id: 'privacy', label: 'Privacy', icon: Shield },
                { id: 'appearance', label: 'Appearance', icon: Moon },
                { id: 'language', label: 'Language Selection', icon: Globe }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                      activeTab === t.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Main Settings Form */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {savedMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  ✓ Settings saved successfully!
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
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab !== 'account' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit uppercase">{activeTab} Preferences</h3>
                  <p className="text-xs text-slate-500">Configure options for {activeTab} settings.</p>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow"
                  >
                    Save {activeTab} Settings
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
