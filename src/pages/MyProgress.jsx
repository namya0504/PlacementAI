import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Calendar, Zap, CheckCircle2, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';

export default function MyProgress() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    testsCompleted: 0,
    mockInterviews: 0,
    overallReadiness: 0,
    aptitudeScore: 0,
    technicalScore: 0,
    hrScore: 0,
    atsScore: 0,
    streakDays: 1
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    API.getDashboardStats()
      .then(res => {
        if (res?.stats) {
          setStats(res.stats);
        }
        if (Array.isArray(res?.recentActivities)) {
          setActivities(res.recentActivities);
        }
      })
      .catch(err => console.warn('Progress stats fetch notice:', err.message));
  }, []);

  const totalAttempts = (stats.testsCompleted || 0) + (stats.mockInterviews || 0);
  const avgScore = stats.overallReadiness || 0;
  const bestScore = Math.max(
    stats.aptitudeScore || 0,
    stats.technicalScore || 0,
    stats.hrScore || 0,
    stats.atsScore || 0
  );
  const streak = stats.streakDays || 1;

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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">My Progress</h1>
              <p className="text-xs text-slate-500">Track your performance history and daily preparation streak</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Total Attempts</div>
              <div className="text-3xl font-extrabold text-slate-900 font-outfit">{totalAttempts}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Placement Readiness</div>
              <div className="text-3xl font-extrabold text-blue-600 font-outfit">{avgScore}%</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Best Domain Score</div>
              <div className="text-3xl font-extrabold text-emerald-600 font-outfit">{bestScore}%</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Study Streak</div>
              <div className="text-3xl font-extrabold text-purple-600 font-outfit">{streak} Day{streak > 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* Module Breakdown Grid */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Skill Domain Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Aptitude</span>
                  <span className="text-blue-600">{stats.aptitudeScore || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats.aptitudeScore || 0}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Technical</span>
                  <span className="text-purple-600">{stats.technicalScore || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${stats.technicalScore || 0}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">HR Interview</span>
                  <span className="text-emerald-600">{stats.hrScore || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${stats.hrScore || 0}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">ATS Resume</span>
                  <span className="text-amber-600">{stats.atsScore || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: `${stats.atsScore || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Test History Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Recent Verified Activities</h3>
            <div className="overflow-x-auto">
              {activities.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Activity / Test</th>
                      <th className="py-3 px-4 font-bold">Result</th>
                      <th className="py-3 px-4 font-bold">Date</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {activities.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-bold text-slate-800">{item.title}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{item.score}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {item.time ? new Date(item.time).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No verified test activities recorded yet. Complete an aptitude test or mock interview to populate your activity log.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
