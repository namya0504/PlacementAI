import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Send, CheckCircle2, Code2, Menu, Clock, Terminal, Sparkles, RefreshCw,
  XCircle, AlertCircle, History, X, ChevronRight, ChevronDown, ChevronLeft,
  Check, Copy, RotateCcw, Lock, Unlock, ArrowRight, Trophy, BookOpen, Layers,
  FileCode, CheckSquare, Zap, Eye, EyeOff, Sliders, ShieldCheck, HelpCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';
import { useToast } from '../context/ToastContext';

const DEFAULT_STARTERS = {
  Python: 'def solution(args):\n    # Write your Python solution here\n    pass\n',
  Java: 'public class Solution {\n    public int solve() {\n        // Write your Java solution here\n        return -1;\n    }\n}\n',
  'C++': '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your C++ solution here\n        return -1;\n    }\n};\n',
  JavaScript: 'function solution(args) {\n  // Write your JavaScript solution here\n}\n',
  SQL: '-- Write your SQL query here\nSELECT * FROM table_name;\n'
};

const LANG_CONFIG = {
  Java: { ext: 'java', label: 'Java', color: 'orange', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
  Python: { ext: 'py', label: 'Python', color: 'blue', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  'C++': { ext: 'cpp', label: 'C++', color: 'indigo', badge: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  JavaScript: { ext: 'js', label: 'JavaScript', color: 'amber', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  SQL: { ext: 'sql', label: 'SQL', color: 'cyan', badge: 'bg-cyan-50 text-cyan-600 border-cyan-200' }
};

/** Formats test case input/output values cleanly, unescaping literal \n and objects */
function formatTestCaseValue(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  let str = String(val);
  return str
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '    ');
}

/** Parses description into body and constraints if formatted with "Constraints:" */
function parseDescription(desc) {
  if (!desc) return { body: '', constraints: [] };
  const str = String(desc);
  const constraintMatch = str.match(/Constraints:\s*([\s\S]+?)(?:Example:|$)/i);
  let constraints = [];
  let body = str;

  if (constraintMatch && constraintMatch[1]) {
    const rawConstraints = constraintMatch[1].trim();
    constraints = rawConstraints
      .split(/(?:,\s*|\n+|\.\s+)/)
      .map(c => c.trim().replace(/^[-•*]\s*/, ''))
      .filter(c => c.length > 0 && !c.toLowerCase().startsWith('example'));
  }

  return { body, constraints };
}

export default function Technical() {
  const toast = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Java');
  const [code, setCode] = useState(DEFAULT_STARTERS.Java);
  const [initialCode, setInitialCode] = useState(DEFAULT_STARTERS.Java);
  const [outputResult, setOutputResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ technicalScore: 0 });
  const [copied, setCopied] = useState(false);

  // Active panel tab: 'description' | 'testcases' | 'results'
  const [activeTab, setActiveTab] = useState('description');
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  // Test Case mode: 'sample' | 'custom' (HackerRank / LeetCode style)
  const [testCaseMode, setTestCaseMode] = useState('sample');
  const [customInput, setCustomInput] = useState('');

  // History slide-over drawer
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Editor refs for synchronized line-number scrolling
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const fetchStats = async () => {
    try {
      const res = await API.getDashboardStats();
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (e) {
      console.warn('Stats fetch notice:', e.message);
    }
  };

  const getStarterForLang = (q, lang) => {
    if (!q) return DEFAULT_STARTERS[lang] || '// Write code here\n';
    const langKey = lang.toLowerCase();
    if (q.starterCodes && q.starterCodes[langKey]) {
      return q.starterCodes[langKey];
    }
    if (q.language && q.language.toLowerCase() === langKey && (q.starterCode || q.initialCode)) {
      return q.starterCode || q.initialCode;
    }
    return DEFAULT_STARTERS[lang] || q.starterCode || q.initialCode || '// Write code here\n';
  };

  const loadQuestion = async (lang, forceGenerate = false, excludeId = null) => {
    setLoading(true);
    setQuestionData(null);
    setOutputResult(null);
    setActiveTab('description');
    setActiveCaseIdx(0);
    setTestCaseMode('sample');

    const params = new URLSearchParams();
    params.set('category', lang);
    params.set('language', lang);
    params.set('type', 'code');
    if (forceGenerate) {
      params.set('generate', 'true');
    }
    if (excludeId) {
      params.set('currentId', excludeId);
    }
    params.set('_t', String(Date.now()));

    try {
      const res = await API.getTechnicalQuestions(`?${params.toString()}`);
      if (res && res.length > 0) {
        const q = res[0];
        setQuestionData(q);
        const starter = getStarterForLang(q, lang);
        setCode(starter);
        setInitialCode(starter);
        // Pre-fill custom input with first sample test case input for user convenience
        if (q.testCases && q.testCases.length > 0) {
          setCustomInput(String(q.testCases[0].input || ''));
        }
      }
    } catch (err) {
      console.error('Failed to load technical questions:', err);
      toast.error('Could not load technical challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    setOutputResult(null);
    setActiveTab('description');
    setActiveCaseIdx(0);

    if (questionData) {
      const starter = getStarterForLang(questionData, newLang);
      setCode(starter);
      setInitialCode(starter);
    } else {
      loadQuestion(newLang, false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await API.getTechnicalHistory();
      setHistoryData(data);
    } catch (e) {
      console.warn('Technical history load error:', e.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
    loadHistory();
  };

  useEffect(() => {
    fetchStats();
    loadQuestion(selectedLang, false);
  }, []);

  const handleEditorScroll = (e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '    ';
      const nextCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(nextCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + spaces.length;
        }
      }, 0);
    }
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset editor back to the default starter template?')) {
      setCode(initialCode);
      toast.info('Editor reset to starter template.');
    }
  };

  /**
   * 1. RUN CODE:
   * Evaluates visible test cases ONLY (or custom testcase if in custom mode).
   * Does NOT evaluate hidden test cases and does NOT affect placement readiness score.
   */
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('results');
    try {
      const isCustomActive = testCaseMode === 'custom' && customInput.trim().length > 0;
      const payload = {
        questionId: questionData?.questionId || 'tech_code_1',
        code,
        language: selectedLang.toLowerCase(),
        isCustom: isCustomActive,
        customInput: isCustomActive ? customInput.trim() : undefined,
        testCases: isCustomActive ? [] : (questionData?.testCases || [])
      };

      const res = await API.runTechnicalCode(payload);

      if (res?.isCustom) {
        setOutputResult({
          isCustom: true,
          status: res.status,
          customInput: res.customInput,
          actualOutput: res.actualOutput,
          stdout: res.stdout,
          error: res.error,
          message: res.message
        });
        if (res.status === 'Success') {
          toast.success('Custom test case executed successfully!');
        } else {
          toast.error(res.error || 'Custom test case execution error');
        }
      } else {
        setOutputResult({
          isRun: true,
          status: res.status,
          passCount: res.passCount,
          totalTests: res.totalTests,
          score: res.score,
          message: res.message,
          testResults: res.testResults || []
        });

        if (res.passCount === res.totalTests) {
          toast.success(`🎉 All ${res.totalTests} visible test cases passed! Submit your code to test against 5 hidden edge cases.`);
        } else {
          toast.info(`Passed ${res.passCount} of ${res.totalTests} visible test cases. Click "Submit Code" when ready.`);
        }
      }
    } catch (err) {
      setOutputResult({
        isRun: true,
        status: 'Failed',
        message: err.message || 'Execution error. Check syntax and constraints.',
        passCount: 0,
        totalTests: questionData?.testCases?.length || 3,
        score: 0,
        testResults: (questionData?.testCases || []).map((tc, idx) => ({
          testCaseIndex: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Runtime / Compilation Error',
          passed: false,
          error: err.message
        }))
      });
      toast.error(err.message || 'Execution failed. Check syntax and try again.');
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * 2. SUBMIT CODE:
   * Evaluates BOTH visible test cases AND up to 5 hidden edge cases.
   * Hidden test case inputs and expected outputs are masked/hidden for integrity.
   * Unlocks Next Challenge when 100% of all visible + hidden test cases pass.
   */
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setActiveTab('results');
    try {
      const res = await API.submitTechnicalCode({
        questionId: questionData?.questionId || 'tech_code_1',
        code,
        language: selectedLang.toLowerCase()
      });

      const resultPayload = {
        isSubmission: true,
        status: res.status, // 'Passed' | 'Partial' | 'Failed'
        message: res.message,
        passCount: res.passCount,
        totalTests: res.totalTests,
        visiblePassCount: res.visiblePassCount,
        totalVisible: res.totalVisible,
        hiddenPassCount: res.hiddenPassCount,
        totalHidden: res.totalHidden,
        score: res.score,
        testResults: res.testResults || []
      };

      setOutputResult(resultPayload);

      if (res.updatedStats) {
        setStats(res.updatedStats);
      }

      const passedAll = res.status === 'Passed' || (res.score === 100 && res.passCount === res.totalTests);

      if (passedAll) {
        toast.success('🎉 Outstanding! All visible and 5 hidden edge cases passed! Next challenge unlocked.');
      } else if (res.visiblePassCount === res.totalVisible && res.hiddenPassCount < res.totalHidden) {
        toast.error(`⚠️ Passed all visible cases, but failed ${res.totalHidden - res.hiddenPassCount} hidden edge cases! Review boundary conditions.`);
      } else {
        toast.error('Test cases failed. Review outputs below and try again.');
      }
    } catch (err) {
      setOutputResult({
        isSubmission: true,
        status: 'Failed',
        message: err.message || 'Evaluation error. Check syntax and constraints.',
        passCount: 0,
        totalTests: (questionData?.testCases?.length || 3) + 5,
        score: 0,
        testResults: (questionData?.testCases || []).map((tc, idx) => ({
          testCaseIndex: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Runtime / Compilation Error',
          passed: false,
          error: err.message
        }))
      });
      toast.error(err.message || 'Submission failed. Check syntax and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Condition to activate the "Next Challenge" button: MUST be a submission with 100% pass on all visible + hidden edge cases
  const allTestsPassed = Boolean(
    outputResult &&
    outputResult.isSubmission &&
    (outputResult.status === 'Passed' || outputResult.score === 100) &&
    outputResult.passCount === outputResult.totalTests &&
    outputResult.totalTests > 0
  );

  const handleNextQuestion = () => {
    if (!allTestsPassed && !loading) {
      toast.info('Pass all visible and 5 hidden edge cases to unlock the next challenge, or use "New AI Challenge" to generate anytime.');
      return;
    }
    toast.info('Generating your next AI technical challenge...');
    loadQuestion(selectedLang, true, questionData?.questionId);
  };

  const handleResetCustomInput = () => {
    if (questionData?.testCases?.[0]?.input) {
      setCustomInput(String(questionData.testCases[0].input));
      toast.info('Custom testcase reset to Sample Case 1');
    }
  };

  const techScore = stats.technicalScore ?? 0;
  const stageName = techScore === 0 ? 'Fundamentals (Not started)' :
    techScore < 40 ? `Fundamentals (${techScore}% Proficiency)` :
    techScore < 75 ? `Data Structures & Algorithms (${techScore}% Proficiency)` :
    `Advanced Architecture (${techScore}% Proficiency)`;

  const currentLangConfig = LANG_CONFIG[selectedLang] || LANG_CONFIG.Java;
  const fileExt = currentLangConfig.ext;

  const lineCount = Math.max((code || '').split('\n').length, 18);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const { body: descBody, constraints } = parseDescription(questionData?.description || questionData?.question);

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* ── Top Bar ────────────────────────────────────────── */}
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Technical Preparation</h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-[#7C3AED] border border-purple-200">
                  <ShieldCheck className="w-3 h-3 text-[#7C3AED]" /> Hidden Edge Tests Active
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous challenges with visible tests, 5 hidden edge cases, and custom test input</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs"
              title="View your code submission history"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">History</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Language Switcher Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1 border border-slate-200/80">
              {['Python', 'Java', 'C++', 'SQL', 'JavaScript'].map(l => {
                const isSelected = selectedLang === l;
                return (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>{l}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ── Main Container ─────────────────────────────────── */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* ── Track Overview Banner ─────────────────────────── */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EAEBF4] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20 shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-slate-900 font-outfit text-base sm:text-lg">{selectedLang} Track</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200">
                    {selectedLang === 'SQL' ? 'Query Engineering' : 'Algorithmic Problem Solving'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Current Level: <span className="font-bold text-[#7C3AED]">{stageName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Top Next Challenge Button (Lights up when submit passed all visible + hidden) */}
              <button
                onClick={handleNextQuestion}
                disabled={loading || !allTestsPassed}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
                  allTestsPassed
                    ? 'bg-gradient-to-r from-emerald-600 to-[#7C3AED] hover:from-emerald-700 hover:to-[#6D28D9] text-white shadow-emerald-500/20 animate-pulse cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
                title={allTestsPassed ? 'All visible and 5 hidden edge cases passed! Click to generate next challenge' : 'Pass all visible and 5 hidden edge cases on Submit to unlock'}
              >
                {allTestsPassed ? <Sparkles className="w-4 h-4 text-amber-300" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                <span>Next Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Generate New AI Challenge */}
              <button
                onClick={() => loadQuestion(selectedLang, true, questionData?.questionId)}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                <span>{loading ? 'Generating...' : 'New AI Challenge'}</span>
              </button>
            </div>
          </div>

          {/* ── Main Workspace: 2-Column Split ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ── Left Pane: Problem Description, Test Cases, & Evaluation ── */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAEBF4] shadow-xs overflow-hidden flex flex-col min-h-[600px]">
              
              {/* Tab Navigation */}
              <div className="flex items-center border-b border-[#EAEBF4] bg-slate-50/70 px-4 pt-2 gap-2">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
                    activeTab === 'description'
                      ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Description</span>
                </button>

                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
                    activeTab === 'testcases'
                      ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Test Cases</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                    {questionData?.testCases?.length || 3}+5
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 border-b-2 relative ${
                    activeTab === 'results'
                      ? 'border-[#7C3AED] text-[#7C3AED] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Results</span>
                  {outputResult && (
                    <span className={`w-2 h-2 rounded-full ${
                      allTestsPassed
                        ? 'bg-emerald-500'
                        : outputResult.status === 'Partial' || outputResult.isCustom
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`} />
                  )}
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto max-h-[700px]">
                {loading ? (
                  <div className="py-24 text-center space-y-4 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto border border-purple-100">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800 font-outfit">Generating Coding Challenge...</div>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Synthesizing algorithmic problem statement, visible test cases, and 5 hidden edge cases.
                      </p>
                    </div>
                  </div>
                ) : !questionData ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 py-20 my-auto text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 font-outfit">No challenge currently loaded</p>
                      <p className="text-xs text-slate-400 mt-0.5">Click below to generate a tailored challenge for {selectedLang}</p>
                    </div>
                    <button
                      onClick={() => loadQuestion(selectedLang, true)}
                      className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20"
                    >
                      Generate AI Challenge
                    </button>
                  </div>
                ) : (
                  <>
                    {/* ── TAB 1: Problem Description ────────────────── */}
                    {activeTab === 'description' && (
                      <div className="space-y-5">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                              (questionData.difficulty || 'Medium').toLowerCase() === 'easy'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : (questionData.difficulty || 'Medium').toLowerCase() === 'hard'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {questionData.difficulty || 'Medium'}
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                              {questionData.category || selectedLang}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            ID: {questionData.questionId || 'tech_q'}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-extrabold text-slate-900 font-outfit tracking-tight">
                          {questionData.title || 'Coding Challenge'}
                        </h2>

                        {/* Main Description */}
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-wrap">
                          {descBody}
                        </div>

                        {/* Constraints (if found) */}
                        {constraints.length > 0 && (
                          <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 font-outfit uppercase tracking-wider">
                              Constraints
                            </h4>
                            <ul className="space-y-1 font-mono text-xs text-slate-600 list-disc list-inside">
                              {constraints.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Sample Example preview */}
                        {Array.isArray(questionData.testCases) && questionData.testCases.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 font-outfit uppercase tracking-wider">
                                Sample Example
                              </span>
                              <button
                                onClick={() => setActiveTab('testcases')}
                                className="text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                              >
                                View all test cases & custom option <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="p-3.5 bg-[#F8F9FE] rounded-2xl border border-[#EAEBF4] font-mono text-xs space-y-2">
                              <div>
                                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Input:</span>
                                <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap break-all bg-white p-2 rounded-lg border border-[#EAEBF4]">
                                  {formatTestCaseValue(questionData.testCases[0].input)}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Expected Output:</span>
                                <pre className="font-mono text-xs text-emerald-700 font-bold whitespace-pre-wrap break-all bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
                                  {formatTestCaseValue(questionData.testCases[0].expectedOutput)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TAB 2: Test Cases (Sample + Custom Testcase) ── */}
                    {activeTab === 'testcases' && (
                      <div className="space-y-4">
                        
                        {/* Sub-mode selector: Sample Cases vs Custom Testcase */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => setTestCaseMode('sample')}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                                testCaseMode === 'sample'
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                              <span>Sample Cases ({questionData.testCases?.length || 3})</span>
                            </button>
                            <button
                              onClick={() => setTestCaseMode('custom')}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                                testCaseMode === 'custom'
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Custom Testcase</span>
                            </button>
                          </div>

                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" /> +5 Hidden Edge Tests
                          </span>
                        </div>

                        {/* MODE A: Sample Test Cases */}
                        {testCaseMode === 'sample' && (
                          <div className="space-y-4">
                            {/* Test case selector pills */}
                            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                              {(questionData.testCases || []).map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveCaseIdx(idx)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                                    activeCaseIdx === idx
                                      ? 'bg-white text-slate-900 shadow-xs'
                                      : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  Case {idx + 1}
                                </button>
                              ))}
                            </div>

                            {/* Selected test case details */}
                            {Array.isArray(questionData.testCases) && questionData.testCases[activeCaseIdx] && (
                              <div className="p-4 bg-[#F8F9FE] rounded-2xl border border-[#EAEBF4] space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                  <span className="text-xs font-bold text-slate-700 font-outfit">
                                    Sample Test Case #{activeCaseIdx + 1}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Evaluated on "Run Code"
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Input Parameters:</span>
                                  <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap break-all bg-white p-3 rounded-xl border border-[#EAEBF4] leading-relaxed">
                                    {formatTestCaseValue(questionData.testCases[activeCaseIdx].input)}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Expected Output:</span>
                                  <pre className="font-mono text-xs text-emerald-700 font-bold whitespace-pre-wrap break-all bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 leading-relaxed">
                                    {formatTestCaseValue(questionData.testCases[activeCaseIdx].expectedOutput)}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Hidden Edge Cases Notice Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 space-y-2">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                                <h4 className="text-xs font-extrabold text-purple-900 font-outfit">
                                  5 Hidden Edge Cases Included on Submit
                                </h4>
                              </div>
                              <p className="text-[11px] text-purple-800 leading-relaxed">
                                When you click <strong>"Submit Code"</strong>, your solution is evaluated against all visible sample cases plus <strong>5 hidden edge cases</strong> (empty inputs, negative bounds, zero values, duplicates, and large constraints). Test case details remain hidden to maintain interview integrity.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* MODE B: Custom Test Case (HackerRank / LeetCode style) */}
                        {testCaseMode === 'custom' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 font-outfit">Try Your Own Testcase</h4>
                                <p className="text-[11px] text-slate-500">Enter custom input parameters matching the challenge signature.</p>
                              </div>
                              <button
                                onClick={handleResetCustomInput}
                                className="text-[11px] font-bold text-[#7C3AED] hover:underline"
                              >
                                Reset to Sample
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                                Custom Input Parameters:
                              </label>
                              <textarea
                                rows={4}
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
                                className="w-full font-mono text-xs p-3 rounded-2xl bg-white border border-[#EAEBF4] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 resize-none leading-relaxed"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-400">
                                Run Code will execute using this custom input.
                              </span>
                              <button
                                onClick={handleRunCode}
                                disabled={isRunning || isSubmitting}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                              >
                                <Play className="w-3.5 h-3.5 text-purple-400" />
                                <span>{isRunning ? 'Running...' : 'Run Custom Test'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* ── TAB 3: Results Console ────────────────────── */}
                    {activeTab === 'results' && (
                      <div className="space-y-4">
                        {isRunning || isSubmitting ? (
                          <div className="py-20 text-center space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto text-[#7C3AED]">
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            </div>
                            <div className="text-sm font-bold text-slate-800 font-outfit">
                              {isSubmitting ? 'Evaluating Full Submission (Visible + 5 Hidden Edge Tests)...' : 'Running Code...'}
                            </div>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                              {isSubmitting
                                ? 'Testing edge cases, boundary limits, and constraints in secure execution sandbox.'
                                : 'Compiling and verifying your solution.'}
                            </p>
                          </div>
                        ) : !outputResult ? (
                          <div className="py-20 text-center space-y-3 text-slate-400">
                            <Terminal className="w-10 h-10 mx-auto text-slate-300" />
                            <div className="text-sm font-bold text-slate-700 font-outfit">No Test Results Yet</div>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                              Click <strong className="text-slate-700">"Run Code"</strong> to test visible or custom inputs, or <strong className="text-slate-700">"Submit Code"</strong> to evaluate all hidden edge cases.
                            </p>
                          </div>
                        ) : outputResult.isCustom ? (
                          /* ── RESULT VIEW A: Custom Testcase Result ── */
                          <div className="space-y-4">
                            <div className={`p-4 rounded-2xl border space-y-2 ${
                              outputResult.status === 'Success'
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-red-50/70 border-red-200 text-red-900'
                            }`}>
                              <div className="flex items-center justify-between font-bold">
                                <div className="flex items-center gap-2">
                                  {outputResult.status === 'Success' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                  <span className="text-xs font-outfit">Custom Testcase Execution</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  outputResult.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {outputResult.status}
                                </span>
                              </div>
                              <p className="text-xs opacity-90">{outputResult.message}</p>
                            </div>

                            <div className="space-y-3 font-mono text-xs">
                              <div>
                                <span className="text-slate-400 font-sans font-semibold text-[11px] block mb-1">Your Input:</span>
                                <pre className="bg-white p-3 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap break-all leading-relaxed">
                                  {outputResult.customInput}
                                </pre>
                              </div>
                              <div>
                                <span className="text-slate-400 font-sans font-semibold text-[11px] block mb-1">Program Output / Returned:</span>
                                <pre className={`p-3 rounded-xl border font-bold whitespace-pre-wrap break-all leading-relaxed ${
                                  outputResult.status === 'Success'
                                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                                    : 'bg-red-50/60 border-red-200 text-red-700'
                                }`}>
                                  {outputResult.actualOutput}
                                </pre>
                              </div>
                              {outputResult.stdout && (
                                <div>
                                  <span className="text-slate-400 font-sans font-semibold text-[11px] block mb-1">Console Logs (stdout):</span>
                                  <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap break-all">
                                    {outputResult.stdout}
                                  </pre>
                                </div>
                              )}
                              {outputResult.error && (
                                <div className="p-3 rounded-xl bg-red-100/70 border border-red-200 text-red-800 text-[11px]">
                                  {outputResult.error}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : outputResult.isRun ? (
                          /* ── RESULT VIEW B: Run Code (Visible Tests Only) ── */
                          <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between font-bold">
                                <div className="flex items-center gap-2">
                                  <Play className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs font-outfit text-slate-900">
                                    Sample Run Results ({outputResult.passCount}/{outputResult.totalTests} Passed)
                                  </span>
                                </div>
                                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-[#7C3AED]">
                                  Visible Only
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600">
                                ℹ️ Note: This was a sample run against visible test cases only. Click <strong>"Submit Code"</strong> to evaluate against all 5 hidden edge cases and earn placement score.
                              </p>
                            </div>

                            {/* Visible Test Case Cards */}
                            <div className="space-y-2.5">
                              {(outputResult.testResults || []).map((tr, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3.5 rounded-2xl border space-y-2 font-mono text-xs ${
                                    tr.passed
                                      ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                                      : 'bg-red-50/50 border-red-200/80 text-red-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-bold font-sans">
                                    <div className="flex items-center gap-1.5">
                                      {tr.passed ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                      )}
                                      <span>Sample Case #{tr.testCaseIndex || idx + 1}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      tr.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {tr.passed ? '✓ Passed' : '✗ Failed'}
                                    </span>
                                  </div>

                                  <div className="space-y-1.5 text-[11px] text-slate-700">
                                    <div>
                                      <span className="text-slate-400 font-semibold block mb-0.5">Input:</span>
                                      <pre className="bg-white p-2 rounded-lg border border-slate-200/60 whitespace-pre-wrap break-all">
                                        {formatTestCaseValue(tr.input)}
                                      </pre>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="text-slate-400 font-semibold block mb-0.5">Expected:</span>
                                        <pre className="bg-white p-2 rounded-lg border border-slate-200/60 text-emerald-700 font-bold whitespace-pre-wrap break-all">
                                          {formatTestCaseValue(tr.expectedOutput)}
                                        </pre>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 font-semibold block mb-0.5">Actual:</span>
                                        <pre className={`p-2 rounded-lg border font-bold whitespace-pre-wrap break-all ${
                                          tr.passed
                                            ? 'bg-white border-slate-200/60 text-emerald-700'
                                            : 'bg-white border-red-200 text-red-600'
                                        }`}>
                                          {formatTestCaseValue(tr.actualOutput ?? 'None')}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* ── RESULT VIEW C: Full Submission (Visible + 5 Hidden Edge Tests) ── */
                          <div className="space-y-4">
                            {allTestsPassed ? (
                              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-purple-50 border border-emerald-200 space-y-3 shadow-xs">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                      <Trophy className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-extrabold text-emerald-900 font-outfit">
                                        All Visible & 5 Hidden Edge Cases Passed!
                                      </h4>
                                      <p className="text-xs text-emerald-700 font-medium">
                                        Score: 100% · All edge constraints satisfied · Readiness updated.
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                                    {outputResult.passCount}/{outputResult.totalTests} Passed
                                  </span>
                                </div>

                                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between gap-3">
                                  <p className="text-[11px] text-slate-600 font-medium">
                                    Next question is now activated. Ready for the next problem?
                                  </p>
                                  <button
                                    onClick={handleNextQuestion}
                                    className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition shrink-0"
                                  >
                                    <span>Next Challenge</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className={`p-4 rounded-2xl border space-y-2 ${
                                outputResult.status === 'Partial'
                                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                                  : 'bg-red-50 border-red-200 text-red-900'
                              }`}>
                                <div className="flex items-center justify-between font-bold">
                                  <div className="flex items-center gap-2">
                                    {outputResult.status === 'Partial' ? (
                                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                    )}
                                    <span className="text-xs">
                                      {outputResult.visiblePassCount === outputResult.totalVisible && outputResult.hiddenPassCount < outputResult.totalHidden
                                        ? `Passed visible cases, but failed ${outputResult.totalHidden - outputResult.hiddenPassCount} hidden edge tests`
                                        : `Passed ${outputResult.passCount} of ${outputResult.totalTests} total test cases`}
                                    </span>
                                  </div>
                                  <span className="text-xs px-2 py-0.5 rounded font-bold bg-white/80">
                                    Score: {outputResult.score}%
                                  </span>
                                </div>
                                {outputResult.message && (
                                  <p className="text-xs opacity-90">{outputResult.message}</p>
                                )}
                              </div>
                            )}

                            {/* Test Cases Breakdown (Visible vs Hidden) */}
                            <div className="space-y-2.5">
                              <span className="text-xs font-bold text-slate-700 font-outfit uppercase tracking-wider block">
                                Test Case Breakdown (Visible + 5 Hidden Edge Cases)
                              </span>
                              {(outputResult.testResults || []).map((tr, idx) => {
                                const isHidden = tr.isHidden;

                                if (isHidden) {
                                  // HIDDEN TEST CASE: DO NOT SHOW INPUT OR EXPECTED OUTPUT
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-3.5 rounded-2xl border space-y-2 font-mono text-xs ${
                                        tr.passed
                                          ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-900'
                                          : 'bg-rose-50/60 border-rose-200 text-rose-900'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between font-bold font-sans">
                                        <div className="flex items-center gap-1.5">
                                          <Lock className={`w-3.5 h-3.5 ${tr.passed ? 'text-emerald-600' : 'text-rose-600'}`} />
                                          <span>{tr.label || `Hidden Test Case #${idx + 1}`}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          tr.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}>
                                          {tr.passed ? '✓ Passed' : '✗ Failed (Edge Case)'}
                                        </span>
                                      </div>

                                      <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/60 text-[11px] font-sans text-slate-600 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                          <span>Input & expected output hidden for evaluation integrity</span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-400">
                                          {tr.edgeDescription || 'Boundary constraint'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }

                                // VISIBLE TEST CASE
                                return (
                                  <div
                                    key={idx}
                                    className={`p-3.5 rounded-2xl border space-y-2 font-mono text-xs ${
                                      tr.passed
                                        ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                                        : 'bg-red-50/50 border-red-200/80 text-red-900'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between font-bold font-sans">
                                      <div className="flex items-center gap-1.5">
                                        {tr.passed ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span>{tr.label || `Visible Test Case #${idx + 1}`}</span>
                                      </div>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        tr.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {tr.passed ? '✓ Passed' : '✗ Failed'}
                                      </span>
                                    </div>

                                    <div className="space-y-1.5 text-[11px] text-slate-700">
                                      <div>
                                        <span className="text-slate-400 font-semibold block mb-0.5">Input:</span>
                                        <pre className="bg-white p-2 rounded-lg border border-slate-200/60 whitespace-pre-wrap break-all">
                                          {formatTestCaseValue(tr.input)}
                                        </pre>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-slate-400 font-semibold block mb-0.5">Expected:</span>
                                          <pre className="bg-white p-2 rounded-lg border border-slate-200/60 text-emerald-700 font-bold whitespace-pre-wrap break-all">
                                            {formatTestCaseValue(tr.expectedOutput)}
                                          </pre>
                                        </div>
                                        <div>
                                          <span className="text-slate-400 font-semibold block mb-0.5">Actual:</span>
                                          <pre className={`p-2 rounded-lg border font-bold whitespace-pre-wrap break-all ${
                                            tr.passed
                                              ? 'bg-white border-slate-200/60 text-emerald-700'
                                              : 'bg-white border-red-200 text-red-600'
                                          }`}>
                                            {formatTestCaseValue(tr.actualOutput ?? 'None')}
                                          </pre>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bottom Quick-Action Footnote */}
              <div className="p-3 bg-slate-50 border-t border-[#EAEBF4] flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${allTestsPassed ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  {allTestsPassed ? 'Challenge Completed' : 'In Progress'}
                </span>
                {allTestsPassed && (
                  <button
                    onClick={handleNextQuestion}
                    className="font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
                  >
                    Proceed to Next Challenge <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Right Pane: Code Editor Area ─────────────────── */}
            <div className="lg:col-span-7 bg-[#0B1120] rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col min-h-[600px] space-y-4">
              
              {/* Editor Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-xl bg-slate-800/90 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 border border-slate-700/60">
                    <FileCode className="w-3.5 h-3.5 text-purple-400" />
                    <span>{selectedLang === 'Java' ? 'Solution.java' : `solution.${fileExt}`}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                    {selectedLang}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Copy Code */}
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] flex items-center gap-1 transition"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* Reset Starter */}
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] flex items-center gap-1 transition"
                    title="Reset to starter code"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Code Workspace with Synchronized Line Numbers Gutter */}
              <div className="relative flex flex-1 min-h-[420px] bg-[#070D18] rounded-2xl overflow-hidden border border-slate-800/80 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/20 transition">
                {/* Gutter */}
                <div
                  ref={gutterRef}
                  className="select-none py-4 px-2.5 bg-[#050912] text-slate-600 font-mono text-xs text-right border-r border-slate-800/70 shrink-0 w-11 overflow-hidden"
                >
                  {lineNumbers.map(n => (
                    <div key={n} className="leading-6">{n}</div>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={18}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  onScroll={handleEditorScroll}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-slate-100 font-mono text-xs sm:text-[13px] p-4 leading-6 focus:outline-none resize-none selection:bg-purple-600/30 overflow-y-auto"
                  spellCheck="false"
                  placeholder="// Write your code here..."
                />
              </div>

              {/* Editor Bottom Action Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <span>Tab = 4 spaces</span>
                  <span>·</span>
                  <button
                    onClick={() => {
                      setActiveTab('testcases');
                      setTestCaseMode(testCaseMode === 'custom' ? 'sample' : 'custom');
                    }}
                    className="text-purple-400 hover:text-purple-300 underline font-bold"
                  >
                    {testCaseMode === 'custom' ? 'Mode: Custom Input' : 'Try Custom Input'}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 justify-end flex-wrap">
                  {/* Run Code Button */}
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 border border-slate-700"
                    title={testCaseMode === 'custom' ? 'Run with your custom testcase' : 'Run against visible sample test cases'}
                  >
                    <Play className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isRunning ? 'Running...' : testCaseMode === 'custom' ? 'Run Custom' : 'Run Code'}</span>
                  </button>

                  {/* Submit Code Button */}
                  <button
                    onClick={handleSubmitCode}
                    disabled={isRunning || isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                    title="Evaluate visible + 5 hidden edge cases"
                  >
                    {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isSubmitting ? 'Evaluating...' : 'Submit Code'}</span>
                  </button>

                  {/* Next Challenge Button (ACTIVATES WHEN ALL VISIBLE + HIDDEN PASSED ON SUBMIT) */}
                  <button
                    onClick={handleNextQuestion}
                    disabled={!allTestsPassed || loading}
                    className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center gap-2 transition shadow-md ${
                      allTestsPassed
                        ? 'bg-gradient-to-r from-emerald-500 to-[#7C3AED] hover:from-emerald-600 hover:to-[#6D28D9] text-white shadow-emerald-500/20 cursor-pointer animate-pulse'
                        : 'bg-slate-900/80 text-slate-600 border border-slate-800 cursor-not-allowed opacity-60'
                    }`}
                    title={allTestsPassed ? 'Next challenge is unlocked!' : 'Pass all visible and 5 hidden edge cases on Submit to unlock'}
                  >
                    {allTestsPassed ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>Next Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ── Technical History Slide-Over Panel ─────────────────── */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative ml-auto w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="h-16 border-b border-[#EAEBF4] px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-[#7C3AED]" />
                <h2 className="font-bold text-slate-900 font-outfit text-base">Technical Practice History</h2>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#7C3AED]" />
                  <p className="text-sm font-medium">Loading history…</p>
                </div>
              ) : !historyData || historyData.submissions?.length === 0 ? (
                <div className="text-center py-20 space-y-2">
                  <History className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">No submissions yet</p>
                  <p className="text-xs text-slate-400">Submit code or MCQ answers to see your history here.</p>
                </div>
              ) : (
                <>
                  {/* Per-language stats */}
                  {historyData.langStats?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">By Language</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {historyData.langStats.map(ls => (
                          <div key={ls.language} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                            <div className="text-sm font-black text-slate-800 font-outfit">{ls.language}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{ls.total} submitted · {ls.passed} passed</div>
                            <div className={`text-xs font-bold mt-1 ${ls.avgScore >= 60 ? 'text-emerald-700' : 'text-rose-600'}`}>
                              Avg {ls.avgScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submission Timeline</h4>
                    {historyData.submissions.map(s => {
                      const isExpanded = expandedHistoryId === s.submissionId;
                      return (
                        <div key={s.submissionId} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedHistoryId(isExpanded ? null : s.submissionId)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                                s.status === 'Passed' || s.isCorrect
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : s.status === 'Partial'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}>
                                {s.score}%
                              </div>
                              <div className="text-left min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{s.questionTitle}</div>
                                <div className="text-[11px] text-slate-500">
                                  {s.language ? `${s.language} · ` : ''}{s.type === 'code' ? 'Code' : 'MCQ'} · {new Date(s.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                s.status === 'Passed' || s.isCorrect
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : s.status === 'Partial'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}>
                                {s.status || (s.isCorrect ? 'Passed' : 'Failed')}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {isExpanded && s.type === 'code' && s.passCount !== null && (
                            <div className="px-4 pb-3 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50 space-y-1">
                              <div>
                                {s.passCount}/{s.totalTests} test cases passed
                                {s.difficulty && <span className="ml-2 text-slate-400">· {s.difficulty}</span>}
                              </div>
                              {s.totalHidden ? (
                                <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-purple-600" />
                                  <span>{s.hiddenPassCount || 0}/{s.totalHidden} hidden edge cases passed</span>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
