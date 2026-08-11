const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<<<<<<<')) return;

  console.log('Cleaning conflict markers from:', filePath);

  const lines = content.split('\n');
  const cleaned = [];
  let inConflict = false;
  let inTheirs = false;

  for (let line of lines) {
    if (line.startsWith('<<<<<<<')) {
      inConflict = true;
      inTheirs = false;
      continue;
    }
    if (line.startsWith('=======')) {
      inTheirs = true;
      continue;
    }
    if (line.startsWith('>>>>>>>')) {
      inConflict = false;
      inTheirs = false;
      continue;
    }

    // Keep OUR clean version (HEAD side) or non-conflict code
    if (!inConflict || (!inTheirs)) {
      cleaned.push(line);
    }
  }

  fs.writeFileSync(filePath, cleaned.join('\n'), 'utf8');
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    } else if (/\.(js|jsx|ts|tsx|json|css|html|md)$/.test(file)) {
      cleanFile(fullPath);
    }
  }
}

const targetDir = path.resolve(__dirname, '..');
walk(targetDir);
console.log('Finished cleaning conflict markers across Frontend.');
