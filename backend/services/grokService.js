import { config } from '../config/env.js';

export const GrokService = {
  async generateCompletion(prompt) {
    if (!config.ai.grokKey) {
      throw new Error('Grok API Key not configured');
    }
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.grokKey}`
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err) {
      console.error('Grok Service Error:', err.message);
      throw err;
    }
  }
};
