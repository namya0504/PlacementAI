import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, Clock, Cpu, Terminal,
  ShieldCheck, HelpCircle, AlertTriangle, Award, FileCode,
  Trophy, ChevronRight, ArrowRight, BookOpen
} from 'lucide-react';
import { VERDICT_CONFIG } from '../constants/dsaTopics';

export default function ResultPanel({
  result,
  isRunning,
  isSubmitting,
  runnerError,
  customMode,
  hasNextProblem = false,
  onOpenNextProblem,
  hasNextTopic = false,
  nextTopicTitle = '',
  onOpenNextTopic,
  onBackToTopic
}) {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  if (isRunning || isSubmitting) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-sm font-semibold text-slate-200">
          {isSubmitting ? 'Evaluating against all test cases...' : 'Executing code in sandboxed runner...'}
        </div>
        <div className="text-xs text-slate-400 max-w-sm mx-auto">
          Input piped via stdin, output captured from stdout. Isolated execution container.
        </div>
      </div>
    );
  }

  if (runnerError) {
    return (
      <div className="p-5 bg-rose-950/40 border border-rose-800 rounded-2xl space-y-2 text-rose-200 text-xs">
        <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Execution Service Notice
        </div>
        <p className="leading-relaxed">{runnerError}</p>
        <p className="text-[11px] text-rose-400/80">Your code has been preserved in the editor.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center text-xs text-slate-500">
        Run your code against sample test cases or Submit for placement assessment.
      </div>
    );
  }

  const {
    verdict,
    testsPassed = 0,
    totalTests = 0,
    time,
    memory,
    isScored,
    scoringMessage,
    testResults = [],
    failedTestCase,
    customOutput,
    error
  } = result;

  const isAccepted = verdict === 'Accepted';
  const vStyle = VERDICT_CONFIG[verdict] || {
    label: verdict,
    bg: 'bg-slate-800',
    text: 'text-slate-200',
    border: 'border-slate-700'
  };

  const currentCase = testResults[activeCaseIdx] || {};
  const currentInput = currentCase.input ?? '';
  const currentExpected = currentCase.expectedOutput ?? currentCase.expected ?? currentCase.output ?? '';
  const currentActual = currentCase.actualOutput ?? currentCase.actual ?? '';
  const currentCaseError = currentCase.error ?? null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md text-slate-200">
      {/* Celebration & Next Problem / Next Topic Options Banner */}
      {isAccepted && (
        <div className="p-4 bg-emerald-950/50 border-b border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">
                All Test Cases Passed! Solved
              </div>
              <div className="text-[11px] text-emerald-400/80">
                {hasNextProblem ? 'Great job! Continue to the next problem.' : 'Topic completed! Ready for the next topic?'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasNextProblem && onOpenNextProblem ? (
              <button
                type="button"
                onClick={onOpenNextProblem}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all hover:scale-105"
              >
                <span>Next Problem</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : hasNextTopic && onOpenNextTopic ? (
              <button
                type="button"
                onClick={onOpenNextTopic}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all hover:scale-105"
              >
                <span>Next Topic: {nextTopicTitle}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            {onBackToTopic && (
              <button
                type="button"
                onClick={onBackToTopic}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Topic Problems</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verdict Header Banner */}
      <div className={`p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isAccepted ? 'bg-emerald-950/20' : 'bg-rose-950/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {isAccepted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : verdict === 'Time Limit Exceeded' ? (
              <Clock className="w-6 h-6 text-amber-400" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-base font-extrabold ${vStyle.text}`}>
                {verdict}
              </span>
              {totalTests > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {testsPassed} / {totalTests} test cases passed
                </span>
              )}
            </div>

            {scoringMessage && (
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-sans">
                {isScored ? (
                  <span className="text-purple-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {scoringMessage}
                  </span>
                ) : (
                  <span className="text-slate-400">
                    {scoringMessage}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Time and Memory Metrics */}
        {(typeof time === 'number' || typeof memory === 'number' || typeof time === 'string') && (
          <div className="flex items-center gap-3 self-end sm:self-center text-xs font-mono text-slate-400">
            {time && (
              <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                {typeof time === 'number' ? `${time} ms` : time}
              </span>
            )}
            {memory && (
              <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                {typeof memory === 'number' ? (memory > 1024 ? `${(memory / 1024).toFixed(1)} MB` : `${memory} KB`) : memory}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Output Panel (Runtime or Compilation Error) */}
      {error && (
        <div className="p-4 bg-rose-950/40 border-b border-rose-900/50">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Diagnostic Message:
          </div>
          <pre className="font-mono text-xs text-rose-200 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed bg-black/40 p-3 rounded-lg border border-rose-900/40">
            <code>{error}</code>
          </pre>
        </div>
      )}

      {/* Custom Input Output */}
      {customOutput && (
        <div className="p-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Custom Test Execution
          </div>
          <div>
            <div className="text-[11px] text-slate-400 mb-1">Standard Input:</div>
            <pre className="p-2.5 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 whitespace-pre-wrap">
              {customOutput.input || '(empty)'}
            </pre>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 mb-1">Your Output:</div>
            <pre className="p-2.5 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800 whitespace-pre-wrap">
              {customOutput.output || '(no stdout output)'}
            </pre>
          </div>
        </div>
      )}

      {/* Visible Test Cases Tabs */}
      {Array.isArray(testResults) && testResults.length > 0 && (
        <div className="p-4 space-y-3">
          {/* Test Case Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {testResults.map((tc, idx) => {
              const isSelected = activeCaseIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveCaseIdx(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tc.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span>Case {idx + 1} {tc.isHidden ? '(Hidden)' : ''}</span>
                </button>
              );
            })}
          </div>

          {/* Active Case Inspection Card */}
          {testResults[activeCaseIdx] && (
            <div className="space-y-3 pt-2">
              {currentCase.isHidden ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    Confidential Assessment Test Case
                  </div>
                  <p>
                    {currentCase.passed
                      ? '✅ Passed: Your solution passed this test case within the required time and memory bounds.'
                      : '❌ Failed: Input and expected values for hidden test cases are masked to prevent hardcoded submissions.'}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Input
                    </div>
                    <pre className="p-2.5 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 whitespace-pre-wrap">
                      {currentInput || '(empty input)'}
                    </pre>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Expected Output
                    </div>
                    <pre className="p-2.5 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800 whitespace-pre-wrap">
                      {currentExpected !== '' ? currentExpected : '(no expected output specified)'}
                    </pre>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Your Output
                    </div>
                    <pre className={`p-2.5 bg-slate-950 rounded-lg text-xs font-mono border border-slate-800 whitespace-pre-wrap ${
                      currentCase.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {currentActual !== '' ? currentActual : '(no stdout output)'}
                    </pre>
                  </div>

                  {currentCaseError && !currentCase.passed && !currentCaseError.startsWith('Expected:\n') && (
                    <div>
                      <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Execution Diagnostic / Error</span>
                      </div>
                      <pre className="p-2.5 bg-rose-950/40 rounded-lg text-xs font-mono text-rose-200 border border-rose-900/60 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        <code>{currentCaseError}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Failed Hidden Test Case Notice */}
      {!isAccepted && failedTestCase && failedTestCase.isHidden && (
        <div className="p-4 bg-amber-950/20 border-t border-amber-900/40 text-xs text-amber-300">
          <div className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
            <AlertCircle className="w-4 h-4" />
            Hidden Test Case Failed
          </div>
          <p className="leading-relaxed">
            Your solution failed on a confidential edge case. To preserve placement assessment integrity and prevent hardcoding, hidden test case inputs are not shown. Check boundary conditions, large constraints, negative values, and empty structures!
          </p>
        </div>
      )}
    </div>
  );
}
