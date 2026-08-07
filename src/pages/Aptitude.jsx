import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, HelpCircle, ArrowRight, ArrowLeft, Bookmark, Menu, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Aptitude() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2055); // 34 mins 15 secs
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [testResult, setTestResult] = useState(null);

  const questions = [
    {
      id: 1,
      topic: 'Quantitative Aptitude',
      text: 'A train travels 360 km at a certain speed. If the speed had been 5 km/h more, it would have taken 48 minutes less for the journey. What is the original speed of the train?',
      options: ['40 km/h', '45 km/h', '50 km/h', '60 km/h'],
      correct: 1 // 45 km/h
    },
    {
      id: 2,
      topic: 'Logical Reasoning',
      text: 'Looking at a portrait, a man said, "I have no brother or sister, but that man\'s father is my father\'s son." Whose portrait was he looking at?',
      options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
      correct: 1 // His son's
    },
    {
      id: 3,
      topic: 'English',
      text: 'Choose the word nearest in meaning to "CANDID":',
      options: ['Frank', 'Secretive', 'Deceitful', 'Shy'],
      correct: 0 // Frank
    },
    {
      id: 4,
      topic: 'Quantitative Aptitude',
      text: 'If A can finish a work in 12 days and B in 15 days, how many days will they take working together?',
      options: ['6.67 days', '7.5 days', '8 days', '9 days'],
      correct: 0
    },
    {
      id: 5,
      topic: 'Logical Reasoning',
      text: 'Find the next number in the series: 3, 5, 9, 17, 33, ?',
      options: ['49', '55', '65', '70'],
      correct: 2 // 65
    }
  ];

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
    return `00:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (optIndex) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optIndex });
  };

  const toggleMark = (index) => {
    setMarkedQuestions({ ...markedQuestions, [index]: !markedQuestions[index] });
  };

  const handleSubmitTest = async () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct) score++;
    });

    const percentage = Math.round((score / questions.length) * 100);

    setTestResult({
      score,
      total: questions.length,
      percentage
    });

    // Record score in backend Firestore
    try {
      await API.submitAptitudeTest({
        category: 'Quantitative & Logical',
        userAnswers,
        score: percentage
      });
    } catch (err) {
      console.warn('Aptitude API notice:', err.message);
    }
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Aptitude Preparation</h1>
              <p className="text-xs text-slate-500">Master Quant, Reasoning, and Verbal for placement exams</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Stage Progress Header (Screen 9 in Collage) */}
          {!testActive && (
            <div className="space-y-8">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Your Aptitude Progress</h3>
                  <span className="text-xs font-bold text-blue-600">Stage 2 of 4</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { stage: 'Beginner', status: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { stage: 'Intermediate', status: 'Current', bg: 'bg-blue-600 text-white shadow-md' },
                    { stage: 'Advanced', status: 'Locked', bg: 'bg-slate-100 text-slate-400 border-slate-200' },
                    { stage: 'Mock Test', status: 'Locked', bg: 'bg-slate-100 text-slate-400 border-slate-200' }
                  ].map((st, i) => (
                    <div key={i} className={`p-4 rounded-xl border text-center font-bold text-xs ${st.bg}`}>
                      <div className="font-outfit text-sm">{st.stage}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{st.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Quantitative Aptitude', sub: '18/30 Solved', pct: 60, color: 'bg-blue-600' },
                  { title: 'Logical Reasoning', sub: '15/30 Solved', pct: 50, color: 'bg-purple-600' },
                  { title: 'English Verbal', sub: '24/30 Solved', pct: 80, color: 'bg-emerald-600' }
                ].map((tp, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-900 font-outfit text-base">{tp.title}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>{tp.sub}</span>
                        <span>{tp.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${tp.color} rounded-full`} style={{ width: `${tp.pct}%` }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setTestActive(true); setTestResult(null); }}
                      className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition"
                    >
                      Start Practice
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ACTIVE TEST SCREEN (Screen 9 Right Pane in Collage) */}
          {testActive && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Question Screen */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {/* Test Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {questions[currentQuestionIndex].topic}
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
                    {questions[currentQuestionIndex].text}
                  </h3>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-xl border cursor-pointer font-medium text-sm transition flex items-center gap-3 ${
                        userAnswers[currentQuestionIndex] === optIdx
                          ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        userAnswers[currentQuestionIndex] === optIdx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
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

              </div>

              {/* Question Palette Sidebar */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit">
                <h4 className="font-bold text-slate-900 font-outfit text-sm">Question Palette</h4>
                
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, i) => {
                    const isAnswered = userAnswers[i] !== undefined;
                    const isMarked = markedQuestions[i];
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentQuestionIndex(i)}
                        className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition ${
                          currentQuestionIndex === i ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                        } ${
                          isMarked
                            ? 'bg-amber-400 text-slate-900'
                            : isAnswered
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500"></div>
                    <span className="text-slate-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-slate-200"></div>
                    <span className="text-slate-600">Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-400"></div>
                    <span className="text-slate-600">Marked for Review</span>
                  </div>
                </div>

                {testResult && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-center">
                    <Award className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="text-base font-extrabold text-emerald-900">Score: {testResult.score} / {testResult.total}</div>
                    <div className="text-xs text-emerald-700 font-semibold">{testResult.percentage}% Accuracy</div>
                    <button
                      onClick={() => setTestActive(false)}
                      className="w-full mt-2 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                    >
                      Back to Stages
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
