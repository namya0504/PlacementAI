import React from 'react';

/**
 * Safe, zero-dependency Markdown Renderer for Technical DSA content.
 * Beautifully adapts to Light (default) and Dark themes without altering page design.
 * Safely parses bold (**text**), italics (*text*), inline code (`code`),
 * code blocks (```lang ... ```), lists (- item, 1. item), headings (#, ##, ###).
 */

// Helper to parse inline styles: bold, italic, inline code, and clean text
function parseInlineMarkdown(text, isDark = false) {
  if (!text || typeof text !== 'string') return text;

  // Split by inline code first: `...`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, i) => {
    // If inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={i}
          className={`px-1.5 py-0.5 mx-0.5 rounded font-mono text-[12px] font-semibold inline ${
            isDark
              ? 'bg-slate-800 text-purple-300 border border-slate-700/80'
              : 'bg-purple-50 text-purple-700 border border-purple-200/80'
          }`}
        >
          {codeContent}
        </code>
      );
    }

    // Process bold (**...** or __...__) and italic (*...* or _..._)
    const boldParts = part.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);

    return boldParts.map((bPart, j) => {
      if (
        (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length >= 4) ||
        (bPart.startsWith('__') && bPart.endsWith('__') && bPart.length >= 4)
      ) {
        const boldText = bPart.slice(2, -2);
        return (
          <strong
            key={`${i}-${j}`}
            className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {boldText}
          </strong>
        );
      }

      // Check for single italic (*...* or _..._)
      const italicParts = bPart.split(/(\*[^*]+\*|_[^_]+_)/g);
      return italicParts.map((itPart, k) => {
        if (
          (itPart.startsWith('*') && itPart.endsWith('*') && itPart.length >= 2) ||
          (itPart.startsWith('_') && itPart.endsWith('_') && itPart.length >= 2)
        ) {
          return (
            <em
              key={`${i}-${j}-${k}`}
              className={`italic ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
            >
              {itPart.slice(1, -1)}
            </em>
          );
        }
        return itPart;
      });
    });
  });
}

export default function MarkdownRenderer({
  content = '',
  className = '',
  inline = false,
  theme = 'light'
}) {
  if (!content) return null;

  const rawText = String(content);
  const isDark = theme === 'dark';

  // If inline mode requested (e.g. within a span, hint header, or constraint bullet)
  if (inline) {
    return (
      <span className={className}>
        {parseInlineMarkdown(rawText, isDark)}
      </span>
    );
  }

  // 1. Separate fenced code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  const sections = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      sections.push({
        type: 'text',
        data: rawText.substring(lastIndex, match.index)
      });
    }
    sections.push({
      type: 'code',
      lang: match[1] || '',
      data: match[2].trimEnd()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < rawText.length) {
    sections.push({
      type: 'text',
      data: rawText.substring(lastIndex)
    });
  }

  const textColorClass = isDark ? 'text-slate-200' : 'text-slate-800';

  return (
    <div className={`space-y-3 leading-relaxed ${textColorClass} ${className}`}>
      {sections.map((sec, sIdx) => {
        if (sec.type === 'code') {
          return (
            <div
              key={sIdx}
              className={`my-3 rounded-xl overflow-hidden border shadow-inner ${
                isDark
                  ? 'border-slate-800 bg-slate-950'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              {sec.lang && (
                <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                  {sec.lang}
                </div>
              )}
              <pre className="p-3 text-xs font-mono text-purple-300 overflow-x-auto leading-relaxed">
                <code>{sec.data}</code>
              </pre>
            </div>
          );
        }

        // Text Section: split into blocks by paragraphs (double newlines)
        const paragraphs = sec.data.split(/\r?\n\r?\n/);

        return (
          <React.Fragment key={sIdx}>
            {paragraphs.map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // Headings
              if (trimmed.startsWith('#### ')) {
                return (
                  <h5
                    key={pIdx}
                    className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                      isDark ? 'text-purple-400' : 'text-purple-700'
                    }`}
                  >
                    {parseInlineMarkdown(trimmed.replace(/^####\s+/, ''), isDark)}
                  </h5>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h4
                    key={pIdx}
                    className={`text-sm font-bold mt-3 ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }`}
                  >
                    {parseInlineMarkdown(trimmed.replace(/^###\s+/, ''), isDark)}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3
                    key={pIdx}
                    className={`text-base font-bold mt-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {parseInlineMarkdown(trimmed.replace(/^##\s+/, ''), isDark)}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2
                    key={pIdx}
                    className={`text-lg font-extrabold mt-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {parseInlineMarkdown(trimmed.replace(/^#\s+/, ''), isDark)}
                  </h2>
                );
              }

              // Check for bullet list lines
              const lines = trimmed.split(/\r?\n/);
              const isBulletList = lines.every(l => /^\s*[-*]\s+/.test(l));
              if (isBulletList) {
                return (
                  <ul
                    key={pIdx}
                    className={`space-y-1.5 my-2 list-disc list-inside text-xs sm:text-sm leading-relaxed ${textColorClass}`}
                  >
                    {lines.map((l, lIdx) => (
                      <li key={lIdx}>
                        {parseInlineMarkdown(l.replace(/^\s*[-*]\s+/, ''), isDark)}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Check for numbered list lines
              const isNumberedList = lines.every(l => /^\s*\d+\.\s+/.test(l));
              if (isNumberedList) {
                return (
                  <ol
                    key={pIdx}
                    className={`space-y-1.5 my-2 list-decimal list-inside text-xs sm:text-sm leading-relaxed ${textColorClass}`}
                  >
                    {lines.map((l, lIdx) => (
                      <li key={lIdx}>
                        {parseInlineMarkdown(l.replace(/^\s*\d+\.\s+/, ''), isDark)}
                      </li>
                    ))}
                  </ol>
                );
              }

              // Standard Paragraph with internal single line-breaks
              return (
                <p
                  key={pIdx}
                  className={`text-xs sm:text-sm leading-relaxed ${textColorClass}`}
                >
                  {lines.map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {lIdx > 0 && <br />}
                      {parseInlineMarkdown(line, isDark)}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
