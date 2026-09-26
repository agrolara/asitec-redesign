const fs = require('fs');

let content = fs.readFileSync('src/data/products.ts', 'utf8');

// 1. Fix Unicode accent URLs
content = content.replace(
  'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-lu\u0301cuma-1.jpg',
  'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg'
);
content = content.replace(
  'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_pla\u0301tano.jpg',
  'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg'
);

// Also check precomposed
content = content.replace(
  'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-lúcuma-1.jpg',
  'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg'
);
content = content.replace(
  'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_plátano.jpg',
  'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg'
);

// 2. Parse products and fill empty images
content = content.replace(/import\s+[^;]+;/g, '');
content = content.replace('export const products: Product[] =', 'global.rawProds =');

eval(content);

const rawProds = global.rawProds;

console.log('Read products:', rawProds.length);

const defaultBakeryImg = 'https://www.asitec.cl/wp-content/uploads/2019/07/mejorador-marraqueta.jpg';
const defaultFlourImg = 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-03-1.png';
const defaultGeneralImg = 'https://www.asitec.cl/wp-content/uploads/2021/04/Productos-Asitec-2021-01-1.png';

let fixedCount = 0;
rawProds.forEach(p => {
  if (!p.image || p.image.trim() === '') {
    fixedCount++;
    if (p.category === 'Panadería') {
      if (p.name.toLowerCase().includes('molde') || p.name.toLowerCase().includes('amasado') || p.name.toLowerCase().includes('ciabatta')) {
        p.image = defaultGeneralImg;
      } else {
        p.image = defaultBakeryImg;
      }
    } else if (p.category === 'Insumos para Molinos') {
      p.image = defaultFlourImg;
    } else {
      p.image = defaultGeneralImg;
    }
  }
});

console.log('Fixed empty images:', fixedCount);

const newFileContent = `import type { Product } from '../types';

export const products: Product[] = ` + JSON.stringify(rawProds, null, 2) + `;\n`;

fs.writeFileSync('src/data/products.ts', newFileContent, 'utf8');
console.log('Successfully wrote updated src/data/products.ts');
