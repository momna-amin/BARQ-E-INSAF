const https = require('https');

https.get('https://barq-e-insaaf.vercel.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('--- DOUBLE A DOMAIN DIAGNOSTICS ---');
    console.log('Response Status:', res.statusCode);
    console.log('HTML Preview (500 chars):', data.substring(0, 500));
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
