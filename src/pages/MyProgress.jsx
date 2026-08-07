import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, Zap, CheckCircle2, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function MyProgress() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const testHistory = [
    { name: 'Aptitude Intermediate', date: '6 Aug 2026', score: '78%', status: 'Passed', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Python Basics Quiz', date: '5 Aug 2026', score: '85%', status: 'Passed', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'HR Round 1', date: '3 Aug 2026', score: '82%', status: 'Passed', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'SQL Advanced', date: '1 Aug 2026', score: '70%', status: 'Average', color: 'bg-amber-50 text-amber-600' }
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">My Progress</h1>
              <p className="text-xs text-slate-500">Track your performance history and daily preparation streak</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Summary Cards Grid (Screen 13 in Collage) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Total Attempts</div>
              <div className="text-3xl font-extrabold text-slate-900 font-outfit">24</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Average Score</div>
              <div className="text-3xl font-extrabold text-blue-600 font-outfit">76%</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Best Score</div>
              <div className="text-3xl font-extrabold text-emerald-600 font-outfit">92%</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Study Streak</div>
              <div className="text-3xl font-extrabold text-purple-600 font-outfit">7 Days</div>
            </div>
          </div>

          {/* Progress Timeline SVG Graph (Matches Screen 13 Graph) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Progress Overview</h3>
            <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-4 bg-slate-50 rounded-xl border border-slate-100 relative">
              <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q25,40 50,30 T100,10" fill="none" stroke="#2563EB" strokeWidth="3" />
                <path d="M0,90 Q25,60 50,45 T100,25" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="4" />
              </svg>
              <div className="text-[10px] font-bold text-slate-400 self-end z-10">1 May</div>
              <div className="text-[10px] font-bold text-slate-400 self-end z-10">7 May</div>
              <div className="text-[10px] font-bold text-slate-400 self-end z-10">15 May</div>
              <div className="text-[10px] font-bold text-slate-400 self-end z-10">22 May</div>
              <div className="text-[10px] font-bold text-slate-400 self-end z-10">30 May</div>
            </div>
          </div>

          {/* Recent Test History Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Recent Tests</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Test Name</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Score</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {testHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 text-slate-500">{item.date}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{item.score}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.color}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
