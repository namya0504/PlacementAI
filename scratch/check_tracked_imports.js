import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const files = execSync('git ls-files backend', { encoding: 'utf-8' }).trim().split(/\r?\n/);
let found = 0;
for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(file, 'utf-8');
  const importMatches = [...content.matchAll(/from\s+['"](\.[^'"]+)['"]/g)];
  for (const match of importMatches) {
    const importPath = match[1];
    let resolved = path.resolve(path.dirname(file), importPath);
    if (!resolved.endsWith('.js') && fs.existsSync(resolved + '.js')) {
      resolved = resolved + '.js';
    }
    const rel = path.relative(process.cwd(), resolved).replace(/\\/g, '/');
    const gitTracked = execSync(`git ls-files "${rel}"`, { encoding: 'utf-8' }).trim();
    if (!gitTracked) {
      console.log(`UNTRACKED IMPORT: ${file} imports "${importPath}" (resolved to ${rel})`);
      found++;
    }
  }
}
console.log(`Check completed. Found ${found} untracked imports.`);
