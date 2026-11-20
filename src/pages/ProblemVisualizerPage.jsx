import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, ArrowRight, Code2,
  Cpu, Layers, Eye, Zap, BookOpen, ExternalLink, HelpCircle,
  TrendingUp, Award, Clock, Compass, Terminal, ShieldCheck,
  MessageSquare, Send, X, AlertTriangle, Lightbulb, Search,
  Sliders, ThumbsUp, Check, RefreshCw
} from 'lucide-react';
import { API } from '../services/api';

/**
 * Universal & Non-Coder Friendly Algorithmic Understanding & Animated Visualizer Studio
 * Supports all 420 problems across 21 topics with real-world analogies, multi-language code line tracing,
 * custom input/target simulations with rich success/failure messages, and an interactive AI Algorithm Coach.
 */
export default function ProblemVisualizerPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  // Navigation tabs: 'visualizer' | 'story' | 'problem_info' | 'approaches'
  const [activeTab, setActiveTab] = useState('visualizer');

  // Input & Simulation State
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [customArrayText, setCustomArrayText] = useState('');
  const [customTargetText, setCustomTargetText] = useState('9');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTrace, setCustomTrace] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState(null);

  // Playback State
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // AI Tutor Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [dynamicQuickButtons, setDynamicQuickButtons] = useState([
    "Explain this step in simple non-coder words",
    "What edge case could break this?",
    "Why is this approach optimal?"
  ]);
  const chatBottomRef = useRef(null);

  // AI Visualization State
  const [aiVisualization, setAiVisualization] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Load chat messages from localStorage per problem
  useEffect(() => {
    if (!problemId) return;
    try {
      const saved = localStorage.getItem(`placementai_coach_${problemId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatMessages(parsed);
          return;
        }
      }
    } catch (_) {}

    setChatMessages([
      {
        sender: 'ai',
        text: `👋 Hi! I'm Sarah, your placement algorithm coach! Whether you're a complete non-coder or brushing up for campus interviews, I can explain every line, analogy, or custom test case for ${problem?.title || 'this problem'}. Ask me anything below!`
      }
    ]);
  }, [problemId, problem?.title]);

  // Persist chat messages to localStorage per problem
  useEffect(() => {
    if (!problemId || chatMessages.length <= 1) return;
    try {
      localStorage.setItem(`placementai_coach_${problemId}`, JSON.stringify(chatMessages));
    } catch (_) {}
  }, [chatMessages, problemId]);

  // Load problem details and synthesized AI visualizer from API
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        setLoadingAi(true);

        const [probRes, aiRes] = await Promise.allSettled([
          API.getDsaProblemDetail(problemId),
          API.getDsaAiVisualization(problemId)
        ]);

        if (isMounted && probRes.status === 'fulfilled' && probRes.value?.problem) {
          setProblem(probRes.value.problem);
        }
        if (isMounted && aiRes.status === 'fulfilled' && aiRes.value?.visualization) {
          setAiVisualization(aiRes.value.visualization);
          if (Array.isArray(aiRes.value.quickButtons) && aiRes.value.quickButtons.length > 0) {
            setDynamicQuickButtons(aiRes.value.quickButtons);
          }
        }
      } catch (err) {
        console.error('Failed to load problem for visualizer:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingAi(false);
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, [problemId]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  // Determine problem archetype
  const archetype = useMemo(() => {
    const slug = (problem?.problemId || problemId || '').toLowerCase();
    const title = (problem?.title || '').toLowerCase();
    const topic = (problem?.topicId || '').toLowerCase();

    // 1. Stock problems
    if (slug.includes('stock') || title.includes('stock') || title.includes('buy and sell')) {
      return 'stock';
    }
    // 2. Two Sum / Hashing Pair problems
    if (slug.includes('two_sum') || title.includes('two sum') || title.includes('pair')) {
      return 'two_sum';
    }
    // 3. Binary Search
    if (slug.includes('binary_search') || title.includes('binary search') || topic === 'binary search' || topic === 'binary_search') {
      return 'binary_search';
    }
    // 4. Maximum Subarray / Kadane
    if (slug.includes('max_subarray') || title.includes('maximum subarray') || title.includes('kadane')) {
      return 'max_subarray';
    }
    // 5. Sliding Window
    if (slug.includes('sliding_window') || topic === 'sliding window' || topic === 'sliding_window' || title.includes('sliding window') || title.includes('window') || title.includes('longest substring')) {
      return 'sliding_window';
    }
    // 6. Prefix Sum
    if (slug.includes('prefix_sum') || topic === 'prefix sum' || topic === 'prefix_sum' || title.includes('prefix sum') || title.includes('range sum')) {
      return 'prefix_sum';
    }
    // 7. Stack / Parentheses
    if (slug.includes('stack') || topic === 'stack' || title.includes('stack') || title.includes('parentheses') || title.includes('bracket')) {
      return 'stack';
    }
    // 8. Linked List
    if (slug.includes('linked_list') || topic === 'linked list' || topic === 'linked_list' || title.includes('linked list') || title.includes('list node')) {
      return 'linked_list';
    }
    // 9. Two Pointers / Palindrome / Container
    if (slug.includes('container') || title.includes('most water') || slug.includes('palindrome') || title.includes('palindrome') || topic === 'two pointers' || topic === 'two_pointers') {
      return 'two_pointers';
    }
    // 10. Trees / BST
    if (slug.includes('tree') || topic.includes('tree') || title.includes('tree') || title.includes('bst')) {
      return 'tree';
    }
    // 11. Heap / Priority Queue
    if (slug.includes('heap') || topic.includes('heap') || topic.includes('priority queue') || title.includes('kth')) {
      return 'heap';
    }
    // 12. Dynamic Programming
    if (slug.includes('dp') || topic.includes('dynamic programming') || topic === 'dp' || title.includes('climb') || title.includes('coin change')) {
      return 'dp';
    }
    // 13. Bit Manipulation
    if (slug.includes('bit') || topic.includes('bit') || title.includes('single number') || title.includes('bits')) {
      return 'bit_manipulation';
    }
    return 'universal';
  }, [problem, problemId]);

  // Dynamic input presets based on actual problem examples or archetype fallbacks
  const inputPresets = useMemo(() => {
    const list = [];

    // Parse real problem examples from database
    if (Array.isArray(problem?.examples) && problem.examples.length > 0) {
      problem.examples.forEach((ex, idx) => {
        const raw = String(ex.input || '').trim();
        const rawOutput = String(ex.output || '').trim();
        const tokens = raw.split(/\s+/).map(Number).filter(n => !isNaN(n));

        if (archetype === 'two_sum' || archetype === 'binary_search') {
          if (tokens.length >= 3) {
            const n = tokens[0];
            const nums = tokens.slice(1, n + 1);
            const target = tokens[n + 1] !== undefined ? tokens[n + 1] : tokens[tokens.length - 1];
            list.push({
              label: `Example ${idx + 1}: Target = ${target}`,
              nums: nums.length > 0 ? nums : [2, 7, 11, 15],
              target: isNaN(target) ? 9 : target,
              expectedOutput: rawOutput,
              explanation: ex.explanation
            });
            return;
          }
        }

        if (tokens.length > 1 && tokens[0] === tokens.length - 1) {
          const arr = tokens.slice(1);
          list.push({
            label: `Example ${idx + 1}: [${arr.slice(0, 4).join(', ')}${arr.length > 4 ? '...' : ''}]`,
            data: arr,
            nums: arr,
            target: arr[arr.length - 1],
            expectedOutput: rawOutput,
            explanation: ex.explanation
          });
          return;
        }

        if (tokens.length > 0) {
          list.push({
            label: `Example ${idx + 1}: [${tokens.slice(0, 4).join(', ')}${tokens.length > 4 ? '...' : ''}]`,
            data: tokens,
            nums: tokens,
            target: tokens[tokens.length - 1],
            expectedOutput: rawOutput,
            explanation: ex.explanation
          });
          return;
        }

        list.push({
          label: `Example ${idx + 1}: "${raw.slice(0, 24)}"`,
          text: raw,
          data: [1, 2, 3, 4, 5],
          nums: [1, 2, 3, 4, 5],
          expectedOutput: rawOutput,
          explanation: ex.explanation
        });
      });
    }

    // Default presets and edge cases per archetype
    // 2. Fallback to starter codes for all languages
    if (problem?.starterCode) {
      const result = {};
      ['python', 'javascript', 'java', 'cpp'].forEach((lang) => {
        const rawCode = problem.starterCode[lang] || '';
        result[lang] = (rawCode || `// Solution for ${problem?.title || 'problem'}`)
          .split('\n')
          .map((text, idx) => ({ line: idx + 1, text }));
      });
      return result;
    }

    // Default clean stub for this problem
    return {
      python: [
        { line: 1, text: `# Optimal solution for ${problem?.title || 'Problem'}` },
        { line: 2, text: "def solve(data):" },
        { line: 3, text: "    # Process optimal algorithm step-by-step" },
        { line: 4, text: "    return result" }
      ],
      javascript: [
        { line: 1, text: `// Optimal solution for ${problem?.title || 'Problem'}` },
        { line: 2, text: "function solve(data) {" },
        { line: 3, text: "    // Process optimal algorithm step-by-step" },
        { line: 4, text: "    return result;" },
        { line: 5, text: "}" }
      ],
      java: [
        { line: 1, text: `// Optimal solution for ${problem?.title || 'Problem'}` },
        { line: 2, text: "public int solve(int[] data) {" },
        { line: 3, text: "    // Process optimal algorithm step-by-step" },
        { line: 4, text: "    return 0;" },
        { line: 5, text: "}" }
      ],
      cpp: [
        { line: 1, text: `// Optimal solution for ${problem?.title || 'Problem'}` },
        { line: 2, text: "int solve(vector<int>& data) {" },
        { line: 3, text: "    // Process optimal algorithm step-by-step" },
        { line: 4, text: "    return 0;" },
        { line: 5, text: "}" }
      ]
    };
  }, [aiVisualization, problem, selectedLanguage]);

  const activeSnippet = codeSnippets[selectedLanguage] || codeSnippets.python;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold">Loading Interactive Algorithm Visualizer...</h2>
        <p className="text-xs text-slate-400 mt-1">Preparing step-by-step memory trace and non-coder learning studio</p>
      </div>
    );
  }

  const problemTitle = problem?.title || 'Interactive Algorithm Visualizer';
  const pricesList = archetype === 'stock'
    ? (activeInput?.data || [7, 1, 5, 3, 6, 4])
    : (activeInput?.nums || [2, 7, 11, 15]);
  const maxPriceVal = Math.max(...pricesList, 10);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-8 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => window.close()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition shrink-0"
            title="Close this visualizer tab"
          >
            <ChevronLeft className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Close Tab</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                {problemTitle}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Visualizer Studio</span>
              </span>
              {aiVisualization ? (
                <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-700/80 items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
                  <span>AI Trace Synthesized ✨</span>
                </span>
              ) : (
                <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Non-Coder Friendly
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate">
              Step-by-step visual learning and interactive placement code walkthrough.
            </p>
          </div>
        </div>

        {/* Action Header Items: Tabs & AI Coach Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Main Studio Navigation Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'visualizer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visualizer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'story' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Beginner Analogy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('problem_info')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${
                activeTab === 'problem_info' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Problem Info</span>
            </button>
          </div>

          {/* AI Coach Chat Toggle Button */}
          <button
            type="button"
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
              chatOpen
                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                : 'bg-slate-800 text-purple-300 hover:bg-slate-700 border border-purple-800/80'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">AI Coach</span>
            {chatMessages.length > 1 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* TAB 1: BEGINNER STORY & REAL-WORLD ANALOGY */}
        {activeTab === 'story' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
                💡
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {beginnerAnalogy.analogyTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  How anyone without a programming background can intuitively understand this problem.
                </p>
              </div>
            </div>

            {/* The Story */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                The Real-World Story:
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {beginnerAnalogy.story}
              </p>
            </div>

            {/* Why Brute Force Fails vs The Aha! Moment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Why The Human Brute Force Way Fails:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {beginnerAnalogy.whyBruteForceFails}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>The "Aha!" Smart Shortcut:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {beginnerAnalogy.ahaMoment}
                </p>
              </div>
            </div>

            {/* 60-Second Placement Interview Pitch */}
            {beginnerAnalogy.interviewPitch && (
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/80 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>60-Second Placement Interview Pitch:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {beginnerAnalogy.interviewPitch}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('visualizer')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition hover:scale-105"
              >
                <span>Jump to Interactive Visualizer 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROBLEM DESCRIPTION & CONSTRAINTS */}
        {activeTab === 'problem_info' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>{problem?.title}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  {problem?.difficulty}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Topic: {problem?.topicId}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Problem Statement</h3>
              <p className="whitespace-pre-line text-sm text-slate-200 leading-relaxed">
                {problem?.statement}
              </p>
            </div>

            {Array.isArray(problem?.constraints) && problem.constraints.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Constraints</h3>
                <ul className="space-y-1.5 list-disc list-inside text-xs font-mono text-slate-300">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx} className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('visualizer')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                <span>Back to Visual Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE ANIMATED VISUALIZER STUDIO */}
        {activeTab === 'visualizer' && (
          <>
            {/* Dataset Presets Bar & Custom Input Sandbox */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  Dataset:
                </span>
                {inputPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsCustomMode(false);
                      setActivePresetIndex(idx);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      !isCustomMode && activePresetIndex === idx
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isCustomMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <Sliders className="w-3 h-3 text-purple-400" />
                  <span>Custom Input & Target ✏️</span>
                </button>
              </div>

              {/* Step indicator count */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span>Step {currentStep + 1} of {simulationSteps.length}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              </div>
            </div>

            {/* Custom Input Drawer (if activated) */}
            {isCustomMode && (
              <div className="bg-slate-900 border border-purple-800/80 rounded-2xl p-4 animate-in fade-in space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    Custom Problem Sandbox (Test any numbers or target):
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Real-time simulation with instant diagnostic feedback
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Array / Sequence (Comma or Space-separated):
                    </label>
                    <input
                      type="text"
                      value={customArrayText}
                      onChange={(e) => setCustomArrayText(e.target.value)}
                      placeholder={archetype === 'stock' ? '7, 1, 5, 3, 6, 4' : '2, 7, 11, 15'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {(archetype === 'two_sum' || archetype === 'binary_search') && (
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Target Value:
                      </label>
                      <input
                        type="text"
                        value={customTargetText}
                        onChange={(e) => setCustomTargetText(e.target.value)}
                        placeholder="9"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}

                  <div className={`sm:col-span-${(archetype === 'two_sum' || archetype === 'binary_search') ? '2' : '4'} flex items-end pt-5`}>
                    <button
                      type="button"
                      onClick={handleRunCustomSimulation}
                      disabled={customLoading || !customArrayText.trim()}
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 transition hover:scale-105"
                    >
                      Simulate 🚀
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Playback Control Bar */}
            <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-900/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Reset to beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold border border-slate-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Step</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all hover:scale-105 ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>

                <button
                  type="button"
                  disabled={currentStep >= simulationSteps.length - 1}
                  onClick={() => setCurrentStep((prev) => Math.min(simulationSteps.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold border border-purple-500/40 transition"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Scrubber track */}
              <div className="flex-1 max-w-md w-full px-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Timeline: Step 1</span>
                  <span>End</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, simulationSteps.length - 1)}
                  value={currentStep}
                  onChange={(e) => {
                    setCurrentStep(Number(e.target.value));
                    setIsPlaying(false);
                  }}
                  aria-label="Simulation timeline scrubber"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl text-xs text-slate-300 border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  aria-label="Playback speed"
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value={0.5} className="bg-slate-900 text-white">0.5x Speed</option>
                  <option value={1} className="bg-slate-900 text-white">1.0x Speed</option>
                  <option value={2} className="bg-slate-900 text-white">2.0x Speed</option>
                </select>
              </div>
            </div>

            {/* Split Screen Layout: Graphical Canvas (7 cols) + Code Viewer (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Visual Element Cards */}
              <div className="lg:col-span-7 space-y-6">
                {/* Step Decision Callout Card */}
                <div className={`p-5 rounded-2xl border transition-all shadow-md ${
                  currentStepData.outcomeStatus === 'solution_found'
                    ? 'bg-gradient-to-r from-emerald-950/90 via-purple-950/40 to-slate-900 border-emerald-500 text-emerald-200'
                    : currentStepData.outcomeStatus === 'solution_not_found'
                      ? 'bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border-rose-500 text-rose-200'
                      : currentStepData.isOptimalUpdate
                        ? 'bg-gradient-to-r from-emerald-950/80 via-purple-950/40 to-slate-900 border-emerald-500/80 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}>
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      currentStepData.outcomeStatus === 'solution_found'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : currentStepData.outcomeStatus === 'solution_not_found'
                          ? 'bg-rose-500 text-white font-black'
                          : currentStepData.isOptimalUpdate
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-purple-600 text-white font-bold'
                    }`}>
                      {currentStepData.outcomeStatus === 'solution_found' ? '🎉' : currentStepData.outcomeStatus === 'solution_not_found' ? '❌' : currentStep + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold text-white">
                        {currentStepData.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                        {currentStepData.explanation}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300">
                          {currentStepData.formula}
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          {currentStepData.decision}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Memory Elements Canvas */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span>Animated Element & Pointer Track</span>
                    </h4>
                    <span className="text-[11px] font-mono text-purple-300">
                      {archetype === 'stock' ? 'Daily Price Bar Chart' : 'Memory Array Slots'}
                    </span>
                  </div>

                  {/* Stock Graphical Bars */}
                  {archetype === 'stock' ? (
                    <div className="pt-8 pb-4 flex items-end justify-between gap-2 overflow-x-auto min-h-[220px]">
                      {pricesList.map((price, idx) => {
                        const isCurrentDay = currentStepData.dayIndex === idx;
                        const isMinBuyDay = currentStepData.buyDay === idx;
                        const isSellDay = currentStepData.sellDay === idx && currentStepData.currentProfit > 0;
                        const barHeightPercent = Math.max(25, Math.round((price / maxPriceVal) * 100));

                        return (
                          <div key={idx} className="flex-1 min-w-[54px] flex flex-col items-center group relative">
                            {/* Floating pointer badge */}
                            <div className="h-10 flex items-end justify-center mb-1 w-full">
                              {isCurrentDay && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600 text-white shadow-lg animate-bounce">
                                  Today
                                </span>
                              )}
                              {!isCurrentDay && isMinBuyDay && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-md">
                                  Buy Day
                                </span>
                              )}
                              {!isCurrentDay && !isMinBuyDay && isSellDay && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-md">
                                  Sell Day
                                </span>
                              )}
                            </div>

                            {/* Bar Card */}
                            <div
                              style={{ height: `${barHeightPercent * 1.4}px` }}
                              className={`w-full max-w-[64px] rounded-2xl flex flex-col items-center justify-between p-2 transition-all duration-300 border ${
                                isCurrentDay
                                  ? 'bg-gradient-to-t from-purple-900 to-purple-600 border-purple-400 shadow-xl shadow-purple-600/30 ring-2 ring-purple-400 scale-105'
                                  : isMinBuyDay
                                    ? 'bg-gradient-to-t from-emerald-950 to-emerald-700 border-emerald-400 shadow-md ring-2 ring-emerald-400/60'
                                    : isSellDay
                                      ? 'bg-gradient-to-t from-amber-950 to-amber-600 border-amber-400 shadow-md'
                                      : 'bg-slate-800/80 border-slate-700/60'
                              }`}
                            >
                              <span className="text-sm font-extrabold text-white">
                                ₹{price}
                              </span>
                              <span className="text-[10px] font-mono text-slate-300">
                                P[{idx}]
                              </span>
                            </div>

                            <div className="mt-2 text-center">
                              <span className="text-xs font-bold text-slate-400">Day {idx + 1}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Two Sum / Binary Search / Two Pointers / Sliding Window / Universal Memory Blocks */
                    <div className="space-y-4">
                      <div className="py-6 flex items-center justify-center gap-3 flex-wrap">
                        {(activeInput?.nums || [2, 7, 11, 15]).map((val, idx) => {
                          const isCurrent = currentStepData.index === idx || currentStepData.mid === idx;
                          const isMatched = (Array.isArray(currentStepData.foundPair) && currentStepData.foundPair.includes(idx)) || (archetype === 'two_pointers' && currentStepData.isOptimalUpdate && (currentStepData.left === idx || currentStepData.right === idx));
                          const isLeft = currentStepData.left === idx;
                          const isRight = currentStepData.right === idx;
                          const inWindow = archetype === 'sliding_window' && typeof currentStepData.left === 'number' && typeof currentStepData.right === 'number' && idx >= currentStepData.left && idx <= currentStepData.right;

                          return (
                            <React.Fragment key={idx}>
                              <div className="flex flex-col items-center">
                                {/* Pointer labels */}
                                <div className="h-6 flex items-center justify-center text-[10px] font-bold">
                                  {isMatched ? (
                                    <span className="text-emerald-400 font-black animate-bounce">Match!</span>
                                  ) : isCurrent ? (
                                    <span className="text-purple-400">Pointer</span>
                                  ) : isLeft ? (
                                    <span className="text-blue-400 font-bold">Left</span>
                                  ) : isRight ? (
                                    <span className="text-amber-400 font-bold">Right</span>
                                  ) : inWindow ? (
                                    <span className="text-indigo-400 font-semibold">Window</span>
                                  ) : null}
                                </div>

                                <div
                                  className={`w-16 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${
                                    isMatched
                                      ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/40 scale-110 shadow-xl'
                                      : isCurrent
                                        ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400 scale-105 shadow-lg'
                                        : isLeft || isRight
                                          ? 'bg-slate-800 border-purple-500 text-white shadow-md'
                                          : inWindow
                                            ? 'bg-indigo-950/70 border-indigo-500/80 text-indigo-100 ring-1 ring-indigo-400'
                                            : 'bg-slate-800 border-slate-700 text-slate-200'
                                  }`}
                                >
                                  <span className="text-xs font-mono text-slate-400">[{idx}]</span>
                                  <span className="text-lg font-black">{val}</span>
                                </div>
                              </div>

                              {/* Linked List pointer arrows between nodes */}
                              {archetype === 'linked_list' && idx < (activeInput?.nums || []).length - 1 && (
                                <div className="flex items-center text-purple-400 font-extrabold text-base pt-6 px-0.5">
                                  ➔
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Prefix Sum live accumulator tray */}
                      {archetype === 'prefix_sum' && currentStepData.prefixArray && (
                        <div className="mt-2 pt-3 border-t border-slate-800">
                          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Prefix Sum Array (prefix[i] = prefix[i-1] + arr[i]):</span>
                            <span className="text-[10px] text-slate-400 font-mono">Answers Range Sums in O(1)</span>
                          </div>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {currentStepData.prefixArray.map((pVal, pIdx) => (
                              <div
                                key={pIdx}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                                  pIdx === currentStepData.prefixArray.length - 1
                                    ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400/40'
                                    : 'bg-slate-950 border-slate-800 text-purple-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-400 block font-normal">prefix[{pIdx}]</span>
                                <span>{pVal}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stack state tray */}
                      {archetype === 'stack' && (
                        <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                            Stack Contents (LIFO Order):
                          </div>
                          <div className="flex items-center gap-2">
                            {currentStepData.stackArray && currentStepData.stackArray.length > 0 ? (
                              currentStepData.stackArray.map((sVal, sIdx) => (
                                <span
                                  key={sIdx}
                                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                                    sIdx === currentStepData.stackArray.length - 1
                                      ? 'bg-purple-600 text-white border-purple-400 animate-pulse shadow-md'
                                      : 'bg-slate-800 text-slate-200 border-slate-700'
                                  }`}
                                >
                                  {sVal} {sIdx === currentStepData.stackArray.length - 1 ? '⭐ TOP' : ''}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">Empty Stack []</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* State Variables HUD */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {archetype === 'stock' ? 'Lowest Buy (min_price)' : 'Current Scan'}
                      </div>
                      <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                        {archetype === 'stock'
                          ? (currentStepData.minPrice === Infinity ? 'None' : `₹${currentStepData.minPrice}`)
                          : (currentStepData.currentNum ?? currentStepData.mid ?? '-')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {archetype === 'stock' ? 'Profit Today' : 'Complement / Target'}
                      </div>
                      <div className="text-base font-extrabold text-purple-400 mt-0.5">
                        {archetype === 'stock'
                          ? (currentStepData.currentPrice !== null && currentStepData.minPrice !== Infinity
                            ? `₹${currentStepData.currentProfit}`
                            : '-')
                          : (currentStepData.complement ?? activeInput?.target ?? '-')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {archetype === 'stock' ? 'Max Profit So Far' : 'Solution Status'}
                      </div>
                      <div className="text-base font-extrabold text-amber-400 mt-0.5">
                        {archetype === 'stock'
                          ? `₹${currentStepData.maxProfit}`
                          : (currentStepData.foundPair
                            ? `Found: [${currentStepData.foundPair.join(', ')}]`
                            : currentStepData.outcomeStatus === 'solution_not_found'
                              ? 'Not Found'
                              : 'Searching...')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Algorithm Invariant
                      </div>
                      <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                        {currentStepData.isOptimalUpdate ? 'Optimal Max Updated' : 'Safe Invariant Holds'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Placement Interview Tip Card */}
                <div className="bg-slate-900 border border-purple-900/50 rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>How to Pitch This in a Placement Interview (60s Pitch)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {archetype === 'stock'
                      ? `"Instead of checking every pair with O(N²) nested loops, we maintain two variables: min_price and max_profit. At each day, we greedily update min_price with the minimum price seen so far. The profit if we sold today is price - min_price. By tracking the maximum profit in a single pass, we achieve optimal O(N) time and O(1) auxiliary space."`
                      : `"Instead of a quadratic double loop, we store visited elements in a Hash Map with their indices. For each element, we check if target - num already exists in O(1) amortized lookup time, achieving O(N) linear time and O(N) space."`}
                  </p>
                </div>
              </div>

              {/* Right Column: Code viewer & Complexity Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Synchronized Code Trace ({selectedLanguage.toUpperCase()})
                      </span>
                    </div>

                    {/* Language selector tabs */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                      {['python', 'javascript', 'java', 'cpp'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setSelectedLanguage(lang)}
                          className={`px-2 py-0.5 rounded-lg font-bold capitalize transition ${
                            selectedLanguage === lang
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Block with Line Numbers */}
                  <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs border border-slate-800 space-y-1 overflow-x-auto">
                    {activeSnippet.map((row) => {
                      const isActive = row.line === currentStepData.activeLine;

                      return (
                        <div
                          key={row.line}
                          className={`flex items-center gap-3 px-2 py-1 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-purple-900/60 border border-purple-500/70 text-purple-100 font-bold shadow'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className={`text-[10px] font-mono select-none w-6 text-right ${
                            isActive ? 'text-purple-300 font-bold' : 'text-slate-600'
                          }`}>
                            {row.line}
                          </span>
                          <span className="whitespace-pre">{row.text}</span>
                          {isActive && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Operation Subtitle */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Executing Line Decision:
                    </div>
                    <div className="font-mono text-purple-300 text-xs font-semibold">
                      {currentStepData.decision || 'Executing line in single pass...'}
                    </div>
                  </div>
                </div>

                {/* Complexity Verification Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Complexity</div>
                    <div className="text-sm font-extrabold text-emerald-400 mt-1">O(N) Linear</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Single-pass traversal</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Space Complexity</div>
                    <div className="text-sm font-extrabold text-purple-400 mt-1">
                      {archetype === 'two_sum' ? 'O(N) Hash Table' : 'O(1) Auxiliary'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {archetype === 'two_sum' ? 'Stores visited elements' : 'Constant pointers only'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Slide-out Interactive AI Tutor Coach Drawer */}
      {chatOpen && (
        <aside 
          aria-label="AI Algorithm Coach Chat"
          className="fixed bottom-0 right-0 sm:right-6 top-16 sm:top-20 w-full sm:w-96 bg-slate-900 border-l sm:border border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right duration-200"
        >
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                AI
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Sarah AI Algorithm Coach</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Non-coder friendly tutor & guide</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'error' ? (
                  <div className="p-3 rounded-2xl max-w-[90%] bg-rose-950/80 border border-rose-800 text-rose-200 rounded-tl-none shadow-sm space-y-2">
                    <div>{msg.text}</div>
                    {msg.retryQuery && (
                      <button
                        type="button"
                        onClick={() => handleSendChat(msg.retryQuery)}
                        className="px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-100 text-[11px] font-bold border border-rose-700 flex items-center gap-1.5 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry Question</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-purple-400 italic">
                <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Sarah is writing an easy explanation...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {dynamicQuickButtons.map((btnText, bIdx) => (
              <button
                key={bIdx}
                type="button"
                onClick={() => handleSendChat(btnText)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition flex items-center gap-1"
              >
                <span>💡</span>
                <span>{btnText}</span>
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Sarah any question about this problem..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !inputQuery.trim()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
