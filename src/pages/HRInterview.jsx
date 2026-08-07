import React, { useState, useEffect } from 'react';
import { Mic, Send, Sparkles, CheckCircle2, RefreshCw, Menu, Bot, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { evaluateHRAnswer } from '../services/aiService';
import { API } from '../services/api';

export default function HRInterview() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentRound, setCurrentRound] = useState(2);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);

  const [hrQuestions, setHrQuestions] = useState([
    { id: '1', title: 'Career Choice', question: 'Can you tell me why you chose Information Technology as your career?' },
    { id: '2', title: 'Self Introduction', question: 'Tell me about yourself, your academic background, and your key technical achievements.' },
    { id: '3', title: 'Strengths & Weaknesses', question: 'What is your greatest technical strength, and how do you work on improving your weaknesses?' },
    { id: '4', title: 'Conflict Resolution', question: 'Describe a situation where you faced a conflict during a team project and how you resolved it.' }
  ]);

  useEffect(() => {
    API.getHRQuestions(currentRound)
      .then(res => {
        if (res?.questions && res.questions.length > 0) {
          setHrQuestions(res.questions.map(q => ({
            id: q.id || q.questionId || '1',
            title: q.title || q.category || 'HR Question',
            question: q.title || q.question || 'Tell me about your background.'
          })));
        }
      })
      .catch(err => console.warn('HR questions notice:', err.message));
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
      } else {
        const fallbackRes = await evaluateHRAnswer(q, userAnswer);
        setFeedbackResult(fallbackRes);
      }
    } catch (err) {
      const fallbackRes = await evaluateHRAnswer(hrQuestions[questionIndex], userAnswer);
      setFeedbackResult(fallbackRes);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedbackResult(null);
    setUserAnswer('');
    setQuestionIndex((prev) => (prev + 1) % hrQuestions.length);
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
              <p className="text-xs text-slate-500">Practice common & profile-based HR questions with instant AI scoring</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Round Indicator */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">Round 2 of 4</h3>
                <p className="text-xs text-slate-500">Profile-Based HR Questions</p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
              AI Evaluator Active
            </span>
          </div>

          {/* HR INTERVIEW ROUND & FEEDBACK (Screen 11 in Collage) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Pane: AI Bot Prompt & Answer Box */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Bot Avatar Graphic Card */}
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-tr from-blue-50 to-purple-50 border border-blue-100/80">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Interviewer</div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit leading-relaxed">
                      "{hrQuestions[questionIndex].question}"
                    </h3>
                  </div>
                </div>

                {/* User Text/Voice Answer Box */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Your Response</label>
                  <textarea
                    rows={6}
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here or speak clearly..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Tips: Be structured, confident, and provide specific examples.</span>
                    <span>{userAnswer.length} chars</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {isEvaluating ? 'AI Scoring...' : 'Submit Answer for AI Evaluation'}
                </button>
              </div>

            </div>

            {/* Right Pane: AI Feedback Result Card (Matches Screen 11 Right in Collage) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> AI Feedback & Scoring Report
              </h3>

              {feedbackResult ? (
                <div className="space-y-6">
                  {/* Overall Score Badge */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border border-purple-100">
                    <div>
                      <span className="text-xs text-slate-500 font-bold uppercase block">Round Score</span>
                      <span className="text-3xl font-extrabold text-purple-700 font-outfit">{feedbackResult.overallScore}/100</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Good Answer</span>
                  </div>

                  {/* Metrics Bar Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 font-bold">Communication</div>
                      <div className="text-lg font-extrabold text-blue-600">{feedbackResult.scores.communication}/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 font-bold">Relevance</div>
                      <div className="text-lg font-extrabold text-purple-600">{feedbackResult.scores.relevance}/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 font-bold">Confidence</div>
                      <div className="text-lg font-extrabold text-emerald-600">{feedbackResult.scores.confidence}/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 font-bold">Grammar</div>
                      <div className="text-lg font-extrabold text-amber-600">{feedbackResult.scores.grammar}/100</div>
                    </div>
                  </div>

                  {/* Feedback Summary */}
                  <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-2 leading-relaxed border border-slate-100">
                    <div className="font-bold text-slate-900 text-sm font-outfit">AI Suggestions:</div>
                    <p>{feedbackResult.feedback}</p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
                  >
                    Next HR Question
                  </button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                  <Bot className="w-12 h-12 text-slate-300" />
                  <p className="text-xs max-w-xs">Type your answer on the left and click submit to view instant AI communication scoring.</p>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
