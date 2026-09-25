import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, HelpCircle, ArrowRight, ArrowLeft, Bookmark, Menu, Award, Sparkles, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Aptitude() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [testResult, setTestResult] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Quantitative');
  const [stats, setStats] = useState({ aptitudeScore: 0, testsCompleted: 0 });

  const fetchStats = async () => {
    try {
      const res = await API.getDashboardStats();
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (e) {
      console.warn('Stats fetch warning:', e.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const startTest = async (category = 'Quantitative') => {
    setSelectedCategory(category);
    setLoading(true);
    setTestActive(true);
    setTestResult(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedQuestions({});
    setTimeLeft(1800);

    try {
      const data = await API.getAptitudeQuestions(`?category=${encodeURIComponent(category)}&generate=true&limit=5`);
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      } else {
        // Fallback fetch any questions
        const fallback = await API.getAptitudeQuestions('?limit=5');
        setQuestions(Array.isArray(fallback) ? fallback : []);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (testActive && timeLeft > 0 && !testResult) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [testActive, timeLeft, testResult]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (opt) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: opt });
  };

  const toggleMark = (index) => {
    setMarkedQuestions({ ...markedQuestions, [index]: !markedQuestions[index] });
  };

  const handleSubmitTest = async () => {
    let score = 0;
    const answerPayload = {};
    questions.forEach((q, i) => {
      const qId = q.questionId || q.id || `q_${i}`;
      const selected = userAnswers[i];
      answerPayload[qId] = selected;
      if (selected && (selected === q.correctAnswer || selected === q.correct)) {
        score++;
      }
    });

    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    setTestResult({
      score,
      total: questions.length,
      percentage
    });

    // Record score in backend Firestore
    try {
      await API.submitAptitudeTest({
        category: selectedCategory,
        topic: questions[0]?.topic || 'Mixed',
        userAnswers: answerPayload
      });
      await fetchStats();
    } catch (err) {
      console.warn('Aptitude API notice:', err.message);
    }
  };

  const testsCount = stats.testsCompleted || 0;
  const currentStageNum = testsCount === 0 ? 1 : testsCount < 3 ? 2 : testsCount < 6 ? 3 : 4;

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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Aptitude Preparation</h1>
              <p className="text-xs text-slate-500">AI-Powered adaptive questions in Quant, Reasoning, and Verbal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Aptitude Score: {stats.aptitudeScore ?? 0}%
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Stage Progress Header */}
          {!testActive && (
            <div className="space-y-8">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Your Aptitude Roadmap</h3>
                    <p className="text-xs text-slate-500">Completed: {testsCount} tests taken</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Stage {currentStageNum} of 4
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { stage: 'Beginner', required: 0 },
                    { stage: 'Intermediate', required: 1 },
                    { stage: 'Advanced', required: 3 },
                    { stage: 'Mock Test Expert', required: 6 }
                  ].map((st, i) => {
                    const isCompleted = testsCount > st.required;
                    const isCurrent = currentStageNum === i + 1;
                    const bgClass = isCurrent
                      ? 'bg-blue-600 text-white shadow-md border-blue-600'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200';

                    return (
                      <div key={i} className={`p-4 rounded-xl border text-center font-bold text-xs ${bgClass}`}>
                        <div className="font-outfit text-sm">{st.stage}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {isCurrent ? 'Current Stage' : isCompleted ? 'Completed' : 'Upcoming'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Topics Grid with AI Practice Trigger */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Quantitative Aptitude', category: 'Quantitative', desc: 'Percentages, Profit & Loss, Speed & Distance, Algebra', color: 'bg-blue-600' },
                  { title: 'Logical Reasoning', category: 'Logical Reasoning', desc: 'Blood Relations, Number Series, Syllogisms, Coding-Decoding', color: 'bg-purple-600' },
                  { title: 'Verbal Ability', category: 'Verbal Ability', desc: 'Synonyms, Antonyms, Reading Comprehension, Grammar', color: 'bg-emerald-600' }
                ].map((tp, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 font-outfit text-base">{tp.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">AI Powered</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{tp.desc}</p>
                    </div>

                    <button
                      onClick={() => startTest(tp.category)}
                      className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start AI Practice Test</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ACTIVE TEST SCREEN */}
          {testActive && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Question Screen */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {loading ? (
                  <div className="text-center py-16 space-y-3">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    <div className="text-sm font-bold text-slate-700">Generating Personalized Questions with Grok AI...</div>
                    <div className="text-xs text-slate-400">Tailoring test to your skill profile</div>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="text-slate-600 font-medium">No questions generated. Please try again.</div>
                    <button
                      onClick={() => setTestActive(false)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                ) : testResult ? (
                  /* Test Result Screen */
                  <div className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                      <Award className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-900 font-outfit">Test Completed!</h3>
                      <p className="text-sm text-slate-500">Your score has been updated in your Placement Readiness score.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <div className="text-2xl font-black text-slate-900">{testResult.score}/{testResult.total}</div>
                        <div className="text-xs text-slate-500 font-semibold">Correct</div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-blue-600">{testResult.percentage}%</div>
                        <div className="text-xs text-slate-500 font-semibold">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-emerald-600">+{testResult.percentage > 70 ? 5 : 2}</div>
                        <div className="text-xs text-slate-500 font-semibold">XP Gained</div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 pt-4">
                      <button
                        onClick={() => startTest(selectedCategory)}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow"
                      >
                        Try Another Test
                      </button>
                      <button
                        onClick={() => setTestActive(false)}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                      >
                        Back to Roadmap
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {questions[currentQuestionIndex]?.topic || selectedCategory}
                      </span>
                      <div className="flex items-center gap-2 text-slate-700 font-mono font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-xl">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{formatTime(timeLeft)}</span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-outfit">
                        {questions[currentQuestionIndex]?.question || questions[currentQuestionIndex]?.text}
                      </h3>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3">
                      {(questions[currentQuestionIndex]?.options || []).map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(opt)}
                          className={`p-4 rounded-xl border cursor-pointer font-medium text-sm transition flex items-center gap-3 ${
                            userAnswers[currentQuestionIndex] === opt
                              ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            userAnswers[currentQuestionIndex] === opt ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => toggleMark(currentQuestionIndex)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          markedQuestions[currentQuestionIndex]
                            ? 'bg-amber-100 text-amber-700'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {markedQuestions[currentQuestionIndex] ? 'Marked for Review' : 'Mark for Review'}
                      </button>

                      <div className="flex gap-2">
                        <button
                          disabled={currentQuestionIndex === 0}
                          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {currentQuestionIndex < questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700"
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitTest}
                            className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700"
                          >
                            Submit Test
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Question Navigation Palette */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 font-outfit text-sm">Question Palette</h4>
                  <button
                    onClick={() => setTestActive(false)}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Quit Test
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isMarked = markedQuestions[idx];
                    const isCurrent = currentQuestionIndex === idx;

                    let bg = 'bg-slate-100 text-slate-700';
                    if (isCurrent) bg = 'ring-2 ring-blue-600 bg-blue-50 text-blue-700 font-black';
                    else if (isMarked) bg = 'bg-amber-100 text-amber-800 font-bold';
                    else if (isAnswered) bg = 'bg-emerald-600 text-white font-bold';

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-10 rounded-xl text-xs flex items-center justify-center transition ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span>Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
