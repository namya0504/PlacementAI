import React from 'react';
import { FileText, CheckCircle, Info } from 'lucide-react';

export default function ProblemDescription({ problem }) {
  if (!problem) return null;

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Examples
          </h3>
          {problem.examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs font-mono"
            >
              <div className="font-sans font-bold text-slate-900 dark:text-white text-xs mb-1">
                Example {idx + 1}:
              </div>
              <div>
                <span className="text-slate-500 font-sans font-semibold">Input: </span>
                <span className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200/70 dark:border-slate-800">
                  {ex.input}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-sans font-semibold">Output: </span>
                <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/70 dark:border-emerald-800">
                  {ex.output}
                </span>
              </div>
              {ex.explanation && (
                <div className="pt-1 text-slate-600 dark:text-slate-400 font-sans text-xs">
                  <span className="font-semibold text-slate-500">Explanation: </span>
                  {ex.explanation}
                </div>
              )}
            </div>
          ))}
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
