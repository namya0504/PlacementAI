import { FirestoreHelper } from '../firebase/firestoreHelper.js';
import {
  uploadFile,
  validateFile,
  validateFileSignature,
  generateStoragePath,
  getSignedDownloadUrl,
  deleteFile,
  downloadFileBuffer,
  parseStoragePath,
  isOwnedByUser
} from '../services/storageService.js';
import { TextExtractorService } from '../services/textExtractorService.js';
import { GrokService } from '../services/grokService.js';
import { SocialProfileService } from '../services/socialProfileService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileId = 'prof_' + userId;

    let profileDoc = await FirestoreHelper.getDoc('profiles', profileId);
    let userDoc = await FirestoreHelper.getDoc('users', userId);

    if (!userDoc) {
      return sendError(res, 'User not found', 404);
    }

    if (!profileDoc) {
      profileDoc = {
        profileId,
        userId,
        phone: userDoc.phone || '',
        location: userDoc.location || '',
        college: userDoc.college || '',
        branch: userDoc.branch || '',
        passingYear: userDoc.passingYear || '',
        role: userDoc.role || '',
        targetRole: userDoc.targetRole || userDoc.role || '',
        linkedIn: '',
        github: '',
        bio: '',
        interests: [],
        skills: []
      };
      await FirestoreHelper.setDoc('profiles', profileId, profileDoc);
    }

    // Resolve avatar URL (signed Supabase URL for new records, legacy URL for old)
    let photoURL = userDoc.photoURL || '';
    if (userDoc.storageProvider === 'supabase' && userDoc.storagePath) {
      try {
        const { bucket, filePath } = parseStoragePath(userDoc.storagePath);
        photoURL = await getSignedDownloadUrl(bucket, filePath, 3600); // 1 hour for profile display
      } catch (err) {
        console.warn('[Profile] Signed URL fallback:', err.message);
        // Keep the existing photoURL as fallback
      }
    }

    const effectiveRole = profileDoc.targetRole || profileDoc.role || userDoc.targetRole || userDoc.role || '';

    const combined = {
      ...profileDoc,
      uid: userId,
      userId,
      name: userDoc.name || '',
      email: userDoc.email || '',
      role: effectiveRole,
      targetRole: effectiveRole,
      phone: profileDoc.phone || userDoc.phone || '',
      location: profileDoc.location || userDoc.location || '',
      college: profileDoc.college || userDoc.college || '',
      branch: profileDoc.branch || userDoc.branch || '',
      passingYear: profileDoc.passingYear || userDoc.passingYear || '',
      bio: profileDoc.bio || '',
      linkedIn: profileDoc.linkedIn || '',
      github: profileDoc.github || '',
      interests: Array.isArray(profileDoc.interests) ? profileDoc.interests : [],
      skills: Array.isArray(profileDoc.skills) ? profileDoc.skills : [],
      photoURL,
      storageProvider: userDoc.storageProvider || null,
      storagePath: userDoc.storagePath || null
    };

    return sendSuccess(res, combined, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileId = 'prof_' + userId;

    let userDoc = await FirestoreHelper.getDoc('users', userId);
    let profileDoc = await FirestoreHelper.getDoc('profiles', profileId);

    if (!userDoc) {
      return sendError(res, 'User not found', 404);
    }

    const {
      name,
      role,
      targetRole,
      phone,
      location,
      photoURL,
      college,
      branch,
      passingYear,
      linkedIn,
      github,
      bio,
      interests,
      skills,
      currentPassword,
      newPassword
    } = req.body;

    // Handle password change if requested
    if (newPassword !== undefined || currentPassword !== undefined) {
      if (!currentPassword || !newPassword) {
        return sendError(res, 'Both current password and new password are required to change password.', 400);
      }
      if (!userDoc.password) {
        return sendError(res, 'Password change is not available for accounts created via Google Sign-In.', 400);
      }
      const { default: bcrypt } = await import('bcryptjs');
      const match = await bcrypt.compare(currentPassword, userDoc.password);
      if (!match) {
        return sendError(res, 'Current password is incorrect.', 401);
      }
      const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
      if (!PASSWORD_REGEX.test(newPassword)) {
        return sendError(res, 'New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.', 400);
      }
      const hashedNew = await bcrypt.hash(newPassword, 10);
      await FirestoreHelper.setDoc('users', userId, { password: hashedNew }, true);

      // Keep Firebase Auth password in sync if live Firebase is active
      try {
        const { auth } = await import('../firebase/firebaseAdmin.js');
        if (auth) {
          await auth.updateUser(userId, { password: newPassword }).catch(() => {});
        }
      } catch (_) {}

      return sendSuccess(res, {}, 'Password updated successfully');
    }

    const existingPhone = (userDoc.phone || profileDoc?.phone || '').trim();
    const existingCollege = (userDoc.college || profileDoc?.college || '').trim();
    const existingBranch = (userDoc.branch || profileDoc?.branch || '').trim();
    const existingPassingYear = (userDoc.passingYear || profileDoc?.passingYear || '').trim();
    const existingRole = (userDoc.targetRole || userDoc.role || profileDoc?.targetRole || profileDoc?.role || '').trim();

    // STRICT VALIDATION: Compulsory fields cannot be deleted or set to empty string once provided
    if (phone !== undefined) {
      const trimmedPhone = String(phone).trim();
      if (!trimmedPhone && existingPhone) {
        return sendError(res, 'Phone number is a compulsory field and cannot be deleted. You can update it with a new number, but cannot leave it empty.', 400);
      }
    }

    if (college !== undefined) {
      const trimmedCollege = String(college).trim();
      if (!trimmedCollege && existingCollege) {
        return sendError(res, 'College / University is a compulsory field and cannot be deleted.', 400);
      }
    }

    if (branch !== undefined) {
      const trimmedBranch = String(branch).trim();
      if (!trimmedBranch && existingBranch) {
        return sendError(res, 'Branch / Department is a compulsory field and cannot be deleted.', 400);
      }
    }

    if (passingYear !== undefined) {
      const trimmedPassingYear = String(passingYear).trim();
      if (!trimmedPassingYear && existingPassingYear) {
        return sendError(res, 'Passing year is a compulsory field and cannot be deleted.', 400);
      }
    }

    if (targetRole !== undefined || role !== undefined) {
      const trimmedRole = String(targetRole || role || '').trim();
      if (!trimmedRole && existingRole) {
        return sendError(res, 'Target role is a compulsory field and cannot be deleted.', 400);
      }
    }

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        return sendError(res, 'Full name is required and cannot be empty.', 400);
      }
    }

    const assignedTargetRole = (targetRole !== undefined ? targetRole : role);
    const sanitizedRole = (assignedTargetRole !== undefined && typeof assignedTargetRole === 'string' && assignedTargetRole.trim())
      ? assignedTargetRole.trim().slice(0, 80)
      : null;

    // Update user info
    const userUpdates = {};
    if (typeof name === 'string' && name.trim()) userUpdates.name = name.trim().slice(0, 80);
    if (sanitizedRole) {
      userUpdates.targetRole = sanitizedRole;
      userUpdates.role = sanitizedRole;
    }
    if (typeof phone === 'string' && phone.trim()) userUpdates.phone = phone.trim().slice(0, 25);
    if (typeof location === 'string') userUpdates.location = location.trim().slice(0, 100);
    if (typeof college === 'string' && college.trim()) userUpdates.college = college.trim().slice(0, 150);
    if (typeof branch === 'string' && branch.trim()) userUpdates.branch = branch.trim().slice(0, 100);
    if (typeof passingYear === 'string' && passingYear.trim()) userUpdates.passingYear = passingYear.trim().slice(0, 10);
    if (typeof photoURL === 'string' && photoURL.trim()) userUpdates.photoURL = photoURL.trim().slice(0, 500);

    if (Object.keys(userUpdates).length > 0) {
      await FirestoreHelper.setDoc('users', userId, userUpdates, true);
    }

    // Update profile document in profiles collection
    const profileUpdates = {
      profileId,
      userId,
      ...(sanitizedRole && { targetRole: sanitizedRole, role: sanitizedRole }),
      ...(phone !== undefined && phone.trim() && { phone: String(phone).trim().slice(0, 25) }),
      ...(location !== undefined && { location: String(location).trim().slice(0, 100) }),
      ...(college !== undefined && college.trim() && { college: String(college).trim().slice(0, 150) }),
      ...(branch !== undefined && branch.trim() && { branch: String(branch).trim().slice(0, 100) }),
      ...(passingYear !== undefined && passingYear.trim() && { passingYear: String(passingYear).trim().slice(0, 10) }),
      ...(linkedIn !== undefined && { linkedIn: String(linkedIn).trim().slice(0, 200) }),
      ...(github !== undefined && { github: String(github).trim().slice(0, 200) }),
      ...(bio !== undefined && { bio: String(bio).trim().slice(0, 1000) }),
      ...(Array.isArray(interests) && { interests: interests.slice(0, 30) }),
      ...(Array.isArray(skills) && { skills: skills.slice(0, 50) })
    };

    const updatedProfile = await FirestoreHelper.setDoc('profiles', profileId, profileUpdates, true);

    userDoc = await FirestoreHelper.getDoc('users', userId);

    // Resolve avatar URL for response
    let resolvedPhotoURL = userDoc?.photoURL || photoURL;
    if (userDoc?.storageProvider === 'supabase' && userDoc?.storagePath) {
      try {
        const { bucket, filePath } = parseStoragePath(userDoc.storagePath);
        resolvedPhotoURL = await getSignedDownloadUrl(bucket, filePath, 3600);
      } catch (err) {
        // Keep existing photoURL
      }
    }

    const finalRole = sanitizedRole || userDoc?.targetRole || userDoc?.role || updatedProfile.targetRole || updatedProfile.role || '';

    return sendSuccess(res, {
      ...updatedProfile,
      uid: userId,
      name: userDoc?.name || name,
      email: userDoc?.email,
      role: finalRole,
      targetRole: finalRole,
      phone: updatedProfile.phone || userDoc?.phone || '',
      location: updatedProfile.location || userDoc?.location || '',
      college: updatedProfile.college || userDoc?.college || '',
      branch: updatedProfile.branch || userDoc?.branch || '',
      passingYear: updatedProfile.passingYear || userDoc?.passingYear || '',
      photoURL: resolvedPhotoURL
    }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    // Server-side validation
    const validation = validateFile('profile-images', req.file.mimetype, req.file.size);
    if (!validation.valid) {
      return sendError(res, validation.error, 400);
    }
    if (!validateFileSignature(req.file.buffer, req.file.mimetype)) {
      return sendError(res, 'Image content does not match its file type.', 400);
    }

    // Generate safe storage path
    const storagePath = generateStoragePath('profile-images', userId, req.file.mimetype);

    // Delete previous Supabase avatar if one exists
    const currentUser = await FirestoreHelper.getDoc('users', userId);
    if (currentUser?.storageProvider === 'supabase' && currentUser?.storagePath) {
      try {
        const { bucket: oldBucket, filePath: oldPath } = parseStoragePath(currentUser.storagePath);
        if (isOwnedByUser(oldPath, userId)) {
          await deleteFile(oldBucket, oldPath);
        }
      } catch (delErr) {
        console.warn('[Profile] Old avatar cleanup notice:', delErr.message);
        // Non-blocking — continue with upload
      }
    }

    // Upload to Supabase Storage
    const result = await uploadFile('profile-images', storagePath, req.file.buffer, req.file.mimetype);

    // SEC-19 fix: verify the generated path is owned by this user before issuing any URL
    const { filePath: newFilePath } = parseStoragePath(result.storagePath);
    if (!isOwnedByUser(newFilePath, userId)) {
      return sendError(res, 'Storage path ownership validation failed', 403);
    }

    // Get a signed URL to return to the frontend (1-hour TTL for immediate display).
    // NOTE: We do NOT persist this URL — it expires. The storagePath is stored and
    // a fresh URL is regenerated via getProfile whenever needed.
    const signedUrl = await getSignedDownloadUrl('profile-images', storagePath, 3600);

    // Store storage metadata only — no cached signed URL as photoURL
    await FirestoreHelper.setDoc('users', userId, {
      storageProvider: 'supabase',
      storagePath: result.storagePath,
      avatarFileName: storagePath.split('/').pop(),
      avatarFileType: req.file.mimetype,
      avatarFileSize: req.file.size,
      avatarUploadedAt: new Date().toISOString()
    }, true);

    return sendSuccess(res, { photoURL: signedUrl }, 'Profile picture uploaded successfully');
  } catch (err) {
    next(err);
  }
};


/**
 * POST /api/profile/upload-resume
 * Stores the user's own uploaded resume (PDF/DOCX) as their "profile resume".
 * Old resume is deleted from Supabase before upload.
 */
export const uploadProfileResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!req.file) return sendError(res, 'No resume file uploaded', 400);

    const validation = validateFile('resumes', req.file.mimetype, req.file.size);
    if (!validation.valid) return sendError(res, validation.error, 400);
    if (!validateFileSignature(req.file.buffer, req.file.mimetype)) {
      return sendError(res, 'Resume content does not match its file type.', 400);
    }

    const storagePath = generateStoragePath('resumes', userId, req.file.mimetype, `profile_resume_${userId}`);

    // Delete existing profile resume if present
    const userDoc = await FirestoreHelper.getDoc('users', userId);
    if (userDoc?.resumeStorageProvider === 'supabase' && userDoc?.resumeStoragePath) {
      try {
        const { bucket, filePath } = parseStoragePath(userDoc.resumeStoragePath);
        if (isOwnedByUser(filePath, userId)) await deleteFile(bucket, filePath);
      } catch (delErr) {
        console.warn('[Profile] Old resume cleanup notice:', delErr.message);
      }
    }

    const result = await uploadFile('resumes', storagePath, req.file.buffer, req.file.mimetype);
    // Generate a fresh signed URL to return to the client immediately (1-hour TTL).
    // NOTE: We do NOT persist this URL — signed URLs expire.
    // getProfileResume always regenerates from resumeStoragePath at read time.
    const signedUrl = await getSignedDownloadUrl('resumes', storagePath, 3600);

    const rawBase = (req.file.originalname || 'Resume.pdf').replace(/\.[^/.]+$/, '').trim();
    const cleanTitle = rawBase.replace(/[_-]+/g, ' ').trim() || 'My Resume';

    await FirestoreHelper.setDoc('users', userId, {
      resumeStorageProvider: 'supabase',
      resumeStoragePath: result.storagePath,
      resumeFileName: req.file.originalname || storagePath.split('/').pop(),
      resumeFileType: req.file.mimetype,
      resumeFileSize: req.file.size,
      resumeUploadedAt: new Date().toISOString()
      // resumeDownloadUrl intentionally not stored — always regenerated on read
    }, true);

    // Also sync to 'resumes' collection so it appears in My Resumes with the proper name
    try {
      const resumeId = 'res_' + userId + '_' + Date.now();
      await FirestoreHelper.setDoc('resumes', resumeId, {
        resumeId,
        userId,
        title: cleanTitle,
        role: userDoc?.targetRole || userDoc?.role || '',
        source: 'uploaded',
        isPrimary: true,
        templateId: 'modern',
        fileName: req.file.originalname,
        storageProvider: 'supabase',
        storagePath: result.storagePath,
        pdfUrl: signedUrl,
        pdfFileSize: req.file.size,
        pdfFileType: req.file.mimetype,
        pdfUploadedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    } catch (resumeSyncErr) {
      console.warn('[Profile] Resume sync to resumes collection notice:', resumeSyncErr.message);
    }

    // Extract combined skills & About Me across Resume, GitHub, and LinkedIn
    let extracted = null;
    let combinedSources = null;
    try {
      const combined = await resolveCombinedCandidateEvidence({
        userId,
        uploadedBuffer: req.file.buffer,
        uploadedMime: req.file.mimetype
      });
      extracted = combined.extracted;
      combinedSources = combined;
    } catch (extractErr) {
      console.warn('[Profile] Resume combined extraction notice:', extractErr.message);
    }

    return sendSuccess(res, {
      resumeDownloadUrl: signedUrl,
      resumeFileName: req.file.originalname,
      resumeFileType: req.file.mimetype,
      resumeFileSize: req.file.size,
      resumeUploadedAt: new Date().toISOString(),
      extracted,
      sources: combinedSources
    }, 'Resume uploaded and profile insights extracted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Resolves combined evidence across Resume, GitHub, and LinkedIn for a candidate.
 * If all provided, combines all three. If partial, extracts from whatever is provided.
 */
async function resolveCombinedCandidateEvidence({
  userId,
  uploadedBuffer = null,
  uploadedMime = null,
  githubOverride = null,
  linkedinOverride = null
}) {
  const [profileDoc, userDoc] = await Promise.all([
    FirestoreHelper.getDoc('profiles', 'prof_' + userId).then(p => p || {}),
    FirestoreHelper.getDoc('users', userId).then(u => u || {})
  ]);

  const targetRole = profileDoc.targetRole || profileDoc.role || userDoc?.targetRole || userDoc?.role || '';

  // 1. Resolve Resume Text
  let resumeText = '';
  if (uploadedBuffer && uploadedMime) {
    try {
      resumeText = await TextExtractorService.extractTextFromFile(uploadedBuffer, uploadedMime);
    } catch (e) {
      console.warn('[Profile] Uploaded resume extraction error:', e.message);
    }
  }

  // If no uploaded buffer provided in this call, check existing profile resume file in Supabase
  if (!resumeText && userDoc?.resumeStoragePath && userDoc?.resumeFileType) {
    try {
      const { bucket, filePath } = parseStoragePath(userDoc.resumeStoragePath);
      const buf = await downloadFileBuffer(bucket, filePath);
      if (buf) {
        resumeText = await TextExtractorService.extractTextFromFile(buf, userDoc.resumeFileType);
      }
    } catch (storageErr) {
      console.warn('[Profile] Existing resume file download notice:', storageErr.message);
    }
  }

  // If still no resume text, check saved resume builder resumes
  if (!resumeText) {
    try {
      const resumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
      if (Array.isArray(resumes) && resumes.length > 0) {
        resumes.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
        const r = resumes[0];
        const parts = [];
        if (r.role) parts.push(`Target Role: ${r.role}`);
        if (r.summary) parts.push(`Professional Summary: ${r.summary}`);
        if (Array.isArray(r.skills) && r.skills.length > 0) parts.push(`Skills: ${r.skills.join(', ')}`);
        if (Array.isArray(r.projects) && r.projects.length > 0) {
          parts.push(`Projects:\n${r.projects.map(p => `- ${p.title || p.name}: ${p.description || ''} (${p.technologies || p.tech || ''})`).join('\n')}`);
        }
        if (Array.isArray(r.experience) && r.experience.length > 0) {
          parts.push(`Experience:\n${r.experience.map(exp => `- ${exp.title || exp.role} at ${exp.company || ''}: ${exp.description || ''}`).join('\n')}`);
        }
        resumeText = parts.join('\n\n');
      }
    } catch (resumeErr) {
      console.warn('[Profile] Resume builder lookup notice:', resumeErr.message);
    }
  }

  // 2. Resolve GitHub Data
  let githubData = null;
  const ghTarget = (githubOverride !== null && githubOverride !== undefined ? githubOverride : (profileDoc.github || userDoc?.github || '')).trim();
  if (ghTarget) {
    try {
      githubData = await SocialProfileService.fetchGitHubData(ghTarget);
    } catch (ghErr) {
      console.warn('[Profile] GitHub fetch notice:', ghErr.message);
    }
  }

  // 3. Resolve LinkedIn Data
  let linkedinData = null;
  const liTarget = (linkedinOverride !== null && linkedinOverride !== undefined ? linkedinOverride : (profileDoc.linkedIn || userDoc?.linkedIn || '')).trim();
  if (liTarget) {
    const handle = SocialProfileService.extractLinkedInHandle(liTarget);
    linkedinData = {
      url: liTarget,
      handle: handle || null,
      context: handle ? `Candidate LinkedIn profile: ${handle}` : `Candidate LinkedIn URL: ${liTarget}`
    };
  }

  // 4. Run Grok Multi-Source Extraction
  const extracted = await GrokService.extractProfileSkillsAndBio({
    resumeText,
    githubData,
    linkedinData,
    targetRole,
    existingSkills: Array.isArray(profileDoc.skills) ? profileDoc.skills : [],
    existingBio: profileDoc.bio || ''
  });

  return {
    extracted,
    githubData,
    linkedinData,
    hasResume: !!(resumeText && resumeText.trim().length > 30),
    hasGitHub: !!githubData,
    hasLinkedIn: !!linkedinData,
    targetRole
  };
}

/**
 * POST /api/profile/scan-github
 * POST /api/profile/sync-sources
 * Synthesizes skills & bio across all provided sources: Resume, GitHub, and LinkedIn.
 */
export const scanGitHubProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { github, linkedin } = req.body;

    const result = await resolveCombinedCandidateEvidence({
      userId,
      githubOverride: github,
      linkedinOverride: linkedin
    });

    return sendSuccess(res, {
      githubData: result.githubData,
      linkedinData: result.linkedinData,
      sources: {
        hasResume: result.hasResume,
        hasGitHub: result.hasGitHub,
        hasLinkedIn: result.hasLinkedIn
      },
      extracted: result.extracted
    }, 'Profile insights synthesized across combined sources');
  } catch (err) {
    next(err);
  }
};

export const syncCombinedProfileSources = scanGitHubProfile;

/**
 * DELETE /api/profile/resume
 * Removes the user's profile resume from Supabase and clears the Firestore fields.
 */
export const deleteProfileResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userDoc = await FirestoreHelper.getDoc('users', userId);

    if (!userDoc?.resumeStoragePath) {
      return sendError(res, 'No uploaded resume found to delete', 404);
    }

    try {
      const { bucket, filePath } = parseStoragePath(userDoc.resumeStoragePath);
      if (isOwnedByUser(filePath, userId)) await deleteFile(bucket, filePath);
    } catch (delErr) {
      console.warn('[Profile] Resume delete from storage notice:', delErr.message);
    }

    await FirestoreHelper.setDoc('users', userId, {
      resumeStorageProvider: null,
      resumeStoragePath: null,
      resumeFileName: null,
      resumeFileType: null,
      resumeFileSize: null,
      resumeUploadedAt: null,
      resumeDownloadUrl: null
    }, true);

    return sendSuccess(res, {}, 'Resume removed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/profile/resume
 * Returns a fresh signed URL for the user's uploaded profile resume.
 */
export const getProfileResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let userDoc = await FirestoreHelper.getDoc('users', userId);

    // If userDoc does not have resumeStoragePath, fallback to checking 'resumes' collection
    // (e.g. uploaded during Onboarding) and auto-link it into profile
    if (!userDoc?.resumeStoragePath) {
      const userResumes = await FirestoreHelper.queryCollection('resumes', 'userId', userId);
      const uploadedResume = userResumes.find(r => r.source === 'uploaded' && r.storagePath) ||
                             userResumes.find(r => r.storagePath);
      if (uploadedResume) {
        const profileResumePatch = {
          resumeStorageProvider: uploadedResume.storageProvider || 'supabase',
          resumeStoragePath: uploadedResume.storagePath,
          resumeFileName: uploadedResume.fileName || uploadedResume.title || 'resume.pdf',
          resumeFileType: uploadedResume.pdfFileType || 'application/pdf',
          resumeFileSize: uploadedResume.pdfFileSize || 0,
          resumeUploadedAt: uploadedResume.pdfUploadedAt || uploadedResume.createdAt || new Date().toISOString()
        };
        await FirestoreHelper.setDoc('users', userId, profileResumePatch, true);
        userDoc = { ...(userDoc || {}), ...profileResumePatch };
        console.log(`✅ Auto-linked onboarding resume to user profile for user ${userId}`);
      }
    }

    if (!userDoc?.resumeStoragePath) {
      return sendSuccess(res, { hasResume: false }, 'No uploaded resume on file');
    }

    // Always generate a fresh signed URL from storagePath — never use a cached value.
    let downloadUrl = '';
    if (userDoc.resumeStorageProvider === 'supabase' && userDoc.resumeStoragePath) {
      try {
        const { bucket, filePath } = parseStoragePath(userDoc.resumeStoragePath);
        downloadUrl = await getSignedDownloadUrl(bucket, filePath, 3600);
      } catch (urlErr) {
        console.warn('[Profile] Resume signed URL notice:', urlErr.message);
      }
    }

    const [userResumes, userProjects] = await Promise.all([
      FirestoreHelper.queryCollection('resumes', 'userId', userId).catch(() => []),
      FirestoreHelper.queryCollection('projects', 'userId', userId).catch(() => [])
    ]);
    const primaryResume = userResumes.find(r => r.isPrimary) || userResumes.find(r => r.parsedText) || userResumes[0];

    return sendSuccess(res, {
      hasResume: true,
      resumeDownloadUrl: downloadUrl,
      resumeFileName: userDoc.resumeFileName || 'resume.pdf',
      resumeFileType: userDoc.resumeFileType || 'application/pdf',
      resumeFileSize: userDoc.resumeFileSize || 0,
      resumeUploadedAt: userDoc.resumeUploadedAt || null,
      parsedText: primaryResume?.parsedText || '',
      projects: userProjects.map(p => ({
        name: p.title || p.name || 'Project',
        description: p.description || '',
        tech: typeof p.tech === 'string' ? p.tech.split(',').map(t => t.trim()) : (Array.isArray(p.tech) ? p.tech : []),
        role: p.role || 'Developer'
      }))
    }, 'Profile resume retrieved');
  } catch (err) {
    next(err);
  }
};

const MAX_RESUME_VERSIONS = 10;

/**
 * POST /api/profile/resume/save-version
 * Saves a web-created resume (from builder) as a history version entry.
 * Stores metadata only (no file — the resume data lives in `resumes` collection).
 * Enforces max 10 versions by removing the oldest when limit is exceeded.
 */
export const saveWebResumeVersion = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resumeId, title, templateId, personalInfo, role, createdAt } = req.body;

    if (!resumeId) return sendError(res, 'resumeId is required', 400);

    const existingVersions = await FirestoreHelper.queryCollection('resume_versions', 'userId', userId);
    existingVersions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Enforce max 10 — remove all excess oldest versions before inserting the new one
    if (existingVersions.length >= MAX_RESUME_VERSIONS) {
      const excessCount = existingVersions.length - MAX_RESUME_VERSIONS + 1;
      const toRemove = existingVersions.slice(0, excessCount);
      await Promise.all(toRemove.map(old => FirestoreHelper.deleteDoc('resume_versions', old.versionId)));
    }

    const versionId = `rv_${userId}_${Date.now()}`;
    const versionDoc = {
      versionId,
      userId,
      resumeId,
      title: title || `Resume v${existingVersions.length + 1}`,
      templateId: templateId || 'modern',
      role: role || '',
      previewName: personalInfo?.fullName || '',
      previewEmail: personalInfo?.email || '',
      source: 'web-builder',
      createdAt: createdAt || new Date().toISOString()
    };

    await FirestoreHelper.setDoc('resume_versions', versionId, versionDoc);

    return sendSuccess(res, versionDoc, 'Resume version saved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/profile/resume/history
 * Returns all web-created resume versions for the user, newest first.
 */
export const getResumeVersionHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const versions = await FirestoreHelper.queryCollection('resume_versions', 'userId', userId);
    versions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sendSuccess(res, versions, 'Resume version history retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/profile/resume/version/:versionId
 * Deletes a specific resume version record.
 */
export const deleteResumeVersion = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { versionId } = req.params;

    const doc = await FirestoreHelper.getDoc('resume_versions', versionId);
    if (!doc) return sendError(res, 'Version not found', 404);
    if (doc.userId !== userId) return sendError(res, 'Access denied', 403);

    await FirestoreHelper.deleteDoc('resume_versions', versionId);
    return sendSuccess(res, {}, 'Resume version deleted');
  } catch (err) {
    next(err);
  }
};
