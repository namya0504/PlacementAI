import React, { useState } from 'react';
import {
  Eye, EyeOff, AlertTriangle, Check, Copy, Code2, Clock,
  Cpu, Zap, Lightbulb, ShieldAlert, Footprints
} from 'lucide-react';
import { API } from '../../../services/api';
import { SUPPORTED_LANGUAGES } from '../constants/dsaTopics';

export default function ProblemApproaches({
  problem,
  userStatus,
  onSolutionViewed
}) {
  const approaches = problem?.approaches || [];
  const [selectedApproachIdx, setSelectedApproachIdx] = useState(
    // Default to Optimal if available or 0
    approaches.length > 2 ? 2 : 0
  );
  const [selectedLang, setSelectedLang] = useState('python');
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [unlockedLocally, setUnlockedLocally] = useState(false);

  const isAlreadyViewed = Boolean(userStatus?.solutionViewed || unlockedLocally);
  const hasFirstAttempt = Boolean(userStatus && userStatus.attemptCount > 0);

  // If user hasn't attempted yet and hasn't unlocked solution, gate behind confirmation
  const isGated = !hasFirstAttempt && !isAlreadyViewed;

  const handleConfirmUnlock = async () => {
    try {
      setShowConfirmModal(false);
      setUnlockedLocally(true);
      if (problem?.problemId) {
        await API.markDsaSolutionViewed(problem.problemId);
        if (onSolutionViewed) onSolutionViewed();
      }
    } catch (e) {
      console.warn('Failed to mark solution viewed:', e);
    }
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  if (isGated) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm my-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Unlock Editorial Approaches?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Campus placement scoring evaluates your independent problem-solving skills on your <strong>first submission</strong>.
          </p>
          <div className="p-3 my-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 text-left">
            Opening approaches now will permanently flag this problem as <strong>"Solution viewed, not scored"</strong>. You can still code, test, and practice freely!
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleConfirmUnlock}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            I Understand, Show Approaches
          </button>
        </div>
      </div>
    );
  }

  const currentApproach = approaches[selectedApproachIdx] || approaches[0] || {};
  const approachCodeMap = currentApproach.code || {};
  const currentCode = approachCodeMap[selectedLang] || '// Code snippet coming soon';

  return (
    <div className="space-y-6">
      {/* Solution Viewed Warning Notice */}
      {userStatus?.solutionViewed && !hasFirstAttempt && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <Eye className="w-4 h-4 shrink-0" />
          <span>Solution viewed: Any submissions for this problem will be labeled <strong>Practice attempt, not scored</strong>.</span>
        </div>
      )}

      {/* Approach Selector Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        {approaches.map((app, idx) => {
          const isSelected = selectedApproachIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedApproachIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {app.name || `Approach ${idx + 1}`}
            </button>
          );
        })}
      </div>

      {/* Active Approach Card */}
      <div className="space-y-5">
        {/* Idea */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Core Idea in Simple Words
          </h4>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {currentApproach.idea || 'Iterate through all potential configurations to identify the optimal outcome.'}
          </p>
        </div>

        {/* Dry Run */}
        {currentApproach.dryRun && (
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-purple-600" />
              Dry Run on Example
            </h4>
            <div className="font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {currentApproach.dryRun}
            </div>
          </div>
        )}

        {/* Complexity & When to Use */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800">
            <div className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase">
              Time Complexity
            </div>
            <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white mt-1">
              {currentApproach.timeComplexity || 'O(N)'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800">
            <div className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">
              Space Complexity
            </div>
            <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white mt-1">
              {currentApproach.spaceComplexity || 'O(1)'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800">
            <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
              When to Use
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">
              {currentApproach.whenToUse || 'Optimal for campus placement interviews.'}
            </div>
          </div>
        </div>

        {/* Code Snippet in 4 Languages */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-slate-200">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLang(lang.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedLang === lang.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentCode)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-96">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Common Mistakes */}
        {(currentApproach.commonMistakes || problem.commonMistakes) && (
          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-300">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              Common Pitfalls for This Approach
            </div>
            <p className="leading-relaxed">
              {currentApproach.commonMistakes || problem.commonMistakes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
