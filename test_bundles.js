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
    
    if (jsFiles.length === 0) {
      console.log('No javascript bundle scripts found in the HTML. Checking raw content...');
      console.log('HTML contains "Barq-e-Insaf" ?', indexRes.data.includes('Barq-e-Insaf'));
      // Let's search inside the HTML for the string "Urdu"
      return;
    }

    // Fetch each bundle and search for our text strings
    for (const jsFile of jsFiles) {
      const fullUrl = jsFile.startsWith('http') ? jsFile : `https://barq-e-insaaf.vercel.app${jsFile}`;
      console.log(`Checking bundle: ${fullUrl}`);
      const bundleRes = await fetchUrl(fullUrl);
      
      const hasOldText = bundleRes.data.includes('Abhi koi pending request nahi');
      const hasNewText = bundleRes.data.includes('No pending requests found');
      
      console.log(`- Contains Old Urdu Text?`, hasOldText);
      console.log(`- Contains New English Text?`, hasNewText);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
