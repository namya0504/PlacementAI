import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, Play, Send, CheckCircle2, AlertCircle,
  FileText, Lightbulb, Zap, Clock, Terminal, ChevronRight,
  ShieldCheck, ArrowRight, Eye, Code2, Sparkles, ExternalLink
} from 'lucide-react';
import { API } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { DIFFICULTY_COLORS } from '../constants/dsaTopics';
import ProblemDescription from './ProblemDescription';
import ProblemHints from './ProblemHints';
import ProblemApproaches from './ProblemApproaches';
import ProblemSubmissions from './ProblemSubmissions';
import MonacoCodeEditor from './MonacoCodeEditor';
import ResultPanel from './ResultPanel';

export default function ProblemWorkspace({
  problemId,
  topicTitle = 'Topic',
  onBackToTopic,
  onOpenNextProblem,
  hasNextProblem = false,
  hasNextTopic = false,
  nextTopicTitle = '',
  onOpenNextTopic
}) {
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Left panel active tab: 'description' | 'hints' | 'approaches' | 'submissions'
  const [activeLeftTab, setActiveLeftTab] = useState('description');

  // Editor states
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState('');

  // Custom Input Mode
  const [customInputMode, setCustomInputMode] = useState(false);
  const [customInput, setCustomInput] = useState('');

  // Runner state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [runnerError, setRunnerError] = useState(null);
  const [refreshSubmissions, setRefreshSubmissions] = useState(0);

  // Load problem details
  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      setRunnerError(null);
      const res = await API.getDsaProblemDetail(problemId);
      if (res?.problem) {
        setProblem(res.problem);
        setUserStatus(res.userStatus || {});

        // Auto-load code for current language from localStorage or starter code
        const savedKey = `placementai_dsa_${problemId}_${selectedLang}`;
        const savedCode = localStorage.getItem(savedKey);
        const starter = res.problem.starterCode?.[selectedLang] || '// Write your code here';
        setCode(savedCode || starter);

        // Pre-fill custom input with first example if empty
        if (!customInput && res.problem.examples?.[0]?.input) {
          setCustomInput(res.problem.examples[0].input);
        }
      }
    } catch (err) {
      console.error('Failed to load problem:', err);
      toast?.showToast?.(err.message || 'Failed to load problem', 'error');
    } finally {
      setLoading(false);
    }
  }, [problemId, selectedLang]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  // Handle language switch
  const handleChangeLanguage = (newLang) => {
    setSelectedLang(newLang);
    if (!problem) return;
    const savedKey = `placementai_dsa_${problemId}_${newLang}`;
    const savedCode = localStorage.getItem(savedKey);
    const starter = problem.starterCode?.[newLang] || '// Write your code here';
    setCode(savedCode || starter);
  };

  // Handle code edit with local storage auto-save
  const handleChangeCode = (newCode) => {
    setCode(newCode);
    try {
      localStorage.setItem(`placementai_dsa_${problemId}_${selectedLang}`, newCode);
    } catch (e) {}
  };

  // Run code against sample tests or custom input
  const handleRun = async () => {
    if (!code || !code.trim()) {
      toast?.showToast?.('Please write some code before running', 'warning');
      return;
    }

    try {
      setIsRunning(true);
      setRunnerError(null);

      const res = await API.runDsaCode({
        problemId,
        language: selectedLang,
        code,
        customInput: customInputMode ? customInput : null,
        isCustom: customInputMode
      });

      setResult(res);
      if (res?.verdict === 'Accepted') {
        toast?.showToast?.('Sample test cases passed!', 'success');
      } else if (res?.verdict) {
        toast?.showToast?.(`Run Result: ${res.verdict}`, 'info');
      }
    } catch (err) {
      console.error('Run failed:', err);
      setRunnerError(err.message || 'Code runner service encountered a delay. Your code is preserved.');
      toast?.showToast?.(err.message || 'Runner service issue', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code against all visible + hidden test cases
  const handleSubmit = async () => {
    if (!code || !code.trim()) {
      toast?.showToast?.('Please write some code before submitting', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      setRunnerError(null);

      const res = await API.submitDsaCode({
        problemId,
        language: selectedLang,
        code
      });

      setResult(res);
      setRefreshSubmissions(prev => prev + 1);

      // Refresh status to reflect attempt / solved state
      const statusRes = await API.getDsaProblemDetail(problemId);
      if (statusRes?.userStatus) {
        setUserStatus(statusRes.userStatus);
      }

      if (res?.verdict === 'Accepted') {
        toast?.showToast?.('Congratulations! All test cases passed!', 'success');
      } else {
        toast?.showToast?.(`Submission: ${res.verdict}`, 'warning');
      }
    } catch (err) {
      console.error('Submit failed:', err);
      setRunnerError(err.message || 'Submission service busy. Please try again in a few moments.');
      toast?.showToast?.(err.message || 'Submission service busy', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading problem environment...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Problem Not Found</h3>
        <button
          type="button"
          onClick={onBackToTopic}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Topic Problems
        </button>
      </div>
    );
  }

  const diffStyle = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium;
  const isSolved = userStatus?.state === 'solved';
  const hasAttempt = userStatus && userStatus.attemptCount > 0;

  return (
    <div className="space-y-4">
      {/* Workspace Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToTopic}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{topicTitle}</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                {problem.title}
              </h1>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                {problem.difficulty}
              </span>
              {isSolved ? (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Solved
                </span>
              ) : hasAttempt ? (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3 h-3" /> Attempted
                </span>
              ) : null}
            </div>

            {/* Scoring state note */}
            <div className="text-[11px] text-slate-400 mt-0.5">
              {userStatus?.solutionViewed ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  • Solution viewed (Practice attempts only, not scored)
                </span>
              ) : hasAttempt ? (
                <span>• Scored on Attempt #1 (Currently practicing)</span>
              ) : (
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  • First submission will be scored for campus readiness
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Nav Action: Next Problem or Next Topic */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => window.open(`/placement-prep/technical/visualize/${problem.problemId}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-bold text-xs shadow-sm transition"
            title="Open interactive animated algorithm visualizer in a new tab"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Understand Step-by-Step 🚀</span>
            <ExternalLink className="w-3 h-3 text-purple-500 sm:hidden" />
          </button>

          {hasNextProblem ? (
            <button
              type="button"
              onClick={onOpenNextProblem}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Next Problem</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : hasNextTopic ? (
            <button
              type="button"
              onClick={onOpenNextTopic}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-semibold text-xs transition-colors"
            >
              <span>Next Topic: {nextTopicTitle}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToTopic}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              <span>Topic Problems</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Split-Screen Grid: Left = Tabs / Right = Monaco Editor + Result Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left Side: Problem Metadata Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[750px]">
          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 px-2 pt-2 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeLeftTab === 'description'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('hints')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeLeftTab === 'hints'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hints ({problem.hints?.length || 3})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('approaches')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeLeftTab === 'approaches'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Approaches</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLeftTab('submissions')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeLeftTab === 'submissions'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Submissions</span>
            </button>
          </div>

          {/* Left Tab Body (Scrollable) */}
          <div className="p-5 overflow-y-auto flex-1">
            {activeLeftTab === 'description' && (
              <ProblemDescription problem={problem} />
            )}

            {activeLeftTab === 'hints' && (
              <ProblemHints hints={problem.hints || []} />
            )}

            {activeLeftTab === 'approaches' && (
              <ProblemApproaches
                problem={problem}
                userStatus={userStatus}
                onSolutionViewed={() => {
                  setUserStatus(prev => ({ ...prev, solutionViewed: true }));
                }}
              />
            )}

            {activeLeftTab === 'submissions' && (
              <ProblemSubmissions
                problemId={problemId}
                refreshTrigger={refreshSubmissions}
                onLoadCodeIntoEditor={(loadedCode, lang) => {
                  setSelectedLang(lang);
                  setCode(loadedCode);
                  toast?.showToast?.(`Loaded ${lang} submission into editor`, 'info');
                }}
              />
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor + Action Bar + Result Panel */}
        <div className="space-y-4 flex flex-col h-[750px]">
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[380px]">
            <MonacoCodeEditor
              problemId={problemId}
              starterCodes={problem.starterCode || {}}
              language={selectedLang}
              onChangeLanguage={handleChangeLanguage}
              code={code}
              onChangeCode={handleChangeCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Action Bar: Custom Input Toggle, Run, Submit */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={customInputMode}
                onChange={(e) => setCustomInputMode(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
              />
              <span>Custom Input</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRunning || isSubmitting}
                onClick={handleRun}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-purple-600" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                type="button"
                disabled={isRunning || isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
              </button>
            </div>
          </div>

          {/* Custom Input Box (if enabled) */}
          {customInputMode && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Custom Testcase (stdin):
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter standard input testcase..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Result Panel (Scrollable) */}
          <div className="max-h-[260px] overflow-y-auto">
            <ResultPanel
              result={result}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              runnerError={runnerError}
              customMode={customInputMode}
              hasNextProblem={hasNextProblem}
              onOpenNextProblem={onOpenNextProblem}
              hasNextTopic={hasNextTopic}
              nextTopicTitle={nextTopicTitle}
              onOpenNextTopic={onOpenNextTopic}
              onBackToTopic={onBackToTopic}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

