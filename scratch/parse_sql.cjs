const fs = require('fs');
const sql = fs.readFileSync('database.sql', 'utf8');
const prodsMatch = sql.match(/INSERT INTO `products`[\s\S]*?;\r?\n/);
if (prodsMatch) {
  const insertText = prodsMatch[0];
  const rows = insertText.split(/\),\s*\(/g);
  console.log('Total product rows in database.sql:', rows.length);
  const categories = {};
  for (const r of rows) {
    const parts = r.split("', '");
    if (parts.length >= 3) {
      const cat = parts[2];
      categories[cat] = (categories[cat] || 0) + 1;
    }
  }
  console.log('Categories in database.sql:', categories);
} else {
  console.log('No INSERT INTO products match found');
}
