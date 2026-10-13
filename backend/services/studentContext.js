import { FirestoreHelper } from '../firebase/firestoreHelper.js';

/**
 * Fetches real student context from Firestore to personalize AI generation.
 * @param {string} userId - Current authenticated user ID
 * @returns {Promise<Object>} Student context object with formatted prompt snippet
 */
export async function getStudentContext(userId) {
  if (!userId) {
    return {
      userId: 'anonymous',
      skills: [],
      branch: 'Computer Science',
      targetRole: 'Software Engineer',
      scores: {},
      weakAreas: [],
      promptSnippet: 'Candidate is an aspiring Software Engineer.'
    };
  }

  try {
    // 1. Fetch Profile
    const profile = await FirestoreHelper.getDoc('profiles', `prof_${userId}`) || {};

    // 2. Fetch Placement Readiness
    const readiness = await FirestoreHelper.getDoc('placement_readiness', `readiness_${userId}`) || {};

    // 3. Fetch User Resume / Skills
    const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
    const latestResume = resumes && resumes.length > 0 ? resumes[resumes.length - 1] : null;

    const skillsDocs = await FirestoreHelper.queryCollection('skills', 'userId', userId);
    const directSkills = skillsDocs.map(s => s.name || s.skillName).filter(Boolean);
    const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
    const allSkills = Array.from(new Set([...directSkills, ...profileSkills]));

    // 4. Fetch recent test attempts to find weak areas
    const aptitudeAttempts = await FirestoreHelper.queryCollection('aptitude_attempts', 'userId', userId);
    const techAttempts = await FirestoreHelper.queryCollection('technical_practice', 'userId', userId);
    const hrInterviews = await FirestoreHelper.queryCollection('hr_interviews', 'userId', userId);

    const weakAreas = [];
    const strongAreas = [];

    // Analyze aptitude attempts
    if (aptitudeAttempts.length > 0) {
      aptitudeAttempts.slice(-5).forEach(att => {
        const topic = att.topic || att.category || 'Aptitude';
        if (att.score < 60) {
          weakAreas.push(`${topic} (score: ${att.score}%)`);
        } else if (att.score >= 80) {
          strongAreas.push(`${topic} (score: ${att.score}%)`);
        }
      });
    }

    // 5. Gather practiced topics from technical submissions
    const techTopics = [];
    if (techAttempts.length > 0) {
      techAttempts.slice(-10).forEach(att => {
        if (att.category && !techTopics.includes(att.category)) {
          techTopics.push(att.category);
        }
        if (att.language && !techTopics.includes(att.language)) {
          techTopics.push(att.language);
        }
      });
    }

    // 6. Fetch Student Onboarding Analysis & Verified Projects
    let onboardingAnalysis = null;
    let verifiedProjects = [];
    try {
      const analysisDocs = await FirestoreHelper.queryCollection('student_analysis', 'userId', userId);
      if (analysisDocs && analysisDocs.length > 0) {
        onboardingAnalysis = analysisDocs[analysisDocs.length - 1];
        if (Array.isArray(onboardingAnalysis.detectedProjects)) {
          verifiedProjects = onboardingAnalysis.detectedProjects.map(p => p.title + (p.technologies ? ` (${p.technologies})` : ''));
        }
        if (Array.isArray(onboardingAnalysis.starterQuestions?.aptitudeTopics)) {
          onboardingAnalysis.starterQuestions.aptitudeTopics.forEach(t => {
            if (!weakAreas.some(w => w.includes(t))) weakAreas.push(`Priority Onboarding Topic: ${t}`);
          });
        }
      }
      // Also check projects collection directly
      const projectsDocs = await FirestoreHelper.queryCollection('projects', 'userId', userId);
      if (projectsDocs && projectsDocs.length > 0) {
        projectsDocs.forEach(p => {
          const title = p.title || p.name;
          if (title && !verifiedProjects.some(vp => vp.startsWith(title))) {
            verifiedProjects.push(title + (p.tech ? ` (${p.tech})` : ''));
          }
        });
      }
    } catch (anErr) {
      console.warn('[StudentContext] Analysis lookup notice:', anErr.message);
    }

    const targetRole = latestResume?.role || profile.role || profile.targetRole || '';
    const college = profile.college?.trim() || '';
    const branch = profile.branch?.trim() || '';
    const educationSummary = (college && branch)
      ? `${branch} student at ${college}`
      : (branch || college || 'Student / Recent Graduate');

    const promptSnippet = `
Student Background:
- Status: Entry-level student / fresher candidate preparing for campus placement
- Education: ${educationSummary}
- Target Role: ${targetRole}
- Explicit Skills: ${allSkills.length > 0 ? allSkills.join(', ') : 'None explicitly specified yet'}
${verifiedProjects.length > 0 ? `- Candidate's Real Evidenced Projects: ${verifiedProjects.slice(0, 4).join('; ')}` : ''}
${techTopics.length > 0 ? `- Topics Practiced on Platform: ${techTopics.join(', ')}` : ''}
- Readiness Scores: Aptitude: ${readiness.aptitudeScore ?? 'Not evaluated'}%, Technical: ${readiness.technicalScore ?? 'Not evaluated'}%, HR: ${readiness.hrScore ?? 'Not evaluated'}%, ATS Resume: ${readiness.atsScore ?? 'Not evaluated'}%
${weakAreas.length > 0 ? `- Weak/Priority Areas needing improvement: ${weakAreas.slice(0, 4).join(', ')}` : ''}
${strongAreas.length > 0 ? `- Demonstrated Strengths: ${strongAreas.slice(0, 3).join(', ')}` : ''}
`.trim();

    return {
      userId,
      profile,
      targetRole,
      college,
      branch,
      educationSummary,
      skills: allSkills,
      readiness,
      weakAreas,
      strongAreas,
      technicalTopicsPracticed: techTopics,
      recentAttempts: {
        aptitude: aptitudeAttempts.length,
        technical: techAttempts.length,
        hr: hrInterviews.length
      },
      promptSnippet
    };
  } catch (error) {
    console.warn(`[StudentContext] Error fetching context for ${userId}:`, error.message);
    return {
      userId,
      skills: [],
      branch: '',
      college: '',
      educationSummary: 'Student / Recent Graduate',
      targetRole: '',
      scores: {},
      weakAreas: [],
      strongAreas: [],
      technicalTopicsPracticed: [],
      promptSnippet: 'Candidate is an entry-level student / fresher preparing for campus placement.'
    };
  }
}
