import { API } from './api';

export const generateProfessionalSummary = async (paramsOrRole, skills = [], experienceYears = 0) => {
  let payload;
  if (typeof paramsOrRole === 'object' && paramsOrRole !== null) {
    payload = { type: 'summary', ...paramsOrRole };
  } else {
    payload = { type: 'summary', role: paramsOrRole, skills, experienceYears };
  }
  const res = await API.generateAIContent(payload);
  if (res?.summary) return res.summary;
  throw new Error('AI was unable to generate summary. Please try again.');
};

export const generateProjectBulletPoints = async (projectName, techStack) => {
  const res = await API.generateAIContent({ type: 'projectBullets', projectName, techStack });
  if (res?.bullets) return res.bullets;
  throw new Error('AI was unable to generate project bullet points. Please try again.');
};

export const generateSkillSuggestions = async (role) => {
  const res = await API.generateAIContent({ type: 'skillSuggestions', role });
  if (res?.suggestions) return res.suggestions;
  throw new Error('AI was unable to generate skill suggestions. Please try again.');
};

export const analyzeATSResume = async (fileName, fileContent) => {
  const res = await API.analyzeATS({ resumeText: fileContent, targetRole: 'Software Developer' });
  if (res) return res;
  throw new Error('ATS Resume analysis failed. Please try again with valid text or PDF.');
};

export const evaluateHRAnswer = async (question, userResponse) => {
  const res = await API.evaluateHRAnswer({
    questionId: question.id,
    questionTitle: question.title,
    userResponse
  });
  if (res?.evaluation) return res.evaluation;
  throw new Error('AI evaluation failed. Please check your network and try again.');
};
