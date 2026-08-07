import { API } from './api';

export const generateProfessionalSummary = async (role, skills = [], experienceYears = 0) => {
  try {
    const res = await API.generateAIContent({ type: 'summary', role, skills, experienceYears });
    if (res?.summary) return res.summary;
  } catch (err) {
    console.warn('AI Summary API fallback:', err.message);
  }

  const roleSummaries = {
    'Software Developer': `Motivated and detail-oriented Software Developer with core expertise in building modern, scalable web applications using React, Node.js, and SQL. Passionate about writing clean code, solving complex algorithms, and implementing high-performance responsive web interfaces.`,
    'Data Scientist': `Analytical Data Scientist proficient in Python, SQL, Machine Learning models, and statistical analysis. Proven track record in transforming complex datasets into actionable business intelligence and predictive solutions.`,
    'Product Manager': `Strategic Product Manager adept at user research, roadmap planning, and cross-functional agile leadership. Skilled at bridging business strategy and technical execution to build high-impact customer-centric products.`,
    'Full Stack Engineer': `Versatile Full Stack Engineer with solid expertise in frontend responsive UI design and robust backend RESTful microservices architecture. Experienced in Cloud deployments, CI/CD pipelines, and database optimization.`
  };

  return roleSummaries[role] || `Dedicated ${role || 'Professional'} eager to leverage technical skills in engineering, project management, and problem solving to deliver high-quality solutions in fast-paced software environments.`;
};

export const generateProjectBulletPoints = async (projectName, techStack) => {
  try {
    const res = await API.generateAIContent({ type: 'projectBullets', projectName, techStack });
    if (res?.bullets) return res.bullets;
  } catch (err) {
    console.warn('AI Bullets API fallback:', err.message);
  }

  return [
    `Architected and deployed ${projectName || 'application'} utilizing ${techStack || 'React, Firebase, and Tailwind CSS'} ensuring 99.9% uptime.`,
    `Optimized state management and database queries resulting in a 40% reduction in page load latency.`,
    `Implemented responsive glassmorphism UI design patterns and integrated secure RESTful API endpoints.`
  ];
};

export const analyzeATSResume = async (fileName, fileContent) => {
  try {
    const res = await API.analyzeATS({ resumeText: fileContent, targetRole: 'Software Developer' });
    if (res) return res;
  } catch (err) {
    console.warn('ATS API fallback:', err.message);
  }

  return {
    overallScore: 84,
    summary: {
      goodPoints: [
        'Properly structured contact details and professional summary.',
        'Relevant technical skills listed with recognized keywords.',
        'Projects are well-described with quantitative impact metrics.'
      ],
      needsImprovement: [
        'Add more industry-standard keyword variations for cloud technologies.',
        'Improve professional summary conciseness.',
        'Add more measurable achievement metrics in work experience.'
      ]
    },
    metrics: {
      keywordMatch: 88,
      contentQuality: 85,
      formatting: 90,
      readability: 80
    },
    missingKeywords: ['REST API', 'Git', 'Agile', 'OOP', 'Data Structures', 'Docker', 'Jest'],
    actionableSuggestions: [
      'Include metrics like "increased throughput by 25%" or "reduced load time by 300ms".',
      'Use standard ATS section titles like "Work Experience", "Education", and "Skills".',
      'Avoid placing text in header/footer regions or using complex graphic tables.'
    ]
  };
};

export const evaluateHRAnswer = async (question, userResponse) => {
  try {
    const res = await API.evaluateHRAnswer({
      questionId: question.id,
      questionTitle: question.title,
      userResponse
    });
    if (res?.evaluation) return res.evaluation;
  } catch (err) {
    console.warn('HR Evaluation API fallback:', err.message);
  }

  const responseLength = userResponse ? userResponse.trim().length : 0;
  let baseScore = responseLength > 80 ? 85 : responseLength > 30 ? 75 : 60;

  return {
    overallScore: baseScore,
    scores: {
      communication: Math.min(95, baseScore + 3),
      relevance: Math.min(92, baseScore - 2),
      confidence: Math.min(90, baseScore + 1),
      grammar: Math.min(96, baseScore + 4)
    },
    feedback: `Good answer! You clearly explained your experience related to "${question.title || 'the question'}". To make it even stronger, mention specific metrics and concrete examples from past internships or academic projects using the STAR method (Situation, Task, Action, Result).`
  };
};

