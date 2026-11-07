import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, Award, CheckCircle2, Menu, RefreshCw, BookOpen, Code2, Mic, FileText,
  ChevronDown, Target, ArrowRight, Sparkles, Search, Filter, ChevronLeft,
  AlertTriangle, Info, TrendingDown, Zap, X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

const MODULE_CONFIG = {
  aptitude: {
    label: 'Aptitude',
    color: 'purple',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    iconClass: 'text-purple-600',
    iconBgClass: 'bg-purple-100',
    barColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    icon: BookOpen,
    link: ROUTES.aptitude
  },
  hr: {
    label: 'HR Interview',
    color: 'pink',
    badgeClass: 'bg-pink-50 text-pink-700 border border-pink-200/60',
    iconClass: 'text-pink-600',
    iconBgClass: 'bg-pink-100',
    barColor: 'bg-pink-500',
    textColor: 'text-pink-600',
    icon: Mic,
    link: ROUTES.hrInterview
  },
  technical: {
    label: 'Technical',
    color: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    iconClass: 'text-indigo-600',
    iconBgClass: 'bg-indigo-100',
    barColor: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    icon: Code2,
    link: ROUTES.technical
  },
  ats: {
    label: 'ATS Resume',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    iconClass: 'text-amber-600',
    iconBgClass: 'bg-amber-100',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-600',
    icon: FileText,
    link: ROUTES.atsChecker
  }
};

const PERIOD_OPTIONS = [
  { key: '24h',   label: 'Last 24 Hours' },
  { key: 'week',  label: 'This Week'     },
  { key: 'month', label: 'This Month'    },
  { key: 'all',   label: 'All Time'      }
];

const PAGE_SIZE = 10;

function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-3">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="p-1.5 rounded-xl border border-[#EAEBF4] text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
            p === page ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-500/20' : 'border border-[#EAEBF4] text-slate-600 hover:bg-slate-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="p-1.5 rounded-xl border border-[#EAEBF4] text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
      >
        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
      </button>
    </div>
  );
}

function ScoreBadge({ score, passed }) {
  const badgeStyle = passed
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
    : score >= 40
      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
      : 'bg-rose-50 text-rose-700 border border-rose-200/60';
  return (
    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center justify-center ${badgeStyle}`}>
      {score}%
    </span>
  );
}

function InsightTypeIcon({ type }) {
  if (type === 'positive') return <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />;
  if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
  return <Info className="w-4 h-4 text-[#7C3AED] shrink-0" />;
}

export default function MyProgress() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [period, setPeriod] = useState('week');
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [modulePage, setModulePage] = useState({});

  // AI Insights state
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [showInsights, setShowInsights] = useState(false);

  // Timeline search + filter + pagination
  const [timelineSearch, setTimelineSearch] = useState('');
  const [timelineModuleFilter, setTimelineModuleFilter] = useState('all');
  const [timelinePage, setTimelinePage] = useState(1);

  const navigate = useNavigate();

  const loadProgress = useCallback(async (p) => {
    setLoading(true);
    try {
      const data = await API.getCombinedProgress(p);
      setProgressData(data);
      setTimelinePage(1);
    } catch (err) {
      console.warn('Progress fetch notice:', err.message);
      setProgressData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress(period);
    setInsights(null);
    setInsightsError('');
    setShowInsights(false);
  }, [period, loadProgress]);

  const fetchInsights = async (refresh = false) => {
    setInsightsLoading(true);
    setInsightsError('');
    setShowInsights(true);
    try {
      const data = await API.getProgressInsights(period, refresh);
      setInsights(data);
    } catch (err) {
      setInsightsError(err.message || 'Failed to generate insights. Please try again.');
    } finally {
      setInsightsLoading(false);
    }
  };

  const summary = progressData?.summary || {};
  const timeline = progressData?.timeline || [];
  const byModule = progressData?.byModule || {};

  const overallReadiness = useMemo(() => {
    const scores = ['aptitude', 'hr', 'technical', 'ats']
      .map(k => summary[k]?.avgScore || 0).filter(s => s > 0);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [summary]);

  // Filtered + searched timeline
  const filteredTimeline = useMemo(() => {
    let items = timeline;
    if (timelineModuleFilter !== 'all') items = items.filter(i => i.module === timelineModuleFilter);
    if (timelineSearch.trim()) {
      const q = timelineSearch.toLowerCase();
      items = items.filter(i => i.title?.toLowerCase().includes(q));
    }
    return items;
  }, [timeline, timelineModuleFilter, timelineSearch]);

  const pagedTimeline = useMemo(() => {
    const start = (timelinePage - 1) * PAGE_SIZE;
    return filteredTimeline.slice(start, start + PAGE_SIZE);
  }, [filteredTimeline, timelinePage]);

  // Reset timeline page when filter/search changes
  useEffect(() => { setTimelinePage(1); }, [timelineSearch, timelineModuleFilter]);

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">My Progress</h1>
              <p className="text-xs text-slate-500">Combined performance history across all preparation modules</p>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EAEBF4] rounded-2xl shadow-2xs">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setPeriod(opt.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  period === opt.key ? 'bg-[#7C3AED] text-white shadow-xs' : 'text-slate-500 hover:text-[#7C3AED]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#7C3AED]" />
              <p className="text-sm font-medium">Loading your progress data…</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Activities', val: summary.total || 0, sub: 'in selected period', color: 'text-slate-900' },
                  { label: 'Placement Readiness', val: `${overallReadiness}%`, sub: 'avg across modules', color: 'text-[#7C3AED]' },
                  { label: 'Best Module Score', val: `${Math.max(summary.aptitude?.bestScore||0, summary.hr?.bestScore||0, summary.technical?.bestScore||0, summary.ats?.bestScore||0)}%`, sub: 'highest single score', color: 'text-emerald-600' },
                  { label: 'Pass Rate', val: (() => { const r = ['aptitude','hr','technical','ats'].map(m => summary[m]?.passRate||0).filter(x=>x>0); return r.length ? `${Math.round(r.reduce((a,b)=>a+b,0)/r.length)}%` : '—'; })(), sub: 'across active modules', color: 'text-[#E03484]' }
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs hover:shadow-md transition-shadow">
                    <div className="text-xs font-semibold text-slate-500 mb-1">{c.label}</div>
                    <div className={`text-3xl font-extrabold font-outfit ${c.color}`}>{c.val}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* AI Insights Panel */}
              <div className="bg-white rounded-3xl border border-[#EAEBF4] shadow-xs overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                    <h3 className="text-sm font-bold text-slate-900 font-outfit">AI Progress Insights</h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold border border-purple-200">AI Generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {insights && (
                      <button
                        onClick={() => fetchInsights(true)}
                        disabled={insightsLoading}
                        className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${insightsLoading ? 'animate-spin' : ''}`} /> Refresh
                      </button>
                    )}
                    {!showInsights && (
                      <button
                        onClick={() => fetchInsights(false)}
                        disabled={insightsLoading}
                        className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-purple-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {insightsLoading ? 'Analyzing…' : 'Get AI Insights'}
                      </button>
                    )}
                    {showInsights && !insightsLoading && (
                      <button onClick={() => setShowInsights(false)} className="p-1 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {showInsights && (
                  <div className="p-6">
                    {insightsLoading ? (
                      <div className="flex items-center gap-3 py-6 text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin text-purple-500" />
                        <span className="text-sm font-medium">Analyzing your performance data with AI…</span>
                      </div>
                    ) : insightsError ? (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" /> {insightsError}
                      </div>
                    ) : insights ? (
                      <div className="space-y-5">
                        {/* Overall Verdict */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                          <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Overall Assessment</div>
                          <p className="text-sm text-slate-800 leading-relaxed">{insights.overallVerdict}</p>
                        </div>

                        {/* Strength + Focus */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {insights.topStrength && (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                <TrendingUp className="w-3.5 h-3.5" /> Top Strength
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">{insights.topStrength}</p>
                            </div>
                          )}
                          {insights.criticalFocus && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                <Target className="w-3.5 h-3.5" /> Focus Area
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">{insights.criticalFocus}</p>
                            </div>
                          )}
                        </div>

                        {/* Weekly Goal */}
                        {insights.weeklyGoal && (
                          <div className="p-3 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-start gap-2">
                            <Zap className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">This Week's Goal</div>
                              <p className="text-xs text-slate-700 mt-0.5">{insights.weeklyGoal}</p>
                            </div>
                          </div>
                        )}

                        {/* Insights List */}
                        {insights.insights?.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Key Observations</div>
                            {insights.insights.map((ins, idx) => (
                              <div key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                                ins.type === 'positive' ? 'bg-emerald-50 border-emerald-200' :
                                ins.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                                'bg-[#EDE9FE] border-[#DDD6FE]'
                              }`}>
                                <InsightTypeIcon type={ins.type} />
                                <p className="text-slate-700 leading-relaxed">{ins.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Next Actions */}
                        {insights.nextActions?.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Recommended Next Actions</div>
                            {insights.nextActions.map((action, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                    action.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                                    action.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-slate-200 text-slate-600'
                                  }`}>
                                    {action.priority}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-[11px] font-bold text-slate-600">{action.module}</div>
                                    <div className="text-xs text-slate-700 truncate">{action.action}</div>
                                  </div>
                                </div>
                                {MODULE_CONFIG[action.module?.toLowerCase()] && (
                                  <button
                                    onClick={() => navigate(MODULE_CONFIG[action.module?.toLowerCase()]?.link || '#')}
                                    className="text-[11px] font-bold text-[#7C3AED] hover:underline shrink-0 ml-2 flex items-center gap-1"
                                  >
                                    Go <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Module Skill Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-5">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Skill Domain Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(MODULE_CONFIG).map(([key, cfg]) => {
                    const s = summary[key] || { count: 0, avgScore: 0, bestScore: 0, passRate: 0 };
                    const Icon = cfg.icon;
                    return (
                      <div key={key} className="p-4 bg-[#F8F9FE] rounded-2xl space-y-3 border border-[#EAEBF4]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${cfg.iconClass || 'text-purple-600'}`} />
                            <span className="text-xs font-bold text-slate-700">{cfg.label}</span>
                          </div>
                          <span className={`text-xs font-black ${cfg.textColor || 'text-purple-600'}`}>
                            {s.count > 0 ? `${s.avgScore}%` : '—'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${cfg.barColor || 'bg-purple-500'} rounded-full`} style={{ width: `${s.avgScore||0}%` }} />
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          {s.count > 0 ? (
                            <><div>{s.count} activities · Best: {s.bestScore}%</div><div>Pass rate: {s.passRate}%</div></>
                          ) : (
                            <div className="italic">No activity in this period</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Combined Activity Timeline */}
              <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">
                    Activity Timeline
                    {filteredTimeline.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-slate-500">({filteredTimeline.length})</span>
                    )}
                  </h3>

                  {/* Search + filter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={timelineSearch}
                        onChange={e => setTimelineSearch(e.target.value)}
                        placeholder="Search activities…"
                        className="pl-8 pr-3 py-1.5 border border-[#EAEBF4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#7C3AED] w-40 bg-[#F8F9FE] text-slate-800"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-[#F8F9FE] border border-[#EAEBF4] rounded-xl">
                      <button
                        onClick={() => { setTimelineModuleFilter('all'); setTimelinePage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-xs ${
                          timelineModuleFilter === 'all'
                            ? 'bg-[#7C3AED] text-white shadow-purple-500/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                        }`}
                      >
                        All
                      </button>
                      {Object.entries(MODULE_CONFIG).map(([k, cfg]) => (
                        <button
                          key={k}
                          onClick={() => { setTimelineModuleFilter(k); setTimelinePage(1); }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-xs ${
                            timelineModuleFilter === k
                              ? 'bg-[#7C3AED] text-white shadow-purple-500/20'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {filteredTimeline.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <Target className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-500">
                      {timelineSearch || timelineModuleFilter !== 'all'
                        ? 'No activities match your search or filter.'
                        : 'No activities in this period.'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {period === '24h' ? 'No activity in the last 24 hours. Start practicing!'
                        : period === 'week' ? 'No activities this week.'
                        : 'Try "All Time" to see your complete history.'}
                    </p>
                    {(timelineSearch || timelineModuleFilter !== 'all') && (
                      <button
                        onClick={() => { setTimelineSearch(''); setTimelineModuleFilter('all'); }}
                        className="text-xs font-bold text-[#7C3AED] hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#EAEBF4] text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-3 font-bold">Activity</th>
                            <th className="py-3 px-3 font-bold">Module</th>
                            <th className="py-3 px-3 font-bold">Score</th>
                            <th className="py-3 px-3 font-bold">Status</th>
                            <th className="py-3 px-3 font-bold">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {pagedTimeline.map((item, idx) => {
                            const cfg = MODULE_CONFIG[item.module] || {};
                            const Icon = cfg.icon || CheckCircle2;
                            return (
                              <tr key={idx} className="hover:bg-purple-50/30 transition">
                                <td className="py-3 px-3 font-bold text-slate-800">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Icon className={`w-3.5 h-3.5 ${cfg.iconClass || 'text-slate-500'} shrink-0`} />
                                    <span className="truncate max-w-[200px]">{item.title}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.badgeClass || 'bg-slate-50 text-slate-700'}`}>
                                    {cfg.label || item.module}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <ScoreBadge score={item.score} passed={item.passed} />
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.passed
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                  }`}>
                                    {item.passed ? 'Passed' : 'Attempted'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-slate-500">
                                  {item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      page={timelinePage}
                      total={filteredTimeline.length}
                      pageSize={PAGE_SIZE}
                      onChange={setTimelinePage}
                    />
                  </>
                )}
              </div>

              {/* Per-Module Sections (collapsible with pagination) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Per-Module History</h3>
                {Object.entries(MODULE_CONFIG).map(([key, cfg]) => {
                  const items = byModule[key] || [];
                  const s = summary[key] || { count: 0 };
                  const isOpen = expandedModule === key;
                  const Icon = cfg.icon;
                  const mPage = modulePage[key] || 1;
                  const pagedItems = items.slice((mPage - 1) * PAGE_SIZE, mPage * PAGE_SIZE);

                  return (
                    <div key={key} className="bg-white rounded-3xl border border-[#EAEBF4] shadow-xs overflow-hidden">
                      <button
                        onClick={() => setExpandedModule(isOpen ? null : key)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl ${cfg.iconBgClass || 'bg-purple-100'} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${cfg.iconClass || 'text-purple-600'}`} />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold text-slate-800">{cfg.label}</div>
                            <div className="text-[11px] text-slate-500">
                              {s.count > 0
                                ? `${s.count} activities · Avg ${s.avgScore}% · Pass rate ${s.passRate}%`
                                : 'No activity in this period'
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {s.count > 0 && <span className={`text-sm font-black ${cfg.textColor || 'text-purple-600'} font-outfit`}>{s.avgScore}%</span>}
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 px-6 pb-5 pt-4">
                          {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                              <Icon className="w-8 h-8 text-slate-300" />
                              <p className="text-xs font-semibold text-slate-500">No {cfg.label} activity in this period</p>
                              <button
                                onClick={() => navigate(cfg.link)}
                                className={`mt-1 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-500/20`}
                              >
                                Start Now <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {pagedItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                  <div className="text-xs font-bold text-slate-800 truncate flex-1 min-w-0 mr-3">
                                    {item.title}
                                    {item.meta?.category && <span className="ml-2 text-slate-400 font-normal">· {item.meta.category}</span>}
                                    {item.meta?.round && <span className="ml-2 text-slate-400 font-normal">· Round {item.meta.round}</span>}
                                    {item.meta?.language && <span className="ml-2 text-slate-400 font-normal">· {item.meta.language}</span>}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <ScoreBadge score={item.score} passed={item.passed} />
                                    <span className="text-[11px] text-slate-400">
                                      {item.completedAt ? new Date(item.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              <Pagination
                                page={mPage}
                                total={items.length}
                                pageSize={PAGE_SIZE}
                                onChange={p => setModulePage(prev => ({ ...prev, [key]: p }))}
                              />
                              <div className="pt-3">
                                <button
                                  onClick={() => navigate(cfg.link)}
                                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                                >
                                  Go to {cfg.label} <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
