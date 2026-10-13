import React, { useState, useEffect } from 'react';
import { Mic, Send, Sparkles, CheckCircle2, RefreshCw, Menu, Bot, Award, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';

export default function HRInterview() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [hrQuestions, setHrQuestions] = useState([]);
  const [stats, setStats] = useState({ hrScore: 0, mockInterviews: 0 });

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

  const loadQuestions = async (round, forceGenerate = false) => {
    setIsLoadingQuestions(true);
    setFeedbackResult(null);
    setUserAnswer('');
    try {
      const res = await API.getHRQuestions(round, forceGenerate);
      if (res?.questions && res.questions.length > 0) {
        setHrQuestions(res.questions.map(q => ({
          id: q.id || q.questionId || `hr_${Date.now()}`,
          title: q.title || q.category || 'HR Question',
          question: q.title || q.question || 'Tell me about your professional background and aspirations.',
          category: q.category || 'Behavioral',
          tip: q.tip || 'Use the STAR method: Situation, Task, Action, Result.'
        })));
        setQuestionIndex(0);
      }
    } catch (err) {
      console.error('HR questions error:', err.message);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchStats();
    loadQuestions(currentRound, false);
  }, [currentRound]);

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

      if (res?.evaluation) {
        setFeedbackResult(res.evaluation);
      } else if (res) {
        setFeedbackResult(res);
      }
      if (res?.updatedStats) {
        setStats(res.updatedStats);
      }
    } catch (err) {
      console.error('HR evaluation error:', err.message);
      alert(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedbackResult(null);
    setUserAnswer('');
    if (questionIndex + 1 < hrQuestions.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setQuestionIndex(0);
    }
  };

  const roundTitles = {
    1: 'Behavioral & Core Introductions',
    2: 'Technical & Project Deep-Dive',
    3: 'Situational & Team Problem Solving',
    4: 'Leadership & Culture Fit'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">AI HR Mock Interview</h1>
              <p className="text-xs text-slate-500">Real-time behavioral response analysis and interview feedback</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              HR Score: {stats.hrScore ?? 0}% ({stats.mockInterviews || 0} evaluated)
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Round Indicator & Selector */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">
                  Round {currentRound} of 4: {roundTitles[currentRound]}
                </h3>
                <p className="text-xs text-slate-500">
                  Question {hrQuestions.length > 0 ? questionIndex + 1 : 0} of {hrQuestions.length}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4].map(rnd => (
                <button
                  key={rnd}
                  onClick={() => setCurrentRound(rnd)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentRound === rnd ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Round {rnd}
                </button>
              ))}

              <button
                onClick={() => loadQuestions(currentRound, true)}
                disabled={isLoadingQuestions}
                className="px-3.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-100 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{isLoadingQuestions ? 'Generating...' : 'New Questions'}</span>
              </button>
            </div>
          </div>

          {/* HR INTERVIEW ROUND & FEEDBACK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Pane: AI Bot Prompt & Answer Box */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              
              {isLoadingQuestions ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                  <div className="text-sm font-bold text-slate-700">Generating Tailored HR Questions...</div>
                  <div className="text-xs text-slate-400">Personalizing for Round {currentRound}</div>
                </div>
              ) : hrQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 py-16">
                  <Bot className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-medium">No HR questions loaded.</p>
                  <button
                    onClick={() => loadQuestions(currentRound, true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    Generate AI Questions
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {/* Bot Graphic Card */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-tr from-blue-50 to-purple-50 border border-blue-100/80">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {hrQuestions[questionIndex]?.category || 'Interview Question'}
                          </span>
                          <span className="text-xs text-slate-400">Interviewer</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit leading-relaxed">
                          "{hrQuestions[questionIndex]?.question}"
                        </h3>
                        {hrQuestions[questionIndex]?.tip && (
                          <p className="text-xs text-slate-500 italic">
                            💡 Tip: {hrQuestions[questionIndex].tip}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* User Text Answer Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Your Answer</label>
                        <span className="text-xs text-slate-400 font-mono">{userAnswer.length} chars</span>
                      </div>
                      <textarea
                        rows={6}
                        value={userAnswer}
                        onChange={e => setUserAnswer(e.target.value)}
                        placeholder="Type your response clearly using the STAR framework (Situation, Task, Action, Result)..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-normal text-sm text-slate-800 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                    >
                      Skip / Next Question
                    </button>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Evaluating Response...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Pane: AI Evaluation Feedback Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 font-outfit text-base">Performance Evaluation</h3>
                <span className="text-xs text-slate-400 font-mono">Real-time Analysis</span>
              </div>

              {feedbackResult ? (
                <div className="space-y-6">
                  {/* Overall Score Badge */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Overall Performance</div>
                      <div className="text-2xl font-black text-slate-900 font-outfit mt-0.5">
                        {feedbackResult.overallScore}/100
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Competency Score Metrics */}
                  {feedbackResult.scores && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Competency Breakdown</div>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(feedbackResult.scores).map(([metric, val]) => (
                          <div key={metric} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between text-xs font-bold text-slate-600 capitalize">
                              <span>{metric}</span>
                              <span className="text-purple-600">{val}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${val}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Constructive AI Feedback */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Constructive Feedback</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feedbackResult.feedback}
                    </p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow"
                  >
                    <span>Proceed to Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3 py-16">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Bot className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Your AI assessment report will appear here.</p>
                  <p className="text-xs text-slate-400 text-center max-w-xs">
                    Type your answer to the interviewer's question and click "Submit Answer" to get detailed feedback.
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 text-center pt-2">
                Evaluations contribute directly to your Placement Readiness Score.
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
