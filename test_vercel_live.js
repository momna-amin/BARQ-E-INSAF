const https = require('https');

const options = {
  hostname: 'barq-e-insaf.vercel.app',
  port: 443,
  path: '/IncomingRequests',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('HTML Preview (500 chars):', data.substring(0, 500));
  });
});

req.on('error', (err) => {
  console.error(err);
});

req.end();
