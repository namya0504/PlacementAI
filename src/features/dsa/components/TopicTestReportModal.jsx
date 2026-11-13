import React, { useEffect } from 'react';
import {
  Trophy, CheckCircle2, XCircle, Award, Clock,
  Cpu, Zap, AlertTriangle, ArrowRight, X, RotateCcw,
  Sparkles, Star, ChevronDown, Check, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TopicTestReportModal({
  report,
  onClose,
  onRetakeTest
}) {
  if (!report) return null;

  const {
    topicTitle = 'Topic',
    overallScore = 0,
    hasPassed = false,
    hasStarBadge = false,
    durationSpentSeconds = 0,
    evaluationBreakdown = [],
    overallRecommendations
  } = report;

  // Trigger celebratory confetti if passed >= 80%
  useEffect(() => {
    if (hasPassed) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  }, [hasPassed]);

  const minutesSpent = Math.floor(durationSpentSeconds / 60);
  const secondsSpent = durationSpentSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between ${
          hasPassed
            ? 'bg-gradient-to-r from-emerald-50 via-purple-50 to-white dark:from-emerald-950/40 dark:via-purple-950/30 dark:to-slate-900'
            : 'bg-slate-50 dark:bg-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              hasPassed ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/20' : 'bg-slate-700'
            }`}>
              {hasPassed ? <Star className="w-6 h-6 fill-white" /> : <Award className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {topicTitle} Assessment Report
                </h2>
                {hasPassed && (
                  <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Mastery Star Earned
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluation across 20 test cases per question, code approach, and algorithmic complexity.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Score Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Overall Score */}
            <div className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-center ${
              hasPassed
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            }`}>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Final Score
              </div>
              <div className={`text-4xl font-black ${hasPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {overallScore}%
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">
                {hasPassed ? 'Passed (>= 80% threshold)' : 'Requires >= 80% for Star'}
              </div>
            </div>

            {/* Time Taken */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center flex flex-col items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Time Spent
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {minutesSpent}m {secondsSpent}s
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dynamic Countdown Timer
              </div>
            </div>

            {/* Star Badge Card */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center flex flex-col items-center justify-center">
              <Star className={`w-6 h-6 mb-1 ${hasStarBadge ? 'fill-amber-400 text-amber-500 animate-bounce' : 'text-slate-300 dark:text-slate-600'}`} />
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Topic Star Badge
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {hasStarBadge ? '⭐ Star Awarded' : 'Not Yet Earned'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {hasStarBadge ? 'Shown on profile & topic list' : 'Retake test to earn'}
              </div>
            </div>
          </div>

          {/* AI Feedback & Placement Readiness Advice */}
          {overallRecommendations && (
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/50 text-xs leading-relaxed text-purple-900 dark:text-purple-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-purple-900 dark:text-purple-200 mb-1">
                  Placement Preparation Feedback
                </div>
                <p>{overallRecommendations}</p>
              </div>
            </div>
          )}

          {/* Question Breakdown List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Per-Problem Evaluation Breakdown (20 Test Cases Each)
            </h3>

            {evaluationBreakdown.map((item, idx) => {
              const isAccepted = item.verdict === 'Accepted';

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        isAccepted
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200'
                      }`}>
                        {item.verdict}
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {item.totalScore} / 100 pts
                      </span>
                    </div>
                  </div>

                  {/* Rubric metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Test Cases Passed</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {item.testsPassed} / {item.totalTests} passed ({item.testCasesScore} / 60 pts)
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Approach Detected</div>
                      <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mt-0.5 truncate" title={item.detectedApproach}>
                        {item.detectedApproach} ({item.approachScore} / 25 pts)
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Code Cleanliness</div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {item.qualityScore} / 15 pts
                      </div>
                    </div>
                  </div>

                  {/* Detailed approach feedback */}
                  {item.feedback && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-950/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 font-sans">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Analysis: </span>
                      {item.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRetakeTest}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
