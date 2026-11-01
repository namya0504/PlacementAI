import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, CheckCircle, BrainCircuit, Code, Users, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      {/* Background Subtle Glowing Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold shadow-md">
                <span className="text-sm font-black">P</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-outfit">
                Placement<span className="text-[#A855F7]">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your comprehensive AI companion for ATS resume building, aptitude tests, technical coding practice, and AI HR interview preparation. Land your dream job with confidence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-[#7C3AED] transition" aria-label="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-[#7C3AED] transition" aria-label="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-[#7C3AED] transition" aria-label="GitHub">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-red-600 transition" aria-label="YouTube">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-outfit">Modules</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/resume-builder" className="hover:text-[#A855F7] transition">AI Resume Builder</Link></li>
              <li><Link to="/ats-checker" className="hover:text-[#A855F7] transition">ATS Resume Analysis</Link></li>
              <li><Link to="/templates" className="hover:text-[#A855F7] transition">Resume Templates</Link></li>
              <li><Link to="/placement-prep/aptitude" className="hover:text-[#A855F7] transition">Aptitude Prep</Link></li>
              <li><Link to="/placement-prep/technical" className="hover:text-[#A855F7] transition">Coding & Technical</Link></li>
              <li><Link to="/placement-prep/hr-interview" className="hover:text-[#A855F7] transition">AI HR Interview</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-outfit">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard" className="hover:text-[#A855F7] transition">Student Dashboard</Link></li>
              <li><Link to="/placement-prep/company" className="hover:text-[#A855F7] transition">Company Prep (TCS, Infosys)</Link></li>
              <li><Link to="/my-progress" className="hover:text-[#A855F7] transition">Progress Analytics</Link></li>
              <li><Link to="/about" className="hover:text-[#A855F7] transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#A855F7] transition">Contact & Support</Link></li>
              <li><Link to="/settings" className="hover:text-[#A855F7] transition">Account Settings</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-outfit">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>support@placementai.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Surat, Gujarat, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PlacementAI System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
