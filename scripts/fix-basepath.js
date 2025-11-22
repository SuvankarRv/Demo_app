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
fs.writeFileSync(indexPath, content);
console.log('Base tag injected into index.html');
