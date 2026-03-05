const fs = require('fs');
let html = fs.readFileSync('index.html.bak', 'utf8');

// Use this clean file to restore index.html
fs.writeFileSync('index.html', html);
console.log('Restored from index.html.bak');
