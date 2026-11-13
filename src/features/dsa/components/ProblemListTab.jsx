import React, { useState, useMemo } from 'react';
import {
  Search, CheckCircle2, Clock, Circle, ArrowRight,
  Filter, Trophy, Sparkles, AlertCircle, Code, Eye,
  Star, Award, Check, FileText, Lock
} from 'lucide-react';
import { DIFFICULTY_COLORS } from '../constants/dsaTopics';

export default function ProblemListTab({
  problems = [],
  topicTitle = 'Topic',
  onSelectProblem,
  badgeInfo = null,
  onStartTest,
  onViewTestReport
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sorted Easy -> Medium -> Hard
  const diffRank = { Easy: 1, Medium: 2, Hard: 3 };
  const sortedProblems = useMemo(() => {
    return [...problems].sort((a, b) => (diffRank[a.difficulty] || 2) - (diffRank[b.difficulty] || 2));
  }, [problems]);

  // Find the next unseen problem
  const nextUnseenProblem = useMemo(() => {
    const unseen = sortedProblems.find(p => !p.userStatus || p.userStatus.state === 'unseen');
    if (unseen) return unseen;
    return sortedProblems.find(p => p.userStatus?.state !== 'solved') || null;
  }, [sortedProblems]);

  const solvedCount = sortedProblems.filter(p => p.userStatus?.state === 'solved').length;
  const totalProblemsCount = sortedProblems.length;
  const allProblemsSolved = totalProblemsCount >= 20 && solvedCount >= totalProblemsCount;
  const hasStar = Boolean(badgeInfo?.hasStarBadge);
  const canStartTest = allProblemsSolved || hasStar;

  // Filtered list
  const filteredProblems = useMemo(() => {
    return sortedProblems.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchesSearch) return false;

      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) {
        return false;
      }

      const state = p.userStatus?.state || 'unseen';
      if (statusFilter === 'Solved' && state !== 'solved') return false;
      if (statusFilter === 'Attempted' && state !== 'attempted') return false;
      if (statusFilter === 'Unsolved' && state === 'solved') return false;

      return true;
    });
  }, [sortedProblems, searchTerm, difficultyFilter, statusFilter]);

  const easyProblems = sortedProblems.filter(p => p.difficulty === 'Easy');
  const medProblems = sortedProblems.filter(p => p.difficulty === 'Medium');
  const hardProblems = sortedProblems.filter(p => p.difficulty === 'Hard');

  const easySolved = easyProblems.filter(p => p.userStatus?.state === 'solved').length;
  const medSolved = medProblems.filter(p => p.userStatus?.state === 'solved').length;
  const hardSolved = hardProblems.filter(p => p.userStatus?.state === 'solved').length;

  const totalProgressPercent = sortedProblems.length > 0
    ? Math.round((solvedCount / sortedProblems.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner: Progress Bar & Next Problem Action */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {topicTitle} Practice Problems
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                {solvedCount} of {sortedProblems.length} Solved ({totalProgressPercent}%)
              </span>
              {hasStar && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Topic Mastered
                </span>
              )}
            </div>

            {/* Level breakdown */}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Easy: {easySolved} / {easyProblems.length}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium: {medSolved} / {medProblems.length}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Hard: {hardSolved} / {hardProblems.length}
              </span>
            </div>
          </div>

          {/* Next Problem / All Solved Button */}
          <div>
            {allProblemsSolved ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold text-xs shadow-sm">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>All {sortedProblems.length} practice problems completed!</span>
              </div>
            ) : nextUnseenProblem ? (
              <button
                type="button"
                onClick={() => onSelectProblem(nextUnseenProblem.problemId)}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md hover:shadow-purple-500/20"
              >
                <span>Next: {nextUnseenProblem.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>All questions attempted</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${totalProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Topic Assessment / Final Test Banner */}
      {!canStartTest ? (
        /* Locked State: Unlocks only when all 20 problems are solved */
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shadow-inner shrink-0">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {topicTitle} Final Assessment
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Locked • Complete 20/20 to Unlock
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Solve all 20 practice questions ({solvedCount}/20 solved) to unlock this 3-problem timed campus assessment. {Math.max(0, 20 - solvedCount)} problems remaining.
              </p>

              {/* Unlock Progress Bar */}
              <div className="mt-2.5 flex items-center gap-3 max-w-xs">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (solvedCount / 20) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                  {solvedCount} / 20
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              title="Solve all 20 practice questions to unlock the final assessment"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed select-none shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Locked ({solvedCount}/20 Solved)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked State: Available when 20/20 solved or star badge earned */
        <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-md ${
          hasStar
            ? 'bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border-amber-300 dark:border-amber-700/60'
            : 'bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-transparent border-purple-300 dark:border-purple-700'
        }`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${
              hasStar ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/30' : 'bg-purple-600 shadow-purple-600/30'
            }`}>
              {hasStar ? <Star className="w-6 h-6 fill-white" /> : <Sparkles className="w-6 h-6 text-white" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {hasStar ? `⭐ ${topicTitle} Mastered` : `🎉 ${topicTitle} Assessment Unlocked!`}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  3 Problems • Dynamic Timer
                </span>
                {hasStar && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Best Score: {badgeInfo?.bestScore || 85}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
                {hasStar
                  ? `You earned the Mastery Star with a best score of ${badgeInfo?.bestScore || 85}%. You can retake the test anytime under timed exam conditions.`
                  : `Awesome work! You have solved all 20 practice questions in ${topicTitle}. Now test your skills under timed exam conditions. Score 80% or higher to earn the ⭐ ${topicTitle} Mastery Star!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasStar && onViewTestReport && (
              <button
                type="button"
                onClick={onViewTestReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Report</span>
              </button>
            )}

            {onStartTest && (
              <button
                type="button"
                onClick={onStartTest}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>{hasStar ? 'Retake Test' : 'Start Topic Test'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 20 topic problems by title or tags..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  difficultyFilter === diff
                    ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            {['All', 'Unsolved', 'Solved', 'Attempted'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  statusFilter === st
                    ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/70 shadow-sm overflow-hidden">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No problems match your search criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          filteredProblems.map((problem, idx) => {
            const status = problem.userStatus || {};
            const isSolved = status.state === 'solved';
            const isAttempted = status.state === 'attempted';
            const diffStyle = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium;

            return (
              <div
                key={problem.problemId}
                onClick={() => onSelectProblem(problem.problemId)}
                className="group p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-purple-50/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="shrink-0">
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isAttempted ? (
                      <Clock className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {problem.title}
                      </span>
                      {status.solutionViewed && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Eye className="w-2.5 h-2.5" /> Solution Viewed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {Array.isArray(problem.tags) && problem.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {status.attemptCount > 0 && (
                        <span className="text-[11px] text-slate-400">
                          {status.attemptCount} {status.attemptCount === 1 ? 'attempt' : 'attempts'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                    {problem.difficulty}
                  </span>

                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                  >
                    <span>{isSolved ? 'Solve Again' : 'Solve'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
