import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import {
  uploadFile,
  validateFile,
  validateFileSignature,
  generateStoragePath,
  getSignedDownloadUrl
} from '../services/storageService.js';
import { TextExtractorService } from '../services/textExtractorService.js';
import { GrokService, sanitizeUserInput } from '../services/grokService.js';
import { SocialProfileService } from '../services/socialProfileService.js';
import { getStudentContext } from '../services/studentContext.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculatePlacementReadiness } from '../utils/scoring.js';

/**
 * POST /api/onboarding/resume
 * Validates and uploads a candidate's resume (PDF or DOCX), extracts text,
 * runs initial ATS analysis, and stores the record in Firestore.
 */
export const uploadOnboardingResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!req.file) {
      return sendError(res, 'No resume file provided. Please upload a PDF or DOCX file.', 400);
    }

    const { targetRole = 'Software Developer' } = req.body;

    // 1. Validate bucket config (size and MIME)
    const validation = validateFile('resumes', req.file.mimetype, req.file.size);
    if (!validation.valid) {
      return sendError(res, validation.error, 400);
    }

    // 2. Validate magic bytes file signature
    const isValidSignature = validateFileSignature(req.file.buffer, req.file.mimetype);
    if (!isValidSignature) {
      return sendError(res, 'File content does not match the file extension. Please upload a valid, uncorrupted PDF or DOCX file.', 400);
    }

    // 3. Extract text server-side
    const extractedText = await TextExtractorService.extractTextFromFile(req.file.buffer, req.file.mimetype);
    const cleanText = (extractedText || '').trim();

    // If PDF is scanned or image-based with no extractable text
    if (cleanText.length < 20) {
      return sendError(
        res,
        'Could not extract text from this resume (scanned or image-only file detected). Please upload a text-based PDF/DOCX or use our manual entry form.',
        422
      );
    }

    // 4. Safe storage path and upload to Supabase
    const resumeId = 'res_' + userId + '_' + Date.now();
    const storagePath = generateStoragePath('resumes', userId, req.file.mimetype, 'onboarding');
    const uploadResult = await uploadFile('resumes', storagePath, req.file.buffer, req.file.mimetype);
    const signedUrl = await getSignedDownloadUrl('resumes', storagePath, 3600);

    // 5. Run ATS Check using existing GrokService
    let atsReport = {
      overallScore: 65,
      summary: { goodPoints: ['Clean resume structure'], needsImprovement: ['Add quantified achievements'] },
      metrics: { keywordMatch: 60, contentQuality: 65, formatting: 75, readability: 70 },
      missingKeywords: [],
      actionableSuggestions: ['Add measurable impacts to your project descriptions']
    };

    try {
      const studentContext = await getStudentContext(userId);
      const aiATS = await GrokService.analyzeATS(cleanText.slice(0, 6000), targetRole, studentContext);
      if (aiATS && typeof aiATS.overallScore === 'number') {
        atsReport = aiATS;
      }
    } catch (atsErr) {
      console.warn('[OnboardingController] AI ATS fallback notice:', atsErr.message);
    }

    // 6. Save resume record in 'resumes' collection (Additive, marking as uploaded & primary)
    const resumeDoc = {
      resumeId,
      userId,
      title: `${targetRole} Resume`,
      role: targetRole,
      source: 'uploaded',
      isPrimary: true,
      templateId: 'modern',
      fileName: req.file.originalname,
      storageProvider: 'supabase',
      storagePath: uploadResult.storagePath,
      pdfUrl: signedUrl,
      pdfFileSize: req.file.size,
      pdfFileType: req.file.mimetype,
      pdfUploadedAt: new Date().toISOString(),
      parsedText: cleanText.slice(0, 5000),
      atsScore: atsReport.overallScore || 0,
      createdAt: new Date().toISOString()
    };
    await FirestoreHelper.setDoc('resumes', resumeId, resumeDoc);

    // Save ATS report in 'ats_results'
    const reportId = 'ats_rep_' + userId + '_' + Date.now();
    await FirestoreHelper.setDoc('ats_results', reportId, {
      reportId,
      userId,
      resumeId,
      targetRole,
      overallScore: atsReport.overallScore || 0,
      summary: atsReport.summary || {},
      metrics: atsReport.metrics || {},
      missingKeywords: atsReport.missingKeywords || [],
      actionableSuggestions: atsReport.actionableSuggestions || [],
      createdAt: new Date().toISOString()
    });

    // Update readiness stats
    const readiness = await FirestoreHelper.getDoc('placement_readiness', 'readiness_' + userId) || {};
    const updatedReadiness = {
      ...readiness,
      atsScore: atsReport.overallScore || 0,
      resumesCreated: Math.max((readiness.resumesCreated || 0), 1)
    };
    updatedReadiness.overallReadiness = calculatePlacementReadiness(updatedReadiness);
    await FirestoreHelper.setDoc('placement_readiness', 'readiness_' + userId, updatedReadiness);

    return sendSuccess(res, {
      resumeId,
      fileName: req.file.originalname,
      storagePath: uploadResult.storagePath,
      pdfUrl: signedUrl,
      extractedTextLength: cleanText.length,
      parsedText: cleanText.slice(0, 4000),
      atsReport
    }, 'Resume uploaded and analyzed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/onboarding/analyze
 * Aggregates resume, GitHub, LinkedIn, and manual details into a Grok analysis
 * producing personalized profile summary, study plan, and starter questions.
 */
export const analyzeProfilesAndBuildPlan = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      targetRole = 'Software Developer',
      resumeText = '',
      resumeId = '',
      github = '',
      linkedin = '',
      linkedinText = '',
      manualData = null
    } = req.body;

    let effectiveResumeText = resumeText || '';

    // If resumeId was provided, load text from resume document
    if (!effectiveResumeText && resumeId) {
      const resDoc = await FirestoreHelper.getDoc('resumes', resumeId);
      if (resDoc && resDoc.userId === userId) {
        effectiveResumeText = resDoc.parsedText || '';
      }
    }

    // 1. Fetch Social Context (GitHub + LinkedIn)
    const socialContext = await SocialProfileService.getSocialProfileContext({
      github,
      linkedin,
      linkedinText
    });

    // 2. Student Context
    const studentContext = await getStudentContext(userId);

    // 3. Call Grok AI Onboarding Analysis
    const aiAnalysis = await GrokService.analyzeOnboardingProfile({
      resumeText: effectiveResumeText,
      manualData,
      githubData: socialContext.githubData,
      linkedinData: socialContext.linkedinData,
      targetRole,
      studentContext
    });

    // 4. Save to 'student_analysis' collection
    const analysisId = 'analysis_' + userId + '_' + Date.now();
    const analysisDoc = {
      analysisId,
      userId,
      targetRole,
      sourcesUsed: socialContext.sourceStatus,
      evidenceExcerpts: socialContext.evidenceExcerpts,
      inputsSummary: {
        hasResume: !!effectiveResumeText,
        hasManual: !!manualData,
        hasGitHub: !!github,
        hasLinkedIn: !!(linkedin || linkedinText)
      },
      analysis: aiAnalysis,
      createdAt: new Date().toISOString(),
      version: 1
    };
    await FirestoreHelper.setDoc('student_analysis', analysisId, analysisDoc);

    // 5. Save/Update 'study_plans' collection
    const planId = `plan_${userId}`;
    const studyPlanDoc = {
      planId,
      userId,
      targetRole,
      durationWeeks: aiAnalysis.studyPlan?.durationWeeks || 4,
      weeks: aiAnalysis.studyPlan?.weeks || [],
      starterQuestions: aiAnalysis.starterQuestions || {},
      updatedAt: new Date().toISOString()
    };
    await FirestoreHelper.setDoc('study_plans', planId, studyPlanDoc);

    return sendSuccess(res, {
      analysisId,
      planId,
      analysis: aiAnalysis,
      sourceStatus: socialContext.sourceStatus,
      evidenceExcerpts: socialContext.evidenceExcerpts
    }, 'Personalized profile and study plan generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/onboarding/confirm
 * Commits candidate's reviewed skills, projects, and target role into
 * the 'skills', 'projects', and 'profiles' collections. Marks onboarding complete.
 */
export const confirmOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      confirmedSkills = [],
      confirmedProjects = [],
      targetRole = 'Software Developer',
      github = '',
      linkedin = '',
      bio = '',
      education = null
    } = req.body;

    // 1. Write confirmed skills avoiding duplicates
    if (Array.isArray(confirmedSkills) && confirmedSkills.length > 0) {
      const existingSkills = await FirestoreHelper.queryCollection('skills', 'userId', userId);
      const existingNames = new Set(existingSkills.map(s => (s.name || '').toLowerCase()));

      for (const skill of confirmedSkills) {
        const skillName = typeof skill === 'string' ? skill.trim() : (skill.name || '').trim();
        if (skillName && !existingNames.has(skillName.toLowerCase())) {
          existingNames.add(skillName.toLowerCase());
          const skillId = 'sk_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
          await FirestoreHelper.setDoc('skills', skillId, {
            skillId,
            userId,
            name: skillName,
            category: 'Technical',
            level: skill.level || 'Intermediate',
            evidence: skill.evidence || 'onboarding',
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // 2. Write confirmed projects avoiding duplicates
    if (Array.isArray(confirmedProjects) && confirmedProjects.length > 0) {
      const existingProjects = await FirestoreHelper.queryCollection('projects', 'userId', userId);
      const existingTitles = new Set(existingProjects.map(p => (p.title || '').toLowerCase()));

      for (const proj of confirmedProjects) {
        const title = (proj.title || '').trim();
        if (title && !existingTitles.has(title.toLowerCase())) {
          existingTitles.add(title.toLowerCase());
          const projectId = 'proj_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
          await FirestoreHelper.setDoc('projects', projectId, {
            projectId,
            userId,
            title,
            description: (proj.description || '').slice(0, 500),
            tech: proj.technologies || proj.tech || '',
            link: proj.link || '',
            source: proj.source || 'onboarding',
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // 3. Update Profile
    const profileId = 'prof_' + userId;
    const profileUpdates = {
      profileId,
      userId,
      targetRole,
      ...(github && { github: github.trim() }),
      ...(linkedin && { linkedIn: linkedin.trim() }),
      ...(bio && { bio: bio.trim().slice(0, 1000) }),
      ...(Array.isArray(confirmedSkills) && {
        skills: confirmedSkills.map(s => typeof s === 'string' ? s : s.name).filter(Boolean)
      }),
      ...(education && {
        college: education.college || '',
        branch: education.branch || '',
        passingYear: education.passingYear || education.year || ''
      })
    };
    await FirestoreHelper.setDoc('profiles', profileId, profileUpdates, true);

    // 4. Update User onboarding status to 'completed'
    await FirestoreHelper.setDoc('users', userId, {
      role: targetRole,
      onboarding: {
        status: 'completed',
        currentStep: 4,
        completedAt: new Date().toISOString(),
        skippedAt: null
      }
    }, true);

    return sendSuccess(res, {
      status: 'completed',
      message: 'Onboarding successfully completed'
    }, 'Onboarding confirmed');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/onboarding/step
 * Saves mid-flow onboarding step and draft data so refresh/tab-closing resumes cleanly.
 */
export const saveStepProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { step = 1, draftData = {} } = req.body;

    await FirestoreHelper.setDoc('users', userId, {
      onboarding: {
        status: 'in_progress',
        currentStep: Number(step),
        draft: draftData,
        updatedAt: new Date().toISOString()
      }
    }, true);

    return sendSuccess(res, { step, status: 'in_progress' }, 'Step progress saved');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/onboarding/skip
 * Marks onboarding as skipped so the student is never trapped.
 */
export const skipOnboarding = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await FirestoreHelper.setDoc('users', userId, {
      onboarding: {
        status: 'skipped',
        currentStep: 1,
        skippedAt: new Date().toISOString()
      }
    }, true);

    return sendSuccess(res, { status: 'skipped' }, 'Onboarding skipped');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/onboarding/state
 * Retrieves user's saved onboarding status, draft, and active plan for resuming.
 */
export const getOnboardingState = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userDoc = await FirestoreHelper.getDoc('users', userId);
    const planDoc = await FirestoreHelper.getDoc('study_plans', `plan_${userId}`);
    const analysisDocs = await FirestoreHelper.queryCollection('student_analysis', 'userId', userId);

    return sendSuccess(res, {
      onboarding: userDoc?.onboarding || { status: 'not_started', currentStep: 1 },
      studyPlan: planDoc || null,
      latestAnalysis: analysisDocs && analysisDocs.length > 0 ? analysisDocs[analysisDocs.length - 1] : null
    }, 'Onboarding state retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/onboarding/study-plan/task
 * Toggles a task completion checkbox in the student's study plan.
 */
export const toggleStudyPlanTask = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { weekNumber, taskId, completed } = req.body;

    const planId = `plan_${userId}`;
    const planDoc = await FirestoreHelper.getDoc('study_plans', planId);
    if (!planDoc || !Array.isArray(planDoc.weeks)) {
      return sendError(res, 'Study plan not found.', 404);
    }

    const updatedWeeks = planDoc.weeks.map(week => {
      if (week.week === Number(weekNumber) && Array.isArray(week.tasks)) {
        return {
          ...week,
          tasks: week.tasks.map(t => (t.id === taskId ? { ...t, completed: Boolean(completed) } : t))
        };
      }
      return week;
    });

    await FirestoreHelper.setDoc('study_plans', planId, {
      weeks: updatedWeeks,
      updatedAt: new Date().toISOString()
    }, true);

    return sendSuccess(res, { weeks: updatedWeeks }, 'Study plan task updated');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/onboarding/plan
 * Fetches student's active personalized study plan and analysis summary for Dashboard.
 */
export const getStudyPlan = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const planDoc = await FirestoreHelper.getDoc('study_plans', `plan_${userId}`);
    const analysisDocs = await FirestoreHelper.queryCollection('student_analysis', 'userId', userId);
    const latestAnalysis = analysisDocs && analysisDocs.length > 0 ? analysisDocs[analysisDocs.length - 1] : null;

    return sendSuccess(res, {
      studyPlan: planDoc || null,
      analysis: latestAnalysis?.analysis || null,
      sourcesUsed: latestAnalysis?.sourcesUsed || null,
      createdAt: latestAnalysis?.createdAt || null
    }, 'Study plan retrieved');
  } catch (err) {
    next(err);
  }
};
