/**
 * Calculates overall placement readiness based on module scores
 * @param {Object} scores
 * @param {number} scores.resumeScore
 * @param {number} scores.atsScore
 * @param {number} scores.aptitudeScore
 * @param {number} scores.technicalScore
 * @param {number} scores.hrScore
 * @returns {number} Round integer score 0-100
 */
export const calculatePlacementReadiness = ({
  resumeScore = 0,
  atsScore = 0,
  aptitudeScore = 0,
  technicalScore = 0,
  hrScore = 0
}) => {
  const weighted =
    (resumeScore * 0.20) +
    (atsScore * 0.20) +
    (aptitudeScore * 0.20) +
    (technicalScore * 0.20) +
    (hrScore * 0.20);

  return Math.min(100, Math.max(0, Math.round(weighted)));
};
