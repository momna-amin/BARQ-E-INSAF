const fs = require('fs');
const path = require('path');

const pathsToCheck = [
  'C:\\Users\\HP\\BARQ-E-INSAF\\.env',
  'C:\\Users\\HP\\BARQ-E-INSAF\\Backend\\.env',
  'C:\\Users\\HP\\BARQ-E-INSAF\\Frontend\\.env',
  'C:\\Users\\HP\\.env',
  'C:\\Users\\HP\\BARQ-E-INSAF\\chatbot\\.env',
  'C:\\Users\\HP\\BARQ-E-INSAF\\admin-panel\\.env'
];

pathsToCheck.forEach((p) => {
  if (fs.existsSync(p)) {
    console.log('Found .env at:', p);
    const content = fs.readFileSync(p, 'utf8');
    const hasUrl = content.includes('SUPABASE_URL');
    console.log(`- Has SUPABASE_URL: ${hasUrl}`);
  } else {
    // console.log('Not found:', p);
  }
});
