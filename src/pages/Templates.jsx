import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, Check, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Templates() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const templatesList = [
    { id: 'modern', name: 'Modern Tech', role: 'Software Developer', category: 'Modern', tag: 'Most Popular', color: 'from-blue-600 to-indigo-600' },
    { id: 'professional', name: 'Corporate Elite', role: 'Product Manager', category: 'Professional', tag: 'Executive', color: 'from-purple-600 to-pink-600' },
    { id: 'minimal', name: 'Minimalist Clean', role: 'Data Scientist', category: 'Minimal', tag: 'ATS Approved', color: 'from-emerald-600 to-teal-600' },
    { id: 'creative', name: 'Creative Designer', role: 'UI/UX Designer', category: 'Creative', tag: 'Designers', color: 'from-amber-600 to-orange-600' },
    { id: 'classic', name: 'Classic Analyst', role: 'Business Analyst', category: 'Classic', tag: 'Traditional', color: 'from-slate-700 to-slate-900' },
    { id: 'executive', name: 'Executive Leader', role: 'Engineering Lead', category: 'Professional', tag: 'Senior', color: 'from-blue-700 to-cyan-700' }
  ];

  const roles = ['All', 'Software Developer', 'Data Scientist', 'Product Manager', 'UI/UX Designer'];

  const filteredTemplates = templatesList.filter(t => {
    const matchesRole = selectedRole === 'All' || t.role === selectedRole;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSelectTemplate = (templateId) => {
    navigate(`/resume-builder?template=${templateId}`);
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Resume Templates</h1>
              <p className="text-xs text-slate-500">Select an ATS-friendly template to start building</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedRole === r
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(tpl => (
              <div key={tpl.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`h-56 rounded-xl bg-gradient-to-tr ${tpl.color} p-4 text-white flex flex-col justify-between relative overflow-hidden shadow-inner group-hover:scale-102 transition`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-white/20 backdrop-blur-md">
                        {tpl.category}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-yellow-400 text-slate-900 shadow">
                        {tpl.tag}
                      </span>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md text-slate-900 rounded-lg p-3 space-y-1.5 shadow-lg">
                      <div className="w-1/2 h-2.5 bg-blue-600 rounded"></div>
                      <div className="w-3/4 h-1.5 bg-slate-300 rounded"></div>
                      <div className="w-full h-1 bg-slate-200 rounded mt-2"></div>
                      <div className="w-5/6 h-1 bg-slate-200 rounded"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 font-outfit text-lg">{tpl.name}</h3>
                    <p className="text-xs text-slate-500">Best for {tpl.role}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
