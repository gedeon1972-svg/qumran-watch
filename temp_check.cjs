const fs = require('fs');
const content = fs.readFileSync('src/js/ui/mishmar-dashboard.js', 'utf8');
console.log(content.length);
console.log(content.includes('Qumr'));
console.log(content.indexOf('Qumr'));
