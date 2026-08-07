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
  Menu
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    stats: currentUser?.stats || {
      resumeScore: 85,
      atsScore: 84,
      aptitudeScore: 72,
      technicalScore: 80,
      hrScore: 82,
      overallReadiness: 78
    },
    recentActivities: []
  });

  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete Aptitude Stage 3', done: false },
    { id: 2, text: 'Attempt Technical Stage 2', done: true },
    { id: 3, text: 'Complete HR Round 3', done: false }
  ]);

  useEffect(() => {
    API.getDashboardStats()
      .then(res => {
        if (res && res.stats) {
          setDashboardData(res);
        }
      })
      .catch(err => console.warn('Dashboard stats notice:', err.message));
  }, []);

  const stats = dashboardData.stats || {};
  const recentActivities = dashboardData.recentActivities?.length > 0 ? dashboardData.recentActivities : [
    { title: 'Aptitude Intermediate Test Completed', score: '85%', time: '2h ago' },
    { title: 'Technical Code Submission Accepted', score: '100%', time: '1d ago' },
    { title: 'HR Interview Evaluation Completed', score: '82%', time: '3d ago' }
  ];

  const toggleGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const overallReadiness = stats.overallReadiness || 78;
  const strokeOffset = Math.round(163 - (163 * overallReadiness) / 100);

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
                Hello, {currentUser?.name || 'Namya'} <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Let's continue your preparation today!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search modules, templates..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
              />
            </div>
            <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Top Score Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Resume Score */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                <span>Resume Score</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold">
                  {stats.resumeScore >= 80 ? 'Good' : 'Needs Work'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-outfit">{stats.resumeScore || 85}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <Link to="/resume-builder" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                View Details <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* ATS Score */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                <span>ATS Score</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold">
                  {stats.atsScore >= 80 ? 'Good' : 'Needs Work'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-outfit">{stats.atsScore || 84}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <Link to="/ats-checker" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline">
                View Details <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Aptitude Score */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                <span>Aptitude Score</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-bold">
                  {stats.aptitudeScore >= 75 ? 'Good' : 'Average'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-outfit">{stats.aptitudeScore || 72}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <Link to="/placement-prep/aptitude" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
                View Details <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Overall Readiness Gauge */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold mb-1">Overall Readiness</div>
                <div className="text-3xl font-extrabold text-slate-900 font-outfit">{overallReadiness}%</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Keep practicing!</div>
              </div>
              {/* Circular SVG Meter */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#22C55E"
                    strokeWidth="6"
                    strokeDasharray="163"
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-slate-800">{overallReadiness}%</span>
              </div>
            </div>
          </div>

          {/* Your Progress Stage Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Brain className="w-4 h-4 text-blue-600" /> Aptitude
                  </div>
                  <span className="text-xs font-bold text-blue-600">{stats.aptitudeScore || 72}%</span>
                </div>
                <div className="text-xs text-slate-500">Stage 2 of 4</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats.aptitudeScore || 72}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Code2 className="w-4 h-4 text-purple-600" /> Technical
                  </div>
                  <span className="text-xs font-bold text-purple-600">{stats.technicalScore || 80}%</span>
                </div>
                <div className="text-xs text-slate-500">Stage 2 of 4</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${stats.technicalScore || 80}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Mic className="w-4 h-4 text-emerald-600" /> HR Interview
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{stats.hrScore || 82}%</span>
                </div>
                <div className="text-xs text-slate-500">Round 2 of 4</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${stats.hrScore || 82}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Building2 className="w-4 h-4 text-amber-600" /> Company Prep
                  </div>
                  <span className="text-xs font-bold text-amber-600">80%</span>
                </div>
                <div className="text-xs text-slate-500">TCS & Infosys</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full w-4/5"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Grid: Recent Activity & Upcoming Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Recent Activity Feed */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Recent Activity</h3>
              <div className="space-y-3">
                
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{act.title}</div>
                        <div className="text-[11px] text-slate-500">Score/Result: {act.score}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">Recent</span>
                  </div>
                ))}

              </div>
            </div>

            {/* Upcoming Goals Checklist */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Upcoming Goals</h3>
              <div className="space-y-3">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-3 transition"
                  >
                    <button className="text-blue-600 focus:outline-none">
                      {g.done ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </button>
                    <span className={`text-xs font-medium ${g.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {g.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

