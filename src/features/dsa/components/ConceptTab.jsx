import React, { useState } from 'react';
import {
  BookOpen, Lightbulb, Footprints, AlertTriangle, Clock,
  Cpu, Code2, Copy, Check, ArrowRight, Zap, Target
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants/dsaTopics';

export default function ConceptTab({ topic }) {
  const [activeLang, setActiveLang] = useState('python');
  const [copied, setCopied] = useState(false);

  if (!topic) {
    return (
      <div className="p-8 text-center text-slate-400">
        Select a topic to explore its foundational concepts.
      </div>
    );
  }

  const overview = topic.overview || {};
  const codeExamples = topic.codeExamples || {};
  const currentCode = codeExamples[activeLang] || '// Code example coming soon';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {topic.title} Concept & Core Patterns
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fundamental principles, interview patterns, dry run, and operation snippets
            </p>
          </div>
        </div>

        {/* What it is */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
          <p>{overview.whatItIs || topic.conceptMarkdown || 'Mastering this topic is essential for campus coding assessments.'}</p>
        </div>

        {/* 2-Column: When to Use & Common Recognition Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/50">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-semibold text-sm mb-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              When to Use
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {overview.whenToUse || 'Used for sequential lookups, contiguous subarrays, and fixed-sized window operations.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold text-sm mb-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Patterns to Recognise
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {overview.recognitionPatterns || 'Look for keywords like "contiguous", "pair sum", "find subarray with target", or "in-place rearrangement".'}
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Dry Run */}
      {overview.stepByStepDryRun && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-sm mb-3">
            <Footprints className="w-4 h-4 text-purple-600" />
            Step-by-Step Dry Run Example
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {overview.stepByStepDryRun}
          </div>
        </div>
      )}

      {/* Common Mistakes & Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm mb-2">
            <AlertTriangle className="w-4 h-4" />
            Common Pitfalls & Mistakes
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {overview.commonMistakes || 'Off-by-one errors when updating bounds; failing to handle 0 or 1 element edge cases.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-2">
            <Clock className="w-4 h-4" />
            Time & Space Complexity
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {overview.timeAndSpaceComplexity || 'Average Time: O(N) or O(N log N). Space: O(1) in-place or O(N) auxiliary.'}
          </p>
        </div>
      </div>

      {/* Code Examples in 4 Languages */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Code2 className="w-4 h-4 text-purple-600" />
            Core Operation Snippets
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setActiveLang(lang.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeLang === lang.id
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs text-slate-400 font-mono">
            <span>{topic.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_operations.{activeLang === 'python' ? 'py' : activeLang === 'javascript' ? 'js' : activeLang}</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-96">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
