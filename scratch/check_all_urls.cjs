const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function getFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, exts, fileList);
    } else if (exts.includes(path.extname(file))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = getFiles('./src', ['.ts', '.tsx']);
const urlRegex = /(https?:\/\/[^\s'"`,;()<>[\]{}]+)/g;
const urlsWithSources = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    let url = match[1];
    // Clean trailing punctuation if any
    url = url.replace(/[.,;)]+$/, '');
    if (url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i) || url.includes('/photo-') || url.includes('/uploads/')) {
      urlsWithSources.push({ file: f, url });
    }
  }
}

console.log(`Found ${urlsWithSources.length} image references.`);

async function checkUrl(item) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(item.url);
      const reqModule = parsed.protocol === 'https:' ? https : http;
      const req = reqModule.request(
        parsed,
        {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          },
          timeout: 6000
        },
        (res) => {
          resolve({ ...item, status: res.statusCode });
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve({ ...item, status: 'TIMEOUT' });
      });
      req.on('error', (err) => {
        resolve({ ...item, status: 'ERR: ' + err.message });
      });
      req.end();
    } catch (e) {
      resolve({ ...item, status: 'INVALID: ' + e.message });
    }
  });
}

(async () => {
  const uniqueUrls = [...new Map(urlsWithSources.map(i => [i.url, i])).values()];
  console.log(`Checking ${uniqueUrls.length} unique URLs...`);
  const results = await Promise.all(uniqueUrls.map(checkUrl));
  const broken = results.filter(r => typeof r.status !== 'number' || r.status >= 400);
  console.log(`Broken count: ${broken.length}`);
  for (const b of broken) {
    console.log(`BROKEN [${b.status}]: ${b.url} in ${b.file}`);
  }
})();
