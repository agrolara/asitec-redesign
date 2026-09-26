const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const prods = JSON.parse(content.replace(/^import[^\n]*\n+/m, '').replace(/export const products: Product\[\] = /, '').replace(/;\s*$/, ''));

fs.writeFileSync('api/data_products.json', JSON.stringify(prods, null, 2), 'utf8');
console.log(`Successfully generated api/data_products.json with ${prods.length} products.`);
