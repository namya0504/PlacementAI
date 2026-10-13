import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, CheckCircle2, XCircle, AlertTriangle, HelpCircle,
  ArrowRight, ArrowLeft, Bookmark, Menu, Award, Sparkles,
  RefreshCw, LogOut, Check, ChevronDown, Filter, RotateCcw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Aptitude() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Stats & Progress
  const [aptitudeStats, setAptitudeStats] = useState({
    aptitudeScore: 0,
    testsCompleted: 0,
    testsPassed: 0,
    passedStages: [],
    currentStage: 'beginner',
    passThreshold: 60
  });

  // Test Selection State
  const [selectedCategory, setSelectedCategory] = useState('Quantitative');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Active Test State
  const [testActive, setTestActive] = useState(false);
  const [currentTest, setCurrentTest] = useState(null); // { testId, category, stage, totalQuestions, timeLimitSeconds, questions, expiresAt }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // in seconds
  const [userAnswers, setUserAnswers] = useState({}); // { [index]: selectedOptionIndex }
  const [markedQuestions, setMarkedQuestions] = useState({}); // { [index]: boolean }

  // Result & Review State
  const [testResult, setTestResult] = useState(null); // Full result payload from server
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'wrong' | 'unanswered'

  // Modals
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);

  // Fetch verified stats from backend
  const fetchStats = async () => {
    try {
      const res = await API.getAptitudeStats();
      if (res) {
        setAptitudeStats({
          aptitudeScore: res.aptitudeScore ?? 0,
          testsCompleted: res.testsCompleted ?? 0,
          testsPassed: res.testsPassed ?? 0,
          passedStages: res.passedStages ?? [],
          currentStage: res.currentStage || 'beginner',
          passThreshold: res.passThreshold || 60
        });
      }
    } catch (e) {
      console.warn('Aptitude stats fetch warning:', e.message);
    }
  };

  // Check for any active in-progress test on page load / refresh
  const checkActiveTest = async () => {
    try {
      const active = await API.getActiveAptitudeTest();
      if (active && active.testId && Array.isArray(active.questions) && active.questions.length > 0) {
        setCurrentTest(active);
        setSelectedCategory(active.category || 'Quantitative');
        setTestActive(true);
        const remaining = Math.max(0, Math.floor((new Date(active.expiresAt).getTime() - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
    } catch (err) {
      // No active test or session expired
    }
  };

  useEffect(() => {
    fetchStats();
    checkActiveTest();
  }, []);

  // Background tab resilient countdown timer based on server expiresAt
  useEffect(() => {
    let timer;
    if (testActive && currentTest?.expiresAt && !testResult) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((new Date(currentTest.expiresAt).getTime() - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testActive, currentTest, testResult]);

  const formatTime = (seconds) => {
    const safeSecs = Math.max(0, Number(seconds) || 0);
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start a fresh, non-repeating test
  const startTest = async (category = selectedCategory, stageOverride = null) => {
    setLoading(true);
    setErrorMessage('');
    setTestResult(null);
    setUserAnswers({});
    setMarkedQuestions({});
    setCurrentQuestionIndex(0);
    setReviewFilter('all');

    const stage = stageOverride || aptitudeStats.currentStage || 'beginner';

    try {
      const res = await API.startAptitudeTest({
        category,
        stage,
        questionCount: selectedQuestionCount
      });

      if (res && res.testId && Array.isArray(res.questions) && res.questions.length > 0) {
        setCurrentTest(res);
        setSelectedCategory(category);
        setTestActive(true);
        const initialSeconds = res.timeLimitSeconds || (res.questions.length * 120);
        setTimeLeft(initialSeconds);
      } else {
        throw new Error("Failed to initialize test questions. Please try again.");
      }
    } catch (err) {
      console.error('Start aptitude test error:', err);
      setErrorMessage(err.message || "Couldn't generate your test right now. Please try again.");
      setTestActive(false);
    } finally {
      setLoading(false);
    }
  };

  // Option Selection
  const handleSelectOption = (optIndex) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIndex }));
  };

  // Mark for review toggle
  const toggleMark = (index) => {
    setMarkedQuestions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Auto-submit when time runs out
  const handleAutoSubmit = async () => {
    if (submitting || testResult) return;
    await executeSubmission();
  };

  // Manual submit trigger
  const handleManualSubmit = () => {
    const totalQ = currentTest?.questions?.length || 0;
    const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== undefined && userAnswers[k] !== null).length;
    const markedCount = Object.values(markedQuestions).filter(Boolean).length;

    if (answeredCount < totalQ || markedCount > 0) {
      setShowSubmitConfirmModal(true);
    } else {
      executeSubmission();
    }
  };

  // Execute submission to backend (Server-side grading)
  const executeSubmission = async () => {
    if (!currentTest?.testId || submitting) return;
    setSubmitting(true);
    setErrorMessage('');
    setShowSubmitConfirmModal(false);

    try {
      const res = await API.submitAptitudeTest({
        testId: currentTest.testId,
        answers: userAnswers
      });

      if (res && typeof res.accuracy === 'number') {
        setTestResult(res);
        await fetchStats();
      } else {
        throw new Error('Invalid test grading received from server.');
      }
    } catch (err) {
      console.error('Submit aptitude test error:', err);
      setErrorMessage(err.message || 'Failed to submit test. Your answers are preserved. Please click retry.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quit Test
  const handleQuitTest = async () => {
    setShowQuitModal(false);
    if (currentTest?.testId) {
      try {
        await API.abandonAptitudeTest({ testId: currentTest.testId });
      } catch (e) {
        // Ignore
      }
    }
    setTestActive(false);
    setCurrentTest(null);
    setTestResult(null);
    setUserAnswers({});
    setMarkedQuestions({});
    await fetchStats();
  };

  // Stage roadmap definitions
  const stages = [
    { id: 'beginner', name: 'Beginner', level: 1, desc: 'Core fundamentals & straightforward formulas' },
    { id: 'intermediate', name: 'Intermediate', level: 2, desc: 'Multi-step logic & standard placement patterns' },
    { id: 'advanced', name: 'Advanced', level: 3, desc: 'Speed tricks, complex word problems & tricky series' },
    { id: 'mock-expert', name: 'Mock Test Expert', level: 4, desc: 'Comprehensive full-length company-style mocks' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === aptitudeStats.currentStage);
  const currentStageNum = currentStageIndex !== -1 ? currentStageIndex + 1 : 1;

  // Filter questions on the review screen
  const getFilteredReviewQuestions = () => {
    if (!testResult?.perQuestionResults) return [];
    if (reviewFilter === 'wrong') {
      return testResult.perQuestionResults.filter(q => !q.isCorrect && !q.isUnanswered);
    }
    if (reviewFilter === 'unanswered') {
      return testResult.perQuestionResults.filter(q => q.isUnanswered);
    }
    return testResult.perQuestionResults;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Aptitude Preparation</h1>
              <p className="text-xs text-slate-500">AI-Powered adaptive questions in Quant, Reasoning, and Verbal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Aptitude Score: {aptitudeStats.aptitudeScore}%
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* ROADMAP & SELECTION SCREEN (When no test is active and no result is showing) */}
          {!testActive && !testResult && (
            <div className="space-y-8">
              
              {/* Error banner if generation failed */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button onClick={() => setErrorMessage('')} className="font-bold underline text-red-800">Dismiss</button>
                </div>
              )}

              {/* Verified Aptitude Roadmap Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Your Aptitude Roadmap</h3>
                    <p className="text-xs text-slate-500">
                      Completed: {aptitudeStats.testsCompleted} tests taken ({aptitudeStats.testsPassed} passed)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Stage {currentStageNum} of 4 ({stages.find(s => s.id === aptitudeStats.currentStage)?.name || 'Beginner'})
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stages.map((st, i) => {
                    const isPassed = aptitudeStats.passedStages.includes(st.id);
                    const isCurrent = aptitudeStats.currentStage === st.id;
                    const isLocked = !isPassed && !isCurrent;

                    let bgClass = 'bg-slate-100 text-slate-400 border-slate-200';
                    let statusLabel = 'Locked (Pass previous)';
                    if (isPassed) {
                      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm';
                      statusLabel = 'Completed ✓';
                    } else if (isCurrent) {
                      bgClass = 'bg-blue-600 text-white border-blue-600 shadow-md';
                      statusLabel = 'Current Stage';
                    }

                    return (
                      <div key={st.id} className={`p-4 rounded-xl border text-center font-bold text-xs transition ${bgClass}`}>
                        <div className="font-outfit text-sm">{st.name}</div>
                        <div className="text-[10px] opacity-90 mt-1 font-medium">{statusLabel}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-500 italic pt-1">
                  * Note: A stage is marked as Completed only when you pass a test with at least {aptitudeStats.passThreshold}% accuracy.
                </div>
              </div>

              {/* Test Configuration Selector */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 font-outfit text-base">Test Sizing & Timing</h4>
                    <p className="text-xs text-slate-500">Choose the number of questions. The timer scales automatically (2 mins/question).</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Questions:</span>
                    {[10, 15, 20].map(count => (
                      <button
                        key={count}
                        onClick={() => setSelectedQuestionCount(count)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          selectedQuestionCount === count
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {count} Qs ({count * 2} mins)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories & Tracks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Quantitative Aptitude',
                    category: 'Quantitative',
                    desc: 'Percentages, Profit & Loss, Speed & Distance, Algebra, Time & Work, Interest',
                    badge: 'Quant'
                  },
                  {
                    title: 'Logical Reasoning',
                    category: 'Logical Reasoning',
                    desc: 'Blood Relations, Number Series, Syllogisms, Coding-Decoding, Seating Arrangement',
                    badge: 'Reasoning'
                  },
                  {
                    title: 'Verbal Ability',
                    category: 'Verbal Ability',
                    desc: 'Synonyms, Antonyms, Reading Comprehension, Grammar, Sentence Correction',
                    badge: 'Verbal'
                  }
                ].map((tp) => (
                  <div key={tp.category} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between hover:border-blue-300 transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 font-outfit text-base">{tp.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {tp.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{tp.desc}</p>
                    </div>

                    <button
                      onClick={() => startTest(tp.category)}
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {loading && selectedCategory === tp.category ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Preparing Assessment Test...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Start {tp.category} Test</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ACTIVE TEST SCREEN */}
          {testActive && currentTest && !testResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Question Screen Pane */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {/* Question Header & Timer */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {currentTest.questions[currentQuestionIndex]?.topic || currentTest.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {currentTest.stage}
                    </span>
                  </div>

                  <div className={`flex items-center gap-2 font-mono font-bold text-sm px-3 py-1.5 rounded-xl border ${
                    timeLeft < 180 ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">
                    Question {currentQuestionIndex + 1} of {currentTest.questions.length}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-outfit">
                    {currentTest.questions[currentQuestionIndex]?.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {(currentTest.questions[currentQuestionIndex]?.options || []).map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-4 rounded-xl border cursor-pointer font-medium text-sm transition flex items-center gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/90 font-bold text-blue-900 shadow-sm ring-1 ring-blue-600'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="leading-snug">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => toggleMark(currentQuestionIndex)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                      markedQuestions[currentQuestionIndex]
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {markedQuestions[currentQuestionIndex] ? 'Marked for Review' : 'Mark for Review'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs disabled:opacity-40 hover:bg-slate-50 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Previous
                    </button>

                    {currentQuestionIndex < currentTest.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                      </button>
                    ) : (
                      <button
                        onClick={handleManualSubmit}
                        disabled={submitting}
                        className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Question Navigation Palette (ONLY visible during active test) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 font-outfit text-sm">Question Palette</h4>
                    <p className="text-[11px] text-slate-400">Total: {currentTest.questions.length} questions</p>
                  </div>
                  <button
                    onClick={() => setShowQuitModal(true)}
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Quit Test
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
                  {currentTest.questions.map((_, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
                    const isMarked = markedQuestions[idx];
                    const isCurrent = currentQuestionIndex === idx;

                    let bg = 'bg-slate-100 text-slate-700 border-slate-200';
                    if (isCurrent) bg = 'ring-2 ring-blue-600 bg-blue-50 text-blue-700 font-black border-blue-400';
                    else if (isMarked) bg = 'bg-amber-100 text-amber-800 font-bold border-amber-300';
                    else if (isAnswered) bg = 'bg-emerald-600 text-white font-bold border-emerald-600';

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-xl text-xs flex items-center justify-center transition border ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                      <span>Answered</span>
                    </div>
                    <span className="font-bold">{Object.values(userAnswers).filter(v => v !== undefined && v !== null).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <span>Marked for Review</span>
                    </div>
                    <span className="font-bold">{Object.values(markedQuestions).filter(Boolean).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <span>Unanswered</span>
                    </div>
                    <span className="font-bold">
                      {currentTest.questions.length - Object.values(userAnswers).filter(v => v !== undefined && v !== null).length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleManualSubmit}
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Test Now'}
                </button>
              </div>

            </div>
          )}

          {/* COMPREHENSIVE RESULT & REVIEW SCREEN (No Question Palette or Quit button here!) */}
          {testResult && (
            <div className="space-y-8 max-w-5xl mx-auto w-full">
              
              {/* Pass / Fail Banner */}
              <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-3 ${
                testResult.passed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                  : 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
              }`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
                  testResult.passed ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-rose-100 border-rose-300 text-rose-700'
                }`}>
                  {testResult.passed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">
                    {testResult.passed ? '🎉 Test Passed!' : '❌ Not Passed'}
                  </h2>
                  <p className="text-xs sm:text-sm mt-1 max-w-md mx-auto opacity-90">
                    {testResult.passed
                      ? `Great job! You achieved ${testResult.accuracy}% (Requirement: ${testResult.passThreshold}%). Stage progress has been recorded!`
                      : `You achieved ${testResult.accuracy}%. You need at least ${testResult.passThreshold}% to pass and advance to the next stage.`}
                  </p>
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className="text-2xl font-black text-slate-900 font-outfit">
                    {testResult.correctAnswers}/{testResult.totalQuestions}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Score</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className={`text-2xl font-black font-outfit ${testResult.passed ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {testResult.accuracy}%
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Accuracy</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className="text-2xl font-black text-emerald-600 font-outfit">
                    +{testResult.xpGained} XP
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">XP Earned</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className="text-2xl font-black text-slate-700 font-outfit">
                    {formatTime(testResult.timeTakenSeconds)}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Time Taken</div>
                </div>
              </div>

              {/* Performance Breakdown & Weakest Topic */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 font-outfit text-base">Topic-wise Performance</h4>
                  {testResult.weakestTopic && testResult.weakestTopic !== 'None' && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      Focus Area: {testResult.weakestTopic}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(testResult.topicBreakdown || []).map((tb, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 truncate">{tb.topic}</span>
                        <span className={tb.accuracy >= 60 ? 'text-emerald-700' : 'text-amber-700'}>
                          {tb.accuracy}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {tb.correct} of {tb.total} correct ({tb.wrong} wrong, {tb.unanswered} unanswered)
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${tb.accuracy >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${tb.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                <button
                  onClick={() => startTest(testResult.category)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Another Test (New Questions)</span>
                </button>

                <button
                  onClick={() => {
                    setTestActive(false);
                    setTestResult(null);
                    setCurrentTest(null);
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition"
                >
                  Back to Roadmap
                </button>
              </div>

              {/* Question-by-Question Review Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Question-by-Question Review</h3>
                    <p className="text-xs text-slate-500">Review every answer and step-by-step mathematical explanation</p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({testResult.totalQuestions})
                    </button>
                    <button
                      onClick={() => setReviewFilter('wrong')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        reviewFilter === 'wrong' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Wrong only ({testResult.wrongAnswers})
                    </button>
                    <button
                      onClick={() => setReviewFilter('unanswered')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        reviewFilter === 'unanswered' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Not answered ({testResult.unanswered})
                    </button>
                  </div>
                </div>

                {/* Review Questions List */}
                <div className="space-y-6">
                  {getFilteredReviewQuestions().map((item) => (
                    <div
                      key={item.questionIndex}
                      className={`p-5 rounded-2xl border space-y-4 ${
                        item.isCorrect
                          ? 'bg-slate-50/50 border-slate-200'
                          : item.isUnanswered
                          ? 'bg-amber-50/30 border-amber-200'
                          : 'bg-rose-50/30 border-rose-200'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">
                            Question {item.questionIndex}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/60 text-slate-600">
                            {item.topic}
                          </span>
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          item.isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.isUnanswered
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </>
                          ) : item.isUnanswered ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" /> Not Answered
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </>
                          )}
                        </span>
                      </div>

                      {/* Question Text */}
                      <div className="font-bold text-slate-900 text-sm leading-relaxed">
                        {item.question}
                      </div>

                      {/* Options with color-coded results */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {item.options.map((opt, optIdx) => {
                          const isCorrectOpt = optIdx === item.correctOptionIndex;
                          const isSelectedOpt = optIdx === item.selectedOptionIndex;

                          let optStyle = 'bg-white border-slate-200 text-slate-700';
                          if (isCorrectOpt) {
                            optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                          } else if (isSelectedOpt && !isCorrectOpt) {
                            optStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-500';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${optStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                  isCorrectOpt ? 'bg-emerald-600 text-white' : isSelectedOpt ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isCorrectOpt && (
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider shrink-0">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isSelectedOpt && !isCorrectOpt && (
                                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider shrink-0">
                                  ✗ Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Step-by-Step Solution / Explanation */}
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-blue-900">
                          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>Step-by-Step Solution:</span>
                        </div>
                        <div className="leading-relaxed whitespace-pre-wrap text-[11px] text-blue-900">
                          {item.explanation}
                        </div>
                      </div>

                    </div>
                  ))}

                  {getFilteredReviewQuestions().length === 0 && (
                    <div className="text-center py-10 text-xs text-slate-500 italic">
                      No questions match the current filter ({reviewFilter}).
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Confirmation Modal before Submit */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 font-outfit">Submit Test?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              You have unanswered questions or marked questions. Are you sure you want to finalize your submission? Unanswered questions will count as incorrect.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Keep Testing
              </button>
              <button
                onClick={executeSubmission}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Quit Test */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 font-outfit">Quit Test Session?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to quit? This session will be abandoned and your progress will not be saved.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowQuitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Resume Test
              </button>
              <button
                onClick={handleQuitTest}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Quit Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
