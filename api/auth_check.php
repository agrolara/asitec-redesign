<?php
/**
 * ASITEC S.A. - Verificación de Sesión y Logout
 * GET/POST/DELETE /api/auth_check.php
 */

require_once __DIR__ . '/config.php';

// Si es DELETE o logout
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || isset($_GET['logout'])) {
    $token = getBearerToken();
    if ($token) {
        $pdo = getDbConnection();
        $del = $pdo->prepare("DELETE FROM user_tokens WHERE token = ?");
        $del->execute([$token]);
    }
    jsonResponse(['success' => true, 'message' => 'Sesión cerrada correctamente.']);
}

// Verificación normal de sesión
$user = requireAuth();

jsonResponse([
    'success' => true,
    'authenticated' => true,
    'user' => [
        'id' => (int)$user['id'],
        'username' => $user['username'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);
