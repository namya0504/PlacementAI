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

    const targetRole = latestResume?.role || profile.targetRole || 'Software Engineer';
    const college = profile.college || 'Engineering College';
    const branch = profile.branch || 'Computer Science & Engineering';

    const promptSnippet = `
Student Background:
- College/Branch: ${college}, ${branch}
- Target Role: ${targetRole}
- Skills: ${allSkills.length > 0 ? allSkills.join(', ') : 'Data Structures, Algorithms, JavaScript, Python'}
- Readiness Scores: Aptitude: ${readiness.aptitudeScore ?? 'Not taken'}%, Technical: ${readiness.technicalScore ?? 'Not taken'}%, HR: ${readiness.hrScore ?? 'Not taken'}%, ATS Resume: ${readiness.atsScore ?? 'Not evaluated'}%
${weakAreas.length > 0 ? `- Weak Areas needing improvement: ${weakAreas.slice(0, 3).join(', ')}` : ''}
${strongAreas.length > 0 ? `- Demonstrated Strengths: ${strongAreas.slice(0, 3).join(', ')}` : ''}
`.trim();

    return {
      userId,
      profile,
      targetRole,
      college,
      branch,
      skills: allSkills,
      readiness,
      weakAreas,
      strongAreas,
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
      branch: 'Computer Science',
      targetRole: 'Software Engineer',
      scores: {},
      weakAreas: [],
      promptSnippet: 'Candidate is an aspiring Software Engineer with foundational knowledge in Computer Science.'
    };
  }
}
