<?php
/**
 * ASITEC S.A. - Endpoint de Subida Segura de Archivos
 * POST /api/upload.php
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'error' => 'Método no permitido. Use POST con multipart/form-data.'], 405);
}

// Requiere sesión de administrador
$user = requireAuth();

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errCode = $_FILES['file']['error'] ?? 'No file';
    jsonResponse(['success' => false, 'error' => "Error al recibir el archivo (Código: $errCode)."], 400);
}

$file = $_FILES['file'];
$maxSize = 10 * 1024 * 1024; // 10 Megabytes

if ($file['size'] > $maxSize) {
    jsonResponse(['success' => false, 'error' => 'El archivo supera el tamaño máximo permitido (10 MB).'], 400);
}

// Validar extensión
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions, true)) {
    jsonResponse(['success' => false, 'error' => 'Formato no permitido. Solo se aceptan: jpg, png, webp, gif, svg.'], 400);
}

// Validar MIME type real
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
];

if (!in_array($mimeType, $allowedMimes, true) && $extension !== 'svg') {
    jsonResponse(['success' => false, 'error' => 'El contenido del archivo no es una imagen válida.'], 400);
}

// Directorio destino (carpeta /uploads en la raíz del hosting)
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generar nombre seguro único
$prefix = preg_replace('/[^a-zA-Z0-9]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
$prefix = substr($prefix, 0, 20) ?: 'asitec';
$fileName = $prefix . '_' . bin2hex(random_bytes(6)) . '.' . $extension;
$targetPath = $uploadDir . $fileName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    jsonResponse(['success' => false, 'error' => 'No se pudo guardar el archivo en el servidor. Verifique permisos 755 de /uploads.'], 500);
}

// Retornar URL relativa y absoluta
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$relativeUrl = 'uploads/' . $fileName;
$fullUrl = $protocol . $host . '/' . $relativeUrl;

jsonResponse([
    'success' => true,
    'message' => 'Imagen subida correctamente.',
    'url' => $relativeUrl,
    'fullUrl' => $fullUrl,
    'filename' => $fileName
]);
