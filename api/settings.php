<?php
/**
 * ASITEC S.A. - Endpoint de Configuración General
 * GET /api/settings.php
 * POST /api/settings.php
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

// -------------------------------------------------------------
// 1. GET: Obtener todos los ajustes
// -------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    jsonResponse([
        'success' => true,
        'settings' => $settings
    ]);
}

// -------------------------------------------------------------
// 2. POST / PUT: Actualizar Ajustes (Requiere Auth)
// -------------------------------------------------------------
if ($method === 'POST' || $method === 'PUT') {
    $user = requireAuth();
    $input = getJsonInput();

    if (empty($input)) {
        jsonResponse(['success' => false, 'error' => 'No se enviaron datos para actualizar.'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO settings (setting_key, setting_value) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    ");

    $pdo->beginTransaction();
    try {
        foreach ($input as $key => $val) {
            $stmt->execute([$key, is_string($val) ? $val : json_encode($val, JSON_UNESCAPED_UNICODE)]);
        }
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        jsonResponse(['success' => false, 'error' => 'Error al guardar ajustes: ' . $e->getMessage()], 500);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Configuración actualizada correctamente.'
    ]);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
