// scripts/fix-basepath.js – inject <base> tag for GitHub Pages subdirectory
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'web-build', 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at', indexPath);
    process.exit(1);
}

let content = fs.readFileSync(indexPath, 'utf8');
// Insert <base href="/Demo_app/"> right after <head>
content = content.replace(/<head>/i, '<head>\n    <base href="/Demo_app/">');

// Rewrite absolute paths to include the subdirectory
content = content.replace(/"\/_expo\//g, '"/Demo_app/_expo/');
content = content.replace(/"\/favicon.ico"/g, '"/Demo_app/favicon.ico"');

fs.writeFileSync(indexPath, content);
console.log('Base tag injected and paths rewritten to /Demo_app/ in index.html');
