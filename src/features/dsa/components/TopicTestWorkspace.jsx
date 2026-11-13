import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock, AlertTriangle, Play, Send, ChevronLeft, ChevronRight,
  CheckCircle2, Circle, AlertCircle, FileText, Code2, Award,
  Sparkles, X, ShieldCheck
} from 'lucide-react';
import { API } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import MonacoCodeEditor from './MonacoCodeEditor';
import ResultPanel from './ResultPanel';
import ProblemDescription from './ProblemDescription';

export default function TopicTestWorkspace({
  testData,
  onCloseTest,
  onSubmitComplete
}) {
  const toast = useToast();

  const {
    testId,
    topicId,
    topicTitle = 'Topic',
    questions = [],
    durationSeconds = 3600
  } = testData;

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationSeconds);
  const [answers, setAnswers] = useState({}); // { [problemId]: { language: 'python', code: '' } }
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [runnerError, setRunnerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const activeQuestion = questions[activeQuestionIdx] || questions[0];
  const activeProblemId = activeQuestion?.problemId;

  // Initialize answers from starter codes or localStorage
  useEffect(() => {
    const initial = {};
    questions.forEach((q) => {
      const savedKey = `dsa_test_code_${testId}_${q.problemId}_python`;
      const saved = localStorage.getItem(savedKey);
      const starter = q.starterCode?.python || '// Write your solution here';
      initial[q.problemId] = {
        language: 'python',
        code: saved || starter
      };
    });
    setAnswers(initial);
  }, [testId, questions]);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = () => {
    toast?.showToast?.('Time expired! Submitting your assessment automatically...', 'info');
    performFinalSubmit();
  };

  // Format time MM:SS or HH:MM:SS
  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentAnswer = answers[activeProblemId] || { language: 'python', code: '' };

  const handleCodeChange = (newCode) => {
    setAnswers((prev) => ({
      ...prev,
      [activeProblemId]: {
        ...prev[activeProblemId],
        code: newCode
      }
    }));
    try {
      localStorage.setItem(
        `dsa_test_code_${testId}_${activeProblemId}_${currentAnswer.language}`,
        newCode
      );
    } catch (e) {}
  };

  const handleLanguageChange = (newLang) => {
    const starter = activeQuestion?.starterCode?.[newLang] || '// Write your code here';
    const savedKey = `dsa_test_code_${testId}_${activeProblemId}_${newLang}`;
    const saved = localStorage.getItem(savedKey);

    setAnswers((prev) => ({
      ...prev,
      [activeProblemId]: {
        language: newLang,
        code: saved || starter
      }
    }));
  };

  // Run code against visible test cases during the test
  const handleRunCode = async () => {
    if (!currentAnswer.code || !currentAnswer.code.trim()) {
      toast?.showToast?.('Please write some code before running', 'warning');
      return;
    }

    try {
      setIsRunning(true);
      setRunnerError(null);

      const res = await API.runDsaCode({
        problemId: activeProblemId,
        language: currentAnswer.language,
        code: currentAnswer.code
      });

      setRunResult(res);
      if (res?.verdict === 'Accepted') {
        toast?.showToast?.('Visible sample tests passed!', 'success');
      } else if (res?.verdict) {
        toast?.showToast?.(`Test Case Result: ${res.verdict}`, 'info');
      }
    } catch (err) {
      console.warn('Run failed during test:', err);
      setRunnerError(err.message || 'Runner service notice.');
    } finally {
      setIsRunning(false);
    }
  };

  // Final Submit
  const performFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowSubmitConfirm(false);

      const payload = {
        answers: questions.map((q) => {
          const ans = answers[q.problemId] || { language: 'python', code: '' };
          return {
            problemId: q.problemId,
            language: ans.language,
            code: ans.code
          };
        }),
        durationSpentSeconds: durationSeconds - timeLeftSeconds
      };

      const res = await API.submitTopicTest(topicId, payload);
      if (res?.report) {
        // Clean up test localStorage keys
        questions.forEach((q) => {
          try {
            localStorage.removeItem(`dsa_test_code_${testId}_${q.problemId}_python`);
            localStorage.removeItem(`dsa_test_code_${testId}_${q.problemId}_java`);
            localStorage.removeItem(`dsa_test_code_${testId}_${q.problemId}_cpp`);
            localStorage.removeItem(`dsa_test_code_${testId}_${q.problemId}_javascript`);
          } catch (e) {}
        });

        onSubmitComplete(res.report);
      }
    } catch (err) {
      console.error('Final submit failed:', err);
      toast?.showToast?.(err.message || 'Failed to submit assessment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Count answered questions
  const answeredCount = questions.filter((q) => {
    const a = answers[q.problemId];
    return a && a.code && a.code.trim().length > 30;
  }).length;

  const isTimerCritical = timeLeftSeconds < 300; // < 5 mins
  const isTimerWarning = timeLeftSeconds < 600; // < 10 mins

  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold">Evaluating Topic Assessment</h2>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
          Evaluating each problem against 20 test cases (including hidden edge cases), analyzing code approaches and algorithmic time complexities...
        </p>
      </div>
    );
  }

  return (
    <div className="dark fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Test Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the assessment? Your test progress will be lost.')) {
                onCloseTest();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Exit Test</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white flex items-center gap-2 truncate">
              <span>{topicTitle} Assessment</span>
              <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                ⭐ Star Badge on &ge; 80%
              </span>
            </h1>
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {questions.map((q, idx) => {
            const isSelected = activeQuestionIdx === idx;
            const ans = answers[q.problemId];
            const hasCode = ans && ans.code && ans.code.trim().length > 30;

            return (
              <button
                key={q.problemId}
                type="button"
                onClick={() => {
                  setActiveQuestionIdx(idx);
                  setRunResult(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${hasCode ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span>Q{idx + 1} ({q.difficulty})</span>
              </button>
            );
          })}
        </div>

        {/* Right Timer & Submit Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dynamic Countdown Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
            isTimerCritical
              ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
              : isTimerWarning
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Mobile Question Selector Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          {questions.map((q, idx) => (
            <button
              key={q.problemId}
              type="button"
              onClick={() => {
                setActiveQuestionIdx(idx);
                setRunResult(null);
              }}
              className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                activeQuestionIdx === idx ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
            >
              Q{idx + 1}
            </button>
          ))}
        </div>
        <div className="text-slate-400 text-[11px]">
          Answered {answeredCount} of {questions.length}
        </div>
      </div>

      {/* Main Split Screen Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden min-h-0">
        {/* Left Pane: Question Description & Constraints */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 sm:p-6 overflow-y-auto flex flex-col min-h-0 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                Question {activeQuestionIdx + 1} of {questions.length}
              </div>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                {activeQuestion?.title}
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-slate-900 border border-slate-800 text-purple-300">
              {activeQuestion?.difficulty} ({activeQuestion?.timeAllocationMinutes || 25}m)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <ProblemDescription
              problem={activeQuestion}
              isAssessment={true}
              theme="dark"
            />
          </div>
        </div>

        {/* Right Pane: Editor & Runner */}
        <div className="flex flex-col gap-3 overflow-hidden min-h-0">
          {/* Monaco Editor */}
          <div className="flex-1 min-h-[300px]">
            <MonacoCodeEditor
              problemId={activeProblemId}
              starterCodes={activeQuestion?.starterCode || {}}
              language={currentAnswer.language}
              onChangeLanguage={handleLanguageChange}
              code={currentAnswer.code}
              onChangeCode={handleCodeChange}
              onRun={handleRunCode}
              onSubmit={() => setShowSubmitConfirm(true)}
              isRunning={isRunning}
              isSubmitting={false}
            />
          </div>

          {/* Action Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400 font-mono">
              Auto-saved locally for this assessment
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-purple-400" />
                <span>{isRunning ? 'Running...' : 'Run Sample Tests'}</span>
              </button>
            </div>
          </div>

          {/* Result Panel for test run */}
          {runResult && (
            <div className="max-h-[220px] overflow-y-auto">
              <ResultPanel
                result={runResult}
                isRunning={isRunning}
                isSubmitting={false}
                runnerError={runnerError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Submit Topic Assessment?
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                You have answered <strong>{answeredCount} of {questions.length}</strong> questions.
              </p>
              <div className="p-3 my-3 bg-purple-950/40 border border-purple-900/60 rounded-xl text-xs text-purple-300 text-left space-y-1">
                <div>• All solutions will be evaluated against <strong>20 test cases each</strong>.</div>
                <div>• Algorithms and approaches will be analyzed for time and space complexity.</div>
                <div>• Scoring <strong>80% or above</strong> awards the ⭐ <strong>Mastery Star</strong>!</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Keep Coding
              </button>
              <button
                type="button"
                onClick={performFinalSubmit}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30"
              >
                Confirm & Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
