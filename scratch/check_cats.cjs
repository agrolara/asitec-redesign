const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const catMatches = [...content.matchAll(/"category":\s*"([^"]+)"/g)].map(m => m[1]);
const counts = {};
catMatches.forEach(c => counts[c] = (counts[c] || 0) + 1);
console.log('Categories in products.ts:', counts);
