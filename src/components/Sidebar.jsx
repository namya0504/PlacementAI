import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Brain,
  Code2,
  Mic,
  User,
  Settings,
  LogOut,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.dashboard, icon: LayoutDashboard },
    { name: 'Resume Builder', path: ROUTES.resumeBuilder, icon: FileText },
    { name: 'ATS Analysis', path: ROUTES.atsChecker, icon: CheckCircle },
    { name: 'Aptitude Test', path: ROUTES.aptitude, icon: Brain },
    { name: 'Technical Test', path: ROUTES.technical, icon: Code2 },
    { name: 'AI Interview', path: ROUTES.hrInterview, icon: Mic },
    { name: 'Profile', path: ROUTES.profile, icon: User },
    { name: 'Settings', path: ROUTES.settings, icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isItemActive = (path) => {
    if (path === ROUTES.dashboard) {
      return location.pathname === ROUTES.dashboard;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        aria-label="Application sidebar"
        className={`fixed top-0 bottom-0 left-0 z-[45] w-64 bg-white border-r border-[#EAEBF4] flex flex-col transition-transform duration-300 font-sans ${
          mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full lg:visible lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
          <Link to={ROUTES.dashboard} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 font-outfit">
              Placement<span className="text-[#7C3AED]">AI</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen?.(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    active ? 'text-[#7C3AED]' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card Mini / Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {currentUser && (
            <Link
              to={ROUTES.profile}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 hover:bg-slate-100 transition group"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.name || 'User'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                  className="w-9 h-9 rounded-full ring-2 ring-purple-500/20 shrink-0 object-cover"
                />
              ) : null}
              <div
                style={{ display: currentUser.photoURL ? 'none' : 'flex' }}
                className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs items-center justify-center shrink-0 ring-2 ring-purple-500/20"
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-800 truncate group-hover:text-[#7C3AED]">
                  {currentUser.name || 'Namya Shah'}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {currentUser.role || currentUser.branch || '3rd Year, IT'}
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
