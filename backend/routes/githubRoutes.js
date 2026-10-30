import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { SocialProfileService } from '../services/socialProfileService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

const githubLimiter = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Too many GitHub requests. Please wait a moment.'
});

/**
 * GET /api/github/repos?username=...
 * Fetches public repos for a GitHub username/URL.
 * Returns a clean array suitable for the resume project picker.
 */
router.get('/repos', protectRoute, githubLimiter, async (req, res, next) => {
  try {
    const raw = req.query.username;
    if (!raw || !String(raw).trim()) {
      return sendError(res, 'username query param is required', 400);
    }

    const username = SocialProfileService.extractGitHubUsername(String(raw).trim());
    if (!username) {
      return sendError(res, 'Invalid GitHub username or URL format', 400);
    }

    const ghData = await SocialProfileService.fetchGitHubData(username);
    if (!ghData) {
      return sendError(res, `Could not fetch GitHub profile for "${username}". Make sure the account is public.`, 404);
    }

    // Fetch full repo list (more than the 6 in featuredProjects) with richer fields
    const headers = {
      'User-Agent': 'PlacementAI-ResumeBuilder/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    let repos = [];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
        { headers, signal: controller.signal }
      );
      clearTimeout(timeout);

      if (reposRes.ok) {
        const raw = await reposRes.json();
        if (Array.isArray(raw)) {
          repos = raw
            .filter(r => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
            .map(r => ({
              id: String(r.id),
              name: r.name,
              fullName: r.full_name,
              description: (r.description || '').slice(0, 300),
              language: r.language || '',
              topics: Array.isArray(r.topics) ? r.topics.slice(0, 8) : [],
              stars: r.stargazers_count || 0,
              htmlUrl: r.html_url,
              homepage: r.homepage || '',
              updatedAt: r.updated_at,
              isPrivate: r.private || false
            }));
        }
      }
    } catch (fetchErr) {
      console.warn('[GitHub] Repo fetch error:', fetchErr.message);
    }

    return sendSuccess(res, {
      username: ghData.username,
      name: ghData.name,
      bio: ghData.bio,
      publicReposCount: ghData.publicReposCount,
      repos
    }, 'GitHub repos fetched successfully');
  } catch (err) {
    next(err);
  }
});

export default router;
