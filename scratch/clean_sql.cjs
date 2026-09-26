const fs = require('fs');
let c = fs.readFileSync('database.sql', 'utf8');
c = c.replace(/https:\/\/www\.asitec\.cl\/wp-content\/uploads\/2021\/04\/crema-chantilly-lu[^\']+/g, 'https://www.asitec.cl/wp-content/uploads/2021/04/crema-chantilly-1.jpg');
c = c.replace(/https:\/\/www\.asitec\.cl\/wp-content\/uploads\/2021\/07\/premezcla_queque_pla[^\']+/g, 'https://www.asitec.cl/wp-content/uploads/2021/07/premezcla_queque_vainilla.jpg');
fs.writeFileSync('database.sql', c, 'utf8');
console.log('database.sql cleaned successfully!');
