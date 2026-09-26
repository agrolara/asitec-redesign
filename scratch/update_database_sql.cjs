const fs = require('fs');

const prods = require('./temp_prods.cjs');
let sql = fs.readFileSync('database.sql', 'utf8');

// Replace specific broken URLs
sql = sql.replace(
  'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-lu\u0301cuma-1.jpg',
  'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg'
);
sql = sql.replace(
  'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_pla\u0301tano.jpg',
  'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg'
);

// Also replace empty product image entries in SQL
prods.forEach(p => {
  if (p.image) {
    // If the SQL entry has empty image for this product id, update it
    const idEscaped = p.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`('${idEscaped}',[^;]+?,\\s*)''(\\s*,\\s*\\d+)`, 'g');
    sql = sql.replace(regex, `$1'${p.image}'$2`);
  }
});

fs.writeFileSync('database.sql', sql, 'utf8');
console.log('Successfully updated database.sql');
