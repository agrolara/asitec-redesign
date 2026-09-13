<?php
/**
 * ASITEC S.A. - Endpoint de Login
 * POST /api/login.php
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'error' => 'Método no permitido. Use POST.'], 405);
}

$input = getJsonInput();
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($username) || empty($password)) {
    jsonResponse(['success' => false, 'error' => 'Por favor ingrese usuario y contraseña.'], 400);
}

$pdo = getDbConnection();
$stmt = $pdo->prepare("SELECT id, username, password_hash, full_name, email, role FROM users WHERE username = ? LIMIT 1");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['success' => false, 'error' => 'Credenciales inválidas.'], 401);
}

// Verificación de contraseña:
// 1. password_verify nativo de PHP
// 2. Fallback a SHA-256 inicial y actualización automática a bcrypt
$isValid = false;

if (password_verify($password, $user['password_hash'])) {
    $isValid = true;
} else if (hash('sha256', $password) === $user['password_hash']) {
    $isValid = true;
    // Actualizar al hash nativo de PHP (bcrypt)
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $upd = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $upd->execute([$newHash, $user['id']]);
}

if (!$isValid) {
    jsonResponse(['success' => false, 'error' => 'Credenciales inválidas.'], 401);
}

// Generar token seguro de 64 caracteres
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

// Guardar token en user_tokens
$tokenStmt = $pdo->prepare("INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
$tokenStmt->execute([$user['id'], $token, $expiresAt]);

jsonResponse([
    'success' => true,
    'message' => 'Inicio de sesión exitoso.',
    'token' => $token,
    'user' => [
        'id' => (int)$user['id'],
        'username' => $user['username'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);
