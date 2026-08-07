import React, { useState } from 'react';
import { Building2, PieChart, Code, HelpCircle, FileText, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function CompanyPrep() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('TCS');
  const [activeTab, setActiveTab] = useState('aptitude');

  const companies = [
    { name: 'TCS', tag: 'TCS NQT Exam' },
    { name: 'Infosys', tag: 'InfyTQ Test' },
    { name: 'Wipro', tag: 'NLTH Exam' },
    { name: 'Accenture', tag: 'Cognitive Test' },
    { name: 'Capgemini', tag: 'Exceller Drive' }
  ];

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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Company Preparation</h1>
              <p className="text-xs text-slate-500">Company-specific placement patterns & past interview experience</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Select Company Selector Bar (Screen 12 in Collage) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Select Company</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {companies.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCompany(c.name)}
                  className={`p-4 rounded-xl border font-bold text-center transition flex flex-col items-center justify-center space-y-1 ${
                    selectedCompany === c.name
                      ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-outfit text-lg">{c.name}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{c.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Module Tabs (Aptitude Pattern, Technical Topics, HR Questions, Recent Experiences) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex gap-3 border-b border-slate-100 pb-4 overflow-x-auto">
              {[
                { id: 'aptitude', label: 'Aptitude Pattern', icon: PieChart },
                { id: 'technical', label: 'Technical Topics', icon: Code },
                { id: 'hr', label: 'HR Questions', icon: HelpCircle },
                { id: 'experiences', label: 'Recent Questions', icon: FileText }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      activeTab === t.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Content Display (Screen 12 Bottom Layout) */}
            {activeTab === 'aptitude' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 font-outfit">{selectedCompany} Aptitude Pattern</h4>
                  <div className="text-xs text-slate-500 font-bold">Total Questions: 30</div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="font-semibold">Quantitative Aptitude</span>
                      <span className="font-bold text-blue-600">40% (12 Questions)</span>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="font-semibold">Reasoning Ability</span>
                      <span className="font-bold text-purple-600">40% (12 Questions)</span>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="font-semibold">English Verbal</span>
                      <span className="font-bold text-emerald-600">20% (6 Questions)</span>
                    </li>
                  </ul>
                </div>

                {/* SVG Pie Chart Illustration (Matches Screen 12 Pie Chart) */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                      <circle r="16" cx="16" cy="16" fill="transparent" stroke="#2563EB" strokeWidth="32" strokeDasharray="40 100" />
                      <circle r="16" cx="16" cy="16" fill="transparent" stroke="#7C3AED" strokeWidth="32" strokeDasharray="40 100" strokeDashoffset="-40" />
                      <circle r="16" cx="16" cy="16" fill="transparent" stroke="#22C55E" strokeWidth="32" strokeDasharray="20 100" strokeDashoffset="-80" />
                    </svg>
                  </div>
                  <div className="mt-4 flex gap-4 text-xs font-bold">
                    <span className="text-blue-600">● Quant (40%)</span>
                    <span className="text-purple-600">● Reasoning (40%)</span>
                    <span className="text-emerald-600">● English (20%)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'aptitude' && (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800">{selectedCompany} {activeTab.toUpperCase()} Data</h4>
                <p className="text-xs max-w-sm mx-auto">Updated for 2026 recruitment drives. Practice real past questions from recent campus placement rounds.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
