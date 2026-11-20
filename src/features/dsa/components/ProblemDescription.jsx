import React, { useState } from 'react';
import { FileText, CheckCircle, Info, Sparkles, Play, ExternalLink, Code2, Eye, Terminal } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

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
  theme = 'light'
}) {
  const [showRawStdin, setShowRawStdin] = useState(false);

  if (!problem) return null;

  const isDark = theme === 'dark';

  return (
    <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      {/* Problem Statement */}
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
          isDark ? 'text-purple-400' : 'text-purple-600'
        }`}>
          <FileText className="w-3.5 h-3.5" />
          <span>Problem Statement</span>
        </h3>
        <div className={`text-sm leading-relaxed font-normal ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <MarkdownRenderer content={problem.statement} theme={theme} />
        </div>
      </div>

      {/* Examples */}
      {Array.isArray(problem.examples) && problem.examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              <Terminal className="w-3.5 h-3.5" />
              <span>Examples</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRawStdin(!showRawStdin)}
              className={`text-[11px] font-semibold hover:underline flex items-center gap-1 transition ${
                isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              }`}
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
                className={`p-4 rounded-xl border space-y-2 text-xs font-mono transition-all ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`font-sans font-bold text-xs mb-1 flex items-center justify-between ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>Example {idx + 1}:</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {showRawStdin ? 'Compiler stdin (multi-line)' : 'Human-readable parameters'}
                  </span>
                </div>

                {/* Input block */}
                <div>
                  <span className={`font-sans font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Input: </span>
                  {showRawStdin ? (
                    <pre className={`mt-1 p-2.5 rounded-lg border font-mono text-xs whitespace-pre-wrap leading-relaxed ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-purple-300'
                        : 'bg-white border-slate-200/90 text-slate-800'
                    }`}>
                      {rawStdinFormatted}
                    </pre>
                  ) : (
                    <span className={`px-2 py-0.5 rounded border font-mono font-semibold ${
                      isDark
                        ? 'bg-slate-950 text-slate-200 border-slate-800'
                        : 'bg-white text-slate-900 border-slate-200/90'
                    }`}>
                      {formattedInput}
                    </span>
                  )}
                </div>

                {/* Output block */}
                <div>
                  <span className={`font-sans font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Output: </span>
                  <span className={`px-2 py-0.5 rounded border font-mono font-bold ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}>
                    {ex.displayOutput || ex.output}
                  </span>
                </div>

                {/* Explanation block */}
                {ex.explanation && (
                  <div className={`pt-1 font-sans text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Explanation: </span>
                    <MarkdownRenderer content={ex.explanation} inline theme={theme} />
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
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
            isDark ? 'text-purple-400' : 'text-slate-500'
          }`}>
            Constraints
          </h3>
          <ul className={`space-y-1.5 list-disc list-inside text-xs font-mono ${
            isDark ? 'text-slate-200' : 'text-slate-700'
          }`}>
            {problem.constraints.map((c, idx) => (
              <li
                key={idx}
                className={`px-2.5 py-1 rounded-lg border ${
                  isDark
                    ? 'bg-slate-900/40 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200/60 text-slate-700'
                }`}
              >
                <MarkdownRenderer content={c} inline theme={theme} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
