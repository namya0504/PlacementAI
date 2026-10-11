import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let pdfParse;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.error('[TextExtractor] pdf-parse module not available:', e.message);
  pdfParse = null;
}

let mammoth;
try {
  mammoth = require('mammoth');
} catch (e) {
  console.error('[TextExtractor] mammoth module not available:', e.message);
  mammoth = null;
}

export const TextExtractorService = {
  /**
   * Extracts clean text from PDF buffer or text input.
   * Handles:
   * 1. Standard text-based PDFs (via pdf-parse text streams)
   * 2. Hybrid PDFs with text layers or metadata (Subject/Keywords/Title)
   * 3. Plain text files uploaded with .pdf/.txt extension
   */
  async extractTextFromPDF(fileBuffer) {
    if (!fileBuffer || fileBuffer.length === 0) {
      console.warn('[TextExtractor] Empty or null buffer received');
      return '';
    }

    console.log(`[TextExtractor] Processing buffer of ${fileBuffer.length} bytes`);

    // Check magic bytes for PDF (%PDF)
    const isPDF = fileBuffer.length >= 4 &&
      fileBuffer[0] === 0x25 && // %
      fileBuffer[1] === 0x50 && // P
      fileBuffer[2] === 0x44 && // D
      fileBuffer[3] === 0x46;   // F

    if (isPDF && pdfParse) {
      try {
        const parsed = await pdfParse(fileBuffer, { max: 50 });
        let text = (parsed.text || '').trim();

        if (text.length > 20) {
          console.log(`[TextExtractor] Extracted ${text.length} chars from PDF text layer`);
          return text;
        }

        // If text layer is empty or very short, check PDF Info / Metadata
        const info = parsed.info || {};
        const subject = typeof info.Subject === 'string' ? info.Subject.trim() : '';
        const keywords = typeof info.Keywords === 'string' ? info.Keywords.trim() : '';

        if (subject && subject.length > 20) {
          console.log(`[TextExtractor] Extracted ${subject.length} chars from PDF Subject metadata`);
          return subject;
        }

        if (keywords && keywords.length > 20) {
          console.log(`[TextExtractor] Extracted ${keywords.length} chars from PDF Keywords metadata`);
          return `${info.Title || ''}\n${keywords}`.trim();
        }

        // Fallback: search raw buffer for /Subject in PDF dictionary
        const bufferStr = fileBuffer.toString('latin1');
        const subjectMatch = bufferStr.match(/\/Subject\s*\(([^)]+)\)/);
        if (subjectMatch && subjectMatch[1] && subjectMatch[1].length > 20) {
          const unescaped = subjectMatch[1].replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\([\\()])/g, '$1');
          console.log(`[TextExtractor] Extracted ${unescaped.length} chars from raw PDF /Subject tag`);
          return unescaped;
        }

        console.warn(`[TextExtractor] PDF parsed but text layer is empty (${text.length} chars). Scanned or image-only PDF detected.`);
        return text || '';
      } catch (err) {
        console.error('[TextExtractor] pdf-parse error:', err.message);
      }
    }

    // Try fallback for plain text files
    try {
      const textContent = fileBuffer.toString('utf-8').trim();
      const printableCount = textContent.replace(/[^\x20-\x7E\n\r\t]/g, '').length;
      if (textContent.length > 10 && (printableCount / textContent.length) > 0.75) {
        console.log(`[TextExtractor] Read as clean plain text: ${textContent.length} chars`);
        return textContent;
      }
    } catch (e) {
      // ignore
    }

    return '';
  },

  /**
   * Extracts text from DOCX buffer using mammoth.
   * @param {Buffer} fileBuffer
   * @returns {Promise<string>}
   */
  async extractTextFromDOCX(fileBuffer) {
    if (!fileBuffer || fileBuffer.length === 0 || !mammoth) return '';
    try {
      console.log(`[TextExtractor] Processing DOCX buffer of ${fileBuffer.length} bytes`);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = (result.value || '').trim();
      console.log(`[TextExtractor] Extracted ${text.length} chars from DOCX`);
      return text;
    } catch (err) {
      console.error('[TextExtractor] mammoth DOCX extraction error:', err.message);
      return '';
    }
  },

  /**
   * Extracts clean text from either PDF or DOCX based on MIME type or magic bytes.
   * @param {Buffer} fileBuffer
   * @param {string} mimeType
   * @returns {Promise<string>}
   */
  async extractTextFromFile(fileBuffer, mimeType = 'application/pdf') {
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      (fileBuffer && fileBuffer[0] === 0x50 && fileBuffer[1] === 0x4B)
    ) {
      return this.extractTextFromDOCX(fileBuffer);
    }
    return this.extractTextFromPDF(fileBuffer);
  }
};
