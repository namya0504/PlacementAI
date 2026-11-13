import React, { useState } from 'react';
import { Lightbulb, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProblemHints({ hints = [] }) {
  // Array of boolean states for each hint
  const [unlocked, setUnlocked] = useState({ 0: false, 1: false, 2: false });

  if (!Array.isArray(hints) || hints.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No hints available for this problem. Try analyzing the constraints!
      </div>
    );
  }

  const handleToggle = (idx) => {
    // Progressive reveal: can only unlock hint if previous is unlocked
    if (idx > 0 && !unlocked[idx - 1]) return;
    setUnlocked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-850/30 rounded-xl text-xs text-purple-800 dark:text-purple-300">
        <span className="font-semibold">Progressive Hints:</span> Try solving on your own first! You can reveal hints step-by-step from general intuition to optimal direction.
      </div>

      {hints.map((hintText, idx) => {
        const isPreviousUnlocked = idx === 0 || unlocked[idx - 1];
        const isOpen = unlocked[idx];
        const isLocked = !isPreviousUnlocked;

        return (
          <div
            key={idx}
            className={`border rounded-xl overflow-hidden transition-all ${
              isOpen
                ? 'bg-white dark:bg-slate-900 border-purple-350 dark:border-purple-700 shadow-sm'
                : isLocked
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-250 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300'
            }`}
          >
            <button
              type="button"
              disabled={isLocked}
              onClick={() => handleToggle(idx)}
              className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isOpen
                    ? 'bg-purple-600 text-white'
                    : isLocked
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Hint {idx + 1} {idx === 0 ? '(Intuition)' : idx === 1 ? '(Data Structure)' : '(Optimal Trick)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isOpen ? 'Click to collapse' : isLocked ? 'Unlock Hint ' + idx + ' first' : 'Click to reveal hint'}
                  </div>
                </div>
              </div>

              <div className="text-slate-400">
                {isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4 text-purple-500" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {hintText}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
