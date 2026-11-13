import React, { useState } from 'react';
import { FileText, CheckCircle, Info, Sparkles, Play, ExternalLink, Code2, Eye } from 'lucide-react';

/**
 * Formats example inputs cleanly for campus placement students
 * Handles raw stdin strings e.g. "6\n7 1 5 3 6 4" -> "prices = [7, 1, 5, 3, 6, 4]"
 */
function formatExampleInput(ex, problem) {
  if (ex.displayInput) return ex.displayInput;

  const raw = String(ex.input || '').trim();
  const title = (problem?.title || '').toLowerCase();

  // Stock problems
  if (title.includes('stock') || title.includes('buy and sell')) {
    const tokens = raw.split(/\s+/);
    if (tokens.length > 1 && /^\d+$/.test(tokens[0])) {
      return `prices = [${tokens.slice(1).join(', ')}]`;
    }
  }

  // Two Sum
  if (title.includes('two sum')) {
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      const arr = lines[1].split(/\s+/).join(', ');
      const target = lines[2];
      return `nums = [${arr}], target = ${target}`;
    }
    const tokens = raw.split(/\s+/);
    if (tokens.length >= 3 && /^\d+$/.test(tokens[0])) {
      const n = parseInt(tokens[0], 10);
      const arr = tokens.slice(1, n + 1).join(', ');
      const target = tokens[n + 1] || tokens[tokens.length - 1];
      return `nums = [${arr}], target = ${target}`;
    }
  }

  // String / Palindrome problems
  if (title.includes('palindrome') || title.includes('anagram') || title.includes('string')) {
    if (!raw.includes('\n') && !/^\d+\s+\d+/.test(raw)) {
      return `s = "${raw}"`;
    }
  }

  // Container With Most Water
  if (title.includes('container') || title.includes('water')) {
    const tokens = raw.split(/\s+/);
    if (tokens.length > 1 && /^\d+$/.test(tokens[0])) {
      return `height = [${tokens.slice(1).join(', ')}]`;
    }
  }

  // Maximum Subarray / Kadane
  if (title.includes('subarray') || title.includes('kadane')) {
    const tokens = raw.split(/\s+/);
    if (tokens.length > 1 && /^\d+$/.test(tokens[0])) {
      return `nums = [${tokens.slice(1).join(', ')}]`;
    }
  }

  // General array token format: "4\n1 2 3 4" or "4 1 2 3 4"
  const tokens = raw.split(/\s+/);
  if (tokens.length > 1 && /^\d+$/.test(tokens[0])) {
    const n = parseInt(tokens[0], 10);
    if (n === tokens.length - 1) {
      return `nums = [${tokens.slice(1).join(', ')}]`;
    }
    if (n === tokens.length - 2) {
      return `nums = [${tokens.slice(1, n + 1).join(', ')}], target = ${tokens[n + 1]}`;
    }
  }

  return raw;
}

export default function ProblemDescription({ problem }) {
  const [showRawStdin, setShowRawStdin] = useState(false);

  if (!problem) return null;

  const handleOpenVisualizer = () => {
    window.open(`/placement-prep/technical/visualize/${problem.problemId}`, '_blank');
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
      {/* Interactive Step-by-Step Animated Visualizer Banner */}
      <div className="bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-transparent border border-purple-200 dark:border-purple-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
            <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
              <span>Understand Program Step-by-Step</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Interactive Visualizer
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Watch an animated visual dry run, live pointer tracing, state variables, and synchronized code line highlights in a new tab.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenVisualizer}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Understand Step-by-Step 🚀</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Problem Statement */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          Problem Statement
        </h3>
        <p className="whitespace-pre-line text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {problem.statement}
        </p>
      </div>

      {/* Examples */}
      {Array.isArray(problem.examples) && problem.examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Examples
            </h3>
            <button
              type="button"
              onClick={() => setShowRawStdin(!showRawStdin)}
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              <span>{showRawStdin ? 'Show Readable Format' : 'Show Raw Stdin Format'}</span>
            </button>
          </div>

          {problem.examples.map((ex, idx) => {
            const formattedInput = formatExampleInput(ex, problem);

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs font-mono"
              >
                <div className="font-sans font-bold text-slate-900 dark:text-white text-xs mb-1 flex items-center justify-between">
                  <span>Example {idx + 1}:</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {showRawStdin ? 'Compiler stdin' : 'Human-readable parameters'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans font-semibold">Input: </span>
                  <span className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200/70 dark:border-slate-800 font-mono font-semibold">
                    {showRawStdin ? ex.input : formattedInput}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans font-semibold">Output: </span>
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/70 dark:border-emerald-800 font-mono font-bold">
                    {ex.displayOutput || ex.output}
                  </span>
                </div>
                {ex.explanation && (
                  <div className="pt-1 text-slate-600 dark:text-slate-400 font-sans text-xs">
                    <span className="font-semibold text-slate-500">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Constraints */}
      {Array.isArray(problem.constraints) && problem.constraints.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Constraints
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-xs font-mono text-slate-700 dark:text-slate-300">
            {problem.constraints.map((c, idx) => (
              <li key={idx} className="bg-slate-50 dark:bg-slate-900/40 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
