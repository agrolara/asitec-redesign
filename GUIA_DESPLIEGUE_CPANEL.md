# 🚀 GUÍA OFICIAL DE DESPLIEGUE EN CPANEL & MYSQL
## ASITEC S.A. — Plataforma Web Autoadministrable de Alto Rendimiento

---

### 🛡️ SEGURIDAD CRÍTICA: TUS CORREOS CORPORATIVOS ESTÁN 100% SEGUROS

> [!IMPORTANT]
> **GARANTÍA TOTAL DE CONTINUIDAD EN CORREOS `@asitec.cl`**:
> El despliegue de esta nueva plataforma web interactiva **NO afecta, no modifica y no interrumpe bajo ninguna circunstancia** tus correos corporativos existentes.
>
> - Las cuentas de correo configuradas en cPanel (`info@asitec.cl`, `pagos@asitec.cl`, ventas, ejecutivos) se almacenan en carpetas independientes del servidor (`/etc` y `/mail`).
> - Los registros DNS de correo (**MX, SPF, DKIM, DMARC**) permanecen inalterados.
> - Webmail, Roundcube, Outlook, Thunderbird y teléfonos seguirán recibiendo y enviando correos exactamente igual que siempre.

---

## 📋 Resumen de la Arquitectura Desplegada

| Componente | Tecnología | Ubicación en el Servidor |
| :--- | :--- | :--- |
| **Frontend Público y Panel Admin** | React 19 + TypeScript + Tailwind CSS | `public_html/` (`index.html`, `assets/`) |
| **Backend API REST** | PHP 8.1+ con PDO & JSON Nativo | `public_html/api/` |
| **Base de Datos** | MySQL / MariaDB (InnoDB utf8mb4) | Gestionada en phpMyAdmin |
| **Almacenamiento de Fotos** | Disco del hosting (JPG, PNG, WebP) | `public_html/uploads/` |
| **Enrutador y Seguridad** | Apache Mod_Rewrite + GZIP + CSP | `public_html/.htaccess` |

---

## 🛠️ PASO A PASO: Instalación y Puesta en Marcha

### PASO 1: Respaldar la Web Antigua (Por Precaución)
1. Ingresa a tu panel cPanel: `https://asitec.cl:2083` (o la URL que te entregó tu proveedor).
2. Abre el **Administrador de Archivos** (*File Manager*).
3. Entra a la carpeta `public_html`.
4. Selecciona los archivos de la web actual (ej. carpetas antiguas de WordPress si las hubiera) y haz clic en **Comprimir** (*Compress*).
5. Nombra el archivo `respaldo_web_antigua.zip` y guárdalo o descárgalo en tu computador.

---

### PASO 2: Crear la Base de Datos MySQL en cPanel
1. En la pantalla principal de cPanel, busca y abre **"Bases de Datos MySQL"** (*MySQL Databases*) o el **"Asistente de Bases de Datos MySQL"** (*MySQL Database Wizard*).
2. **Crear nueva base de datos**:
   - Nombre: `asiteccl_portal` (o el prefijo que cPanel te asigne, ej. `tuusuario_asitec`).
   - Clic en *Crear Base de Datos*.
3. **Crear usuario para la base de datos**:
   - Nombre de usuario: `asiteccl_user`
   - Contraseña: Crea una contraseña segura (ej. `AsitecMysql2026!Db#`) y anótala.
   - Clic en *Crear Usuario*.
4. **Asignar usuario a la base de datos**:
   - En la sección "Añadir usuario a la base de datos", selecciona el usuario creado y la base de datos.
   - Haz clic en *Añadir*.
   - Marca la casilla **"TODOS LOS PRIVILEGIOS"** (*ALL PRIVILEGES*).
   - Haz clic en *Hacer Cambios* (*Make Changes*).

---

### PASO 3: Importar la Estructura y Datos con phpMyAdmin
1. En cPanel, abre la herramienta **phpMyAdmin**.
2. En la columna izquierda, haz clic sobre el nombre de la base de datos que creaste en el Paso 2 (ej. `tuusuario_asitec`).
3. En el menú superior de pestañas, haz clic en **Importar** (*Import*).
4. En "Seleccione un archivo", haz clic en **Examinar** y sube el archivo:
   `database.sql` (ubicado en la raíz de este proyecto).
5. Deja las opciones por defecto (formato SQL, cotejamiento utf8mb4) y haz clic en el botón **Continuar** (*Go*) al final de la página.
6. Aparecerá un mensaje verde de confirmación:
   *`Importación ejecutada exitosamente, 217 consultas ejecutadas.`*

> **Tablas que quedarán operativas y pobladas:**
> - `products`: Los 45+ productos industriales, premezclas y aditivos con sus especificaciones.
> - `equipments`: Los 6 equipos analíticos certificados SAG (Molinos Bastak, Falling Number, etc.).
> - `recipes`: Las 6 masterclasses técnicas con sus videos, insumos y pasos de preparación.
> - `settings`: Los datos de contacto, teléfonos, WhatsApp, cuentas corrientes oficiales de Banco de Chile y distribuidor Ataelqui.
> - `users`: Usuario administrador listo para ingresar.
> - `user_tokens`: Tokens de sesión cifrados de alta seguridad.

---

### PASO 4: Configurar Credenciales en `api/config.php`
1. Abre el archivo `api/config.php` (también presente en `public/api/config.php` y `dist/api/config.php`).
2. Modifica únicamente las siguientes 4 líneas con los datos reales que definiste en el Paso 2:

```php
// =============================================================
// PARÁMETROS DE CONEXIÓN A MYSQL (cPanel)
// =============================================================
define('DB_HOST', 'localhost');               // Generalmente 'localhost' en cPanel
define('DB_NAME', 'tuusuario_asitec');        // Nombre exacto de la base de datos
define('DB_USER', 'tuusuario_user');          // Usuario MySQL asignado
define('DB_PASS', 'TuContraseñaSegura123!');  // Contraseña del usuario MySQL
define('DB_CHARSET', 'utf8mb4');
```
3. Guarda los cambios en el archivo.

---

### PASO 5: Compilar y Subir los Archivos a `public_html`
1. En tu computador local, compila la aplicación para producción ejecutando en la terminal del proyecto:
   ```bash
   npm.cmd run build
   ```
2. Esto generará la carpeta optimizada `dist/` que ya contiene:
   - `index.html` (Página principal y aplicación SPA)
   - `.htaccess` (Reglas de servidor Apache con GZIP y redirecciones limpias)
   - `assets/` (Código CSS, JavaScript e imágenes optimizadas en WebP/SVG)
   - `api/` (Los 8 scripts PHP de la API REST)
   - `uploads/` (Carpeta para fotos de productos subidas desde el panel)
3. **Subir a cPanel**:
   - Comprime todo el contenido que está **DENTRO** de la carpeta `dist/` en un archivo `dist.zip`.
   - Entra a cPanel > **Administrador de Archivos** > `public_html`.
   - Haz clic en **Cargar** (*Upload*) y sube el archivo `dist.zip`.
   - Haz clic derecho sobre `dist.zip` y selecciona **Extraer** (*Extract*).
   - Verifica que los archivos queden directamente bajo `public_html/` (es decir, `public_html/index.html`, `public_html/.htaccess`, `public_html/api/`, etc.).
   - Puedes borrar el archivo `dist.zip` temporal.

---

### PASO 6: Ajustar Permisos de Carpetas (CHMOD)
Para garantizar que puedas subir fotos de nuevos productos desde el panel de control:
1. En el Administrador de Archivos de cPanel, busca la carpeta `public_html/uploads`.
2. Haz clic derecho sobre `uploads` > **Cambiar Permisos** (*Change Permissions*).
3. Asegúrate de que tenga permisos **`755`** (o `775` si el servidor lo requiere).
4. Para los archivos PHP dentro de `api/`, el permiso estándar es **`644`**.

---

## 🔑 ACCESO AL PANEL DE ADMINISTRACIÓN

Una vez finalizado el despliegue:

| Parámetro | Valor Oficial |
| :--- | :--- |
| **URL del Panel** | `https://www.asitec.cl/admin` *(o `https://www.asitec.cl/#admin`)* |
| **Usuario Inicial** | `admin` |
| **Contraseña Inicial** | `Asitec2026!Admin` |

*(También encontrarás un enlace discreto titulado **"Acceso Administración"** al pie de página del sitio web).*

### Funcionalidades del Panel:
1. **Catálogo de Productos**: Crear nuevos insumos, modificar fichas técnicas, subir fotos reales, cambiar formatos, duplicar productos o eliminar descontinuados.
2. **Equipos de Laboratorio SAG**: Actualizar especificaciones de molinos Bastak, resoluciones SAG y equipamiento analítico.
3. **Recetas y Videos**: Publicar masterclasses en video de YouTube, vincular insumos recomendados y redactar instrucciones paso a paso.
4. **Configuración General**: Cambiar número de teléfono central, WhatsApp de ventas, correos de contacto, sucursales, distribuidor regional y la cuenta corriente oficial de Banco de Chile para recaudación segura.

---

## 💡 MODO HÍBRIDO DE ALTA DISPONIBILIDAD (FALLBACK)

El sistema cuenta con un motor inteligente de respaldo:
- Si en algún momento la base de datos MySQL entra en mantenimiento o se interrumpe la conexión, **el sitio público NO SE CAE ni muestra error 500**.
- Automáticamente carga el catálogo y datos de respaldo precompilados en memoria, asegurando que tus clientes siempre puedan ver los productos, teléfonos y cotizar sin interrupciones.
- Tan pronto MySQL se restablece, el panel y la web se sincronizan en vivo de inmediato.

---

**ASITEC S.A. — Innovación, Tecnología & Servicio**  
*Desarrollado con React 19, PHP 8.x, MySQL & cPanel Architecture.*
