import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const arraysJsonPath = path.resolve(__dirname, '../../../content/blueprints/arrays.blueprint.json');

let arraysData;
if (fs.existsSync(arraysJsonPath)) {
  arraysData = JSON.parse(fs.readFileSync(arraysJsonPath, 'utf-8'));
}

export default arraysData || {
  topicId: 'arrays',
  topicTitle: 'Arrays',
  order: 1,
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  problemCount: 20,
  difficultyDistribution: { Easy: 7, Medium: 9, Hard: 4 },
  sourcesUsed: [
    {
      name: "Striver SDE Sheet / A2Z DSA Sheet",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
      relevance: "Standard curriculum for campus placements"
    },
    {
      name: "NeetCode 150 (Arrays & Hashing)",
      url: "https://neetcode.io/practice",
      relevance: "Algorithmic patterns & optimal complexity"
    },
    {
      name: "GeeksforGeeks Topic Archives",
      url: "https://www.geeksforgeeks.org/top-50-array-coding-problems-for-interviews/",
      relevance: "Campus placement problem variations"
    }
  ],
  problems: []
};

