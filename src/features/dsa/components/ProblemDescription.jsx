import React, { useState } from 'react';
import { FileText, CheckCircle, Info, Sparkles, Play, ExternalLink, Code2, Eye, Terminal } from 'lucide-react';

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

/**
 * Formats raw standard input into clean multi-line compiler format
 */
function formatRawStdin(inputStr, problem) {
  const raw = String(inputStr || '').trim();
  const title = (problem?.title || '').toLowerCase();

  // If already contains newlines, preserve them
  if (raw.includes('\n')) {
    return raw;
  }

  const tokens = raw.split(/\s+/);

  // Two sum: "4 2 7 11 15 9" -> "4\n2 7 11 15\n9"
  if (title.includes('two sum') && tokens.length >= 3) {
    const n = parseInt(tokens[0], 10);
    if (!isNaN(n) && tokens.length >= n + 2) {
      const arr = tokens.slice(1, n + 1).join(' ');
      const target = tokens.slice(n + 1).join(' ');
      return `${n}\n${arr}\n${target}`;
    }
  }

  // Single array with length N at start: "6 7 1 5 3 6 4" -> "6\n7 1 5 3 6 4"
  if (tokens.length > 1 && /^\d+$/.test(tokens[0])) {
    const n = parseInt(tokens[0], 10);
    if (n === tokens.length - 1) {
      return `${n}\n${tokens.slice(1).join(' ')}`;
    }
  }

  return raw;
}

export default function ProblemDescription({
  problem,
  isAssessment = false,
  theme = 'auto'
}) {
  const [showRawStdin, setShowRawStdin] = useState(false);

  if (!problem) return null;

  const isDarkTheme = theme === 'dark';

  const handleOpenVisualizer = () => {
    window.open(`/placement-prep/technical/visualize/${problem.problemId}`, '_blank');
  };

  return (
    <div className={`space-y-6 text-sm leading-relaxed ${
      isDarkTheme ? 'text-slate-100' : 'text-slate-800 dark:text-slate-100'
    }`}>
      {/* Interactive Step-by-Step Animated Visualizer Banner (Hidden in Assessment Exam Mode) */}
      {!isAssessment && (
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
      )}

      {/* Problem Statement (High Contrast, Crisp Typography) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>Problem Statement</span>
        </h3>
        <div className={`whitespace-pre-line text-sm leading-relaxed font-normal ${
          isDarkTheme ? 'text-slate-100' : 'text-slate-800 dark:text-slate-100'
        }`}>
          {problem.statement}
        </div>
      </div>

      {/* Examples */}
      {Array.isArray(problem.examples) && problem.examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>Examples</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRawStdin(!showRawStdin)}
              className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showRawStdin ? 'Show Human-Readable Format' : 'Show Multi-line Compiler Stdin'}</span>
            </button>
          </div>

          {problem.examples.map((ex, idx) => {
            const formattedInput = formatExampleInput(ex, problem);
            const rawStdinFormatted = formatRawStdin(ex.input, problem);

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-3 text-xs font-mono transition-all ${
                  isDarkTheme
                    ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
                }`}
              >
                <div className="font-sans font-bold text-xs flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <span className={isDarkTheme ? 'text-white' : 'text-slate-900 dark:text-white'}>
                    Example {idx + 1}:
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800">
                    {showRawStdin ? 'Compiler Stdin (Multi-line)' : 'Human-readable parameters'}
                  </span>
                </div>

                {/* Input block */}
                <div>
                  <div className="text-slate-400 font-sans font-semibold mb-1 text-[11px]">
                    {showRawStdin ? 'Compiler Stdin Input:' : 'Input:'}
                  </div>
                  {showRawStdin ? (
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {rawStdinFormatted}
                    </pre>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs font-semibold">
                      {formattedInput}
                    </div>
                  )}
                </div>

                {/* Output block */}
                <div>
                  <div className="text-slate-400 font-sans font-semibold mb-1 text-[11px]">
                    Output:
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-emerald-400 font-mono text-xs font-bold inline-block min-w-[60px]">
                    {ex.displayOutput || ex.output}
                  </div>
                </div>

                {/* Explanation block */}
                {ex.explanation && (
                  <div className="pt-2 text-xs font-sans leading-relaxed border-t border-slate-200 dark:border-slate-800/80 text-slate-300">
                    <span className="font-bold text-purple-400">Explanation: </span>
                    <span>{ex.explanation}</span>
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            Constraints
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-xs font-mono">
            {problem.constraints.map((c, idx) => (
              <li
                key={idx}
                className={`px-3 py-1.5 rounded-xl border ${
                  isDarkTheme
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
