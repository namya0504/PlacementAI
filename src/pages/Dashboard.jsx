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
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  X,
  ExternalLink,
  ShieldCheck
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

  // Personalized Study Plan & Grok Analysis
  const [studyPlanData, setStudyPlanData] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [togglingTaskId, setTogglingTaskId] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return sessionStorage.getItem('placement_onboarding_banner_dismissed') === 'true';
  });

  useEffect(() => {
    API.getDashboardStats()
      .then(res => {
        if (res && res.stats) {
          setDashboardData(res);
        }
      })
      .catch(err => console.warn('Dashboard stats notice:', err.message));

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
      // Refresh to sync if failed
      loadStudyPlan();
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    sessionStorage.setItem('placement_onboarding_banner_dismissed', 'true');
  };

  const getModuleLink = (moduleName = '') => {
    const m = (moduleName || '').toLowerCase();
    if (m.includes('aptitude')) return '/placement-prep/aptitude';
    if (m.includes('tech') || m.includes('code') || m.includes('algorithm') || m.includes('dsa')) return '/placement-prep/technical';
    if (m.includes('hr') || m.includes('interview') || m.includes('behavioral')) return '/placement-prep/hr-interview';
    if (m.includes('company') || m.includes('system design')) return '/placement-prep/company';
    if (m.includes('ats')) return '/ats-checker';
    if (m.includes('resume')) return '/resume-builder';
    return '/placement-prep';
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

          {/* Dismissible Onboarding Banner for Skipped or Legacy Users */}
          {!bannerDismissed && (!currentUser?.onboarding || currentUser?.onboarding?.status !== 'completed') && (
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-purple-400/30">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-amber-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base font-outfit flex items-center gap-2">
                    Unlock Your Tailored Grok AI Study Roadmap
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-wider text-purple-100">Recommended</span>
                  </h3>
                  <p className="text-xs text-purple-100 mt-0.5 max-w-2xl leading-relaxed">
                    Complete your onboarding profile to unlock a 4-week structured preparation plan, ATS benchmark analysis, and personalized starter interview questions.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  to="/onboarding"
                  className="px-4 py-2 rounded-xl bg-white text-purple-700 font-bold text-xs hover:bg-purple-50 transition shadow-sm flex items-center gap-1.5"
                >
                  <span>Complete Onboarding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={handleDismissBanner}
                  className="p-2 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition"
                  title="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
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

          {/* YOUR PERSONALIZED PLAN (GROK AI ROADMAP) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">Your Personalized Plan</h3>
                    {studyPlanData?.studyPlan?.targetRole && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-100">
                        {studyPlanData.studyPlan.targetRole}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Week-by-week prioritized tasks calibrated to your verified strengths and skill gaps
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/onboarding?mode=reanalyze"
                  className="px-3 py-1.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-analyze Profile</span>
                </Link>
              </div>
            </div>

            {loadingPlan ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-500">Loading your personalized study plan...</p>
              </div>
            ) : studyPlanData?.studyPlan?.weeks && studyPlanData.studyPlan.weeks.length > 0 ? (
              <div className="space-y-6">
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
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
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

                {/* Selected Week Content */}
                {(() => {
                  const currentWeekObj = studyPlanData.studyPlan.weeks.find(w => w.week === selectedWeek) || studyPlanData.studyPlan.weeks[0];
                  if (!currentWeekObj) return null;

                  const tasks = Array.isArray(currentWeekObj.tasks) ? currentWeekObj.tasks : [];
                  const completedCount = tasks.filter(t => t.completed).length;
                  const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

                  return (
                    <div className="space-y-4">
                      {/* Theme banner & progress */}
                      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Week {currentWeekObj.week} Focus</div>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{currentWeekObj.theme || 'Focused Preparation'}</h4>
                          {Array.isArray(currentWeekObj.focusAreas) && currentWeekObj.focusAreas.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {currentWeekObj.focusAreas.map((fa, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-[11px] text-purple-800 font-medium">
                                  {fa}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col md:items-end shrink-0 min-w-[140px]">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                            <span>{completedCount} of {tasks.length} Completed</span>
                            <span className="text-purple-600">({percent}%)</span>
                          </div>
                          <div className="w-full md:w-36 h-2 bg-purple-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tasks List */}
                      <div className="space-y-2.5">
                        {tasks.map((task) => {
                          const isDone = !!task.completed;
                          const isToggling = togglingTaskId === task.id;
                          const modulePath = getModuleLink(task.module);

                          return (
                            <div
                              key={task.id}
                              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                isDone
                                  ? 'bg-slate-50 border-slate-200 opacity-80'
                                  : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleTask(currentWeekObj.week, task.id, isDone)}
                                  disabled={isToggling}
                                  className="text-purple-600 hover:text-purple-700 transition shrink-0 p-0.5 focus:outline-none"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300 hover:text-purple-600" />
                                  )}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`text-xs font-semibold ${
                                        isDone ? 'line-through text-slate-400' : 'text-slate-800'
                                      }`}
                                    >
                                      {task.title}
                                    </span>
                                    {task.module && (
                                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                                        {task.module}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {task.estimatedHours && (
                                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Clock className="w-3 h-3" />
                                    ~{task.estimatedHours}h
                                  </span>
                                )}
                                <Link
                                  to={modulePath}
                                  className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition flex items-center gap-1"
                                >
                                  <span>Practice</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Personalized Plan Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Complete the quick onboarding to let Grok AI analyze your resume, GitHub, and goals into a customized week-by-week placement plan.
                </p>
                <div className="pt-2">
                  <Link
                    to="/onboarding"
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition inline-flex items-center gap-1.5"
                  >
                    <span>Start Onboarding</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* CANDIDATE PROFILE SUMMARY, STRENGTHS & SKILL GAPS */}
          {studyPlanData?.analysis && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-outfit">Verified Profile Intelligence</h3>
                    <p className="text-xs text-slate-500">
                      Grok AI analysis from your verified resume & GitHub data
                      {studyPlanData?.createdAt && (
                        <span> • Last analyzed {new Date(studyPlanData.createdAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {studyPlanData.analysis.profileSummary && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                  {studyPlanData.analysis.profileSummary}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                {Array.isArray(studyPlanData.analysis.strengths) && studyPlanData.analysis.strengths.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Key Candidate Strengths</span>
                    </div>
                    <ul className="space-y-1.5 pt-1">
                      {studyPlanData.analysis.strengths.map((s, idx) => (
                        <li key={idx} className="text-xs text-emerald-950 flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skill Gaps */}
                {Array.isArray(studyPlanData.analysis.skillGaps) && studyPlanData.analysis.skillGaps.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Target Role Skill Gaps ({studyPlanData.analysis.targetRole || 'Target Role'})</span>
                    </div>
                    <div className="space-y-2 pt-1">
                      {studyPlanData.analysis.skillGaps.map((gap, idx) => (
                        <div key={idx} className="text-xs bg-white/80 p-2.5 rounded-lg border border-amber-200/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{typeof gap === 'string' ? gap : (gap.skill || '')}</span>
                            {gap.level && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                gap.level === 'Critical' ? 'bg-red-100 text-red-700' :
                                gap.level === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {gap.level}
                              </span>
                            )}
                          </div>
                          {gap.action && (
                            <p className="text-[11px] text-slate-600">{gap.action}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
