const fs = require('fs');
const https = require('https');
const http = require('http');

const files = [
  'src/data/products.ts',
  'src/data/recipes.ts',
  'src/data/certifications.ts',
  'src/data/company.ts',
  'src/components/CatalogSection.tsx'
];

const urls = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/https?:\/\/[^\s'"`<>\)]+/g) || [];
  matches.forEach(u => {
    if (u.match(/\.(jpg|jpeg|png|webp|svg|mp4)/i) || u.includes('/uploads/')) {
      // clean trailing punctuation
      const clean = u.replace(/[',;]+$/, '');
      urls.add(clean);
    }
  });
});

console.log('Total URLs to check:', urls.size);

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
        resolve({ url, status: res.statusCode });
      });
      req.on('error', (e) => resolve({ url, status: 'ERROR: ' + e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
    } catch (e) {
      resolve({ url, status: 'INVALID: ' + e.message });
    }
  });
}

(async () => {
  const broken = [];
  for (const u of urls) {
    const res = await checkUrl(u);
    if (res.status !== 200) {
      console.log('BROKEN:', res.status, res.url);
      broken.push({ url: res.url, status: res.status });
    } else {
      console.log('OK (200):', res.url);
    }
  }
  console.log('\n--- RESUMEN DE ROTAS ---');
  console.log('Total rotas:', broken.length);
  fs.writeFileSync('scratch/broken_report.json', JSON.stringify(broken, null, 2));
})();
