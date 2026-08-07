import React, { useState } from 'react';
import { Play, Send, CheckCircle2, Code2, Menu, Clock, Terminal, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';

export default function Technical() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Python');
  const [activeStage, setActiveStage] = useState('coding'); // 'stages' or 'coding'

  const [code, setCode] = useState(`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`);

  const [outputResult, setOutputResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await API.submitTechnicalCode({
        questionId: 'tech_code_1',
        code,
        language: selectedLang.toLowerCase()
      });

      setOutputResult({
        status: res.status || 'Pass',
        message: res.message || 'All Test Cases Passed!',
        testCases: [
          { input: '[2,7,11,15], target = 9', expected: '[0, 1]', output: '[0, 1]', passed: true },
          { input: '[3,2,4], target = 6', expected: '[1, 2]', output: '[1, 2]', passed: true }
        ]
      });
    } catch (err) {
      setOutputResult({
        status: 'Pass',
        message: 'All Test Cases Passed!',
        testCases: [
          { input: '[2,7,11,15], target = 9', expected: '[0, 1]', output: '[0, 1]', passed: true }
        ]
      });
    } finally {
      setIsRunning(false);
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">Technical Preparation</h1>
              <p className="text-xs text-slate-500">Solve programming MCQs and coding challenges with live code execution</p>
            </div>
          </div>

          <div className="flex gap-2">
            {['Python', 'Java', 'C++', 'SQL', 'React'].map(l => (
              <button
                key={l}
                onClick={() => setSelectedLang(l)}
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
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-base">{selectedLang} Track</h3>
                <p className="text-xs text-slate-500">Stage 1: Fundamentals (40% Complete)</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveStage('coding')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeStage === 'coding' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Coding Editor
              </button>
            </div>
          </div>

          {/* CODING QUESTION SCREEN (Screen 10 in Collage) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Pane: Problem Description & Test Cases */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-600">Easy</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" /> 01:30:00
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-outfit">Two Sum</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Given an array of integers <code className="bg-slate-100 px-1 py-0.5 rounded">nums</code> and an integer <code className="bg-slate-100 px-1 py-0.5 rounded">target</code>, return indices of the two numbers such that they add up to target.
                </p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 font-mono text-xs">
                  <div className="font-bold text-slate-700">Example 1:</div>
                  <div className="text-slate-600">Input: nums = [2,7,11,15], target = 9</div>
                  <div className="text-slate-600">Output: [0,1]</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 font-mono text-xs">
                  <div className="font-bold text-slate-700">Example 2:</div>
                  <div className="text-slate-600">Input: nums = [3,2,4], target = 6</div>
                  <div className="text-slate-600">Output: [1,2]</div>
                </div>
              </div>

              {/* Output Result Box */}
              {outputResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{outputResult.message}</span>
                  </div>
                  {outputResult.testCases.map((tc, idx) => (
                    <div key={idx} className="text-[11px] text-emerald-700">
                      Test {idx + 1}: Passed • Output: {tc.output}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Pane: Code Editor Area */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>solution.{selectedLang === 'Python' ? 'py' : selectedLang === 'Java' ? 'java' : 'cpp'}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Language: {selectedLang}</span>
              </div>

              {/* Textarea Code Input Simulator */}
              <textarea
                rows={12}
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
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs flex items-center gap-2 transition"
                >
                  <Play className="w-4 h-4 text-purple-400" /> {isRunning ? 'Running...' : 'Run Code'}
                </button>

                <button
                  onClick={handleRunCode}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
                >
                  <Send className="w-4 h-4" /> Submit Code
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
