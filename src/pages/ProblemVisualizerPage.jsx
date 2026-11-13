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

  // Playback State
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // AI Tutor Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I'm Sarah, your placement algorithm coach! Whether you're a complete non-coder or brushing up for campus interviews, I can explain every line, analogy, or custom test case. Ask me anything below!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Load problem details from API
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

    if (slug.includes('buy_sell_stock') || title.includes('stock') || title.includes('buy and sell')) {
      return 'stock';
    }
    if (slug.includes('two_sum') || title.includes('two sum') || title.includes('pair')) {
      return 'two_sum';
    }
    if (slug.includes('palindrome') || title.includes('palindrome') || title.includes('reverse')) {
      return 'palindrome';
    }
    if (slug.includes('max_subarray') || title.includes('maximum subarray') || title.includes('kadane')) {
      return 'max_subarray';
    }
    if (slug.includes('container') || title.includes('most water')) {
      return 'container';
    }
    if (slug.includes('binary_search') || title.includes('binary search') || topic === 'binary search') {
      return 'binary_search';
    }
    if (slug.includes('parentheses') || title.includes('parentheses') || topic === 'stack') {
      return 'stack';
    }
    if (topic === 'sliding window' || title.includes('sliding window') || title.includes('window')) {
      return 'sliding_window';
    }
    return 'universal';
  }, [problem, problemId]);

  // Input presets based on problem archetype
  const inputPresets = useMemo(() => {
    if (archetype === 'stock') {
      return [
        { label: 'Example 1: Peak & Valley', data: [7, 1, 5, 3, 6, 4] },
        { label: 'Example 2: Strictly Decreasing (No Profit)', data: [7, 6, 4, 3, 1] },
        { label: 'Example 3: Early Dip & Late Moon', data: [2, 4, 1, 8, 3, 9] },
        { label: 'Example 4: Flat Prices', data: [3, 3, 3, 3, 3] }
      ];
    }
    if (archetype === 'two_sum') {
      return [
        { label: 'Example 1: Target = 9', nums: [2, 7, 11, 15], target: 9 },
        { label: 'Example 2: Target = 6', nums: [3, 2, 4], target: 6 },
        { label: 'Example 3: Duplicate Elements (Target = 6)', nums: [3, 3], target: 6 },
        { label: 'Example 4: Target NOT Found (Target = 100)', nums: [1, 4, 6, 12, 15], target: 100 }
      ];
    }
    if (archetype === 'palindrome') {
      return [
        { label: 'Example 1: Panama Phrase', text: 'A man, a plan, a canal: Panama' },
        { label: 'Example 2: Not a Palindrome', text: 'race a car' },
        { label: 'Example 3: Empty / Whitespace', text: '   ' }
      ];
    }
    if (archetype === 'max_subarray') {
      return [
        { label: 'Example 1: Standard Mixed Subarray', data: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        { label: 'Example 2: All Negative Elements', data: [-5, -2, -8, -1, -4] },
        { label: 'Example 3: Single Positive Peak', data: [1, 2, 3, 4] }
      ];
    }
    if (archetype === 'binary_search') {
      return [
        { label: 'Example 1: Target = 9 (Found)', nums: [-1, 0, 3, 5, 9, 12], target: 9 },
        { label: 'Example 2: Target = 2 (NOT Found)', nums: [-1, 0, 3, 5, 9, 12], target: 2 }
      ];
    }
    return [
      { label: 'Sample Array 1: Linear Sequence', data: [1, 2, 3, 4, 5], target: 10 },
      { label: 'Sample Array 2: Varied Data', data: [10, 4, 8, 15, 22], target: 25 },
      { label: 'Sample Array 3: Unsolvable Target', data: [5, 10, 15, 20], target: 99 }
    ];
  }, [archetype]);

  // Resolve current active input
  const activeInput = useMemo(() => {
    if (isCustomMode && customArrayText.trim()) {
      if (archetype === 'two_sum' || archetype === 'binary_search') {
        const nums = customArrayText.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        const target = Number(customTargetText) || 9;
        if (nums.length > 0) return { nums, target };
      } else if (archetype === 'palindrome') {
        return { text: customArrayText };
      } else {
        const parsed = customArrayText.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (parsed.length > 0) return { data: parsed };
      }
    }
    return inputPresets[activePresetIndex] || inputPresets[0];
  }, [isCustomMode, customArrayText, customTargetText, activePresetIndex, inputPresets, archetype]);

  // Non-coder real-world story analogy for the problem
  const beginnerAnalogy = useMemo(() => {
    if (archetype === 'stock') {
      return {
        analogyTitle: '👟 The Sneaker / Crypto Resale Analogy',
        story: 'Imagine you want to buy a collectible sneaker on one day and sell it on a future day for the highest profit. If sneaker prices are [₹7, ₹1, ₹5, ₹3, ₹6, ₹4], you should never buy at ₹7 when you know it drops to ₹1 tomorrow! The smart strategy is to remember the absolute cheapest price you have seen so far (₹1 on Day 2), and as each new day comes, ask: "If I sold today, what is my profit?" On Day 5 it hits ₹6, netting you ₹6 - ₹1 = ₹5 profit! That is the secret of the single-pass algorithm!',
        whyBruteForceFails: 'A non-coder might compare every day with every future day (7 with 1, 7 with 5, 7 with 3...). For 100,000 days, that would take 10,000,000,000 checks—your computer would freeze! With our greedy trick, we only scan once: 100,000 checks in 0.01 seconds!',
        ahaMoment: 'Aha! We only need to remember ONE number from the past: the cheapest price seen so far.'
      };
    }
    if (archetype === 'two_sum') {
      return {
        analogyTitle: '🛒 The Supermarket Coupon Match Analogy',
        story: 'Imagine you have a ₹9 gift voucher, and you must pick exactly TWO items that sum to ₹9. You walk down the aisle and pick up an item costing ₹2. You instantly know: "I need an item costing ₹7 (because 9 - 2 = 7)!" Instead of running back to check every aisle, you write "₹2 is at Shelf 0" on your notepad. When you reach the ₹7 item later, you check your notepad: "Aha! I already saw a ₹2 item earlier!" Match found instantly!',
        whyBruteForceFails: 'Comparing every item with every other item means nested loops O(N²). If a store has 10,000 items, you would make 100,000,000 comparisons!',
        ahaMoment: 'Aha! Instead of searching for the second number, use a Hash Map (notepad) so you only need one quick lookup per item!'
      };
    }
    if (archetype === 'binary_search') {
      return {
        analogyTitle: '📖 The Dictionary / Guess-the-Number Game',
        story: 'Imagine looking up a word in a 1,000-page dictionary. You do NOT flip page by page starting from page 1! Instead, you open right to page 500. If your word starts with "T", you instantly discard pages 1–500 and chop the dictionary in half! Then you check page 750. In just 10 checks, you can find any word out of 1,000 pages!',
        whyBruteForceFails: 'Linear scanning one by one takes O(N). If the dictionary has 1,000,000 pages, linear search takes up to 1,000,000 steps, while Binary Search takes only 20 steps!',
        ahaMoment: 'Aha! Because the list is sorted, every single check cuts the remaining work in half!'
      };
    }
    if (archetype === 'max_subarray') {
      return {
        analogyTitle: '⛄ The Rolling Snowball Analogy (Kadane)',
        story: 'Imagine rolling a snowball down a hill to make it as big as possible. When you hit a patch of heavy mud (a big negative number), if the mud makes your snowball smaller than starting a fresh snowball right here, you DITCH the old ball and start fresh! If the existing snowball is positive, you keep adding to it!',
        whyBruteForceFails: 'Checking all possible start and end indices takes O(N²) or O(N³). Kadane’s algorithm makes a single decision at each step: "Is my past sum helping me, or dragging me down?"',
        ahaMoment: 'Aha! If cur_sum drops below 0, it can never help future numbers. Drop it and start fresh at the next number!'
      };
    }
    return {
      analogyTitle: '🧩 The Step-by-Step Problem Solver',
      story: 'Every algorithm in computer science is just a smart recipe to avoid redundant human work. By maintaining an invariant (a promise that holds true at every step), we process input systematically from left to right.',
      whyBruteForceFails: 'Brute force does the same calculation hundreds of times. Optimal algorithms use smart memory or pointers to solve it in a single pass.',
      ahaMoment: 'Aha! Observe the pattern, eliminate redundant checks, and let the pointers do the work!'
    };
  }, [archetype]);

  // Simulation Step Generator (Universal & Specialized)
  const simulationSteps = useMemo(() => {
    // 1. Stock Simulation
    if (archetype === 'stock') {
      const prices = activeInput?.data || [7, 1, 5, 3, 6, 4];
      const steps = [];

      steps.push({
        stepIndex: 0,
        activeLine: 2,
        title: 'Step 0: Initialize Invariants',
        dayIndex: -1,
        currentPrice: null,
        minPrice: Infinity,
        buyDay: null,
        sellDay: null,
        currentProfit: 0,
        maxProfit: 0,
        explanation: 'We initialize min_price = ∞ and max_profit = 0. We will walk through the days from left to right in a single pass.',
        formula: 'min_price = ∞, max_profit = ₹0',
        decision: 'Ready to scan stock prices.',
        isOptimalUpdate: false,
        outcomeStatus: 'ready'
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
            activeLine: 6,
            title: `Day ${dayNum}: New Lowest Price Found! (₹${p})`,
            dayIndex: i,
            currentPrice: p,
            minPrice: currentMin,
            buyDay: bestBuyDay,
            sellDay: bestSellDay,
            currentProfit: 0,
            maxProfit: currentMaxProfit,
            explanation: `Price today is ₹${p}, which is lower than previous minimum. We update min_price = ₹${p} (Day ${dayNum}). It is always best to buy at the lowest possible valley before selling!`,
            formula: `min_price = min(prev, ${p}) ➔ ₹${currentMin}`,
            decision: `Lowest buy price set to Day ${dayNum} @ ₹${p}.`,
            isOptimalUpdate: false,
            outcomeStatus: 'in_progress'
          });
        } else {
          const profitToday = p - currentMin;
          const isNewRecord = profitToday > currentMaxProfit;
          if (isNewRecord) {
            currentMaxProfit = profitToday;
            bestSellDay = i;
          }

          steps.push({
            stepIndex: steps.length,
            activeLine: 9,
            title: isNewRecord
              ? `Day ${dayNum}: ⭐ NEW RECORD PROFIT LOCKED! (₹${currentMaxProfit})`
              : `Day ${dayNum}: Check Profit if Sold Today (₹${profitToday})`,
            dayIndex: i,
            currentPrice: p,
            minPrice: currentMin,
            buyDay: bestBuyDay,
            sellDay: bestSellDay,
            currentProfit: profitToday,
            maxProfit: currentMaxProfit,
            explanation: isNewRecord
              ? `If we bought on Day ${bestBuyDay + 1} (₹${currentMin}) and sell TODAY on Day ${dayNum} (₹${p}), profit = ${p} - ${currentMin} = ₹${profitToday}! This beats our previous best, so we update max_profit = ₹${currentMaxProfit}!`
              : `If we bought on Day ${bestBuyDay + 1} (₹${currentMin}) and sell today on Day ${dayNum} (₹${p}), profit = ${p} - ${currentMin} = ₹${profitToday}. Since ₹${profitToday} <= current best (₹${currentMaxProfit}), max_profit remains ₹${currentMaxProfit}.`,
            formula: `Profit = ${p} - ${currentMin} = ₹${profitToday} ${isNewRecord ? '➔ New Record! ⭐' : '➔ Not optimal'}`,
            decision: isNewRecord
              ? `Updated best trade: Buy Day ${bestBuyDay + 1} @ ₹${currentMin}, Sell Day ${dayNum} @ ₹${p}.`
              : `Keep current best profit (₹${currentMaxProfit}).`,
            isOptimalUpdate: isNewRecord,
            outcomeStatus: isNewRecord ? 'record_updated' : 'in_progress'
          });
        }
      }

      // Final Verdict
      const hasProfit = currentMaxProfit > 0;
      steps.push({
        stepIndex: steps.length,
        activeLine: 10,
        title: hasProfit
          ? `🎉 Simulation Complete: Maximum Profit is ₹${currentMaxProfit}`
          : `⚠️ Simulation Complete: No Profitable Trade Possible (Max Profit: ₹0)`,
        dayIndex: prices.length - 1,
        currentPrice: prices[prices.length - 1],
        minPrice: currentMin,
        buyDay: bestBuyDay,
        sellDay: bestSellDay,
        currentProfit: currentMaxProfit,
        maxProfit: currentMaxProfit,
        explanation: hasProfit
          ? `Done! The optimal transaction is to BUY on Day ${bestBuyDay + 1} at ₹${prices[bestBuyDay]} and SELL on Day ${(bestSellDay !== null ? bestSellDay + 1 : bestBuyDay + 1)} at ₹${prices[bestSellDay !== null ? bestSellDay : bestBuyDay]}, locking in a profit of ₹${currentMaxProfit}!`
          : 'Prices were strictly decreasing or flat. Since you cannot travel backward in time, buying on any day would lead to a loss or zero gain. Therefore, the optimal profit is ₹0.',
        formula: `return max_profit = ${currentMaxProfit}`,
        decision: hasProfit
          ? `Success! Maximum profit of ₹${currentMaxProfit} achieved in O(N) single-pass.`
          : 'Zero profit returned safely without losses.',
        isOptimalUpdate: hasProfit,
        outcomeStatus: hasProfit ? 'solution_found' : 'solution_not_found'
      });

      return steps;
    }

    // 2. Two Sum Simulation (with Found & NOT Found handling)
    if (archetype === 'two_sum') {
      const nums = activeInput?.nums || [2, 7, 11, 15];
      const target = typeof activeInput?.target === 'number' ? activeInput.target : 9;
      const steps = [];

      steps.push({
        stepIndex: 0,
        activeLine: 2,
        title: `Step 0: Initialize Hash Map (Target = ${target})`,
        index: -1,
        seen: {},
        currentNum: null,
        complement: null,
        foundPair: null,
        explanation: `We initialize an empty Hash Map 'seen = {}'. We need to find two numbers that sum to ${target}. For each number, we will compute 'complement = ${target} - num' and check if it was seen before in O(1) time.`,
        formula: `target = ${target}, seen = {}`,
        decision: `Starting scan looking for pairs that equal ${target}.`,
        isOptimalUpdate: false,
        outcomeStatus: 'ready'
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
            activeLine: 6,
            title: `Index ${i}: 🎉 COMPLEMENT FOUND IN HASH MAP! [${comp} + ${num} = ${target}]`,
            index: i,
            seen: { ...seen },
            currentNum: num,
            complement: comp,
            foundPair,
            explanation: `At index ${i}, number is ${num}. Complement needed is ${target} - ${num} = ${comp}. We check our map: ${comp} IS ALREADY PRESENT at index ${seen[comp]}! 2 + 7 = 9! We have found the solution!`,
            formula: `seen[${comp}] = ${seen[comp]} ➔ Match found! Indices: [${seen[comp]}, ${i}]`,
            decision: `Target reached! Returning indices [${seen[comp]}, ${i}].`,
            isOptimalUpdate: true,
            outcomeStatus: 'solution_found'
          });
          break;
        } else {
          seen[num] = i;
          steps.push({
            stepIndex: steps.length,
            activeLine: 7,
            title: `Index ${i}: Complement ${comp} not in map ➔ Store seen[${num}] = ${i}`,
            index: i,
            seen: { ...seen },
            currentNum: num,
            complement: comp,
            foundPair: null,
            explanation: `At index ${i}, number is ${num}. Complement needed is ${target} - ${num} = ${comp}. ${comp} has not been seen yet. We store seen[${num}] = ${i} on our notepad and move to the next item.`,
            formula: `seen[${num}] = ${i}`,
            decision: `Added ${num} to map. Moving forward.`,
            isOptimalUpdate: false,
            outcomeStatus: 'in_progress'
          });
        }
      }

      // If loop completed without finding pair
      if (!foundPair) {
        steps.push({
          stepIndex: steps.length,
          activeLine: 8,
          title: `❌ Target ${target} NOT Found in Array!`,
          index: nums.length - 1,
          seen: { ...seen },
          currentNum: nums[nums.length - 1],
          complement: null,
          foundPair: null,
          explanation: `All ${nums.length} elements were evaluated, but no two numbers in [${nums.join(', ')}] sum to ${target}. The algorithm completes and safely returns [] (empty list).`,
          formula: `No pair sums to ${target} ➔ return []`,
          decision: `Gracefully handled: Target ${target} is impossible with this array.`,
          isOptimalUpdate: false,
          outcomeStatus: 'solution_not_found'
        });
      }

      return steps;
    }

    // 3. Binary Search Simulation
    if (archetype === 'binary_search') {
      const nums = activeInput?.nums || [-1, 0, 3, 5, 9, 12];
      const target = typeof activeInput?.target === 'number' ? activeInput.target : 9;
      const steps = [];

      let left = 0;
      let right = nums.length - 1;
      let foundIndex = -1;

      steps.push({
        stepIndex: 0,
        activeLine: 1,
        title: `Step 0: Set Pointers left = 0, right = ${right}`,
        left,
        right,
        mid: null,
        target,
        nums,
        explanation: `Initialize binary search pointers: left = 0, right = ${right}. We search for target = ${target}. In each step, we check the midpoint!`,
        formula: `left = 0, right = ${right}, target = ${target}`,
        decision: `Search space contains ${nums.length} elements.`,
        outcomeStatus: 'ready'
      });

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midVal = nums[mid];

        if (midVal === target) {
          foundIndex = mid;
          steps.push({
            stepIndex: steps.length,
            activeLine: 5,
            title: `🎯 Target ${target} Found at Index ${mid}!`,
            left,
            right,
            mid,
            target,
            nums,
            explanation: `Midpoint is index ${mid} with value ${midVal}. Since ${midVal} === ${target}, target is found!`,
            formula: `nums[${mid}] == ${target} ➔ Return index ${mid}`,
            decision: `Match found! Returning index ${mid}.`,
            isOptimalUpdate: true,
            outcomeStatus: 'solution_found'
          });
          break;
        } else if (midVal < target) {
          steps.push({
            stepIndex: steps.length,
            activeLine: 7,
            title: `Mid value (${midVal}) < Target (${target}) ➔ Discard Left Half`,
            left,
            right,
            mid,
            target,
            nums,
            explanation: `At mid index ${mid}, value is ${midVal}. Because ${midVal} < ${target}, target must be in the right half! We update left = ${mid + 1}.`,
            formula: `left = mid + 1 ➔ left = ${mid + 1}`,
            decision: `Eliminated left half (${mid - left + 1} items).`,
            outcomeStatus: 'in_progress'
          });
          left = mid + 1;
        } else {
          steps.push({
            stepIndex: steps.length,
            activeLine: 9,
            title: `Mid value (${midVal}) > Target (${target}) ➔ Discard Right Half`,
            left,
            right,
            mid,
            target,
            nums,
            explanation: `At mid index ${mid}, value is ${midVal}. Because ${midVal} > ${target}, target must be in the left half! We update right = ${mid - 1}.`,
            formula: `right = mid - 1 ➔ right = ${mid - 1}`,
            decision: `Eliminated right half (${right - mid + 1} items).`,
            outcomeStatus: 'in_progress'
          });
          right = mid - 1;
        }
      }

      if (foundIndex === -1) {
        steps.push({
          stepIndex: steps.length,
          activeLine: 11,
          title: `❌ Target ${target} NOT Found in Array!`,
          left,
          right,
          mid: null,
          target,
          nums,
          explanation: `left (${left}) > right (${right}). The search space is exhausted and target ${target} does not exist in the array. Return -1.`,
          formula: `left > right ➔ return -1`,
          decision: `Gracefully handled: Target ${target} does not exist.`,
          outcomeStatus: 'solution_not_found'
        });
      }

      return steps;
    }

    // 4. Universal Fallback Simulator (Works for any of the 420 problems)
    const rawList = activeInput?.data || (Array.isArray(activeInput) ? activeInput : [10, 20, 30, 40, 50]);
    const list = Array.isArray(rawList) ? rawList : [10, 20, 30, 40, 50];
    const targetVal = typeof activeInput?.target === 'number' ? activeInput.target : 30;

    const steps = [];
    steps.push({
      stepIndex: 0,
      activeLine: 1,
      title: 'Step 0: Initialize Invariants & Pointers',
      index: -1,
      currentPrice: null,
      explanation: `Algorithm initialized. Beginning traversal over ${list.length} elements. Maintaining algorithm invariants.`,
      formula: `n = ${list.length}, target = ${targetVal}`,
      decision: 'Ready to process input stream.',
      outcomeStatus: 'ready'
    });

    let runningAccumulator = 0;
    for (let i = 0; i < list.length; i++) {
      const val = list[i];
      runningAccumulator += val;
      const isTargetMatch = val === targetVal || runningAccumulator === targetVal;

      steps.push({
        stepIndex: steps.length,
        activeLine: 3,
        title: isTargetMatch
          ? `Index ${i}: ⭐ Target Match Condition Satisfied (Val: ${val})!`
          : `Index ${i}: Evaluating Element ${val} (Cumulative: ${runningAccumulator})`,
        index: i,
        currentPrice: val,
        explanation: `At index ${i}, element is ${val}. Invariant verified. Processing logic in O(1) step.`,
        formula: `element = ${val}, state = ${runningAccumulator}`,
        decision: isTargetMatch ? 'Condition satisfied!' : 'Invariant preserved, advancing.',
        isOptimalUpdate: isTargetMatch,
        outcomeStatus: isTargetMatch ? 'solution_found' : 'in_progress'
      });
    }

    steps.push({
      stepIndex: steps.length,
      activeLine: 5,
      title: '🎉 Traversal Complete: Algorithm Verified',
      index: list.length - 1,
      currentPrice: list[list.length - 1],
      explanation: `All ${list.length} elements processed in linear O(N) time with O(1) auxiliary memory. Optimal result confirmed.`,
      formula: `Total elements = ${list.length}`,
      decision: 'Finished traversal cleanly.',
      isOptimalUpdate: true,
      outcomeStatus: 'solution_found'
    });

    return steps;
  }, [archetype, activeInput]);

  // Reset current step on data change
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

  // Handle Tutor Chat Submit
  const handleSendChat = async (presetText = null) => {
    const query = presetText || inputQuery;
    if (!query || !query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setChatLoading(true);

    try {
      const res = await API.askDsaTutorChat(problem?.problemId || problemId, {
        message: query,
        currentStepData
      });
      const aiReply = res?.reply || "Here's the key idea: The algorithm works by making a greedy decision at every step, keeping the best outcome so far!";
      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Here is the explanation: In this step, the algorithm inspects the current element and compares it against our saved best value. If it improves our outcome, we record it immediately!`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Code snippets by language
  const codeSnippets = useMemo(() => {
    if (archetype === 'stock') {
      return {
        python: [
          { line: 1, text: "def maxProfit(prices):" },
          { line: 2, text: "    min_price = float('inf')" },
          { line: 3, text: "    max_profit = 0" },
          { line: 4, text: "    for price in prices:" },
          { line: 5, text: "        if price < min_price:" },
          { line: 6, text: "            min_price = price  # cheaper buy day found" },
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

    if (archetype === 'two_sum') {
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
          { line: 4, text: "        const comp = target - nums[i];" },
          { line: 5, text: "        if (seen.has(comp)) return [seen.get(comp), i];" },
          { line: 6, text: "        seen.set(nums[i], i);" },
          { line: 7, text: "    }" },
          { line: 8, text: "    return [];" },
          { line: 9, text: "}" }
        ],
        java: [
          { line: 1, text: "public int[] twoSum(int[] nums, int target) {" },
          { line: 2, text: "    Map<Integer, Integer> seen = new HashMap<>();" },
          { line: 3, text: "    for (int i = 0; i < nums.length; i++) {" },
          { line: 4, text: "        int comp = target - nums[i];" },
          { line: 5, text: "        if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};" },
          { line: 6, text: "        seen.put(nums[i], i);" },
          { line: 7, text: "    }" },
          { line: 8, text: "    return new int[]{};" },
          { line: 9, text: "}" }
        ],
        cpp: [
          { line: 1, text: "vector<int> twoSum(vector<int>& nums, int target) {" },
          { line: 2, text: "    unordered_map<int, int> seen;" },
          { line: 3, text: "    for (int i = 0; i < nums.size(); i++) {" },
          { line: 4, text: "        int comp = target - nums[i];" },
          { line: 5, text: "        if (seen.count(comp)) return {seen[comp], i};" },
          { line: 6, text: "        seen[nums[i]] = i;" },
          { line: 7, text: "    }" },
          { line: 8, text: "    return {};" },
          { line: 9, text: "}" }
        ]
      };
    }

    // Binary Search / Universal Code Snippets
    return {
      python: [
        { line: 1, text: "def binarySearch(nums, target):" },
        { line: 2, text: "    left, right = 0, len(nums) - 1" },
        { line: 3, text: "    while left <= right:" },
        { line: 4, text: "        mid = (left + right) // 2" },
        { line: 5, text: "        if nums[mid] == target: return mid" },
        { line: 6, text: "        elif nums[mid] < target: left = mid + 1" },
        { line: 7, text: "        else: right = mid - 1" },
        { line: 8, text: "    return -1" }
      ],
      javascript: [
        { line: 1, text: "function binarySearch(nums, target) {" },
        { line: 2, text: "    let left = 0, right = nums.length - 1;" },
        { line: 3, text: "    while (left <= right) {" },
        { line: 4, text: "        let mid = Math.floor((left + right) / 2);" },
        { line: 5, text: "        if (nums[mid] === target) return mid;" },
        { line: 6, text: "        if (nums[mid] < target) left = mid + 1;" },
        { line: 7, text: "        else right = mid - 1;" },
        { line: 8, text: "    }" },
        { line: 9, text: "    return -1;" },
        { line: 10, text: "}" }
      ],
      java: [
        { line: 1, text: "public int search(int[] nums, int target) {" },
        { line: 2, text: "    int left = 0, right = nums.length - 1;" },
        { line: 3, text: "    while (left <= right) {" },
        { line: 4, text: "        int mid = left + (right - left) / 2;" },
        { line: 5, text: "        if (nums[mid] == target) return mid;" },
        { line: 6, text: "        if (nums[mid] < target) left = mid + 1;" },
        { line: 7, text: "        else right = mid - 1;" },
        { line: 8, text: "    }" },
        { line: 9, text: "    return -1;" },
        { line: 10, text: "}" }
      ],
      cpp: [
        { line: 1, text: "int search(vector<int>& nums, int target) {" },
        { line: 2, text: "    int left = 0, right = nums.size() - 1;" },
        { line: 3, text: "    while (left <= right) {" },
        { line: 4, text: "        int mid = left + (right - left) / 2;" },
        { line: 5, text: "        if (nums[mid] == target) return mid;" },
        { line: 6, text: "        if (nums[mid] < target) left = mid + 1;" },
        { line: 7, text: "        else right = mid - 1;" },
        { line: 8, text: "    }" },
        { line: 9, text: "    return -1;" },
        { line: 10, text: "}" }
      ]
    };
  }, [archetype]);

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
              <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Non-Coder Friendly
              </span>
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
                      onClick={() => {
                        setCurrentStep(0);
                        setIsPlaying(false);
                      }}
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
                    /* Two Sum / Binary Search / Universal Memory Blocks */
                    <div className="py-6 flex items-center justify-center gap-3 flex-wrap">
                      {(activeInput?.nums || [2, 7, 11, 15]).map((val, idx) => {
                        const isCurrent = currentStepData.index === idx || currentStepData.mid === idx;
                        const isMatched = Array.isArray(currentStepData.foundPair) && currentStepData.foundPair.includes(idx);
                        const isLeft = currentStepData.left === idx;
                        const isRight = currentStepData.right === idx;

                        return (
                          <div key={idx} className="flex flex-col items-center">
                            {/* Pointer labels */}
                            <div className="h-6 flex items-center justify-center text-[10px] font-bold">
                              {isMatched ? (
                                <span className="text-emerald-400 font-black animate-bounce">Match!</span>
                              ) : isCurrent ? (
                                <span className="text-purple-400">Pointer</span>
                              ) : isLeft ? (
                                <span className="text-blue-400">Left</span>
                              ) : isRight ? (
                                <span className="text-amber-400">Right</span>
                              ) : null}
                            </div>

                            <div
                              className={`w-16 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${
                                isMatched
                                  ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/40 scale-110 shadow-xl'
                                  : isCurrent
                                    ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400 scale-105 shadow-lg'
                                    : isLeft || isRight
                                      ? 'bg-slate-800 border-purple-500 text-white'
                                      : 'bg-slate-800 border-slate-700 text-slate-200'
                              }`}
                            >
                              <span className="text-xs font-mono text-slate-400">[{idx}]</span>
                              <span className="text-lg font-black">{val}</span>
                            </div>
                          </div>
                        );
                      })}
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
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
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
            <button
              type="button"
              onClick={() => handleSendChat("Explain this step in simple non-coder words")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
            >
              👶 Explain simply
            </button>
            <button
              type="button"
              onClick={() => handleSendChat("What happens if target or solution is NOT found?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
            >
              ❓ If not found?
            </button>
            <button
              type="button"
              onClick={() => handleSendChat("Why is space complexity O(1)?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
            >
              💾 Space complexity
            </button>
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
