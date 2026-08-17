const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ data, statusCode: res.statusCode }));
    }).on('error', reject);
  });
}

(async () => {
  try {
    console.log('Fetching main index page...');
    const indexRes = await fetchUrl('https://barq-e-insaaf.vercel.app/');
    
    // Find all javascript bundle paths in the HTML
    const jsFiles = [];
    const regex = /src="([^"]+\.js)"/g;
    let match;
    while ((match = regex.exec(indexRes.data)) !== null) {
      jsFiles.push(match[1]);
    }
    
    console.log('Found JS bundles on Vercel:', jsFiles);

    for (const jsFile of jsFiles) {
      const fullUrl = jsFile.startsWith('http') ? jsFile : `https://barq-e-insaaf.vercel.app${jsFile}`;
      console.log(`Checking bundle: ${fullUrl}`);
      const bundleRes = await fetchUrl(fullUrl);
      
      const hasBottomNav = bundleRes.data.includes('bottomNav');
      const hasBrandBadgeRow = bundleRes.data.includes('brandBadgeRow');
      
      console.log(`- Contains "bottomNav"?`, hasBottomNav);
      console.log(`- Contains "brandBadgeRow"?`, hasBrandBadgeRow);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
