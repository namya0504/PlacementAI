import React, { useState, useMemo } from 'react';
import {
  Search, CheckCircle2, Clock, Circle, ArrowRight,
  Filter, Trophy, Sparkles, AlertCircle, Code, Eye
} from 'lucide-react';
import { DIFFICULTY_COLORS } from '../constants/dsaTopics';

export default function ProblemListTab({
  problems = [],
  topicTitle = 'Topic',
  onSelectProblem
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sorted Easy -> Medium -> Hard
  const diffRank = { Easy: 1, Medium: 2, Hard: 3 };
  const sortedProblems = useMemo(() => {
    return [...problems].sort((a, b) => (diffRank[a.difficulty] || 2) - (diffRank[b.difficulty] || 2));
  }, [problems]);

  // Find the next unseen problem (or next unsolved if none are completely unseen)
  const nextUnseenProblem = useMemo(() => {
    const unseen = sortedProblems.find(p => !p.userStatus || p.userStatus.state === 'unseen');
    if (unseen) return unseen;
    return sortedProblems.find(p => p.userStatus?.state !== 'solved') || null;
  }, [sortedProblems]);

  const allProblemsSolved = sortedProblems.length > 0 && sortedProblems.every(p => p.userStatus?.state === 'solved');

  // Filtered list
  const filteredProblems = useMemo(() => {
    return sortedProblems.filter(p => {
      // Search
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchesSearch) return false;

      // Difficulty
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) {
        return false;
      }

      // Status
      const state = p.userStatus?.state || 'unseen';
      if (statusFilter === 'Solved' && state !== 'solved') return false;
      if (statusFilter === 'Attempted' && state !== 'attempted') return false;
      if (statusFilter === 'Unsolved' && state === 'solved') return false;

      return true;
    });
  }, [sortedProblems, searchTerm, difficultyFilter, statusFilter]);

  const solvedCount = sortedProblems.filter(p => p.userStatus?.state === 'solved').length;
  const easyCount = sortedProblems.filter(p => p.difficulty === 'Easy').length;
  const medCount = sortedProblems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = sortedProblems.filter(p => p.difficulty === 'Hard').length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner: Progress & Next Problem Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{topicTitle} Problems</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
              {solvedCount} / {sortedProblems.length} Solved
            </span>
          </h2>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {easyCount} Easy
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> {medCount} Medium
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> {hardCount} Hard
            </span>
          </div>
        </div>

        {/* Next Problem or Topic Completed */}
        <div>
          {allProblemsSolved ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold text-xs shadow-sm">
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Topic completed! Outstanding work.</span>
            </div>
          ) : nextUnseenProblem ? (
            <button
              type="button"
              onClick={() => onSelectProblem(nextUnseenProblem.problemId)}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md hover:shadow-purple-500/20"
            >
              <span>Next Problem: {nextUnseenProblem.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>All available problems attempted</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems by title or concept tags..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Difficulty Dropdown / Pills */}
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

          {/* Status Pills */}
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
                  {/* Status Indicator */}
                  <div className="shrink-0">
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isAttempted ? (
                      <Clock className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  {/* Title & Tags */}
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

                {/* Right: Difficulty & Solve Action */}
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
