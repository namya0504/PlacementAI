import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const TextExtractorService = {
  /**
   * Extracts clean text from PDF buffer or text input
   */
  async extractTextFromPDF(fileBuffer) {
    if (!fileBuffer) return '';
    try {
      const parsed = await pdfParse(fileBuffer);
      return parsed.text || '';
    } catch (err) {
      console.warn('pdf-parse warning (fallback to raw string parsing):', err.message);
      // Fallback: convert buffer to string if plain text file was sent
      return fileBuffer.toString('utf-8');
    }
  }
};


