const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('1. Compilando React con Vite...');
execSync('npm run build', { stdio: 'inherit' });

console.log('2. Copiando 200.html para soporte SPA en Surge / static hosting...');
fs.copyFileSync('dist/index.html', 'dist/200.html');

console.log('3. Copiando archivos de backend API a dist/api...');
if (!fs.existsSync('dist/api')) fs.mkdirSync('dist/api', { recursive: true });
const apiFiles = fs.readdirSync('api');
for (const f of apiFiles) {
  fs.copyFileSync(path.join('api', f), path.join('dist/api', f));
}

console.log('4. Copiando .htaccess y database.sql...');
if (fs.existsSync('.htaccess')) fs.copyFileSync('.htaccess', 'dist/.htaccess');
if (fs.existsSync('database.sql')) fs.copyFileSync('database.sql', 'dist/database.sql');

if (!fs.existsSync('dist/uploads')) fs.mkdirSync('dist/uploads', { recursive: true });

console.log('5. Empaquetando asitec_cpanel_demo.zip...');
if (fs.existsSync('asitec_cpanel_demo.zip')) fs.unlinkSync('asitec_cpanel_demo.zip');
execSync('tar.exe -a -cf asitec_cpanel_demo.zip -C dist .', { stdio: 'inherit' });

console.log('¡Paquete asitec_cpanel_demo.zip listo con éxito!');
const stat = fs.statSync('asitec_cpanel_demo.zip');
console.log(`Tamaño del archivo ZIP: ${(stat.size / 1024).toFixed(2)} KB`);
