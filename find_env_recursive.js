const fs = require('fs');
const path = require('path');

function findEnvFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.expo') {
        results = results.concat(findEnvFiles(filePath));
      }
    } else {
      if (file.endsWith('.env') || file === '.env') {
        results.push(filePath);
      }
    }
  });
  return results;
}

const envFiles = findEnvFiles('C:\\Users\\HP\\BARQ-E-INSAF');
console.log('Found .env files:', envFiles);
