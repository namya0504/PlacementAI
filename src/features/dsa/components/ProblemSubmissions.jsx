import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle2, XCircle, Code2, Copy, Check,
  RotateCcw, AlertCircle
} from 'lucide-react';
import { API } from '../../../services/api';
import { VERDICT_CONFIG } from '../constants/dsaTopics';

export default function ProblemSubmissions({
  problemId,
  onLoadCodeIntoEditor,
  refreshTrigger
}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await API.getDsaSubmissions(`problemId=${problemId}`);
        if (isMounted) {
          setSubmissions(res?.submissions || []);
        }
      } catch (err) {
        console.warn('Failed to load problem submissions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (problemId) load();
    return () => { isMounted = false; };
  }, [problemId, refreshTrigger]);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading submission history...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">No submissions yet for this problem.</p>
        <p className="text-slate-400 mt-1">Submit your solution from the code editor to view tests passed and execution runtime.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((sub) => {
        const vStyle = VERDICT_CONFIG[sub.verdict] || {
          label: sub.verdict,
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700'
        };
        const isAccepted = sub.verdict === 'Accepted';
        const isExpanded = expandedId === sub.attemptId;
        const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        return (
          <div
            key={sub.attemptId}
            className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all"
          >
            <div
              onClick={() => setExpandedId(isExpanded ? null : sub.attemptId)}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
            >
              <div className="flex items-center gap-2.5">
                {isAccepted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${vStyle.bg} ${vStyle.text} ${vStyle.border}`}>
                      {sub.verdict}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase font-mono">
                      {sub.language}
                    </span>
                    {sub.isScored ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        Scored (Attempt #{sub.attemptNumber})
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Practice (Attempt #{sub.attemptNumber})
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{sub.testsPassed} / {sub.totalTests} tests passed</span>
                    {typeof sub.time === 'number' && <span>• {sub.time} ms</span>}
                    {dateStr && <span>• {dateStr}</span>}
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                {isExpanded ? 'Hide Code' : 'View Code'}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                  <span className="font-mono">{sub.language} Solution</span>
                  <div className="flex items-center gap-2">
                    {onLoadCodeIntoEditor && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadCodeIntoEditor(sub.code, sub.language);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/40 text-purple-300 hover:bg-purple-900/70 text-[11px] font-semibold transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Load in Editor</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(sub.code);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-[11px] transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3 bg-slate-900/80 rounded-lg text-slate-200 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
                  <code>{sub.code}</code>
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
