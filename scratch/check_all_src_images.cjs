const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function getFiles(dir, exts = ['.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full, exts));
    } else if (exts.includes(path.extname(full))) {
      results.push(full);
    }
  });
  return results;
}

const allFiles = getFiles('src');
console.log('Scanning ' + allFiles.length + ' files...');

const urlMap = new Map(); // url -> array of files where found

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match URLs
  const regex = /https?:\/\/[a-zA-Z0-9_\-\.\/\?=&%#~:]+/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const u = match[0].replace(/[',;\)\}>]+$/, '');
    if (/\.(jpg|jpeg|png|webp|svg|gif|mp4)($|\?)/i.test(u) || u.includes('/uploads/')) {
      if (!urlMap.has(u)) {
        urlMap.set(u, []);
      }
      urlMap.get(u).push(f);
    }
  }
});

console.log('Total URLs found in src: ' + urlMap.size);

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
  for (const [u, files] of urlMap.entries()) {
    const res = await checkUrl(u);
    if (res.status !== 200) {
      console.log('BROKEN (' + res.status + '): ' + res.url);
      console.log('   In files:', files);
      broken.push({ url: res.url, status: res.status, files });
    } else {
      console.log('OK (200): ' + res.url);
    }
  }
  console.log('\n--- RESUMEN FINAL ---');
  console.log('Total rotas: ' + broken.length);
  fs.writeFileSync('scratch/all_broken.json', JSON.stringify(broken, null, 2));
})();
