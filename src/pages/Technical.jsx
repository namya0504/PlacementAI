import React, { useState, useEffect } from 'react';
import { Play, Send, CheckCircle2, Code2, Menu, Clock, Terminal, Sparkles, RefreshCw, XCircle, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';

const DEFAULT_STARTERS = {
  Python: 'def solution(args):\n    # Write your Python solution here\n    pass',
  Java: 'public class Solution {\n    public int solve() {\n        // Write your Java solution here\n        return -1;\n    }\n}',
  'C++': '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int solve() {\n        // Write your C++ solution here\n        return -1;\n    }\n};',
  JavaScript: 'function solution(args) {\n  // Write your JavaScript solution here\n}',
  SQL: '-- Write your SQL query here\nSELECT * FROM table_name;'
};

export default function Technical() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Java');
  const [code, setCode] = useState(DEFAULT_STARTERS.Java);
  const [outputResult, setOutputResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ technicalScore: 0 });

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
    if (!q) return DEFAULT_STARTERS[lang] || '// Write code here';
    const langKey = lang.toLowerCase();
    if (q.starterCodes && q.starterCodes[langKey]) {
      return q.starterCodes[langKey];
    }
    if (q.language && q.language.toLowerCase() === langKey && (q.starterCode || q.initialCode)) {
      return q.starterCode || q.initialCode;
    }
    return DEFAULT_STARTERS[lang] || q.starterCode || q.initialCode || '// Write code here';
  };

  const loadQuestion = async (lang, forceGenerate = false) => {
    setLoading(true);
    setQuestionData(null);
    setOutputResult(null);

    const query = `?category=${encodeURIComponent(lang)}&language=${encodeURIComponent(lang)}&type=code${forceGenerate ? '&generate=true' : ''}`;
    try {
      const res = await API.getTechnicalQuestions(query);
      if (res && res.length > 0) {
        const q = res[0];
        setQuestionData(q);
        setCode(getStarterForLang(q, lang));
      }
    } catch (err) {
      console.error('Failed to load technical questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    setOutputResult(null);

    // If current question has starter code for the new language, switch code seamlessly
    if (questionData) {
      setCode(getStarterForLang(questionData, newLang));
    } else {
      loadQuestion(newLang, false);
    }
  };

  useEffect(() => {
    fetchStats();
    loadQuestion(selectedLang, false);
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputResult(null);
    try {
      const res = await API.submitTechnicalCode({
        questionId: questionData?.questionId || 'tech_code_1',
        code,
        language: selectedLang.toLowerCase(),
        testCases: questionData?.testCases || []
      });

      setOutputResult({
        status: res.status, // 'Passed' | 'Partial' | 'Failed'
        message: res.message,
        passCount: res.passCount,
        totalTests: res.totalTests,
        score: res.score,
        testResults: res.testResults || []
      });

      if (res.updatedStats) {
        setStats(res.updatedStats);
      }
    } catch (err) {
      setOutputResult({
        status: 'Failed',
        message: err.message || 'Execution failed. Check syntax and try again.',
        passCount: 0,
        totalTests: questionData?.testCases?.length || 3,
        score: 0,
        testResults: (questionData?.testCases || []).map((tc, idx) => ({
          testCaseIndex: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Error',
          passed: false,
          error: err.message
        }))
      });
    } finally {
      setIsRunning(false);
    }
  };

  const techScore = stats.technicalScore ?? 0;
  const stageName = techScore === 0 ? 'Fundamentals (Not started)' :
    techScore < 40 ? `Fundamentals (${techScore}% Proficiency)` :
    techScore < 75 ? `Data Structures & Algorithms (${techScore}% Proficiency)` :
    `Advanced Architecture (${techScore}% Proficiency)`;

  const fileExt =
    selectedLang === 'Python' ? 'py' :
    selectedLang === 'Java' ? 'java' :
    selectedLang === 'C++' ? 'cpp' :
    selectedLang === 'SQL' ? 'sql' : 'js';

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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Technical Preparation</h1>
              <p className="text-xs text-slate-500">Live AI code generation and automated test evaluation</p>
            </div>
          </div>

          <div className="flex gap-2">
            {['Python', 'Java', 'C++', 'SQL', 'JavaScript'].map(l => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedLang === l ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Stages Overview Navigation */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">{selectedLang} Track</h3>
                <p className="text-xs text-purple-700 font-medium">{stageName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadQuestion(selectedLang, true)}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition border border-purple-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{loading ? 'Generating...' : 'New AI Challenge'}</span>
              </button>
            </div>
          </div>

          {/* CODING QUESTION SCREEN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Pane: Problem Description & Test Cases */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                  <div className="text-sm font-bold text-slate-700">Generating Coding Challenge...</div>
                  <div className="text-xs text-slate-400">Preparing test cases and system constraints</div>
                </div>
              ) : questionData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-600">
                      {questionData.difficulty || 'Medium'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Category: {questionData.category || selectedLang}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-outfit">{questionData.title || 'Coding Challenge'}</h3>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {questionData.description || questionData.question}
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Test Cases ({questionData.testCases?.length || 0}):</div>
                    {Array.isArray(questionData.testCases) && questionData.testCases.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 font-mono text-xs">
                        <div className="font-bold text-slate-700">Test Case {idx + 1}:</div>
                        <div className="text-slate-600"><span className="text-slate-400">Input:</span> {ex.input}</div>
                        <div className="text-slate-600"><span className="text-slate-400">Expected:</span> {ex.expectedOutput}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 py-16">
                  <Code2 className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-medium">No challenges loaded yet.</p>
                  <button
                    onClick={() => loadQuestion(selectedLang, true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    Generate AI Challenge
                  </button>
                </div>
              )}

              {/* Output Result Box */}
              {outputResult && (
                <div
                  className={`p-4 rounded-xl border space-y-3 font-mono text-xs ${
                    outputResult.status === 'Passed'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : outputResult.status === 'Partial'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      {outputResult.status === 'Passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>
                        {outputResult.status === 'Passed'
                          ? 'All test cases passed!'
                          : outputResult.status === 'Partial'
                          ? 'Some test cases passed'
                          : 'Test cases failed'}
                      </span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded font-bold uppercase bg-white/70">
                      Score: {outputResult.score}%
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700">
                    Passed {outputResult.passCount} out of {outputResult.totalTests} tests.
                    {outputResult.message && <div className="mt-1 text-slate-600 italic">{outputResult.message}</div>}
                  </div>

                  {/* Individual test results breakdown */}
                  {Array.isArray(outputResult.testResults) && outputResult.testResults.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200/60 max-h-48 overflow-y-auto">
                      {outputResult.testResults.map((tr, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg text-[11px] border ${
                            tr.passed
                              ? 'bg-emerald-100/60 border-emerald-200 text-emerald-800'
                              : 'bg-red-100/60 border-red-200 text-red-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>Test Case {tr.testCaseIndex || i + 1}</span>
                            <span>{tr.passed ? '✓ Passed' : '✗ Failed'}</span>
                          </div>
                          <div className="mt-1 text-[10px] space-y-0.5 text-slate-700">
                            <div><span className="font-semibold">Input:</span> {tr.input}</div>
                            <div><span className="font-semibold">Expected:</span> {tr.expectedOutput}</div>
                            {tr.actualOutput !== undefined && tr.actualOutput !== '' && (
                              <div><span className="font-semibold">Actual:</span> {tr.actualOutput}</div>
                            )}
                            {tr.error && <div className="text-red-700 font-semibold">{tr.error}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Pane: Code Editor Area */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>{selectedLang === 'Java' ? 'Solution.java' : `solution.${fileExt}`}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Language: {selectedLang}</span>
              </div>

              {/* Textarea Code Input */}
              <textarea
                rows={16}
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 border border-slate-800 leading-relaxed"
                spellCheck="false"
              />

              {/* Control Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Play className="w-4 h-4 text-purple-400" /> {isRunning ? 'Running tests...' : 'Run Code'}
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {isRunning ? 'Evaluating...' : 'Submit Code'}
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
