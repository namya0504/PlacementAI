import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';
import { GrokService } from './grokService.js';

let aiInstance = null;

if (config.ai.geminiKey) {
  try {
    aiInstance = new GoogleGenAI({ apiKey: config.ai.geminiKey });
  } catch (err) {
    console.warn('Gemini Client Init Warning:', err.message);
  }
}

/**
 * Helper to generate text using Gemini API with Grok fallback and local smart fallback
 */
async function callAI(prompt, systemInstruction = '') {
  if (aiInstance) {
    try {
      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });
      if (response.text) return response.text;
    } catch (err) {
      console.warn('Gemini API call failed, attempting Grok fallback...', err.message);
    }
  }

  // Fallback to Grok if available
  try {
    const grokRes = await GrokService.generateCompletion(systemInstruction ? `${systemInstruction}\n${prompt}` : prompt);
    if (grokRes) return grokRes;
  } catch (err) {
    // Silent fallback to local rule-based mock
  }

  return null;
}

export const GeminiService = {
  /**
   * Generate Professional Summary & Objective
   */
  async generateSummary(role, skills = [], experienceYears = 0) {
    const prompt = `Generate a high-impact 3-sentence professional summary for a ${role} with key skills: ${skills.join(', ')} and ${experienceYears} years of experience. Keep it action-oriented and ATS optimized.`;
    const aiResult = await callAI(prompt);

    if (aiResult) return aiResult.trim();

    // Default fallback
    return `Motivated and detail-oriented ${role || 'Software Engineer'} with strong expertise in ${skills.length ? skills.join(', ') : 'modern tech stacks'}. Proven track record in developing high-performance applications, solving complex algorithms, and collaborating in agile teams. Eager to leverage technical problem-solving skills to drive product innovation.`;
  },

  /**
   * Generate Project Description & Bullet Points
   */
  async generateProjectBullets(projectName, techStack) {
    const prompt = `Generate 3 strong resume bullet points for a project named "${projectName}" built using "${techStack}". Use action verbs and include metrics/impact. Return as a JSON array of strings.`;
    const aiResult = await callAI(prompt);

    if (aiResult) {
      try {
        const clean = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // parsing failed, split by newlines
        return aiResult.split('\n').filter(line => line.trim().length > 10).slice(0, 3);
      }
    }

    return [
      `Architected and deployed ${projectName || 'application'} utilizing ${techStack || 'React, Node.js, and MongoDB'}, achieving 99.9% uptime.`,
      `Optimized database queries and API response latencies, improving application rendering speed by 35%.`,
      `Implemented responsive UI components and secure RESTful endpoints adhering to standard security practices.`
    ];
  },

  /**
   * Generate Skill Suggestions based on Target Role
   */
  async generateSkillSuggestions(role) {
    const prompt = `List top 8 essential technical and soft skills for a ${role} position. Return ONLY a JSON array of strings.`;
    const aiResult = await callAI(prompt);

    if (aiResult) {
      try {
        const clean = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    const defaultSkillsMap = {
      'Software Developer': ['JavaScript', 'React', 'Node.js', 'Data Structures', 'Git', 'REST APIs', 'SQL', 'Problem Solving'],
      'Data Scientist': ['Python', 'SQL', 'Machine Learning', 'Pandas', 'TensorFlow', 'Data Visualization', 'Statistics', 'R'],
      'Product Manager': ['Agile / Scrum', 'User Research', 'Product Strategy', 'Roadmapping', 'Jira', 'Data Analytics', 'Wireframing'],
      'Full Stack Engineer': ['React.js', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Docker', 'AWS', 'System Design']
    };

    return defaultSkillsMap[role] || ['Problem Solving', 'Data Structures', 'Git', 'RESTful APIs', 'JavaScript', 'Database Management', 'Agile', 'Team Collaboration'];
  },

  /**
   * ATS Resume Analysis
   */
  async analyzeATS(resumeText, targetRole = 'Software Developer') {
    const prompt = `Analyze the following resume text for a target role of "${targetRole}".
Resume Text:
"""
${resumeText}
"""

Evaluate ATS compliance and return a JSON object with this exact structure:
{
  "overallScore": number (0-100),
  "summary": {
    "goodPoints": [string],
    "needsImprovement": [string]
  },
  "metrics": {
    "keywordMatch": number (0-100),
    "contentQuality": number (0-100),
    "formatting": number (0-100),
    "readability": number (0-100)
  },
  "missingKeywords": [string],
  "actionableSuggestions": [string]
}`;

    const aiResult = await callAI(prompt);

    if (aiResult) {
      try {
        const clean = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (parsed && parsed.overallScore !== undefined) {
          return parsed;
        }
      } catch (e) {}
    }

    // Smart heuristic fallback
    const textLength = resumeText ? resumeText.length : 0;
    const baseScore = Math.min(92, Math.max(65, Math.floor(textLength / 40)));

    return {
      overallScore: baseScore,
      summary: {
        goodPoints: [
          'Clear section structure for Education, Skills, and Projects.',
          'Contains quantifiable metrics in project bullet points.',
          'Includes relevant industry contact details and links.'
        ],
        needsImprovement: [
          'Add more specific domain terms for ' + targetRole + '.',
          'Enhance summary conciseness for immediate recruiter scanning.',
          'Incorporate standard standard skill keyword variations.'
        ]
      },
      metrics: {
        keywordMatch: Math.min(100, baseScore + 4),
        contentQuality: baseScore,
        formatting: Math.min(100, baseScore + 8),
        readability: Math.min(100, baseScore + 2)
      },
      missingKeywords: ['REST API', 'CI/CD', 'Docker', 'Agile', 'Jest', 'System Design'],
      actionableSuggestions: [
        'Use action verbs at the beginning of each experience bullet point.',
        'Ensure key technologies are explicitly stated under a dedicated Skills section.',
        'Avoid putting essential information inside tables or graphic headers.'
      ]
    };
  },

  /**
   * HR Interview Question Generation (Round 2+)
   */
  async generateHRQuestions(userProfile = {}) {
    const { role = 'Software Developer', skills = [], projects = [], interests = [] } = userProfile;
    const prompt = `Generate 4 tailored interview questions for a candidate applying for ${role}.
Skills: ${skills.join(', ')}
Projects: ${projects.map(p => p.title || p).join(', ')}
Interests: ${interests.join(', ')}

Return ONLY a JSON array of objects with structure:
[
  {
    "id": string,
    "title": string,
    "category": string,
    "difficulty": "Easy" | "Medium" | "Hard",
    "tip": string
  }
]`;

    const aiResult = await callAI(prompt);

    if (aiResult) {
      try {
        const clean = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }

    return [
      {
        id: 'hr_dyn_1',
        title: `Tell me about a project you worked on using ${skills[0] || 'your core skills'}. What was your specific role?`,
        category: 'Project Deep-Dive',
        difficulty: 'Medium',
        tip: 'Structure your answer using the STAR method: Situation, Task, Action, Result.'
      },
      {
        id: 'hr_dyn_2',
        title: `How do you handle conflict or technical disagreements when working in a software development team?`,
        category: 'Behavioral & Culture',
        difficulty: 'Medium',
        tip: 'Emphasize constructive communication, active listening, and focusing on user/business goals.'
      },
      {
        id: 'hr_dyn_3',
        title: `Describe a situation where a piece of code you wrote failed in production or testing. How did you debug it?`,
        category: 'Problem Solving & Resilience',
        difficulty: 'Hard',
        tip: 'Be honest about what went wrong and highlight what process or test coverage you introduced to prevent it.'
      },
      {
        id: 'hr_dyn_4',
        title: `Where do you see yourself professionally in the next 3 to 5 years in ${role}?`,
        category: 'Career Aspirations',
        difficulty: 'Easy',
        tip: 'Align your personal growth goals with technical mastery, leadership, and value creation.'
      }
    ];
  },

  /**
   * Evaluate Candidate HR Answer
   */
  async evaluateHRAnswer(questionText, userResponse) {
    const prompt = `Evaluate candidate response for HR question:
Question: "${questionText}"
Candidate Answer: "${userResponse}"

Rate candidate performance from 0-100 and return ONLY a JSON object:
{
  "overallScore": number (0-100),
  "scores": {
    "confidence": number,
    "grammar": number,
    "communication": number,
    "clarity": number,
    "relevance": number
  },
  "feedback": string
}`;

    const aiResult = await callAI(prompt);

    if (aiResult) {
      try {
        const clean = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (parsed && parsed.overallScore !== undefined) return parsed;
      } catch (e) {}
    }

    const responseLen = userResponse ? userResponse.trim().length : 0;
    const baseScore = responseLen > 120 ? 88 : responseLen > 50 ? 76 : 60;

    return {
      overallScore: baseScore,
      scores: {
        confidence: Math.min(95, baseScore + 2),
        grammar: Math.min(96, baseScore + 4),
        communication: Math.min(94, baseScore + 1),
        clarity: Math.min(92, baseScore - 1),
        relevance: Math.min(95, baseScore + 3)
      },
      feedback: `Solid answer! You addressed "${questionText.substring(0, 40)}..." well. To stand out, quantify your past impact with numbers (e.g. reduced load time by 30%, led team of 4) and highlight specific technical learnings.`
    };
  }
};
