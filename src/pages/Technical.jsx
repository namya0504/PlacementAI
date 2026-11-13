import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu, BookOpen, Code2, Clock, CheckCircle2, Trophy,
  Sparkles, Layers, ArrowRight, Zap, RefreshCw, AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useSidebar } from '../context/SidebarContext';
import TopicSelector from '../features/dsa/components/TopicSelector';
import ConceptTab from '../features/dsa/components/ConceptTab';
import ProblemListTab from '../features/dsa/components/ProblemListTab';
import SubmissionsTab from '../features/dsa/components/SubmissionsTab';
import ProblemWorkspace from '../features/dsa/components/ProblemWorkspace';
import TopicTestWorkspace from '../features/dsa/components/TopicTestWorkspace';
import TopicTestReportModal from '../features/dsa/components/TopicTestReportModal';
import { DSA_TOPICS_LIST } from '../features/dsa/constants/dsaTopics';

export default function Technical() {
  const toast = useToast();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Topics and selection
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('arrays');
  const [topicDetail, setTopicDetail] = useState(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [userBadges, setUserBadges] = useState([]);

  // Active Topic Tab: 'concept' | 'problems' | 'submissions'
  const [activeTab, setActiveTab] = useState('problems');

  // Active Problem ID (null = Topic Overview mode, string = Problem Workspace mode)
  const [activeProblemId, setActiveProblemId] = useState(null);

  // Assessment / Topic Test State
  const [activeTestSession, setActiveTestSession] = useState(null);
  const [activeTestReport, setActiveTestReport] = useState(null);

  // Load all 21 topics and earned badges
  const fetchTopics = useCallback(async () => {
    try {
      const [res, badgesRes] = await Promise.all([
        API.getDsaTopics(),
        API.getUserTopicBadges().catch(() => ({ badges: [] }))
      ]);

      const badges = badgesRes?.badges || [];
      setUserBadges(badges);
      const badgeTopicMap = new Map(badges.filter(b => b.hasStarBadge).map(b => [b.topicId, b]));

      if (res?.topics && res.topics.length > 0) {
        setTopics(res.topics.map(t => ({
          ...t,
          hasStarBadge: badgeTopicMap.has(t.topicId)
        })));
      } else {
        setTopics(DSA_TOPICS_LIST.map((t) => ({
          ...t,
          solvedCount: 0,
          problemCount: 20,
          hasStarBadge: badgeTopicMap.has(t.topicId)
        })));
      }
    } catch (err) {
      console.warn('Failed to load DSA topics:', err);
      setTopics(DSA_TOPICS_LIST.map((t) => ({ ...t, solvedCount: 0, problemCount: 20 })));
    }
  }, []);

  // Load selected topic details (concept & problems)
  const fetchTopicDetail = useCallback(async (tId) => {
    try {
      setLoadingTopic(true);
      const res = await API.getDsaTopicDetail(tId);
      if (res) {
        setTopicDetail(res);
      }
    } catch (err) {
      console.error('Failed to load topic detail:', err);
      toast?.showToast?.(err.message || 'Failed to load topic detail', 'error');
    } finally {
      setLoadingTopic(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    if (selectedTopicId) {
      fetchTopicDetail(selectedTopicId);
    }
  }, [selectedTopicId, fetchTopicDetail]);

  const activeTopic = topics.find(t => t.topicId === selectedTopicId) || {
    topicId: selectedTopicId,
    title: 'Arrays',
    order: 1
  };

  const problemsList = topicDetail?.problems || [];

  // Handler for "Next problem" inside the problem workspace
  const handleOpenNextProblem = () => {
    const currentIndex = problemsList.findIndex(p => p.problemId === activeProblemId);
    if (currentIndex !== -1 && currentIndex + 1 < problemsList.length) {
      setActiveProblemId(problemsList[currentIndex + 1].problemId);
    }
  };

  const currentProblemIndex = problemsList.findIndex(p => p.problemId === activeProblemId);
  const hasNextProblem = currentProblemIndex !== -1 && currentProblemIndex + 1 < problemsList.length;

  const currentTopicIndex = topics.findIndex(t => t.topicId === selectedTopicId);
  const nextTopic = currentTopicIndex !== -1 && currentTopicIndex + 1 < topics.length
    ? topics[currentTopicIndex + 1]
    : null;

  const handleOpenNextTopic = () => {
    if (nextTopic) {
      setSelectedTopicId(nextTopic.topicId);
      setActiveProblemId(null);
    }
  };

  // Topic Test Handlers
  const handleStartTest = async () => {
    try {
      setLoadingTopic(true);
      const res = await API.getTopicTest(selectedTopicId);
      if (res && res.questions && res.questions.length > 0) {
        setActiveTestSession(res);
      } else {
        toast?.showToast?.('No test questions available for this topic.', 'error');
      }
    } catch (err) {
      toast?.showToast?.(err.message || 'Failed to start test', 'error');
    } finally {
      setLoadingTopic(false);
    }
  };

  const handleViewReport = async () => {
    try {
      const res = await API.getTopicTestReports(selectedTopicId);
      if (res?.reports && res.reports.length > 0) {
        setActiveTestReport(res.reports[0]);
      } else {
        toast?.showToast?.('No assessment reports found yet.', 'info');
      }
    } catch (err) {
      toast?.showToast?.(err.message || 'Failed to load report', 'error');
    }
  };

  const handleTestSubmitComplete = (report) => {
    setActiveTestSession(null);
    setActiveTestReport(report);
    fetchTopics();
    fetchTopicDetail(selectedTopicId);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        activeNav="technical"
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 pb-16 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Technical Preparation</span>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    DSA Practice Platform
                  </span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Topic-by-topic structured campus placement coding practice with sandboxed execution.
                </p>
              </div>
            </div>
          </div>

          {/* Topic Dropdown (Only shown in Topic view or responsive bar) */}
          <div className="shrink-0">
            <TopicSelector
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={(tId) => {
                setSelectedTopicId(tId);
                setActiveProblemId(null); // Return to topic view
              }}
            />
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {activeTestSession ? (
            /* Topic Test Assessment Workspace */
            <TopicTestWorkspace
              testData={activeTestSession}
              onCloseTest={() => setActiveTestSession(null)}
              onSubmitComplete={handleTestSubmitComplete}
            />
          ) : activeProblemId ? (
            /* Problem Workspace View (Split Screen) */
            <ProblemWorkspace
              problemId={activeProblemId}
              topicTitle={activeTopic.title}
              onBackToTopic={() => {
                setActiveProblemId(null);
                fetchTopicDetail(selectedTopicId);
                fetchTopics();
              }}
              onOpenNextProblem={handleOpenNextProblem}
              hasNextProblem={hasNextProblem}
              hasNextTopic={Boolean(nextTopic)}
              nextTopicTitle={nextTopic?.title || ''}
              onOpenNextTopic={handleOpenNextTopic}
            />
          ) : (
            /* Topic Page: 3 Tabs (Concept, Problems, My Submissions) */
            <div className="space-y-6">
              {/* Topic Hero Card */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs uppercase tracking-wider mb-2">
                    <span>Topic #{activeTopic.order || 1} of 21</span>
                    <span>•</span>
                    <span>Campus Placement Core</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                    {activeTopic.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {topicDetail?.topic?.overview?.whatItIs || 'Master foundational algorithms, common interview recognition patterns, and optimal solutions.'}
                  </p>
                </div>

                <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-purple-500/10 to-transparent pointer-events-none" />
              </div>

              {/* 3 Main Tabs: Concept, Problems, My Submissions */}
              <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('concept')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
                    activeTab === 'concept'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Concept & Core Patterns</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('problems')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
                    activeTab === 'problems'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Problems ({problemsList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('submissions')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
                    activeTab === 'submissions'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>My Submissions</span>
                </button>
              </div>

              {/* Tab Content Panes */}
              {loadingTopic ? (
                <div className="p-16 text-center">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-500">Loading topic content...</p>
                </div>
              ) : (
                <div>
                  {activeTab === 'concept' && (
                    <ConceptTab topic={topicDetail?.topic} />
                  )}

                  {activeTab === 'problems' && (
                    <ProblemListTab
                      problems={problemsList}
                      topicTitle={activeTopic.title}
                      onSelectProblem={(pId) => setActiveProblemId(pId)}
                      badgeInfo={userBadges.find(b => b.topicId === selectedTopicId)}
                      onStartTest={handleStartTest}
                      onViewTestReport={handleViewReport}
                    />
                  )}

                  {activeTab === 'submissions' && (
                    <SubmissionsTab
                      topicId={selectedTopicId}
                      onOpenProblem={(pId) => setActiveProblemId(pId)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Topic Test Assessment Report Modal */}
        {activeTestReport && (
          <TopicTestReportModal
            report={activeTestReport}
            onClose={() => setActiveTestReport(null)}
            onRetakeTest={() => {
              setActiveTestReport(null);
              handleStartTest();
            }}
          />
        )}
      </div>
    </div>
  );
}
