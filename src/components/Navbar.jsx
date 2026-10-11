import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, User, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Links shown ONLY when the user is logged in
  const authenticatedNavLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Resume Builder', path: '/resume-builder' },
    { name: 'Resume Templates', path: '/templates' },
    { name: 'ATS Checker', path: '/ats-checker' },
    { name: 'Placement Prep', path: '/placement-prep' },
    { name: 'My Progress', path: '/my-progress' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="relative z-50 glass-nav transition-all duration-300 border-b border-slate-200/70 bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Preserved */}
        <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <img src="/logo.svg" alt="PlacementAI Logo" className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1 font-outfit">
              Placement<span className="gradient-text">AI</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">PWA</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-1">Placement Preparation</span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Visible ONLY when logged in */}
        {currentUser && (
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {authenticatedNavLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Action Buttons Right */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                Dashboard
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link to="/profile" className="flex items-center gap-2 group">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      className="w-9 h-9 rounded-full ring-2 ring-blue-600/30 group-hover:ring-blue-600 transition object-cover"
                    />
                  ) : null}
                  <div
                    style={{ display: currentUser.photoURL ? 'none' : 'flex' }}
                    className="w-9 h-9 rounded-full bg-blue-600 text-white items-center justify-center font-bold text-xs ring-2 ring-blue-600/30 group-hover:ring-blue-600 transition"
                  >
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                    {currentUser.name || currentUser.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-5 duration-200">
          {currentUser ? (
            <>
              {authenticatedNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-blue-50 text-blue-600"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

