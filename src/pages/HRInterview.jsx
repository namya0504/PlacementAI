import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  History,
  Lock,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  RotateCcw,
  X,
  RefreshCw,
  FileText,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useSidebar } from '../context/SidebarContext';
import PreInterviewSetup from '../features/interview/PreInterviewSetup';
import LiveChatInterview from '../features/interview/LiveChatInterview';
import InterviewReport from '../features/interview/InterviewReport';

const ROUND_TITLES = {
  1: 'Round 1: Behavioral',
  2: 'Round 2: Technical',
  3: 'Round 3: Situational',
  4: 'Round 4: Leadership'
};

const ROUND_SUBTITLES = {
  1: 'Past experience & STAR framework',
  2: 'Technical architecture & projects',
  3: 'Workplace scenarios & trade-offs',
  4: 'Ownership, mentoring & vision'
};

export default function HRInterview() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const { isCollapsed } = useSidebar();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // 'setup' | 'live' | 'report'
  const [interviewMode, setInterviewMode] = useState('setup');
  const [currentRound, setCurrentRound] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [roundProgress, setRoundProgress] = useState({});

  // Active multi-round interview session
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionState, setSessionState] = useState(null);
  const [isStartingSession, setIsStartingSession] = useState(false);

  // Final evaluation report
  const [finalReport, setFinalReport] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('sessions'); // 'sessions' | 'answers'
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load user profile & past round progress
  const fetchUserProfile = async () => {
    try {
      const res = await API.getProfile();
      const profile = res?.data?.user || res?.user || res?.data || res;
      if (profile && typeof profile === 'object' && !Array.isArray(profile)) {
        setUserProfile(profile);
      }
    } catch (e) {
      console.warn('Profile fetch notice in HRInterview:', e.message);
    }
  };

  const fetchRoundProgress = async () => {
    try {
      const res = await API.getHRProgress();
      if (res?.progress) setRoundProgress(res.progress);
    } catch (e) {
      console.warn('HR progress fetch notice:', e.message);
    }
  };

  // Restore active interview session if one exists in sessionStorage
  useEffect(() => {
    const restoreSession = async () => {
      const savedId = sessionStorage.getItem('placementai_hr_session_id');
      if (!savedId) return;

      try {
        const res = await API.getInterviewSessionState(savedId);
        const session = res?.session || (res?.sessionId ? res : null);
        if (session && session.sessionId) {
          setActiveSessionId(session.sessionId);
          setSessionState(session);
          setCurrentRound(session.currentRound || 1);

          if (session.status === 'COMPLETED' || session.status === 'REPORT') {
            const report = session.finalReport || (await API.getInterviewReport(session.sessionId));
            setFinalReport(report?.report || report);
            setInterviewMode('report');
          } else {
            setInterviewMode('live');
          }
        } else {
          sessionStorage.removeItem('placementai_hr_session_id');
        }
      } catch (err) {
        console.warn('Could not restore previous interview session:', err.message);
        sessionStorage.removeItem('placementai_hr_session_id');
      }
    };

    restoreSession();
    fetchUserProfile();
    fetchRoundProgress();
  }, []);

  // Start new interview session
  const handleStartSession = async (config) => {
    setIsStartingSession(true);
    try {
      const payload = {
        targetRole: config.targetRole,
        experienceLevel: config.experienceLevel || 'Fresher',
        keySkills: config.skills || config.keySkills || [],
        jobDescription: config.jobDescription || '',
        candidateProfile: config.candidateProfile || config.resumeData?.profile || config.resumeData || null,
        repoInsights: config.repoInsights || config.githubData || null,
        micEnabled: Boolean(config.micEnabled)
      };

      const res = await API.startInterviewSession(payload);
      const session = res?.session || (res?.sessionId ? res : null);
      if (session && session.sessionId) {
        setActiveSessionId(session.sessionId);
        setSessionState(session);
        setCurrentRound(session.currentRound || 1);
        sessionStorage.setItem('placementai_hr_session_id', session.sessionId);
        setInterviewMode('live');
        toast.success(`Interview started! Round 1: Behavioral with Sarah Vance.`);
      } else {
        throw new Error(res?.message || 'Could not initialize interview session.');
      }
    } catch (err) {
      console.error('Start session error:', err);
      toast.error(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setIsStartingSession(false);
    }
  };

  // Session state updated by LiveChatInterview
  const handleSessionUpdated = (updatedSession) => {
    if (!updatedSession) return;
    const session = updatedSession?.session || (updatedSession?.sessionId ? updatedSession : null) || updatedSession;
    setSessionState(session);
    if (session.currentRound) {
      setCurrentRound(session.currentRound);
    }
    if (session.status === 'COMPLETED' || session.status === 'REPORT') {
      handleEndSession();
    }
  };

  // Advance round
  const handleTransitionRound = async () => {
    if (!activeSessionId) return;
    try {
      const res = await API.transitionInterviewRound(activeSessionId);
      const session = res?.session || (res?.sessionId ? res : null);
      if (session && session.sessionId) {
        if (session.status === 'COMPLETED' || session.status === 'REPORT') {
          await handleEndSession();
        } else {
          setSessionState(session);
          setCurrentRound(session.currentRound);
          toast.success(`Welcome to Round ${session.currentRound}!`);
        }
      }
    } catch (err) {
      console.error('Transition round error:', err);
      toast.error(err.message || 'Could not advance to next round.');
    }
  };

  // End interview session and retrieve full report
  const handleEndSession = async () => {
    if (!activeSessionId) return;
    setIsLoadingReport(true);
    try {
      const res = await API.endInterviewSession(activeSessionId);
      const report = res?.report || res?.finalReport || (res?.session?.finalReport) || res;
      if (report && (report.overallScore || report.verdict || report.roundBreakdown)) {
        setFinalReport(report);
      } else {
        const repRes = await API.getInterviewReport(activeSessionId);
        const fetchedReport = repRes?.report || repRes?.finalReport || repRes;
        setFinalReport(fetchedReport);
      }
      setInterviewMode('report');
      sessionStorage.removeItem('placementai_hr_session_id');
      fetchRoundProgress();
      toast.success('Interview concluded! Here is your comprehensive evaluation.');
    } catch (err) {
      console.error('End session error:', err);
      toast.error(err.message || 'Could not generate final evaluation report.');
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Retake interview
  const handleRetakeSession = () => {
    sessionStorage.removeItem('placementai_hr_session_id');
    setActiveSessionId(null);
    setSessionState(null);
    setFinalReport(null);
    setCurrentRound(1);
    setInterviewMode('setup');
  };

  // Practice specific round from report
  const handlePracticeRound = (roundNum) => {
    sessionStorage.removeItem('placementai_hr_session_id');
    setActiveSessionId(null);
    setSessionState(null);
    setFinalReport(null);
    setCurrentRound(roundNum);
    setInterviewMode('setup');
  };

  // Load history data
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

  // Load a past session's report directly from history
  const handleViewHistoricalSession = async (sessionId) => {
    setHistoryLoading(true);
    try {
      const res = await API.getInterviewReport(sessionId);
      if (res?.report) {
        setFinalReport(res.report);
        setShowHistory(false);
        setInterviewMode('report');
      } else {
        toast.error('Could not find report for this session.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load session report.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Resume an in-progress historical session
  const handleResumeHistoricalSession = async (sessionId) => {
    try {
      const res = await API.getInterviewSessionState(sessionId);
      if (res?.session) {
        setActiveSessionId(sessionId);
        setSessionState(res.session);
        setCurrentRound(res.session.currentRound || 1);
        sessionStorage.setItem('placementai_hr_session_id', sessionId);
        setShowHistory(false);
        setInterviewMode('live');
        toast.success(`Resumed session for ${res.session.targetRole}!`);
      }
    } catch (err) {
      toast.error(err.message || 'Could not resume session.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        
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
              <p className="text-xs text-slate-500 hidden sm:block">
                Get real-time feedback on your communication, confidence and skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
              aria-label="View interview history"
            >
              <History className="w-4 h-4 text-[#7C3AED]" />
              <span className="hidden sm:inline">History</span>
            </button>

            {interviewMode === 'live' && sessionState && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-[#7C3AED] border border-purple-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Round {currentRound} of 4</span>
              </span>
            )}
            {interviewMode === 'report' && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Evaluation Completed</span>
              </span>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* ROUND TABS (Persistent across views)                              */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[1, 2, 3, 4].map((rnd) => {
              const isCurrent = currentRound === rnd;
              const isCompleted =
                interviewMode === 'report' ||
                (sessionState?.rounds?.[rnd]?.status === 'COMPLETED') ||
                (interviewMode === 'live' && rnd < currentRound);
              const isLocked =
                interviewMode === 'live'
                  ? rnd > currentRound
                  : interviewMode === 'setup' && rnd > 1 && !roundProgress[rnd - 1]?.cleared;

              return (
                <div
                  key={rnd}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap select-none ${
                    isCurrent
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : isCompleted
                      ? 'bg-purple-50 text-[#7C3AED] border border-purple-100'
                      : isLocked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent'
                      : 'bg-white text-slate-600 border border-[#EAEBF4]'
                  }`}
                  title={ROUND_SUBTITLES[rnd]}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 text-slate-400" />
                  ) : null}
                  <span>{ROUND_TITLES[rnd]}</span>
                </div>
              );
            })}
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 1: PRE-INTERVIEW SETUP SCREEN                                */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {interviewMode === 'setup' && (
            <PreInterviewSetup
              userProfile={userProfile || currentUser}
              onStartInterview={handleStartSession}
              isLoading={isStartingSession}
            />
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 2: LIVE CHAT INTERVIEW SCREEN                                */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {interviewMode === 'live' && sessionState && (
            <LiveChatInterview
              sessionState={sessionState}
              onSessionUpdated={handleSessionUpdated}
              onEndInterview={handleEndSession}
              onTransitionRound={handleTransitionRound}
            />
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 3: COMPREHENSIVE FINAL EVALUATION REPORT                     */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {interviewMode === 'report' && finalReport && (
            <InterviewReport
              reportData={finalReport}
              onRetake={handleRetakeSession}
              onPracticeRound={handlePracticeRound}
              onOpenHistory={handleOpenHistory}
            />
          )}

          {/* Loading Report State */}
          {isLoadingReport && (
            <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-[#EAEBF4] shadow-xs">
              <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Synthesizing Comprehensive Evaluation...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Sarah Vance is analyzing your STAR responses, technical trade-offs, voice telemetry, and GitHub grounding.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* HISTORY DRAWER / MODAL                                            */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {showHistory && (
          <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#7C3AED]" />
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Interview History</h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Close history modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector: Multi-Round Sessions vs Individual Practice */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setHistoryTab('sessions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    historyTab === 'sessions'
                      ? 'bg-purple-100 text-[#7C3AED]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Full Sessions ({historyData?.sessions?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryTab('answers')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    historyTab === 'answers'
                      ? 'bg-purple-100 text-[#7C3AED]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Individual Answers
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {historyLoading ? (
                  <div className="py-16 text-center text-xs text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#7C3AED] mb-2" />
                    Loading past interview records...
                  </div>
                ) : historyTab === 'sessions' ? (
                  historyData?.sessions && historyData.sessions.length > 0 ? (
                    historyData.sessions.map((sess, idx) => (
                      <div
                        key={sess.sessionId || idx}
                        className="p-4 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] hover:border-purple-200 transition space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-900">{sess.targetRole}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{sess.experienceLevel}</span>
                              <span>•</span>
                              <span>
                                {sess.startedAt
                                  ? new Date(sess.startedAt).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : 'Recent'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {sess.overallScore !== null && (
                              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-purple-100 text-[#7C3AED]">
                                {sess.overallScore}/100
                              </span>
                            )}
                            {sess.status === 'IN_PROGRESS' ? (
                              <button
                                type="button"
                                onClick={() => handleResumeHistoricalSession(sess.sessionId)}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
                              >
                                Resume
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleViewHistoricalSession(sess.sessionId)}
                                className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition flex items-center gap-1"
                              >
                                <span>Report</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {sess.verdict && (
                          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Verdict: {sess.verdict}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-xs text-slate-400">
                      No multi-round sessions recorded yet. Start your first interview above!
                    </div>
                  )
                ) : (
                  historyData?.byRound && Object.keys(historyData.byRound).length > 0 ? (
                    Object.entries(historyData.byRound).flatMap(([rnd, answers]) =>
                      answers.map((item, idx) => (
                        <div
                          key={item.interviewId || `${rnd}_${idx}`}
                          className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-[#EAEBF4] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">Round {rnd}: {ROUND_TITLES[rnd]?.split(': ')[1] || 'Practice'}</span>
                            <span className="font-bold text-[#7C3AED]">{item.score || 85}%</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">"{item.questionTitle}"</p>
                          {item.feedback && (
                            <p className="text-[11px] text-slate-500 italic mt-1">
                              💡 {item.feedback}
                            </p>
                          )}
                        </div>
                      ))
                    )
                  ) : (
                    <div className="py-16 text-center text-xs text-slate-400">
                      No individual practice answers recorded yet.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
