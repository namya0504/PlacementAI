import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle2, XCircle, AlertCircle, Copy, Check,
  Code2, ExternalLink, Calendar, ChevronRight, X
} from 'lucide-react';
import { API } from '../../../services/api';
import { VERDICT_CONFIG } from '../constants/dsaTopics';

export default function SubmissionsTab({ topicId, onOpenProblem }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await API.getDsaSubmissions(`topicId=${topicId}`);
        if (isMounted) {
          setSubmissions(res?.submissions || []);
        }
      } catch (err) {
        console.warn('Failed to load topic submissions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (topicId) load();
    return () => { isMounted = false; };
  }, [topicId]);

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
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading submission history...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm max-w-5xl">
        <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          No Submissions Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Select any problem from the Problems tab and submit your code to track your verdicts and execution analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Submission History
          </h2>
          <p className="text-xs text-slate-500">
            {submissions.length} total attempts recorded. Only your first submission was scored for readiness.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/70 shadow-sm overflow-hidden">
        {submissions.map((sub) => {
          const vStyle = VERDICT_CONFIG[sub.verdict] || {
            label: sub.verdict || 'Evaluated',
            bg: 'bg-slate-100 dark:bg-slate-800',
            text: 'text-slate-700 dark:text-slate-300',
            border: 'border-slate-200 dark:border-slate-700'
          };

          const isAccepted = sub.verdict === 'Accepted';
          const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Recent';

          return (
            <div
              key={sub.attemptId}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">
                  {isAccepted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Problem: {sub.problemId.replace(/^dsa_[a-z]+_[0-9]+_/, '').replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${vStyle.bg} ${vStyle.text} ${vStyle.border}`}>
                      {sub.verdict}
                    </span>
                    {sub.isScored ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        Scored Attempt (Attempt #{sub.attemptNumber || 1})
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Practice (Attempt #{sub.attemptNumber || 2})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                    <span className="uppercase font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {sub.language}
                    </span>
                    <span>•</span>
                    <span>{sub.testsPassed} / {sub.totalTests} tests passed</span>
                    {typeof sub.time === 'number' && (
                      <>
                        <span>•</span>
                        <span>{sub.time} ms</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="text-slate-400">{dateStr}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedAttempt(sub)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>View Code</span>
                </button>

                {onOpenProblem && (
                  <button
                    type="button"
                    onClick={() => onOpenProblem(sub.problemId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Open problem workspace"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Code Modal Drawer */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white">
                  Submitted Code ({selectedAttempt.language})
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                  Verdict: {selectedAttempt.verdict}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedAttempt.code)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAttempt(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <pre className="p-4 overflow-auto flex-1 font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
              <code>{selectedAttempt.code}</code>
            </pre>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedAttempt.testsPassed} / {selectedAttempt.totalTests} tests passed</span>
              <span>{selectedAttempt.isScored ? 'Scored Attempt' : 'Practice Attempt'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

