// Re-export GrokService under GeminiService alias for backward compatibility
// Gemini has been deprecated and replaced by Grok/Groq.
import { GrokService } from './grokService.js';

export { GrokService, GrokService as GeminiService };
export default GrokService;
