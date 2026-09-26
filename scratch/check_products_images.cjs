const fs = require('fs');
const https = require('https');

let content = fs.readFileSync('src/data/products.ts', 'utf8');
content = content.replace(/import\s+[^;]+;/g, '');
content = content.replace('export const products: Product[] =', 'module.exports =');
fs.writeFileSync('scratch/temp_prods.cjs', content);

const prods = require('./temp_prods.cjs');
console.log('Total products:', prods.length);

async function checkImg(url) {
  return new Promise(resolve => {
    try {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, res => {
        resolve({ url, status: res.statusCode });
      }).on('error', e => resolve({ url, status: 'ERROR: ' + e.message })).on('timeout', () => resolve({ url, status: 'TIMEOUT' }));
    } catch (e) {
      resolve({ url, status: 'INVALID: ' + e.message });
    }
  });
}

(async () => {
  const issues = [];
  for (const p of prods) {
    if (!p.image) {
      issues.push({ id: p.id, name: p.name, issue: 'NO IMAGE' });
    } else {
      const res = await checkImg(p.image);
      if (res.status !== 200) {
        issues.push({ id: p.id, name: p.name, image: p.image, status: res.status });
      }
    }
  }
  console.log('Product image issues (' + issues.length + '):', JSON.stringify(issues, null, 2));
})();
