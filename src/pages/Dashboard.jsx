import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Brain,
  Code2,
  Mic,
  Building2,
  TrendingUp,
  Award,
  Bell,
  Search,
  CheckSquare,
  Square,
  ArrowUpRight,
  Menu,
  Sparkles,
  RefreshCw,
  Target,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    stats: currentUser?.stats || {
      resumeScore: 0,
      atsScore: 0,
      aptitudeScore: 0,
      technicalScore: 0,
      hrScore: 0,
      overallReadiness: 0,
      testsCompleted: 0,
      mockInterviews: 0
    },
    recentActivities: []
  });

  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    API.getDashboardStats()
      .then(res => {
        if (res && res.stats) {
          setDashboardData(res);
        }
      })
      .catch(err => console.warn('Dashboard stats notice:', err.message));

    loadRecommendations(false);
  }, []);

  const loadRecommendations = async (refresh = false) => {
    setLoadingRecs(true);
    try {
      const recs = await API.getAIRecommendations(refresh);
      if (recs) {
        setAiRecommendations(recs);
      }
    } catch (e) {
      console.warn('AI recommendations load error:', e.message);
    } finally {
      setLoadingRecs(false);
    }
  };

  const stats = dashboardData.stats || {};
  const recentActivities = dashboardData.recentActivities || [];

  const overallReadiness = stats.overallReadiness || 0;
  const strokeOffset = Math.round(163 - (163 * overallReadiness) / 100);

  // Dynamic stage calculations
  const testsCompleted = stats.testsCompleted || 0;
  const aptitudeStage = testsCompleted === 0 ? 1 : testsCompleted < 3 ? 2 : testsCompleted < 6 ? 3 : 4;

  const techScore = stats.technicalScore || 0;
  const techStage = techScore === 0 ? 1 : techScore < 40 ? 2 : techScore < 75 ? 3 : 4;

  const interviewsCompleted = stats.mockInterviews || 0;
  const hrRound = interviewsCompleted === 0 ? 1 : interviewsCompleted < 2 ? 2 : interviewsCompleted < 4 ? 3 : 4;

  const companyPrepScore = Math.round(((stats.aptitudeScore || 0) + (stats.technicalScore || 0)) / 2);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                Hello, {currentUser?.name || 'Student'} <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Track your personalized placement roadmap powered by Grok AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search modules, companies..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
              />
            </div>
            <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Top Banner: Placement Readiness Gauge */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>AI Placement Officer Active</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight">
                  Placement Readiness Score
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                  Calculated dynamically from your verified performance in Resume, ATS, Aptitude tests, Technical challenges, and Mock HR interviews.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Link
                    to="/aptitude"
                    className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition shadow-lg"
                  >
                    Take Adaptive Test
                  </Link>
                  <Link
                    to="/company-prep"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
                  >
                    Company Prep
                  </Link>
                </div>
              </div>

              {/* Readiness Semi-Circle Gauge */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="relative w-36 h-28 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset="125.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#ffffff"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={125.6 + (125.6 * (100 - overallReadiness)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute top-10 flex flex-col items-center">
                    <span className="text-3xl font-black font-outfit">{overallReadiness}%</span>
                    <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Readiness</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* GROK AI PERSONALIZED RECOMMENDATIONS SECTION */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Personalized AI Insights & Strategy</h3>
                  <p className="text-xs text-slate-500">Tailored by Grok AI based on your actual performance</p>
                </div>
              </div>

              <button
                onClick={() => loadRecommendations(true)}
                disabled={loadingRecs}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRecs ? 'animate-spin text-purple-600' : ''}`} />
                <span>{loadingRecs ? 'Analyzing...' : 'Refresh AI Plan'}</span>
              </button>
            </div>

            {loadingRecs ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-500">Grok AI is analyzing your performance metrics...</p>
              </div>
            ) : aiRecommendations ? (
              <div className="space-y-4 pt-2">
                {aiRecommendations.placementReadinessAssessment && (
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                    {aiRecommendations.placementReadinessAssessment}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths & Weaknesses */}
                  {aiRecommendations.criticalWeaknesses?.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>High Priority Focus Areas</span>
                      </div>
                      <ul className="space-y-1">
                        {aiRecommendations.criticalWeaknesses.map((w, idx) => (
                          <li key={idx} className="text-xs text-amber-800 flex items-start gap-1.5">
                            <span className="font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Top Recommended Companies */}
                  {aiRecommendations.topRecommendedCompanies?.length > 0 && (
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                      <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-blue-600" />
                        <span>Recommended Target Companies</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {aiRecommendations.topRecommendedCompanies.map((c, idx) => (
                          <Link
                            key={idx}
                            to={`/company-prep?company=${encodeURIComponent(c)}`}
                            className="px-3 py-1 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition"
                          >
                            {c} →
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Action Plan Steps */}
                {Array.isArray(aiRecommendations.actionPlan) && aiRecommendations.actionPlan.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recommended Next Actions</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {aiRecommendations.actionPlan.map((step, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              {step.module || 'Action'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Target: {step.targetScore || '80%+'}</span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium leading-snug">{step.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Your Progress Stage Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <Link to="/aptitude" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Brain className="w-4 h-4 text-blue-600" /> Aptitude
                  </div>
                  <span className="text-xs font-bold text-blue-600">{stats.aptitudeScore || 0}%</span>
                </div>
                <div className="text-xs text-slate-500">Stage {aptitudeStage} of 4</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${stats.aptitudeScore || 0}%` }}></div>
                </div>
              </Link>

              <Link to="/technical" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Code2 className="w-4 h-4 text-purple-600" /> Technical
                  </div>
                  <span className="text-xs font-bold text-purple-600">{stats.technicalScore || 0}%</span>
                </div>
                <div className="text-xs text-slate-500">Stage {techStage} of 4</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${stats.technicalScore || 0}%` }}></div>
                </div>
              </Link>

              <Link to="/hr-interview" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Mic className="w-4 h-4 text-emerald-600" /> HR Interview
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{stats.hrScore || 0}%</span>
                </div>
                <div className="text-xs text-slate-500">Round {hrRound} of 4</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${stats.hrScore || 0}%` }}></div>
                </div>
              </Link>

              <Link to="/company-prep" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Building2 className="w-4 h-4 text-amber-600" /> Company Prep
                  </div>
                  <span className="text-xs font-bold text-amber-600">{companyPrepScore}%</span>
                </div>
                <div className="text-xs text-slate-500">Recruitment Ready</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: `${companyPrepScore}%` }}></div>
                </div>
              </Link>

            </div>
          </div>

          {/* Bottom Grid: Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{act.title}</div>
                        <div className="text-[11px] text-slate-500">{act.score}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {act.time ? new Date(act.time).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No activities recorded yet. Complete an aptitude test or resume to see your history here!
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
