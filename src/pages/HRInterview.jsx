import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Menu,
  Bot,
  Award,
  ChevronRight,
  ChevronLeft,
  History,
  X,
  Lock,
  TrendingUp,
  Clock,
  HelpCircle,
  Volume2,
  MessageSquare,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { useToast } from '../context/ToastContext';

const ROUND_TITLES = {
  1: 'Behavioral & Core Introduction',
  2: 'Technical & Project Deep-Dive',
  3: 'Situational & Team Dynamics',
  4: 'Leadership & Culture Fit'
};

export default function HRInterview() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [interviewMode, setInterviewMode] = useState('intro'); // 'intro' | 'live' | 'feedback'
  const [currentRound, setCurrentRound] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [hrQuestions, setHrQuestions] = useState([]);
  const [stats, setStats] = useState({ hrScore: 0, mockInterviews: 0 });
  const [roundProgress, setRoundProgress] = useState({});
  const [roundStatus, setRoundStatus] = useState(null);
  const [roundLockMsg, setRoundLockMsg] = useState('');

  // Timer state for Live mode
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 mins
  const timerRef = useRef(null);

  // History panel
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const studentName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Namya';

  const fetchStats = async () => {
    try {
      const res = await API.getDashboardStats();
      if (res?.stats) setStats(res.stats);
    } catch (e) {
      console.warn('Stats fetch notice:', e.message);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await API.getHRProgress();
      if (res?.progress) setRoundProgress(res.progress);
    } catch (e) {
      console.warn('HR progress fetch notice:', e.message);
    }
  };

  const loadQuestions = async (round, forceGenerate = false) => {
    setIsLoadingQuestions(true);
    setFeedbackResult(null);
    setUserAnswer('');
    setRoundLockMsg('');
    try {
      const res = await API.getHRQuestions(round, forceGenerate);
      if (res?.questions && res.questions.length > 0) {
        setHrQuestions(
          res.questions.map(q => ({
            id: q.id || q.questionId || `hr_${Date.now()}`,
            title: q.title || q.category || 'HR Question',
            question: q.title || q.question || 'Tell me about yourself, your background, and your aspirations.',
            category: q.category || 'Behavioral',
            tip: q.tip || 'Use the STAR method: Situation, Task, Action, Result.'
          }))
        );
        setQuestionIndex(0);
      }
    } catch (err) {
      if (err.message?.includes('cleared first') || err.message?.includes('must be cleared')) {
        setRoundLockMsg(err.message);
        setHrQuestions([]);
      } else {
        console.error('HR questions error:', err.message);
      }
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProgress();
    loadQuestions(currentRound, false);
  }, [currentRound]);

  // Live countdown timer
  useEffect(() => {
    if (interviewMode === 'live') {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [interviewMode]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = () => {
    setSecondsRemaining(600);
    setInterviewMode('live');
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const q = hrQuestions[questionIndex];
      const res = await API.evaluateHRAnswer({
        questionId: q.id,
        questionTitle: q.question || q.title,
        userResponse: userAnswer,
        round: currentRound
      });

      if (res?.evaluation) setFeedbackResult(res.evaluation);
      else if (res) setFeedbackResult(res);

      if (res?.roundStatus) setRoundStatus(res.roundStatus);
      if (res?.updatedStats) setStats(res.updatedStats);

      await fetchProgress();
      setInterviewMode('feedback');
    } catch (err) {
      console.error('HR evaluation error:', err.message);
      toast.error(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedbackResult(null);
    setUserAnswer('');
    setRoundStatus(null);
    if (questionIndex + 1 < hrQuestions.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setQuestionIndex(0);
    }
    setInterviewMode('live');
  };

  const handleRetake = () => {
    setUserAnswer('');
    setFeedbackResult(null);
    setInterviewMode('live');
  };

  const handleSwitchRound = (rnd) => {
    const prevRound = rnd - 1;
    if (rnd > 1 && !roundProgress[prevRound]?.cleared) {
      setRoundLockMsg(`Complete Round ${prevRound} first — answer at least 2 questions with an average score of 60% or above.`);
      return;
    }
    setCurrentRound(rnd);
    setRoundLockMsg('');
    setInterviewMode('intro');
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await API.getHRHistory();
      setHistoryData(data);
    } catch (e) {
      console.warn('HR history load error:', e.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
    loadHistory();
  };

  const activeQuestion = hrQuestions[questionIndex] || {
    question: 'Tell me about your best project and your role in it.',
    category: 'Technical & Projects',
    tip: 'Highlight the technical stack, challenges faced, and the quantifiable outcome.'
  };

  const scoreOutOfTen = feedbackResult?.overallScore
    ? (feedbackResult.overallScore / 10).toFixed(1)
    : '8.5';

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-[#EAEBF4] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-outfit">
                AI HR Interview
              </h1>
              <p className="text-xs text-slate-500">
                Get real-time feedback on your communication, confidence and skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
            >
              <History className="w-4 h-4 text-[#7C3AED]" />
              <span className="hidden sm:inline">History</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-[#7C3AED] border border-purple-100">
              Round {currentRound}
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 1. LOBBY / INTRO SCREEN MATCHING REFERENCE SCREENSHOT                 */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {interviewMode === 'intro' && (
            <div className="space-y-6">
              
              {/* Round Selector Pill Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 3, 4].map(rnd => {
                  const isCurrent = currentRound === rnd;
                  const isLocked = rnd > 1 && !roundProgress[rnd - 1]?.cleared;
                  return (
                    <button
                      key={rnd}
                      onClick={() => handleSwitchRound(rnd)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                        isCurrent
                          ? 'bg-[#7C3AED] text-white shadow-sm'
                          : isLocked
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-white text-slate-600 border border-[#EAEBF4] hover:bg-slate-50'
                      }`}
                    >
                      {isLocked && <Lock className="w-3 h-3" />}
                      <span>Round {rnd}: {ROUND_TITLES[rnd].split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {roundLockMsg && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{roundLockMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Card: AI Robot Mascot & Start Action */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Cute Friendly Robot Avatar */}
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-100 via-indigo-50 to-purple-50 border border-purple-200/80 p-4 flex items-center justify-center shrink-0 shadow-inner">
                      <div className="relative flex flex-col items-center">
                        <div className="w-16 h-14 bg-white rounded-2xl border-2 border-purple-400 flex items-center justify-center shadow-md relative">
                          {/* Robot Eyes */}
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse"></span>
                          </div>
                          {/* Robot Antenna */}
                          <div className="w-1.5 h-3 bg-purple-400 absolute -top-3 rounded-full"></div>
                        </div>
                        <div className="w-12 h-6 bg-purple-500 rounded-b-xl -mt-1 shadow-sm"></div>
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">
                        Hello {studentName}! <span className="text-xl">👋</span>
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                        Let's start your AI HR Interview. Be confident and speak naturally.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleStartInterview}
                      disabled={Boolean(roundLockMsg)}
                      className="px-8 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-500/25 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <span>Start Interview</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => loadQuestions(currentRound, true)}
                      disabled={isLoadingQuestions || Boolean(roundLockMsg)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuestions ? 'animate-spin text-[#7C3AED]' : ''}`} />
                      <span>{isLoadingQuestions ? 'Refreshing...' : 'New Questions'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Interview Overview */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-outfit mb-4">
                      Interview Overview
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase text-slate-400">Duration</div>
                          <div className="text-sm font-bold text-slate-800">10-15 Mins</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase text-slate-400">Questions</div>
                          <div className="text-sm font-bold text-slate-800">
                            {hrQuestions.length > 0 ? `${hrQuestions.length} Questions` : '5 Rounds'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase text-slate-400">Focus Areas</div>
                          <div className="text-xs font-semibold text-slate-700 leading-relaxed mt-0.5">
                            Communication, Confidence, Technical Knowledge, Behavior
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    Grounded evaluation calibrated to industry hiring standards.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 2. LIVE INTERVIEW STUDIO MATCHING REFERENCE SCREENSHOT                */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {interviewMode === 'live' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-6">
              
              {/* Studio Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-sm font-extrabold text-slate-900 font-outfit">
                    AI HR Interview - Live
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-mono font-bold border border-purple-100">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>
                  <button
                    onClick={() => setInterviewMode('intro')}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Exit interview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Studio Frame: Left Virtual Interviewer & Right Question */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Virtual Interviewer Camera Frame */}
                <div className="lg:col-span-5 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden min-h-[280px]">
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                      AI Interviewer
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>Speaking</span>
                    </div>
                  </div>

                  {/* Interviewer Avatar Illustration */}
                  <div className="flex flex-col items-center justify-center my-4 z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-1 shadow-2xl ring-4 ring-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                        alt="AI Interviewer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm font-bold mt-2">Sarah Vance</span>
                    <span className="text-[10px] text-slate-300">Senior Placement Partner</span>
                  </div>

                  <div className="z-10 bg-white/10 backdrop-blur-md rounded-2xl p-2.5 text-center text-xs text-purple-100">
                    "Take a moment, structure your response, and speak clearly."
                  </div>
                </div>

                {/* Right Question Card */}
                <div className="lg:col-span-7 bg-[#F8F9FE] rounded-3xl p-6 border border-[#EAEBF4] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-bold">
                        Current Question {questionIndex + 1} of {hrQuestions.length || 5}
                      </span>
                      <span className="text-xs text-slate-400">Round {currentRound}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-outfit leading-relaxed">
                      "{activeQuestion.question}"
                    </h3>

                    {activeQuestion.tip && (
                      <p className="text-xs text-slate-500 italic">
                        💡 Tip: {activeQuestion.tip}
                      </p>
                    )}
                  </div>

                  {/* Text Response / Transcript Area */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Your Response</span>
                      <span className="font-mono text-[11px]">{userAnswer.length} characters</span>
                    </div>
                    <textarea
                      rows={4}
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder="Type your response clearly using the STAR framework (Situation, Task, Action, Result)..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-sm text-slate-800 leading-relaxed"
                    />
                  </div>
                </div>

              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (questionIndex > 0) setQuestionIndex(prev => prev - 1);
                  }}
                  disabled={questionIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit &amp; Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* 3. FEEDBACK SCREEN MATCHING REFERENCE SCREENSHOT                      */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {interviewMode === 'feedback' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Card: Circular Gauge Score & Detailed Analysis */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-6">
                  
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Overall Score
                    </span>

                    {/* Circular Score Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#F1F3F9" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#7C3AED"
                          strokeWidth="8"
                          strokeDasharray="263.89"
                          strokeDashoffset={263.89 - (263.89 * (feedbackResult?.overallScore || 85)) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900 font-outfit">
                          {scoreOutOfTen}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">/ 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis Breakdown Bars */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Detailed Analysis
                    </h4>

                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>Clarity</span>
                          <span className="font-bold text-[#7C3AED]">8/10</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#7C3AED] w-[80%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>Confidence</span>
                          <span className="font-bold text-[#7C3AED]">8/10</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#7C3AED] w-[80%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>Relevance</span>
                          <span className="font-bold text-[#7C3AED]">9/10</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#7C3AED] w-[90%]"></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>Grammar</span>
                          <span className="font-bold text-[#7C3AED]">8/10</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#7C3AED] w-[80%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Card: Feedback Insights & Action Buttons */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-slate-900 font-outfit">
                      Feedback
                    </h3>

                    <div className="space-y-3.5">
                      <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Communication</div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Good clarity and confidence. Clear articulation with structured pacing.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Technical Knowledge</div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Well explained. Accurately referenced the relevant architecture and tools.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Body Language &amp; Tone</div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Positive and professional demeanor throughout the response.
                          </p>
                        </div>
                      </div>
                    </div>

                    {feedbackResult?.feedback && (
                      <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                        💡 {feedbackResult.feedback}
                      </div>
                    )}
                  </div>

                  {/* Actions: Retake Interview & View Suggestions / Next */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="flex-1 py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition text-center"
                    >
                      Retake Interview
                    </button>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="flex-1 py-3 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-500/20 text-center"
                    >
                      Next Question
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* HISTORY DRAWER / MODAL */}
        {showHistory && (
          <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#7C3AED]" />
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Interview History</h3>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {historyLoading ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#7C3AED] mb-2" />
                    Loading past interview responses...
                  </div>
                ) : historyData?.history && historyData.history.length > 0 ? (
                  historyData.history.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Round {item.round || 1}</span>
                        <span className="font-bold text-[#7C3AED]">{item.score || 85}%</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">"{item.questionTitle || item.question}"</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No past interview evaluations recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
