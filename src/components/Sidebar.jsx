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
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { ROUTES } from '../routes/paths';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

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

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const isItemActive = (path) => {
    if (path === ROUTES.dashboard) {
      return location.pathname === ROUTES.dashboard;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        aria-label="Application sidebar"
        className={`fixed top-0 bottom-0 left-0 z-[45] bg-white border-r border-[#EAEBF4] flex flex-col font-sans transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileOpen ? 'w-64 visible translate-x-0' : 'w-64 invisible -translate-x-full lg:visible lg:translate-x-0'
        }`}
      >
        {/* Floating Desktop Collapse/Expand Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3.5 top-7 hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#7C3AED] hover:border-purple-300 shadow-sm z-50 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Brand Header */}
        <div className={`h-20 flex items-center border-b border-slate-100 transition-all duration-300 ${
          isCollapsed ? 'px-0 justify-center' : 'px-6 justify-between'
        }`}>
          <Link to={ROUTES.dashboard} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-extrabold tracking-tight text-slate-900 font-outfit whitespace-nowrap overflow-hidden">
                Placement<span className="text-[#7C3AED]">AI</span>
              </span>
            )}
          </Link>

          {/* Mobile close button */}
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
        <nav
          aria-label="Main navigation"
          className={`flex-1 overflow-y-auto py-6 space-y-1.5 ${
            isCollapsed ? 'px-2.5' : 'px-4'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);

            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isCollapsed
                      ? 'justify-center p-3'
                      : 'gap-3.5 px-4 py-3'
                  } ${
                    active
                      ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? 'text-[#7C3AED]' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap">{item.name}</span>
                  )}
                </Link>

                {/* Tooltip on Hover when Collapsed */}
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150">
                    {item.name}
                    {/* Tooltip arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Card Mini / Logout */}
        <div className={`border-t border-slate-100 transition-all duration-300 ${
          isCollapsed ? 'p-2 space-y-2' : 'p-4 space-y-2'
        }`}>
          {currentUser && (
            <div className="relative group">
              <Link
                to={ROUTES.profile}
                className={`rounded-xl bg-slate-50 border border-slate-100 flex items-center hover:bg-slate-100 transition ${
                  isCollapsed ? 'justify-center p-2' : 'gap-3 p-2.5'
                }`}
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

                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 truncate group-hover:text-[#7C3AED]">
                      {currentUser.name || 'Namya Shah'}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {currentUser.role || currentUser.branch || '3rd Year, IT'}
                    </span>
                  </div>
                )}
              </Link>

              {/* Tooltip on Hover when Collapsed */}
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150">
                  <div className="font-bold">{currentUser.name || 'Namya Shah'}</div>
                  <div className="text-[10px] text-slate-300">{currentUser.role || currentUser.branch || '3rd Year, IT'}</div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>
          )}

          {/* Logout Button */}
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5'
              }`}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>

            {/* Tooltip on Hover when Collapsed */}
            {isCollapsed && (
              <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-rose-950 text-rose-200 text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-rose-950" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
