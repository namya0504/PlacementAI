/**
 * PlacementAI — 20 Practice Questions Generator per Topic
 * Delegates directly to the canonical topic problem catalog to ensure
 * verified test cases, genuine problem descriptions, and working starter codes.
 */

import { getCanonicalTopicQuestions } from './canonicalTopicData.js';

export function buildTopicProblems(topicId, topicTitle) {
  return getCanonicalTopicQuestions(topicId, topicTitle);
}
