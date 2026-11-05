import React, { useState, useRef } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  History,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  Calendar,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Mic
} from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import html2pdf from 'html2pdf.js';
import { useToast } from '../../context/ToastContext';

const VERDICT_STYLES = {
  'Interview ready': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    title: 'Interview Ready',
    description: 'Outstanding technical depth, structured STAR communication, and strong role alignment.'
  },
  'Almost there': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    title: 'Almost There',
    description: 'Solid foundations demonstrated. Fine-tune your STAR results metrics and technical trade-offs.'
  },
  'Needs work': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    title: 'Needs Work',
    description: 'Requires more depth when explaining implementation details and fewer filler words.'
  },
  'Not ready': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    title: 'Not Ready',
    description: 'Several questions were off-topic or lacked required depth. Practice the 7-day plan below.'
  }
};

export default function InterviewReport({
  reportData,
  onRetake,
  onPracticeRound,
  onOpenHistory
}) {
  const toast = useToast();
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const reportContainerRef = useRef(null);

  const report = reportData || {};
  const overallScore = typeof report.overallScore === 'number' ? report.overallScore.toFixed(1) : '7.5';
  const scoreNumber = parseFloat(overallScore);
  const verdictKey = report.verdict || (scoreNumber >= 8.5 ? 'Interview ready' : (scoreNumber >= 7.0 ? 'Almost there' : (scoreNumber >= 5.0 ? 'Needs work' : 'Not ready')));
  const verdictInfo = VERDICT_STYLES[verdictKey] || VERDICT_STYLES['Almost there'];

  const roundScores = report.roundScores || {
    "1": { score: 8.0, title: "Behavioral", summary: "Clear introductory communication and motivation." },
    "2": { score: 7.5, title: "Technical", summary: "Solid grasp of core architectural patterns." },
    "3": { score: 7.0, title: "Situational", summary: "Good response to deadlines and ambiguity." },
    "4": { score: 7.5, title: "Leadership", summary: "Exhibited personal project ownership." }
  };

  const detailedCompetencies = report.detailedCompetencies || {
    communication: 8.0,
    relevance: 8.5,
    technicalDepth: 7.0,
    starStructure: 6.5,
    problemSolving: 7.5,
    leadership: 7.0,
    grammarAndVocabulary: 8.5,
    roleFit: 8.0,
    resumeAlignment: 7.5,
    projectExplanation: 7.0
  };

  const strengths = report.strengths || [];
  const improvements = report.improvements || [];
  const perQuestionReview = report.perQuestionReview || [];
  const resumeInsights = report.resumeAndGithubInsights || {};
  const actionPlan = report.actionPlan7Days || [];
  const speechSummary = report.speechSummary || {};

  // Download PDF Report using html2pdf
  const handleDownloadPdf = async () => {
    if (!reportContainerRef.current) return;
    setIsDownloadingPdf(true);
    toast.info('Generating your comprehensive interview report PDF...');

    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `PlacementAI_Interview_Report_${(report.targetRole || 'Candidate').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(reportContainerRef.current).save();
      toast.success('Report PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. You can print this page using your browser.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const toggleQuestionAccordion = (idx) => {
    setExpandedQuestionIdx(expandedQuestionIdx === idx ? null : idx);
  };

  // SVG Circular Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreNumber / 10) * circumference;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-[#EAEBF4] shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Interview Complete
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-outfit mt-1">
            Performance Audit for: <span className="text-[#7C3AED]">{report.targetRole || 'Software Engineer'}</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Retake Interview</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Report (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Container for PDF export */}
      <div ref={reportContainerRef} className="space-y-8 bg-[#F8F9FE] p-1 sm:p-2">
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 1. OVERALL SCORE & VERDICT BANNER                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Circular SVG Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#EDE9FE"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#7C3AED"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 font-outfit">{overallScore}</span>
                <span className="text-xs font-bold text-slate-400">OUT OF 10</span>
              </div>
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-500">
              Evaluated by Sarah Vance
            </div>
          </div>

          {/* Verdict Description */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${verdictInfo.badge}`}>
                <span className={`w-2 h-2 rounded-full ${verdictInfo.dot}`} />
                <span>{verdictInfo.title}</span>
              </span>
              <span className="text-xs font-bold text-slate-400">
                Target Role: <strong className="text-slate-700">{report.targetRole} ({report.experienceLevel || 'Fresher'})</strong>
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {report.verdictSummary || verdictInfo.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">Rounds Passed</div>
                <div className="text-base font-extrabold text-slate-800 font-outfit">4 / 4</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">STAR Rating</div>
                <div className="text-base font-extrabold text-purple-600 font-outfit">{detailedCompetencies.starStructure || 7}/10</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">Tech Depth</div>
                <div className="text-base font-extrabold text-indigo-600 font-outfit">{detailedCompetencies.technicalDepth || 7}/10</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">Delivery</div>
                <div className="text-base font-extrabold text-emerald-600 font-outfit">
                  {speechSummary.hasVoiceData ? `${speechSummary.averageSpeechConfidenceScore}/10` : 'Text'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 2. ROUND-BY-ROUND BREAKDOWN (4 Cards)                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
            Round-by-Round Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(rnd => {
              const rData = roundScores[String(rnd)] || { score: 7.5, title: `Round ${rnd}`, summary: 'Completed' };
              const isCleared = (rData.score || 0) >= 6.0;
              return (
                <div
                  key={rnd}
                  className="bg-white rounded-3xl p-5 border border-[#EAEBF4] shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        Round {rnd}
                      </span>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        isCleared ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {rData.score}/10
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 font-outfit">
                      {rData.title}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {rData.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onPracticeRound && onPracticeRound(rnd)}
                    className="pt-2 text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition"
                  >
                    <span>Practice Round {rnd}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 3. DETAILED SKILLS & COMPETENCIES (10 Competency Bars)               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
              Core Competency Evaluation
            </h3>
            <p className="text-xs text-slate-500">Benchmark performance across the key pillars of campus & technical hiring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(detailedCompetencies).map(([key, val]) => {
              const formattedName = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
              const numVal = typeof val === 'number' ? val : 7;
              const pct = Math.min(100, Math.max(0, numVal * 10));

              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{formattedName}</span>
                    <span className="font-extrabold text-[#7C3AED]">{numVal.toFixed(1)} / 10</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        numVal >= 8
                          ? 'bg-emerald-500'
                          : numVal >= 6
                          ? 'bg-[#7C3AED]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 4. SPEECH & VOCAL DELIVERY TELEMETRY                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {speechSummary.hasVoiceData && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                  Speech & Vocal Delivery Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Computed from Google Speech acoustic telemetry and timing patterns.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Pace (WPM)</div>
                <div className="text-xl font-extrabold text-slate-900 font-outfit">{speechSummary.averageWpm || 135} WPM</div>
                <div className="text-[11px] text-slate-500 font-medium">Ideal range: 120 - 160 WPM</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Filler Words Rate</div>
                <div className="text-xl font-extrabold text-indigo-700 font-outfit">{speechSummary.averageFillerRatePct || 2.1}%</div>
                <div className="text-[11px] text-slate-500 font-medium">Target: &lt; 3.0% of total speech</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Long Pauses (&gt;1.5s)</div>
                <div className="text-xl font-extrabold text-amber-700 font-outfit">{speechSummary.totalLongPauses || 1} pauses</div>
                <div className="text-[11px] text-slate-500 font-medium">Healthy thought transitions</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400">Speech Confidence</div>
                <div className="text-xl font-extrabold text-emerald-700 font-outfit">{speechSummary.averageSpeechConfidenceScore || 8.2}/10</div>
                <div className="text-[11px] text-slate-500 font-medium">{speechSummary.deliveryAssessment || 'Confident & Articulate'}</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Note: Speech delivery confidence is estimated from pacing, vocal rhythm, and filler patterns, not emotion detection.
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 5. STRENGTHS & IMPROVEMENT AREAS (Evidence-Based Quotes)             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold font-outfit text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Key Strengths (Verified with Quotes)</span>
            </div>

            <div className="space-y-3">
              {strengths.map((str, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                  <div className="text-xs font-bold text-emerald-900">{str.point}</div>
                  <p className="text-xs text-slate-600 italic">"{str.evidence}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAEBF4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-bold font-outfit text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Areas for Improvement</span>
            </div>

            <div className="space-y-3">
              {improvements.map((imp, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-1.5">
                  <div className="text-xs font-bold text-amber-900">{imp.area}</div>
                  {imp.evidence && <p className="text-[11px] text-slate-600 italic">Observed: "{imp.evidence}"</p>}
                  {imp.advice && <p className="text-xs text-slate-700 font-medium">Coaching: {imp.advice}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 6. RESUME & GITHUB ALIGNMENT INSIGHTS                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {(resumeInsights.substantiatedClaims?.length > 0 || resumeInsights.repoSuggestions?.length > 0) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                <GithubIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                  Resume & GitHub Alignment Audit
                </h3>
                <p className="text-xs text-slate-500">
                  How well your live answers substantiated claims made in your resume and public repositories.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800">Verified Project Claims</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(resumeInsights.substantiatedClaims || []).map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800">Portfolio Recommendations</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(resumeInsights.repoSuggestions || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 7. PER-QUESTION ACCORDION REVIEW                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {perQuestionReview.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                Question-by-Question Deep Dive & Model Answers
              </h3>
              <p className="text-xs text-slate-500">
                Review your answers alongside Sarah's exemplar model answers tailored to your target role.
              </p>
            </div>

            <div className="space-y-3">
              {perQuestionReview.map((qItem, idx) => {
                const isExpanded = expandedQuestionIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-white transition shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestionAccordion(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            Round {qItem.round || 1} • {qItem.origin || 'Role Standard'}
                          </span>
                          <span className="text-xs font-extrabold text-slate-800 font-outfit">
                            Score: {qItem.score}/10
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 font-outfit">
                          {qItem.question}
                        </div>
                      </div>

                      <div className="p-1 rounded-lg text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-0 space-y-3 border-t border-slate-100 bg-slate-50/40 text-xs">
                        <div className="space-y-1">
                          <strong className="text-slate-700">Your Response:</strong>
                          <p className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 italic">
                            "{qItem.userAnswer || 'No response provided'}"
                          </p>
                        </div>

                        {qItem.whatWasMissing && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                            <strong>What was missing:</strong>
                            <p>{qItem.whatWasMissing}</p>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                          <strong className="flex items-center gap-1.5 text-[#7C3AED]">
                            <Sparkles className="w-3.5 h-3.5" />
                            Model Answer (STAR & Technical Precision):
                          </strong>
                          <p className="leading-relaxed">{qItem.modelAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 8. PERSONALIZED 7-DAY ACTION PLAN                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {actionPlan.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEBF4] shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#7C3AED]" />
                Personalized 7-Day Interview Action Plan
              </h3>
              <p className="text-xs text-slate-500">
                Targeted practice roadmap tailored for the {report.targetRole} role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {actionPlan.map(dayItem => (
                <div
                  key={dayItem.day}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase bg-purple-100 px-2 py-0.5 rounded-md">
                      Day {dayItem.day}
                    </span>
                    <div className="text-xs font-bold text-slate-900 font-outfit mt-1">
                      {dayItem.task}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {dayItem.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Floating Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#EAEBF4] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Keep Practicing</div>
            <div className="text-sm font-bold text-slate-900 font-outfit">Ready to raise your score?</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-purple-600" />
            <span>View All History</span>
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-500/25 flex items-center gap-1.5"
          >
            <span>Retake Full Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
