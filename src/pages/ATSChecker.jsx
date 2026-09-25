import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, Download, Sparkles, FileText, Menu, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { API } from '../services/api';

export default function ATSChecker() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setErrorMessage('');
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);

      const result = await API.analyzeATS(formData, true);
      if (result && typeof result.overallScore === 'number') {
        setScanResult({
          score: result.overallScore,
          goodPoints: result.summary?.goodPoints || [],
          needsImprovement: result.summary?.needsImprovement || [],
          metrics: result.metrics || { keywordMatch: 0, contentQuality: 0, formatting: 0, readability: 0 },
          missingKeywords: result.missingKeywords || [],
          actionableSuggestions: result.actionableSuggestions || []
        });
      } else {
        throw new Error('Invalid analysis response received from server.');
      }
    } catch (err) {
      console.error('ATS API Error:', err.message);
      setErrorMessage(err.message || 'Failed to analyze resume. Please ensure the file is readable.');
    } finally {
      setIsScanning(false);
    }
  };

  const scoreLabel = scanResult
    ? scanResult.score >= 80 ? 'Excellent' : scanResult.score >= 65 ? 'Good' : 'Needs Optimization'
    : '';

  const strokeOffset = scanResult
    ? Math.round(427 - (427 * scanResult.score) / 100)
    : 427;

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
              <p className="text-xs text-slate-500">Scan and benchmark your resume against industry hiring systems using Grok AI</p>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Upload Zone */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">Upload Resume for Analysis</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Upload your PDF or text resume to test ATS keyword match, content quality, and structure.
              </p>
            </div>

            <div className="max-w-xs mx-auto flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Target Role:</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            
            <div>
              <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs cursor-pointer shadow-md hover:shadow-lg transition ${isScanning ? 'opacity-70 pointer-events-none' : ''}`}>
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Grok AI...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Choose Resume File</span>
                  </>
                )}
                <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" disabled={isScanning} />
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 max-w-md mx-auto rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {errorMessage}
              </div>
            )}
          </div>

          {scanResult && (
            <>
              {/* Analysis Output Dashboard */}
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
                        stroke={scanResult.score >= 75 ? '#22C55E' : scanResult.score >= 50 ? '#3B82F6' : '#F59E0B'}
                        strokeWidth="12"
                        strokeDasharray="427"
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-4xl font-extrabold text-slate-900 font-outfit block">{scanResult.score}/100</span>
                      <span className={`text-xs font-bold ${scanResult.score >= 75 ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {scoreLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 max-w-xs">
                    Evaluated specifically for <span className="font-bold text-slate-700">{targetRole}</span>. Contributes directly to your Readiness score.
                  </p>
                </div>

                {/* Analysis Summary */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Analysis Summary</h3>
                  
                  {scanResult.goodPoints.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Good Points</div>
                      {scanResult.goodPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {scanResult.needsImprovement.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Needs Improvement</div>
                      {scanResult.needsImprovement.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <span className="text-blue-600">{scanResult.metrics.keywordMatch || 0}/100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${scanResult.metrics.keywordMatch || 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Content Quality</span>
                        <span className="text-purple-600">{scanResult.metrics.contentQuality || 0}/100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${scanResult.metrics.contentQuality || 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Formatting</span>
                        <span className="text-emerald-600">{scanResult.metrics.formatting || 0}/100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${scanResult.metrics.formatting || 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Readability</span>
                        <span className="text-amber-600">{scanResult.metrics.readability || 0}/100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full" style={{ width: `${scanResult.metrics.readability || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Missing Keywords & Actions */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Missing Keywords for {targetRole}</h3>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.missingKeywords.length > 0 ? (
                      scanResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No missing keywords detected!</span>
                    )}
                  </div>

                  {scanResult.actionableSuggestions?.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Actionable Recommendations</div>
                      <ul className="space-y-1.5">
                        {scanResult.actionableSuggestions.map((sug, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
