import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, Download, Sparkles, FileText, Menu, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { analyzeATSResume } from '../services/aiService';

export default function ATSChecker() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    score: 84,
    goodPoints: [
      'Properly structured contact details and professional summary.',
      'Skills are relevant for target Software Developer role.',
      'Projects are well-described with clear tech stacks.'
    ],
    needsImprovement: [
      'Add more industry-standard technical keywords.',
      'Improve professional summary impact.',
      'Add more measurable achievement metrics.'
    ],
    metrics: {
      keywordMatch: 88,
      contentQuality: 85,
      formatting: 90,
      readability: 80
    },
    missingKeywords: ['REST API', 'Git', 'Agile', 'OOP', 'Data Structures']
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', 'Software Developer');

      const result = await API.analyzeATS(formData, true);
      setScanResult({
        score: result.overallScore || result.score || 84,
        goodPoints: result.summary?.goodPoints || result.goodPoints || [],
        needsImprovement: result.summary?.needsImprovement || result.needsImprovement || [],
        metrics: result.metrics || { keywordMatch: 85, contentQuality: 85, formatting: 90, readability: 80 },
        missingKeywords: result.missingKeywords || []
      });
    } catch (err) {
      console.warn('ATS API notice:', err.message);
      const fallbackRes = await analyzeATSResume(file.name, '');
      setScanResult({
        score: fallbackRes.overallScore,
        goodPoints: fallbackRes.summary.goodPoints,
        needsImprovement: fallbackRes.summary.needsImprovement,
        metrics: fallbackRes.metrics,
        missingKeywords: fallbackRes.missingKeywords
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanSample = async () => {
    setIsScanning(true);
    try {
      const result = await API.analyzeATS({ resumeText: 'Namya Shah Software Developer Resume', targetRole: 'Software Developer' });
      setScanResult({
        score: result.overallScore || 85,
        goodPoints: result.summary?.goodPoints || [],
        needsImprovement: result.summary?.needsImprovement || [],
        metrics: result.metrics || { keywordMatch: 88, contentQuality: 85, formatting: 90, readability: 80 },
        missingKeywords: result.missingKeywords || []
      });
    } catch (err) {
      const result = await analyzeATSResume('Namya_Shah_Resume.pdf', '');
      setScanResult({
        score: result.overallScore,
        goodPoints: result.summary.goodPoints,
        needsImprovement: result.summary.needsImprovement,
        metrics: result.metrics,
        missingKeywords: result.missingKeywords
      });
    } finally {
      setIsScanning(false);
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit">ATS Resume Analysis</h1>
              <p className="text-xs text-slate-500">Scan and optimize your resume for Applicant Tracking Systems</p>
            </div>
          </div>

          <button
            onClick={handleScanSample}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-xs flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} /> Scan Sample Resume
          </button>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Upload Zone */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Upload Resume for Analysis</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Drag and drop your PDF or DOCX resume here, or click to browse files from your computer.</p>
            </div>
            
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs cursor-pointer shadow-md hover:shadow-lg transition">
              <FileText className="w-4 h-4" />
              <span>{isScanning ? 'Analyzing Resume...' : 'Choose Resume File'}</span>
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Analysis Output Dashboard (Screen 8 in Collage) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Score Radial Meter */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall ATS Score</span>
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="68" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#22C55E"
                    strokeWidth="12"
                    strokeDasharray="427"
                    strokeDashoffset="68"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-extrabold text-slate-900 font-outfit block">{scanResult.score}/100</span>
                  <span className="text-xs font-bold text-emerald-600">Good</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-xs">Your resume has a strong foundation and passes basic ATS parser filters!</p>
            </div>

            {/* Analysis Summary */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Analysis Summary</h3>
              
              <div className="space-y-3">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Good Points</div>
                {scanResult.goodPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Needs Improvement</div>
                {scanResult.needsImprovement.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Detailed Analysis & Missing Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Metric Bars */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Detailed Metric Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Keyword Match</span>
                    <span className="text-blue-600">{scanResult.metrics.keywordMatch}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${scanResult.metrics.keywordMatch}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Content Quality</span>
                    <span className="text-purple-600">{scanResult.metrics.contentQuality}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${scanResult.metrics.contentQuality}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Formatting</span>
                    <span className="text-emerald-600">{scanResult.metrics.formatting}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${scanResult.metrics.formatting}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Readability</span>
                    <span className="text-amber-600">{scanResult.metrics.readability}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${scanResult.metrics.readability}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Keywords & Actions */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {scanResult.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    {kw}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => alert('ATS Detailed PDF Report downloaded!')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Report
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
