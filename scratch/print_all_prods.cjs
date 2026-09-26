const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const prods = JSON.parse(content.replace(/^import[^\n]*\n+/m, '').replace(/export const products: Product\[\] = /, '').replace(/;\s*$/, ''));
console.log('Total products:', prods.length);
prods.forEach((p, i) => console.log(`${i+1}. [${p.category}] id="${p.id}" name="${p.name}" image="${p.image ? p.image.substring(0, 30) + '...' : 'EMPTY'}"`));
