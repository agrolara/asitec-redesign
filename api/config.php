<?php
/**
 * ASITEC S.A. - Configuración de Base de Datos y Helpers de API
 * PHP 8.x / PDO / MySQL / cPanel
 */

// Reporte de errores controlado para producción
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Headers globales de CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de preflight request OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuración de Conexión a Base de Datos MySQL (Edita aquí tus credenciales de cPanel)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'asitec_db');
define('DB_USER', getenv('DB_USER') ?: 'asitec_user');
define('DB_PASS', getenv('DB_PASS') ?: 'Asitec_2026_SecurePass!');
define('DB_CHARSET', 'utf8mb4');

/**
 * Obtener conexión PDO singleton
 */
function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            jsonResponse([
                'success' => false,
                'error' => 'Error de conexión a la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }
    return $pdo;
}

/**
 * Enviar respuesta JSON estandarizada y terminar script
 */
function jsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Obtener cuerpo JSON de la petición
 */
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Obtener token Bearer de la cabecera Authorization
 */
function getBearerToken(): ?string {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

/**
 * Validar autenticación de usuario
 */
function requireAuth(): array {
    $token = getBearerToken();
    if (!$token) {
        jsonResponse([
            'success' => false,
            'error' => 'No autorizado. Token no proporcionado.'
        ], 401);
    }

    $pdo = getDbConnection();
    $stmt = $pdo->prepare("
        SELECT u.id, u.username, u.full_name, u.email, u.role, t.expires_at 
        FROM user_tokens t
        JOIN users u ON u.id = t.user_id
        WHERE t.token = ? AND t.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse([
            'success' => false,
            'error' => 'Sesión expirada o token inválido.'
        ], 401);
    }

    return $user;
}
