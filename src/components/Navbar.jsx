import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, GraduationCap, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const authenticatedNavLinks = [
    { name: 'Dashboard', path: ROUTES.dashboard },
    { name: 'Resume Builder', path: ROUTES.resumeBuilder },
    { name: 'ATS Analysis', path: ROUTES.atsChecker },
    { name: 'Placement Prep', path: ROUTES.placementPrep },
    { name: 'My Progress', path: ROUTES.progress },
  ];

  const publicNavLinks = [
    { name: 'Home', path: ROUTES.home },
    { name: 'Features', path: '/#features' },
    { name: 'About', path: ROUTES.about },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="relative z-50 transition-all duration-300 border-b border-[#EAEBF4] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Purple Graduation Cap */}
        <Link to={currentUser ? ROUTES.dashboard : ROUTES.home} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit">
            Placement<span className="text-[#7C3AED]">AI</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {currentUser ? (
            authenticatedNavLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? 'text-[#7C3AED] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })
          ) : (
            publicNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-slate-600 hover:text-[#7C3AED] transition-colors"
              >
                {link.name}
              </a>
            ))
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.profile}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    className="w-8 h-8 rounded-full ring-2 ring-purple-500/20 object-cover"
                  />
                ) : null}
                <div
                  style={{ display: currentUser.photoURL ? 'none' : 'flex' }}
                  className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] items-center justify-center font-bold text-xs"
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none">
                    {currentUser.name || 'Student'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-none">
                    {currentUser.role || '3rd Year, IT'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.login}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-purple-300 hover:text-[#7C3AED] transition shadow-xs"
              >
                Login
              </Link>
              <Link
                to={ROUTES.signup}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-sm shadow-purple-500/20 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          {(currentUser ? authenticatedNavLinks : publicNavLinks).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={ROUTES.login}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.signup}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold text-white bg-[#7C3AED] rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
