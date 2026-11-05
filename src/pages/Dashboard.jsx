import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  Target,
  Video,
  BarChart3,
  Search,
  Bell,
  Sparkles,
  RefreshCw,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  X,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Menu,
  Bot,
  Code2,
  BookOpen,
  MessageSquare,
  Check,
  Award
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { ROUTES } from '../routes/paths';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [moduleSearch, setModuleSearch] = useState('');

  const [statsLoading, setStatsLoading] = useState(!currentUser?.stats);
  const [_statsError, setStatsError] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: currentUser?.stats || {
      resumeScore: 0,
      atsScore: 0,
      aptitudeScore: 0,
      technicalScore: 0,
      hrScore: 0,
      overallReadiness: 0,
      testsCompleted: 0,
      mockInterviews: 0,
      resumesCount: 0
    },
    recentActivities: []
  });

  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Personalized Study Plan & AI Analysis
  const [studyPlanData, setStudyPlanData] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [togglingTaskId, setTogglingTaskId] = useState(null);
  const [showDetailedRoadmap, setShowDetailedRoadmap] = useState(false);

  useEffect(() => {
    setStatsLoading(true);
    setStatsError(false);
    API.getDashboardStats()
      .then(res => {
        if (res && res.stats) {
          setDashboardData(res);
        }
      })
      .catch(err => {
        console.warn('Dashboard stats notice:', err.message);
        setStatsError(true);
      })
      .finally(() => setStatsLoading(false));

    loadRecommendations(false);
    loadStudyPlan();
  }, []);

  const loadStudyPlan = async () => {
    setLoadingPlan(true);
    try {
      const data = await API.getStudyPlan();
      if (data) {
        setStudyPlanData(data);
      }
    } catch (err) {
      console.warn('Study plan load notice:', err.message);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleToggleTask = async (weekNumber, taskId, currentStatus) => {
    const newStatus = !currentStatus;
    setTogglingTaskId(taskId);

    // Optimistic UI update
    setStudyPlanData(prev => {
      if (!prev?.studyPlan?.weeks) return prev;
      const updatedWeeks = prev.studyPlan.weeks.map(w => {
        if (w.week === weekNumber && Array.isArray(w.tasks)) {
          return {
            ...w,
            tasks: w.tasks.map(t => (t.id === taskId ? { ...t, completed: newStatus } : t))
          };
        }
        return w;
      });
      return {
        ...prev,
        studyPlan: {
          ...prev.studyPlan,
          weeks: updatedWeeks
        }
      };
    });

    try {
      await API.toggleStudyPlanTask({
        weekNumber,
        taskId,
        completed: newStatus
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
      loadStudyPlan();
    } finally {
      setTogglingTaskId(null);
    }
  };

  const getModuleLink = (moduleName = '') => {
    const m = (moduleName || '').toLowerCase();
    if (m.includes('aptitude')) return ROUTES.aptitude;
    if (m.includes('tech') || m.includes('code') || m.includes('algorithm') || m.includes('dsa')) return ROUTES.technical;
    if (m.includes('hr') || m.includes('interview') || m.includes('behavioral')) return ROUTES.hrInterview;
    if (m.includes('company') || m.includes('system design')) return ROUTES.companyPrep;
    if (m.includes('ats')) return ROUTES.atsChecker;
    if (m.includes('resume')) return ROUTES.resumeBuilder;
    return ROUTES.dashboard;
  };

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

  const searchableModules = [
    { label: 'Dashboard', path: ROUTES.dashboard, keywords: 'overview home' },
    { label: 'Resume Builder', path: ROUTES.resumeBuilder, keywords: 'cv create edit template' },
    { label: 'ATS Checker', path: ROUTES.atsChecker, keywords: 'resume scan score ats' },
    { label: 'Aptitude Practice', path: ROUTES.aptitude, keywords: 'quant reasoning english test' },
    { label: 'Technical Practice', path: ROUTES.technical, keywords: 'coding programming dsa' },
    { label: 'HR Interview Practice', path: ROUTES.hrInterview, keywords: 'mock behavioral interview' },
    { label: 'Company Preparation', path: ROUTES.companyPrep, keywords: 'employer hiring rounds' },
    { label: 'My Progress', path: ROUTES.progress, keywords: 'history analytics performance' },
    { label: 'Profile', path: ROUTES.profile, keywords: 'personal details education' },
    { label: 'Settings', path: ROUTES.settings, keywords: 'preferences privacy account' },
  ];

  const filteredModules = moduleSearch.trim()
    ? searchableModules.filter((item) =>
        `${item.label} ${item.keywords}`.toLowerCase().includes(moduleSearch.trim().toLowerCase())
      )
    : [];

  const studentFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Diya';
  const studentFullName = currentUser?.name || 'Diya Shah';
  const studentSubtitle = currentUser?.targetRole || currentUser?.role || currentUser?.branch || 'Candidate';
  const userPhoto = currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120';

  const rawAtsScore = statsLoading ? 0 : (stats.atsScore || stats.resumeScore || 0);
  const rawOverallReadiness = statsLoading ? 0 : (stats.overallReadiness || 0);

  // Animated ring values — start at 0, animate to real value after mount
  const [animatedAts, setAnimatedAts] = React.useState(0);
  const [animatedOverall, setAnimatedOverall] = React.useState(0);
  React.useEffect(() => {
    if (!statsLoading) {
      const t = setTimeout(() => {
        setAnimatedAts(rawAtsScore);
        setAnimatedOverall(rawOverallReadiness);
      }, 120); // slight delay so CSS transition fires after paint
      return () => clearTimeout(t);
    }
  }, [statsLoading, rawAtsScore, rawOverallReadiness]);

  const atsScoreVal = animatedAts;
  const overallReadinessVal = animatedOverall;

  // Default recent activity list matching reference screenshot, smoothly backed by user's actual history
  const displayActivities = recentActivities.length > 0 ? recentActivities.slice(0, 4) : [
    {
      title: 'Resume "Software Developer" created',
      time: '2 hours ago',
      type: 'resume',
      icon: <FileText className="w-4 h-4 text-[#7C3AED]" />,
      bg: 'bg-purple-50'
    },
    {
      title: 'Aptitude Test completed',
      time: '5 hours ago',
      type: 'aptitude',
      icon: <Target className="w-4 h-4 text-pink-500" />,
      bg: 'bg-pink-50'
    },
    {
      title: 'Technical Test completed',
      time: 'Yesterday',
      type: 'technical',
      icon: <Code2 className="w-4 h-4 text-indigo-600" />,
      bg: 'bg-indigo-50'
    },
    {
      title: 'AI Interview practice completed',
      time: '2 days ago',
      type: 'hr',
      icon: <MessageSquare className="w-4 h-4 text-rose-500" />,
      bg: 'bg-rose-50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header matching reference screenshot */}
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 flex-1 justify-end max-w-2xl">
            {/* Search Input */}
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="flex items-center bg-[#F8F9FE] sm:bg-white border border-[#EAEBF4] rounded-2xl px-3.5 py-2 text-xs text-slate-600 focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={moduleSearch}
                  onChange={(e) => setModuleSearch(e.target.value)}
                  placeholder="Search anything..."
                  className="bg-transparent border-none outline-none w-full text-xs text-slate-800 placeholder-slate-400"
                />
                {moduleSearch && (
                  <button onClick={() => setModuleSearch('')} className="text-slate-400 hover:text-slate-600 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Live search dropdown results */}
              {filteredModules.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                  {filteredModules.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setModuleSearch('')}
                      className="px-4 py-2 hover:bg-purple-50 text-xs font-semibold text-slate-700 hover:text-[#7C3AED] flex items-center justify-between transition"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell with '3' count badge */}
            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-2xl text-slate-600 hover:text-[#7C3AED] hover:bg-purple-50 transition relative border border-[#EAEBF4] bg-white shadow-2xs"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-4 h-4 rounded-full bg-[#E03484] text-white font-bold text-[9px] flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white">
                  3
                </span>
              </button>
            </div>

            {/* User Profile Pill */}
            <Link
              to={ROUTES.profile}
              className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
            >
              <img
                src={userPhoto}
                alt={studentFullName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/20"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120';
                }}
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {studentFullName}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 leading-none font-medium">
                  {studentSubtitle}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-0.5" />
            </Link>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Welcome Greeting Header matching reference screenshot */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7C3AED]" />
              <span>Welcome back, {studentFirstName}!</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Let's continue your placement preparation journey.
            </p>
          </div>

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 1. TOP 4 SUMMARY METRIC CARDS ROW                                     */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {statsLoading ? (
              // Shimmer skeleton cards
              <>
                {[0,1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex flex-col justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 w-10 bg-slate-100 rounded-lg" />
                        <div className="h-3 w-24 bg-slate-100 rounded-lg" />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-50">
                      <div className="h-3 w-16 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Card 1: Resumes Created */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      {stats.resumesCount > 0 ? (
                        <div className="text-2xl font-extrabold text-slate-900 font-outfit leading-none">{stats.resumesCount}</div>
                      ) : (
                        <div className="text-xs font-semibold text-slate-400 leading-snug">Not started yet</div>
                      )}
                      <div className="text-xs text-slate-500 font-medium mt-1">Resumes Created</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    {stats.resumesCount > 0 ? (
                      <Link to={ROUTES.resumeBuilder} className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] inline-flex items-center gap-1 transition">
                        <span>View all</span><span>→</span>
                      </Link>
                    ) : (
                      <Link to={ROUTES.resumeBuilder} className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] inline-flex items-center gap-1 transition">
                        <span>Create your first resume</span><span>→</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Card 2: ATS Score */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      {atsScoreVal > 0 ? (
                        <div className="text-2xl font-extrabold text-slate-900 font-outfit leading-none">{atsScoreVal}%</div>
                      ) : (
                        <div className="text-xs font-semibold text-slate-400 leading-snug">Not attempted yet</div>
                      )}
                      <div className="text-xs text-slate-500 font-medium mt-1">ATS Score (Avg)</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    <Link to={ROUTES.atsChecker} className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] inline-flex items-center gap-1 transition">
                      <span>{atsScoreVal > 0 ? 'Improve now' : 'Scan your resume'}</span><span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Card 3: Tests Attempted */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FDF2F8] text-[#DB2777] flex items-center justify-center shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      {stats.testsCompleted > 0 ? (
                        <div className="text-2xl font-extrabold text-slate-900 font-outfit leading-none">{stats.testsCompleted}</div>
                      ) : (
                        <div className="text-xs font-semibold text-slate-400 leading-snug">Not attempted yet</div>
                      )}
                      <div className="text-xs text-slate-500 font-medium mt-1">Tests Attempted</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    <Link to={stats.testsCompleted > 0 ? ROUTES.progress : ROUTES.aptitude} className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] inline-flex items-center gap-1 transition">
                      <span>{stats.testsCompleted > 0 ? 'View progress' : 'Take first test'}</span><span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Card 4: Interviews Done */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      {stats.mockInterviews > 0 ? (
                        <div className="text-2xl font-extrabold text-slate-900 font-outfit leading-none">{stats.mockInterviews}</div>
                      ) : (
                        <div className="text-xs font-semibold text-slate-400 leading-snug">Not attempted yet</div>
                      )}
                      <div className="text-xs text-slate-500 font-medium mt-1">Interviews Done</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    <Link to={stats.mockInterviews > 0 ? ROUTES.hrInterview : ROUTES.hrInterview} className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] inline-flex items-center gap-1 transition">
                      <span>{stats.mockInterviews > 0 ? 'View all' : 'Practice now'}</span><span>→</span>
                    </Link>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 2. MIDDLE 3 COLUMNS: RESUME ATS SCORE, RECENT ACTIVITY, UPCOMING PLAN */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Resume ATS Score */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <h3 className="text-sm font-bold text-slate-900 font-outfit">Resume ATS Score</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Circular Gauge */}
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#EDE9FE" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#7C3AED"
                        strokeWidth="8"
                        strokeDasharray="263.89"
                        strokeDashoffset={263.89 - (263.89 * atsScoreVal) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-extrabold text-slate-900 font-outfit leading-none">
                        {atsScoreVal}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 mt-1">
                        Excellent Match
                      </span>
                    </div>
                  </div>

                  {/* 4 Metrics Progress Bars */}
                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Keyword Match</span>
                        <span className="font-bold text-slate-900">90%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[90%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Skills Match</span>
                        <span className="font-bold text-slate-900">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[85%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Experience</span>
                        <span className="font-bold text-slate-900">88%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[88%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Education</span>
                        <span className="font-bold text-slate-900">83%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7C3AED] rounded-full w-[83%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={ROUTES.atsChecker}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold text-center shadow-md shadow-purple-500/20 transition block"
              >
                Improve Your Resume
              </Link>
            </div>

            {/* Column 2: Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 font-outfit">Recent Activity</h3>
                  <Link
                    to={ROUTES.progress}
                    className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] transition"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-4">
                  {displayActivities.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${act.bg || 'bg-purple-50'} flex items-center justify-center shrink-0 mt-0.5`}>
                        {act.icon || <FileText className="w-4 h-4 text-[#7C3AED]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 leading-snug">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          {act.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Upcoming Plan */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <h3 className="text-sm font-bold text-slate-900 font-outfit">Upcoming Plan</h3>
                </div>

                {/* Next Up Highlight Card */}
                <Link
                  to={ROUTES.technical}
                  className="block p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/60 to-purple-50/60 border border-pink-200/60 hover:border-pink-300 transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span>Today, 6:00 PM</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#E03484] text-[10px] font-extrabold uppercase tracking-wider">
                      Next Up
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors">
                        Technical Test – DSA
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Arrays, Strings, Searching
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#7C3AED] transition-colors" />
                  </div>
                </Link>

                {/* Upcoming Checklist Items */}
                <div className="space-y-3.5 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Aptitude Test</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px]">Tomorrow</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>AI Interview</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px]">May 29, 2025</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Resume Review</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px]">May 30, 2025</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 3. BOTTOM 3 COLUMNS: RESUME BUILDER, TEST YOUR SKILLS, YOUR PROGRESS */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Resume Builder */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Resume Builder</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  Create a professional resume in minutes.
                </p>

                <div className="flex items-stretch gap-4">
                  {/* Mini Resume Visual Mockup matching screenshot */}
                  <div className="w-32 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex shrink-0 text-[6px] select-none">
                    {/* Left purple sidebar */}
                    <div className="w-12 bg-[#7C3AED] text-white p-1.5 flex flex-col items-center justify-between space-y-1">
                      <div className="flex flex-col items-center">
                        <img
                          src={userPhoto}
                          alt="Avatar"
                          className="w-5 h-5 rounded-full object-cover border border-white/60 mb-0.5"
                        />
                        <span className="font-extrabold text-[5px] uppercase tracking-wider text-center leading-none">
                          DIYA SHAH
                        </span>
                        <span className="text-[4px] text-purple-200 text-center leading-none mt-0.5">
                          Software Dev
                        </span>
                      </div>
                      <div className="w-full space-y-1 pt-1">
                        <div className="h-1 bg-white/40 rounded-full w-full"></div>
                        <div className="h-1 bg-white/40 rounded-full w-4/5"></div>
                        <div className="h-1 bg-white/40 rounded-full w-3/4"></div>
                        <div className="h-1 bg-white/40 rounded-full w-5/6"></div>
                      </div>
                    </div>

                    {/* Right white document body */}
                    <div className="flex-1 p-1.5 space-y-1 bg-white">
                      <div>
                        <span className="font-extrabold text-slate-800 text-[6px] block leading-none">DIYA SHAH</span>
                        <span className="text-[4.5px] text-slate-400 block leading-none mt-0.5">Software Developer</span>
                      </div>
                      <div className="pt-1">
                        <span className="font-bold text-[#7C3AED] text-[5px] block leading-none uppercase">About Me</span>
                        <div className="h-0.5 bg-slate-200 rounded-full w-full mt-0.5"></div>
                        <div className="h-0.5 bg-slate-200 rounded-full w-4/5 mt-0.5"></div>
                      </div>
                      <div>
                        <span className="font-bold text-[#7C3AED] text-[5px] block leading-none uppercase">Experience</span>
                        <div className="h-0.5 bg-slate-200 rounded-full w-full mt-0.5"></div>
                        <div className="h-0.5 bg-slate-200 rounded-full w-3/4 mt-0.5"></div>
                      </div>
                      <div>
                        <span className="font-bold text-[#7C3AED] text-[5px] block leading-none uppercase">Education</span>
                        <div className="h-0.5 bg-slate-200 rounded-full w-full mt-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Checklist List */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#7C3AED] stroke-[3]" />
                        <span>Multiple Templates</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#7C3AED] stroke-[3]" />
                        <span>AI Content Suggestions</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#7C3AED] stroke-[3]" />
                        <span>ATS Friendly</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#7C3AED] stroke-[3]" />
                        <span>Easy Customization</span>
                      </li>
                    </ul>

                    <div className="pt-2">
                      <Link
                        to={ROUTES.resumeBuilder}
                        className="py-2 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-bold shadow-md shadow-purple-500/20 text-center transition block"
                      >
                        Create New Resume
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Test Your Skills */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Test Your Skills</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  Prepare with our comprehensive tests.
                </p>

                {/* 2x2 Grid of Practice modules */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to={ROUTES.aptitude}
                    className="p-2.5 rounded-2xl bg-white border border-[#EAEBF4] hover:border-purple-200 hover:shadow-xs transition flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors leading-tight">
                        Aptitude Test
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight font-medium">
                        Improve your aptitude skills
                      </div>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.technical}
                    className="p-2.5 rounded-2xl bg-white border border-[#EAEBF4] hover:border-purple-200 hover:shadow-xs transition flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors leading-tight">
                        Technical Test
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight font-medium">
                        Test your technical knowledge
                      </div>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.hrInterview}
                    className="p-2.5 rounded-2xl bg-white border border-[#EAEBF4] hover:border-purple-200 hover:shadow-xs transition flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors leading-tight">
                        AI Interview
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight font-medium">
                        Practice AI based interviews
                      </div>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.companyPrep}
                    className="p-2.5 rounded-2xl bg-white border border-[#EAEBF4] hover:border-purple-200 hover:shadow-xs transition flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors leading-tight">
                        Resources
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-tight font-medium">
                        Study materials and guides
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bottom Magenta Button */}
              <div className="pt-1 flex justify-center">
                <Link
                  to={ROUTES.aptitude}
                  className="py-2.5 px-8 rounded-xl bg-[#E03484] hover:bg-[#c92471] text-white text-xs font-bold shadow-md shadow-pink-500/25 transition text-center"
                >
                  Start Practicing
                </Link>
              </div>
            </div>

            {/* Card 3: Your Progress */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Your Progress</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  Track your placement preparation journey.
                </p>

                {/* Chart & Gauge layout */}
                <div className="flex items-center gap-4">
                  {/* SVG Line Chart */}
                  <div className="flex-1">
                    <div className="relative h-28 w-full">
                      <svg className="w-full h-full" viewBox="0 0 200 90" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Horizontal guidelines */}
                        <line x1="25" y1="10" x2="195" y2="10" stroke="#F1F3F9" strokeWidth="1" />
                        <line x1="25" y1="30" x2="195" y2="30" stroke="#F1F3F9" strokeWidth="1" />
                        <line x1="25" y1="50" x2="195" y2="50" stroke="#F1F3F9" strokeWidth="1" />
                        <line x1="25" y1="70" x2="195" y2="70" stroke="#F1F3F9" strokeWidth="1" />

                        {/* Y-axis text */}
                        <text x="0" y="12" fill="#94A3B8" fontSize="6" fontWeight="bold">100%</text>
                        <text x="5" y="32" fill="#94A3B8" fontSize="6" fontWeight="bold">75%</text>
                        <text x="5" y="52" fill="#94A3B8" fontSize="6" fontWeight="bold">50%</text>
                        <text x="5" y="72" fill="#94A3B8" fontSize="6" fontWeight="bold">25%</text>

                        {/* Area gradient */}
                        <polygon
                          points="30,70 65,58 100,45 140,32 180,18 180,80 30,80"
                          fill="url(#progressGrad)"
                        />

                        {/* Line */}
                        <polyline
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points="30,70 65,58 100,45 140,32 180,18"
                        />

                        {/* Points */}
                        <circle cx="30" cy="70" r="2.5" fill="#7C3AED" />
                        <circle cx="65" cy="58" r="2.5" fill="#7C3AED" />
                        <circle cx="100" cy="45" r="2.5" fill="#7C3AED" />
                        <circle cx="140" cy="32" r="2.5" fill="#7C3AED" />
                        <circle cx="180" cy="18" r="2.5" fill="#7C3AED" />
                      </svg>
                      {/* X-axis labels */}
                      <div className="flex justify-between pl-6 pr-2 text-[8px] font-bold text-slate-400 mt-1">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                        <span>Week 5</span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Gauge 76% */}
                  <div className="flex flex-col items-center justify-center shrink-0 text-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 70 70">
                        <circle cx="35" cy="35" r="28" stroke="#EDE9FE" strokeWidth="6" fill="transparent" />
                        <circle
                          cx="35"
                          cy="35"
                          r="28"
                          stroke="#7C3AED"
                          strokeWidth="6"
                          strokeDasharray="175.93"
                          strokeDashoffset={175.93 - (175.93 * overallReadinessVal) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-sm font-extrabold text-slate-900 font-outfit">
                        {overallReadinessVal}%
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      Overall Progress
                    </div>
                    <div className="text-[10px] text-slate-400 max-w-[110px] leading-tight mt-0.5">
                      Great going! You're on the right track.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Magenta Button */}
              <div className="pt-1 flex justify-center">
                <Link
                  to={ROUTES.progress}
                  className="py-2.5 px-6 rounded-xl bg-[#E03484] hover:bg-[#c92471] text-white text-xs font-bold shadow-md shadow-pink-500/25 transition text-center"
                >
                  View Detailed Progress
                </Link>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 4. EXPANDABLE SECTION: PERSONALIZED STUDY PLAN & AI INSIGHTS           */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl border border-[#EAEBF4] shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDetailedRoadmap(prev => !prev)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-outfit">Personalized Study Roadmap &amp; AI Intelligence</h3>
                    {studyPlanData?.studyPlan?.targetRole && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-100">
                        {studyPlanData.studyPlan.targetRole}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Week-by-week prioritized tasks calibrated to your verified strengths and skill gaps
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7C3AED]">
                  {showDetailedRoadmap ? 'Hide Roadmap' : 'View Full Roadmap'}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#7C3AED] transition-transform ${showDetailedRoadmap ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {showDetailedRoadmap && (
              <div className="p-6 pt-0 border-t border-slate-100 space-y-6">
                
                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-xs text-slate-500 font-medium">Interactive weekly schedule</span>
                  <Link
                    to="/onboarding?mode=reanalyze"
                    className="px-3 py-1.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-analyze Profile</span>
                  </Link>
                </div>

                {loadingPlan ? (
                  <div className="py-8 text-center space-y-2">
                    <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
                    <p className="text-xs font-medium text-slate-500">Loading your personalized study plan...</p>
                  </div>
                ) : studyPlanData?.studyPlan?.weeks && studyPlanData.studyPlan.weeks.length > 0 ? (
                  <div className="space-y-4">
                    {/* Week Selector Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {studyPlanData.studyPlan.weeks.map(w => {
                        const total = Array.isArray(w.tasks) ? w.tasks.length : 0;
                        const done = Array.isArray(w.tasks) ? w.tasks.filter(t => t.completed).length : 0;
                        const isSelected = selectedWeek === w.week;

                        return (
                          <button
                            key={w.week}
                            type="button"
                            onClick={() => setSelectedWeek(w.week)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/20'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            <span>Week {w.week}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isSelected ? 'bg-purple-700 text-purple-100' : 'bg-slate-200 text-slate-700'}`}>
                              {done}/{total}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Week Tasks */}
                    {(() => {
                      const currentWeekObj = studyPlanData.studyPlan.weeks.find(w => w.week === selectedWeek) || studyPlanData.studyPlan.weeks[0];
                      if (!currentWeekObj) return null;

                      const tasks = Array.isArray(currentWeekObj.tasks) ? currentWeekObj.tasks : [];
                      const completedCount = tasks.filter(t => t.completed).length;
                      const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

                      return (
                        <div className="space-y-3">
                          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">Week {currentWeekObj.week} Focus</div>
                              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{currentWeekObj.theme || 'Focused Preparation'}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <span>{completedCount} of {tasks.length} Completed</span>
                              <span className="text-[#7C3AED]">({percent}%)</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {tasks.map((task) => {
                              const isDone = !!task.completed;
                              const isToggling = togglingTaskId === task.id;
                              const modulePath = getModuleLink(task.module);

                              return (
                                <div
                                  key={task.id}
                                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                    isDone ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-slate-200 hover:border-purple-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleTask(currentWeekObj.week, task.id, isDone)}
                                      disabled={isToggling}
                                      className="text-purple-600 hover:text-purple-700 transition shrink-0 p-0.5"
                                    >
                                      {isDone ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-slate-300 hover:text-purple-600" />
                                      )}
                                    </button>
                                    <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                      {task.title}
                                    </span>
                                  </div>
                                  <Link
                                    to={modulePath}
                                    className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-bold transition flex items-center gap-1"
                                  >
                                    <span>Practice</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                    <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-800">No Personalized Plan Generated Yet</h4>
                    <p className="text-[11px] text-slate-500">
                      Complete onboarding to get a customized week-by-week placement plan.
                    </p>
                    <Link
                      to="/onboarding"
                      className="px-4 py-1.5 rounded-xl bg-[#7C3AED] text-white font-bold text-xs inline-flex items-center gap-1 mt-2"
                    >
                      Start Onboarding
                    </Link>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
