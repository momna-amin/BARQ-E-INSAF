const https = require('https');

const domains = [
  'barqeinsaf.vercel.app',
  'barq-e-insaf-frontend.vercel.app',
  'barq-e-insaf-lawyer.vercel.app',
  'barq-e-insaf-citizen.vercel.app'
];

domains.forEach((dom) => {
  https.get(`https://${dom}/`, (res) => {
    console.log(`Domain: ${dom} -> Status:`, res.statusCode);
  }).on('error', (err) => {
    // console.log(`Domain: ${dom} -> Error:`, err.message);
  });
});
