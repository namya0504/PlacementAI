import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Code2,
  Cpu, Layers, Eye, Zap, BookOpen, ExternalLink, HelpCircle,
  TrendingUp, Award, Clock, Compass, Terminal, ShieldCheck
} from 'lucide-react';
import { API } from '../services/api';
import { ROUTES } from '../routes/paths';

/**
 * Interactive Algorithmic Simulation & Animated Step-by-Step Visualizer
 * Opens in a new tab to provide deep intuitive understanding of DSA problems
 */
export default function ProblemVisualizerPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  // Input preset / custom mode
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [customInputText, setCustomInputText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Playback state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x

  // Load problem details
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await API.getDsaProblemDetail(problemId);
        if (isMounted && res?.problem) {
          setProblem(res.problem);
        }
      } catch (err) {
        console.error('Failed to load problem for visualizer:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [problemId]);

  // Determine problem archetype
  const archetype = useMemo(() => {
    const slug = (problem?.problemId || problemId || '').toLowerCase();
    const title = (problem?.title || '').toLowerCase();
    if (slug.includes('buy_sell_stock') || title.includes('buy and sell stock') || title.includes('stock')) {
      return 'stock';
    }
    if (slug.includes('two_sum') || title.includes('two sum')) {
      return 'two_sum';
    }
    if (slug.includes('palindrome') || title.includes('palindrome')) {
      return 'palindrome';
    }
    if (slug.includes('max_subarray') || title.includes('maximum subarray') || title.includes('kadane')) {
      return 'max_subarray';
    }
    if (slug.includes('container') || title.includes('most water')) {
      return 'container';
    }
    return 'universal';
  }, [problem, problemId]);

  // Input presets based on problem archetype
  const inputPresets = useMemo(() => {
    if (archetype === 'stock') {
      return [
        { label: 'Example 1 (Standard Peak & Valley)', data: [7, 1, 5, 3, 6, 4] },
        { label: 'Example 2 (Strictly Decreasing Prices)', data: [7, 6, 4, 3, 1] },
        { label: 'Example 3 (Multiple Peaks & Late Dip)', data: [2, 4, 1, 8, 3, 9] }
      ];
    }
    if (archetype === 'two_sum') {
      return [
        { label: 'Example 1 (Target = 9)', nums: [2, 7, 11, 15], target: 9 },
        { label: 'Example 2 (Target = 6)', nums: [3, 2, 4], target: 6 },
        { label: 'Example 3 (Duplicates, Target = 6)', nums: [3, 3], target: 6 }
      ];
    }
    if (archetype === 'palindrome') {
      return [
        { label: 'Example 1 (Panama phrase)', text: 'A man, a plan, a canal: Panama' },
        { label: 'Example 2 (Non-palindrome)', text: 'race a car' },
        { label: 'Example 3 (Whitespace only)', text: '   ' }
      ];
    }
    if (archetype === 'max_subarray') {
      return [
        { label: 'Example 1 (Standard Kadane)', data: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        { label: 'Example 2 (All Negative)', data: [-5, -2, -8, -1, -4] }
      ];
    }
    return [
      { label: 'Sample Array 1', data: [1, 2, 3, 4, 5] },
      { label: 'Sample Array 2', data: [10, 20, 15, 30, 25] }
    ];
  }, [archetype]);

  // Resolve current active input
  const activeInput = useMemo(() => {
    if (isCustomMode && customInputText.trim()) {
      if (archetype === 'stock' || archetype === 'max_subarray' || archetype === 'container' || archetype === 'universal') {
        const parsed = customInputText.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (parsed.length > 0) return parsed;
      } else if (archetype === 'two_sum') {
        const parts = customInputText.split('|');
        const nums = (parts[0] || '').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        const target = parts[1] ? Number(parts[1].trim()) : 9;
        if (nums.length >= 2) return { nums, target };
      } else if (archetype === 'palindrome') {
        return customInputText;
      }
    }
    return inputPresets[activePresetIndex] || inputPresets[0];
  }, [isCustomMode, customInputText, activePresetIndex, inputPresets, archetype]);

  // Build simulation steps
  const simulationSteps = useMemo(() => {
    // 1. Best Time to Buy and Sell Stock Simulation
    if (archetype === 'stock') {
      const prices = Array.isArray(activeInput) ? activeInput : (activeInput?.data || [7, 1, 5, 3, 6, 4]);
      const steps = [];

      // Step 0: Initialization
      steps.push({
        stepIndex: 0,
        activeLine: 1,
        title: 'Step 0: Initialize Invariants',
        dayIndex: -1,
        currentPrice: null,
        minPrice: Infinity,
        buyDay: null,
        sellDay: null,
        currentProfit: 0,
        maxProfit: 0,
        explanation: 'Initialize min_price to infinity and max_profit to 0. We will scan prices from left to right in a single pass O(N).',
        formula: 'min_price = ∞, max_profit = 0',
        decision: 'Ready to start single-pass scan.',
        isOptimalUpdate: false
      });

      let currentMin = Infinity;
      let bestBuyDay = 0;
      let currentMaxProfit = 0;
      let bestSellDay = null;

      for (let i = 0; i < prices.length; i++) {
        const p = prices[i];
        const dayNum = i + 1;

        if (p < currentMin) {
          currentMin = p;
          bestBuyDay = i;
          steps.push({
            stepIndex: steps.length,
            activeLine: 4,
            title: `Day ${dayNum}: New Lowest Buying Price Found! (₹${p})`,
            dayIndex: i,
            currentPrice: p,
            minPrice: currentMin,
            buyDay: bestBuyDay,
            sellDay: bestSellDay,
            currentProfit: 0,
            maxProfit: currentMaxProfit,
            explanation: `Price today is ₹${p}, which is lower than previous minimum. We update min_price = ₹${p} (Day ${dayNum}). It is always better to buy at the cheapest day before selling!`,
            formula: `min_price = min(prev_min, ${p}) ➔ ₹${currentMin}`,
            decision: `Updated lowest buying price to Day ${dayNum} @ ₹${p}.`,
            isOptimalUpdate: false
          });
        } else {
          const profitIfSoldToday = p - currentMin;
          const isNewRecord = profitIfSoldToday > currentMaxProfit;
          if (isNewRecord) {
            currentMaxProfit = profitIfSoldToday;
            bestSellDay = i;
          }

          steps.push({
            stepIndex: steps.length,
            activeLine: 5,
            title: isNewRecord
              ? `Day ${dayNum}: ⭐ ALL-TIME HIGH PROFIT LOCKED! (₹${currentMaxProfit})`
              : `Day ${dayNum}: Check Profit if Sold Today (₹${profitIfSoldToday})`,
            dayIndex: i,
            currentPrice: p,
            minPrice: currentMin,
            buyDay: bestBuyDay,
            sellDay: bestSellDay,
            currentProfit: profitIfSoldToday,
            maxProfit: currentMaxProfit,
            explanation: isNewRecord
              ? `If we bought on Day ${bestBuyDay + 1} (₹${currentMin}) and sell TODAY on Day ${dayNum} (₹${p}), profit = ${p} - ${currentMin} = ₹${profitIfSoldToday}. This beats our previous record! We update max_profit = ₹${currentMaxProfit}!`
              : `If we bought on Day ${bestBuyDay + 1} (₹${currentMin}) and sell today on Day ${dayNum} (₹${p}), profit = ${p} - ${currentMin} = ₹${profitIfSoldToday}. Since ₹${profitIfSoldToday} <= current max profit (₹${currentMaxProfit}), max_profit remains ₹${currentMaxProfit}.`,
            formula: `Profit = ${p} - ${currentMin} = ₹${profitIfSoldToday} ${isNewRecord ? '➔ New Max!' : '➔ Not optimal'}`,
            decision: isNewRecord
              ? `Updated best transaction: Buy Day ${bestBuyDay + 1} @ ₹${currentMin}, Sell Day ${dayNum} @ ₹${p}.`
              : `Keep previous best transaction (₹${currentMaxProfit} profit).`,
            isOptimalUpdate: isNewRecord
          });
        }
      }

      // Final Step
      steps.push({
        stepIndex: steps.length,
        activeLine: 6,
        title: `Final Verdict: Maximum Achievable Profit = ₹${currentMaxProfit}`,
        dayIndex: prices.length - 1,
        currentPrice: prices[prices.length - 1],
        minPrice: currentMin,
        buyDay: bestBuyDay,
        sellDay: bestSellDay,
        currentProfit: currentMaxProfit,
        maxProfit: currentMaxProfit,
        explanation: currentMaxProfit > 0
          ? `Algorithm complete! The optimal strategy is to BUY on Day ${bestBuyDay + 1} (₹${prices[bestBuyDay]}) and SELL on Day ${(bestSellDay !== null ? bestSellDay + 1 : bestBuyDay + 1)} (₹${prices[bestSellDay !== null ? bestSellDay : bestBuyDay]}), securing a maximum profit of ₹${currentMaxProfit}. Time Complexity: O(N), Space Complexity: O(1).`
          : 'Algorithm complete! Prices are strictly decreasing or constant. No profitable transactions can be made. Maximum profit returned is 0.',
        formula: `return max_profit = ${currentMaxProfit}`,
        decision: `Execution finished in ${prices.length} iterations.`,
        isOptimalUpdate: true
      });

      return steps;
    }

    // 2. Two Sum Simulation
    if (archetype === 'two_sum') {
      const { nums = [2, 7, 11, 15], target = 9 } = activeInput?.nums ? activeInput : { nums: [2, 7, 11, 15], target: 9 };
      const steps = [];

      steps.push({
        stepIndex: 0,
        activeLine: 1,
        title: `Step 0: Initialize Hash Map (Target = ${target})`,
        index: -1,
        seen: {},
        complement: null,
        currentNum: null,
        foundPair: null,
        explanation: `Initialize empty hash map 'seen = {}'. As we scan numbers, we will compute 'complement = target - num' and check if it already exists in O(1) time.`,
        formula: `seen = {}, target = ${target}`,
        decision: 'Ready to scan array.'
      });

      const seen = {};
      let foundPair = null;

      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const comp = target - num;
        const exists = comp in seen;

        if (exists) {
          foundPair = [seen[comp], i];
          steps.push({
            stepIndex: steps.length,
            activeLine: 4,
            title: `Index ${i}: 🎉 COMPLEMENT FOUND IN HASH MAP! [${comp} + ${num} = ${target}]`,
            index: i,
            seen: { ...seen },
            complement: comp,
            currentNum: num,
            foundPair,
            explanation: `At index ${i}, number is ${num}. Complement needed is ${target} - ${num} = ${comp}. Checking hash map: ${comp} EXISTS at index ${seen[comp]}! We found the solution!`,
            formula: `complement = ${target} - ${num} = ${comp} ➔ Exists at seen[${comp}] = ${seen[comp]}!`,
            decision: `Target pair found: indices [${seen[comp]}, ${i}].`,
            isOptimalUpdate: true
          });
          break;
        } else {
          seen[num] = i;
          steps.push({
            stepIndex: steps.length,
            activeLine: 6,
            title: `Index ${i}: Complement ${comp} not in map ➔ Store seen[${num}] = ${i}`,
            index: i,
            seen: { ...seen },
            complement: comp,
            currentNum: num,
            foundPair: null,
            explanation: `At index ${i}, number is ${num}. Complement needed is ${target} - ${num} = ${comp}. ${comp} is not yet in seen map. We store seen[${num}] = ${i} and continue.`,
            formula: `seen[${num}] = ${i}`,
            decision: `Added ${num} to map. Looking for next element.`
          });
        }
      }

      return steps;
    }

    // 3. Fallback Universal Simulation
    const items = [10, 20, 30, 40, 50];
    return items.map((val, idx) => ({
      stepIndex: idx,
      activeLine: idx + 1,
      title: `Step ${idx + 1}: Process Element ${val}`,
      index: idx,
      currentPrice: val,
      explanation: `Iteration ${idx + 1}: Examining element ${val} at index ${idx}. Maintaining algorithm invariant.`,
      formula: `Index ${idx} -> Value ${val}`,
      decision: `Progressing through array in O(N) linear time.`
    }));
  }, [archetype, activeInput]);

  // Clamp current step on data changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [activeInput, archetype]);

  // Autoplay timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const intervalMs = Math.round(1500 / playbackSpeed);
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= simulationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, simulationSteps.length]);

  const currentStepData = simulationSteps[currentStep] || simulationSteps[0] || {};

  // Code snippets by language with line numbers
  const codeSnippets = useMemo(() => {
    if (archetype === 'stock') {
      return {
        python: [
          { line: 1, text: "def maxProfit(prices):" },
          { line: 2, text: "    min_price = float('inf')" },
          { line: 3, text: "    max_profit = 0" },
          { line: 4, text: "    for price in prices:" },
          { line: 5, text: "        if price < min_price:" },
          { line: 6, text: "            min_price = price  # cheaper buy day" },
          { line: 7, text: "        else:" },
          { line: 8, text: "            profit = price - min_price" },
          { line: 9, text: "            max_profit = max(max_profit, profit)" },
          { line: 10, text: "    return max_profit" }
        ],
        javascript: [
          { line: 1, text: "function maxProfit(prices) {" },
          { line: 2, text: "    let minPrice = Infinity;" },
          { line: 3, text: "    let maxProfit = 0;" },
          { line: 4, text: "    for (let price of prices) {" },
          { line: 5, text: "        if (price < minPrice) {" },
          { line: 6, text: "            minPrice = price;" },
          { line: 7, text: "        } else {" },
          { line: 8, text: "            maxProfit = Math.max(maxProfit, price - minPrice);" },
          { line: 9, text: "        }" },
          { line: 10, text: "    }" },
          { line: 11, text: "    return maxProfit;" },
          { line: 12, text: "}" }
        ],
        java: [
          { line: 1, text: "public int maxProfit(int[] prices) {" },
          { line: 2, text: "    int minPrice = Integer.MAX_VALUE;" },
          { line: 3, text: "    int maxProfit = 0;" },
          { line: 4, text: "    for (int price : prices) {" },
          { line: 5, text: "        if (price < minPrice) {" },
          { line: 6, text: "            minPrice = price;" },
          { line: 7, text: "        } else {" },
          { line: 8, text: "            maxProfit = Math.max(maxProfit, price - minPrice);" },
          { line: 9, text: "        }" },
          { line: 10, text: "    }" },
          { line: 11, text: "    return maxProfit;" },
          { line: 12, text: "}" }
        ],
        cpp: [
          { line: 1, text: "int maxProfit(vector<int>& prices) {" },
          { line: 2, text: "    int min_price = INT_MAX;" },
          { line: 3, text: "    int max_profit = 0;" },
          { line: 4, text: "    for (int price : prices) {" },
          { line: 5, text: "        if (price < min_price) {" },
          { line: 6, text: "            min_price = price;" },
          { line: 7, text: "        } else {" },
          { line: 8, text: "            max_profit = max(max_profit, price - min_price);" },
          { line: 9, text: "        }" },
          { line: 10, text: "    }" },
          { line: 11, text: "    return max_profit;" },
          { line: 12, text: "}" }
        ]
      };
    }

    // Two Sum Code Snippets
    return {
      python: [
        { line: 1, text: "def twoSum(nums, target):" },
        { line: 2, text: "    seen = {}" },
        { line: 3, text: "    for i, num in enumerate(nums):" },
        { line: 4, text: "        complement = target - num" },
        { line: 5, text: "        if complement in seen:" },
        { line: 6, text: "            return [seen[complement], i]" },
        { line: 7, text: "        seen[num] = i" },
        { line: 8, text: "    return []" }
      ],
      javascript: [
        { line: 1, text: "function twoSum(nums, target) {" },
        { line: 2, text: "    const seen = new Map();" },
        { line: 3, text: "    for (let i = 0; i < nums.length; i++) {" },
        { line: 4, text: "        const complement = target - nums[i];" },
        { line: 5, text: "        if (seen.has(complement)) {" },
        { line: 6, text: "            return [seen.get(complement), i];" },
        { line: 7, text: "        }" },
        { line: 8, text: "        seen.set(nums[i], i);" },
        { line: 9, text: "    }" },
        { line: 10, text: "    return [];" },
        { line: 11, text: "}" }
      ],
      java: [
        { line: 1, text: "public int[] twoSum(int[] nums, int target) {" },
        { line: 2, text: "    Map<Integer, Integer> seen = new HashMap<>();" },
        { line: 3, text: "    for (int i = 0; i < nums.length; i++) {" },
        { line: 4, text: "        int comp = target - nums[i];" },
        { line: 5, text: "        if (seen.containsKey(comp)) {" },
        { line: 6, text: "            return new int[]{ seen.get(comp), i };" },
        { line: 7, text: "        }" },
        { line: 8, text: "        seen.put(nums[i], i);" },
        { line: 9, text: "    }" },
        { line: 10, text: "    return new int[]{};" },
        { line: 11, text: "}" }
      ],
      cpp: [
        { line: 1, text: "vector<int> twoSum(vector<int>& nums, int target) {" },
        { line: 2, text: "    unordered_map<int, int> seen;" },
        { line: 3, text: "    for (int i = 0; i < nums.size(); i++) {" },
        { line: 4, text: "        int comp = target - nums[i];" },
        { line: 5, text: "        if (seen.count(comp)) {" },
        { line: 6, text: "            return {seen[comp], i};" },
        { line: 7, text: "        }" },
        { line: 8, text: "        seen[nums[i]] = i;" },
        { line: 9, text: "    }" },
        { line: 10, text: "    return {};" },
        { line: 11, text: "}" }
      ]
    };
  }, [archetype]);

  const activeSnippet = codeSnippets[selectedLanguage] || codeSnippets.python;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Loading Interactive Algorithm Visualizer...</h2>
        <p className="text-xs text-slate-400 mt-1">Preparing step-by-step memory trace and visual simulator</p>
      </div>
    );
  }

  const problemTitle = problem?.title || 'Algorithm Visualizer';
  const pricesList = Array.isArray(activeInput) ? activeInput : (activeInput?.data || [7, 1, 5, 3, 6, 4]);
  const maxPriceVal = Math.max(...pricesList, 10);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <header className="h-16 px-4 sm:px-8 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4 min-w-0">
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
              <h1 className="text-base font-extrabold text-white tracking-tight truncate">
                {problemTitle}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Animated Visualizer Studio
              </span>
              <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Optimal O(N) Single-Pass
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate">
              Step-by-step interactive visual dry-run for campus placement interviews.
            </p>
          </div>
        </div>

        {/* Language selector & Speed badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['python', 'javascript', 'java', 'cpp'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs capitalize transition ${
                  selectedLanguage === lang
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
              </button>
            ))}
          </div>

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
      </header>

      {/* Main Visualizer Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Preset Selector & Input Control Bar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isCustomMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/80'
              }`}
            >
              Custom Input ✏️
            </button>
          </div>

          {/* Step Indicator Count */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>Step {currentStep + 1} of {simulationSteps.length}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
          </div>
        </div>

        {/* Custom Input Drawer if open */}
        {isCustomMode && (
          <div className="bg-slate-900 border border-purple-800/80 rounded-2xl p-4 animate-in fade-in space-y-2">
            <div className="text-xs font-bold text-purple-300">
              Enter custom space or comma-separated numbers (e.g. 7, 1, 5, 3, 6, 4):
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="7, 1, 5, 3, 6, 4"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                Simulate
              </button>
            </div>
          </div>
        )}

        {/* Interactive Playback Control Bar */}
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
              <span>Timeline: Start</span>
              <span>Complete</span>
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
        </div>

        {/* Visual Canvas Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Graphical Simulation Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Action Callout Banner for Current Step */}
            <div className={`p-5 rounded-2xl border transition-all shadow-md ${
              currentStepData.isOptimalUpdate
                ? 'bg-gradient-to-r from-emerald-950/80 via-purple-950/40 to-slate-900 border-emerald-500/80 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  currentStepData.isOptimalUpdate ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-purple-600 text-white'
                }`}>
                  {currentStepData.isOptimalUpdate ? '⭐' : currentStep + 1}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {currentStepData.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {currentStepData.explanation}
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300">
                    <span className="font-semibold text-slate-400">Math:</span>
                    <span>{currentStepData.formula}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphical Visualization of Elements */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Interactive Memory & Pointer Canvas</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {archetype === 'stock' ? 'Prices by Day' : 'Array Elements'}
                </span>
              </div>

              {/* Elements Cards Bar */}
              {archetype === 'stock' ? (
                <div className="pt-8 pb-4 flex items-end justify-between gap-2 overflow-x-auto min-h-[220px]">
                  {pricesList.map((price, idx) => {
                    const isCurrentDay = currentStepData.dayIndex === idx;
                    const isMinBuyDay = currentStepData.buyDay === idx;
                    const isSellDay = currentStepData.sellDay === idx && currentStepData.currentProfit > 0;
                    const barHeightPercent = Math.max(25, Math.round((price / maxPriceVal) * 100));

                    return (
                      <div key={idx} className="flex-1 min-w-[54px] flex flex-col items-center group relative">
                        {/* Top Pointer Badge */}
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

                        {/* Visual Bar Card */}
                        <div
                          style={{ height: `${barHeightPercent * 1.4}px` }}
                          className={`w-full max-w-[64px] rounded-2xl flex flex-col items-center justify-between p-2 transition-all duration-300 border ${
                            isCurrentDay
                              ? 'bg-gradient-to-t from-purple-900 to-purple-600 border-purple-400 shadow-xl shadow-purple-600/30 ring-2 ring-purple-400 scale-105'
                              : isMinBuyDay
                                ? 'bg-gradient-to-t from-emerald-950 to-emerald-700 border-emerald-400 shadow-md ring-2 ring-emerald-400/60'
                                : isSellDay
                                  ? 'bg-gradient-to-t from-amber-950 to-amber-600 border-amber-400 shadow-md'
                                  : 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-sm font-extrabold text-white">
                            ₹{price}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300">
                            P[{idx}]
                          </span>
                        </div>

                        {/* Day label */}
                        <div className="mt-2 text-center">
                          <span className="text-xs font-bold text-slate-400">Day {idx + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Two Sum / Generic Canvas */
                <div className="py-6 flex items-center justify-center gap-3 flex-wrap">
                  {(activeInput?.nums || [2, 7, 11, 15]).map((val, idx) => {
                    const isCurrent = currentStepData.index === idx;
                    const isMatched = Array.isArray(currentStepData.foundPair) && currentStepData.foundPair.includes(idx);

                    return (
                      <div
                        key={idx}
                        className={`w-16 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${
                          isMatched
                            ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/40 scale-110 shadow-xl'
                            : isCurrent
                              ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400 scale-105 shadow-lg'
                              : 'bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-mono text-slate-400">[{idx}]</span>
                        <span className="text-lg font-black">{val}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* State Variables HUD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {archetype === 'stock' ? 'Lowest Buy (min_price)' : 'Current Element'}
                  </div>
                  <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                    {archetype === 'stock'
                      ? (currentStepData.minPrice === Infinity ? 'None' : `₹${currentStepData.minPrice}`)
                      : (currentStepData.currentNum ?? '-')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {archetype === 'stock' ? 'Profit Today' : 'Complement Needed'}
                  </div>
                  <div className="text-base font-extrabold text-purple-400 mt-0.5">
                    {archetype === 'stock'
                      ? (currentStepData.currentPrice !== null && currentStepData.minPrice !== Infinity
                        ? `₹${currentStepData.currentProfit}`
                        : '-')
                      : (currentStepData.complement ?? '-')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {archetype === 'stock' ? 'Max Profit So Far' : 'Pair Found'}
                  </div>
                  <div className="text-base font-extrabold text-amber-400 mt-0.5">
                    {archetype === 'stock'
                      ? `₹${currentStepData.maxProfit}`
                      : (currentStepData.foundPair ? `[${currentStepData.foundPair.join(', ')}]` : 'Searching...')}
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
                <span>How to Explain to the Placement Interviewer (60s Pitch)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {archetype === 'stock'
                  ? `"Instead of checking every pair with O(N²) nested loops, we maintain two variables: min_price and max_profit. At each day, we greedily update min_price with the minimum price seen so far. The profit if we sold today is price - min_price. By tracking the maximum profit in a single pass, we achieve optimal O(N) time and O(1) auxiliary space."`
                  : `"Instead of a quadratic double loop, we store visited elements in a Hash Map with their indices. For each element, we check if target - num already exists in O(1) amortized lookup time, achieving O(N) linear time."`}
              </p>
            </div>
          </div>

          {/* Right Column: Synchronized Code Line Highlighting (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Synchronized Code Trace ({selectedLanguage.toUpperCase()})
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Step {currentStep + 1}
                </span>
              </div>

              {/* Code Box with Line Numbers */}
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

              {/* Step Action Detail */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Operation:
                </div>
                <div className="font-mono text-purple-300 text-xs font-semibold">
                  {currentStepData.decision || 'Executing line...'}
                </div>
              </div>
            </div>

            {/* Complexity Invariants Card */}
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
      </main>
    </div>
  );
}
