import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Brain,
  Code2,
  Mic,
  Building2,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Builder', path: '/resume-builder', icon: FileText, badge: 'AI' },
    { name: 'ATS Checker', path: '/ats-checker', icon: CheckCircle },
    { name: 'Aptitude', path: '/placement-prep/aptitude', icon: Brain },
    { name: 'Technical', path: '/placement-prep/technical', icon: Code2 },
    { name: 'HR Interview', path: '/placement-prep/hr-interview', icon: Mic, badge: 'Mock' },
    { name: 'Company Prep', path: '/placement-prep/company', icon: Building2 },
    { name: 'My Progress', path: '/my-progress', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="PlacementAI" className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-outfit">
                Placement<span className="gradient-text">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">PLACEMENT SYSTEM</span>
            </div>
          </Link>
        </div>

        {/* User Card Mini */}
        {currentUser && (
          <div className="mx-4 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.name || 'User'}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="w-10 h-10 rounded-full ring-2 ring-blue-500/20 shrink-0 object-cover"
              />
            ) : null}
            <div
              style={{ display: currentUser.photoURL ? 'none' : 'flex' }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-sm items-center justify-center shrink-0 shadow-sm ring-2 ring-blue-500/20"
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name || 'Student'}</span>
              <span className="text-[11px] text-slate-500 truncate">{currentUser.role || 'Student'}</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
