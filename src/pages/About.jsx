import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, Users, Target, Rocket } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* About Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Our Mission & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-outfit">
            Empowering Students to <span className="gradient-text">Ace Campus Placements</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            PlacementAI is built to bridge the gap between engineering college preparation and modern tech industry hiring standards.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg font-outfit">AI-Powered Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Smart bullet point generation, instant ATS scanner, and AI HR communication scoring.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg font-outfit">Stage-wise Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Structured learning path from beginner aptitude fundamentals to advanced coding and company mock tests.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg font-outfit">PWA & Offline Ready</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Install PlacementAI on your mobile home screen with ultra-fast page loads and responsive access.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
