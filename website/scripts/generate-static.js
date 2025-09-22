const fs = require('fs');
const path = require('path');

// Create a simple script to help with static generation
const generateStaticPages = () => {
  const outDir = path.join(__dirname, '../out');
  
  // Ensure the out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Create a simple index.html for fallback
  const indexHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ASAiASA - Find ESG Events and Jobs</title>
  <meta name="description" content="Find ESG Events and Jobs">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/logo.svg">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#FFFFFF">
</head>
<body>
  <div id="__next"></div>
  <script>
    // Simple client-side routing fallback
    if (window.location.pathname !== '/' && !window.location.pathname.includes('.')) {
      // Redirect to index for client-side routing
      window.location.href = '/';
    }
  </script>
</body>
</html>
  `.trim();

  // Write index.html
  fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml);
  
  console.log('Static generation helpers created');
};

if (require.main === module) {
  generateStaticPages();
}

module.exports = { generateStaticPages };
