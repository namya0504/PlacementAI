import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, PieChart, Code, HelpCircle, FileText, Menu, Sparkles, RefreshCw, Search, CheckCircle2, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';

export default function CompanyPrep() {
  const [searchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || 'TCS');
  const [customSearch, setCustomSearch] = useState('');
  const [activeTab, setActiveTab] = useState('process');
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularCompanies = [
    { name: 'TCS', tag: 'NQT & Digital' },
    { name: 'Infosys', tag: 'Specialist Programmer' },
    { name: 'Amazon', tag: 'SDE-1 Drive' },
    { name: 'Google', tag: 'STEP & SWE' },
    { name: 'Microsoft', tag: 'SWE College Hire' },
    { name: 'Accenture', tag: 'ASE & FSE' }
  ];

  const fetchPrepGuide = async (company, refresh = false) => {
    setLoading(true);
    setError('');
    try {
      const data = await API.getCompanyPrepGuide(company, refresh);
      if (data) {
        setGuideData(data);
      }
    } catch (err) {
      console.error('Error fetching prep guide:', err);
      setError(err.message || 'Failed to generate company guide.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrepGuide(selectedCompany, false);
  }, [selectedCompany]);

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (customSearch.trim()) {
      setSelectedCompany(customSearch.trim());
      setCustomSearch('');
    }
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Company Preparation</h1>
              <p className="text-xs text-slate-500">Grok AI-generated recruitment blueprints and interview questions</p>
            </div>
          </div>

          <button
            onClick={() => fetchPrepGuide(selectedCompany, true)}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition border border-purple-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
            <span>{loading ? 'Generating...' : 'Refresh Guide'}</span>
          </button>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Company Selector & Search */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Select or Search Any Target Company</h3>
              <form onSubmit={handleCustomSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={customSearch}
                    onChange={e => setCustomSearch(e.target.value)}
                    placeholder="Enter any company (e.g. Adobe, Uber)..."
                    className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 w-60"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                >
                  Generate
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {popularCompanies.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCompany(c.name)}
                  className={`p-3.5 rounded-xl border font-bold text-center transition flex flex-col items-center justify-center space-y-1 ${
                    selectedCompany.toLowerCase() === c.name.toLowerCase()
                      ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-outfit text-base">{c.name}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{c.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Module Content */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-black text-slate-900 font-outfit">{selectedCompany} Recruitment Guide</h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {guideData?.overview || `Comprehensive placement preparation guide for ${selectedCompany}.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Updated for 2026 Season
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
              {[
                { id: 'process', label: 'Selection Process', icon: PieChart },
                { id: 'topics', label: 'Key Topics & Cutoffs', icon: Code },
                { id: 'questions', label: 'Common Interview Questions', icon: HelpCircle }
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

            {/* Content Display */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <div className="text-sm font-bold text-slate-700">Generating {selectedCompany} Prep Blueprint with Grok AI...</div>
                <div className="text-xs text-slate-400">Synthesizing interview rounds, cutoff criteria, and technical questions</div>
              </div>
            ) : error ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-red-600 font-medium">{error}</p>
                <button
                  onClick={() => fetchPrepGuide(selectedCompany, true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Retry
                </button>
              </div>
            ) : guideData ? (
              <div>
                {/* 1. SELECTION PROCESS ROUNDS */}
                {activeTab === 'process' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hiring Pipeline & Assessment Rounds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {guideData.selectionProcess?.map((round, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              Round {round.round || idx + 1}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 font-bold">{round.duration || '45 mins'}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{round.name}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{round.focus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TOPICS & CUTOFFS */}
                {activeTab === 'topics' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Technical Topics */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Code className="w-4 h-4 text-purple-600" />
                        <span>Core Topics Tested</span>
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {guideData.keyTopics?.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Eligibility & Cutoff Criteria */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Eligibility & Cutoff Criteria</span>
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700 pt-1">
                        <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-500">Minimum CGPA:</span>
                          <span className="font-bold text-slate-900">{guideData.cutoffCriteria?.minCgpa || '6.5+ CGPA'}</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-500">Eligible Branches:</span>
                          <span className="font-bold text-slate-900">
                            {Array.isArray(guideData.cutoffCriteria?.eligibleBranches)
                              ? guideData.cutoffCriteria.eligibleBranches.join(', ')
                              : guideData.cutoffCriteria?.eligibleBranches || 'CSE, IT, ECE'}
                          </span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-500">Backlog Allowance:</span>
                          <span className="font-bold text-slate-900">{guideData.cutoffCriteria?.allowedBacklogs || '0 active backlogs'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. COMMON INTERVIEW QUESTIONS */}
                {activeTab === 'questions' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Frequently Asked Questions & Strategy</h3>
                    <div className="space-y-3">
                      {guideData.frequentlyAskedQuestions?.map((q, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${q.type === 'Technical' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {q.type}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">{q.question}</h4>
                          </div>
                          <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100">
                            💡 Insight: {q.keyInsight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

          </div>

        </div>
      </main>
    </div>
  );
}
