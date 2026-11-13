import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  RotateCcw, Sun, Moon, Type, Copy, Check, Terminal,
  Play, Send, HelpCircle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants/dsaTopics';

export default function MonacoCodeEditor({
  problemId,
  starterCodes = {},
  language = 'python',
  onChangeLanguage,
  code,
  onChangeCode,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting
}) {
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  const onRunRef = useRef(onRun);

  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  // Map language to Monaco editor language ID
  const monacoLangMap = {
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    javascript: 'javascript'
  };
  const activeMonacoLang = monacoLangMap[language] || 'python';

  // Setup keyboard shortcut Ctrl+Enter or Cmd+Enter
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunRef.current) {
        onRunRef.current();
      }
    });
  };

  const handleReset = () => {
    const starter = starterCodes[language] || '// Write your solution here';
    if (window.confirm('Reset code to the original starter template? Any unsaved edits will be lost.')) {
      onChangeCode(starter);
      try {
        localStorage.removeItem(`placementai_dsa_${problemId}_${language}`);
      } catch (e) {}
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex-wrap gap-2">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Editor Controls: Font Size, Theme, Reset, Copy */}
        <div className="flex items-center gap-2 text-slate-400">
          {/* Font Size */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-xs">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-slate-300 focus:outline-none text-xs"
            >
              <option value={12}>12px</option>
              <option value={13}>13px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            title="Toggle Editor Theme"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            {editorTheme === 'vs-dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Reset to Starter */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset to starter code"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Surface */}
      <div className="flex-1 min-h-[320px] relative">
        <Editor
          height="100%"
          language={activeMonacoLang}
          theme={editorTheme}
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full bg-slate-950 text-slate-400 text-xs gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading Monaco Editor...</span>
            </div>
          }
          options={{
            fontSize,
            fontFamily: "'Fira Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            suggestOnTriggerCharacters: true
          }}
        />
      </div>

      {/* Editor Shortcut Legend Footer */}
      <div className="px-3.5 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <span>Auto-saved locally</span>
          <span>•</span>
          <span className="text-slate-400">Ctrl + Enter</span> to run
        </div>
        <div className="text-slate-500 font-mono">
          stdin reading included
        </div>
      </div>
    </div>
  );
}
