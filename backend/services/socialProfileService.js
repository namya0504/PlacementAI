import { config } from '../config/env.js';

/**
 * Social Profile Service
 * Extracts real public developer context from GitHub and LinkedIn links
 * to personalize and ground AI generation in students' actual work and learning.
 */

// In-memory cache for fetched social data: key -> { data, timestamp }
const profileCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const SocialProfileService = {
  /**
   * Validate and extract clean username from a GitHub input (username or full URL).
   * @param {string} urlOrUsername
   * @returns {string|null}
   */
  extractGitHubUsername(urlOrUsername) {
    if (!urlOrUsername || typeof urlOrUsername !== 'string') return null;
    const trimmed = urlOrUsername.trim().replace(/\/+$/, '');

    // Full or partial URL: github.com/username
    const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
    if (urlMatch && urlMatch[1]) {
      const candidate = urlMatch[1].toLowerCase();
      const reserved = ['settings', 'explore', 'topics', 'trending', 'pulls', 'issues', 'notifications', 'orgs', 'login', 'signup'];
      if (!reserved.includes(candidate)) {
        return urlMatch[1];
      }
      return null;
    }

    // Pure username
    if (/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(trimmed)) {
      return trimmed;
    }

    return null;
  },

  /**
   * Validate a LinkedIn profile URL format.
   * @param {string} url
   * @returns {boolean}
   */
  isValidLinkedInUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-%]+\/?$/i.test(trimmed);
  },

  /**
   * Extract slug/handle from a LinkedIn URL.
   * @param {string} url
   * @returns {string|null}
   */
  extractLinkedInHandle(url) {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim().replace(/\/+$/, '');
    const match = trimmed.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-%]+)/i);
    if (match && match[1]) {
      return match[1].replace(/[-_]/g, ' ').replace(/[0-9a-f]{8,}$/i, '').trim();
    }
    return null;
  },

  /**
   * Fetch public GitHub developer data using GitHub REST API.
   * Uses optional GITHUB_TOKEN if configured.
   * @param {string} githubUrlOrUsername
   * @returns {Promise<object|null>}
   */
  async fetchGitHubData(githubUrlOrUsername) {
    const username = this.extractGitHubUsername(githubUrlOrUsername);
    if (!username) return null;

    // Check cache
    const cacheKey = `gh_${username.toLowerCase()}`;
    const cached = profileCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[SocialProfile] Using cached GitHub data for ${username}`);
      return cached.data;
    }

    try {
      const headers = {
        'User-Agent': 'PlacementAI-Onboarding-Agent/1.0',
        'Accept': 'application/vnd.github.v3+json'
      };

      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      // 1. Fetch User Profile
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!userRes.ok) {
        console.warn(`[SocialProfile] GitHub user API error for ${username}: status ${userRes.status}`);
        return null;
      }

      const userData = await userRes.json();

      // 2. Fetch Recent Public Repositories (up to 10 sorted by updated)
      let repos = [];
      try {
        const repoController = new AbortController();
        const repoTimeout = setTimeout(() => repoController.abort(), 7000);

        const reposRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`,
          { headers, signal: repoController.signal }
        );
        clearTimeout(repoTimeout);

        if (reposRes.ok) {
          const repoData = await reposRes.json();
          if (Array.isArray(repoData)) {
            repos = repoData
              .filter(r => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
              .map(r => ({
                name: r.name,
                language: r.language || '',
                description: (r.description || '').slice(0, 200),
                topics: Array.isArray(r.topics) ? r.topics.slice(0, 5) : [],
                stars: r.stargazers_count || 0,
                updatedAt: r.updated_at
              }));
          }
        }
      } catch (repoErr) {
        console.warn(`[SocialProfile] GitHub repo fetch notice: ${repoErr.message}`);
      }

      // Collect unique languages and topics
      const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean)));
      const allTopics = Array.from(new Set(repos.flatMap(r => r.topics || [])));

      const result = {
        username,
        name: userData.name || username,
        bio: (userData.bio || '').replace(/\r?\n/g, ' ').slice(0, 300).trim(),
        publicReposCount: userData.public_repos || 0,
        languages,
        topics: allTopics.slice(0, 10),
        featuredProjects: repos.slice(0, 6)
      };

      profileCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (err) {
      console.warn(`[SocialProfile] GitHub fetch failed for ${username}:`, err.message);
      return null;
    }
  },

  /**
   * Build unified social profile context for AI onboarding analysis.
   * Honestly records sourceStatus without hallucinating LinkedIn content.
   *
   * @param {object} params
   * @param {string} [params.github] - GitHub username or URL
   * @param {string} [params.linkedin] - LinkedIn URL
   * @param {string} [params.linkedinText] - Student-pasted LinkedIn text or PDF extract
   * @returns {Promise<object>} Structured context with sourceStatus and evidence
   */
  async getSocialProfileContext({ github, linkedin, linkedinText }) {
    const results = {
      githubData: null,
      linkedinData: null,
      sourceStatus: {
        github: 'not_provided',
        linkedin: 'not_provided'
      },
      evidenceExcerpts: {
        github: '',
        linkedin: ''
      },
      inferredSkills: [],
      inferredProjects: []
    };

    // 1. Process GitHub
    if (github && typeof github === 'string' && github.trim()) {
      const gh = await this.fetchGitHubData(github.trim());
      if (gh) {
        results.githubData = gh;
        results.sourceStatus.github = (gh.publicReposCount > 0 || gh.languages.length > 0) ? 'read' : 'partial';
        results.evidenceExcerpts.github = `Found @${gh.username} with ${gh.publicReposCount} public repositories. Languages: ${gh.languages.join(', ') || 'None'}.`;

        gh.languages.forEach(lang => {
          results.inferredSkills.push({ name: lang, level: 'Proficient', evidence: 'github' });
        });

        gh.featuredProjects.forEach(proj => {
          results.inferredProjects.push({
            title: proj.name,
            description: proj.description || `Public GitHub repository by @${gh.username}`,
            technologies: proj.language || '',
            source: 'github'
          });
        });
      } else {
        results.sourceStatus.github = 'failed';
        results.evidenceExcerpts.github = 'Could not access public GitHub profile. Check if the username exists.';
      }
    }

    // 2. Process LinkedIn
    if (linkedinText && typeof linkedinText === 'string' && linkedinText.trim().length > 20) {
      // User explicitly provided their About/Experience text or PDF extract
      results.linkedinData = {
        url: linkedin || '',
        text: linkedinText.trim().slice(0, 4000)
      };
      results.sourceStatus.linkedin = 'read';
      results.evidenceExcerpts.linkedin = `Pasted/uploaded LinkedIn text analyzed (${results.linkedinData.text.length} characters).`;
    } else if (linkedin && typeof linkedin === 'string' && linkedin.trim()) {
      // User provided LinkedIn URL only
      const handle = this.extractLinkedInHandle(linkedin);
      results.linkedinData = {
        url: linkedin.trim(),
        handle: handle || null,
        text: ''
      };
      // LinkedIn is protected by login wall and anti-scraping
      results.sourceStatus.linkedin = 'failed';
      results.evidenceExcerpts.linkedin = 'LinkedIn profiles are behind login authentication. Automatic browsing could not extract full career history.';
    }

    return results;
  }
};
