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
  resumeScore = 80,
  atsScore = 80,
  aptitudeScore = 75,
  technicalScore = 75,
  hrScore = 80
}) => {
  const weighted =
    (resumeScore * 0.25) +
    (atsScore * 0.25) +
    (aptitudeScore * 0.20) +
    (technicalScore * 0.15) +
    (hrScore * 0.15);

  return Math.min(100, Math.max(0, Math.round(weighted)));
};
