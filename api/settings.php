<?php
/**
 * ASITEC S.A. - Endpoint de Configuración General
 * GET /api/settings.php
 * POST /api/settings.php
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();
$dataFile = __DIR__ . '/data_settings.json';

// -------------------------------------------------------------
// 1. GET: Obtener todos los ajustes
// -------------------------------------------------------------
if ($method === 'GET') {
    $settings = [];

    // Intentar desde MySQL si está disponible
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
        } catch (Exception $e) {
            // Ignorar error de tabla y pasar a fallback
        }
    }

    // Si no hay datos de BD o falló la consulta, recurrir a data_settings.json
    if (empty($settings) && file_exists($dataFile)) {
        $json = @file_get_contents($dataFile);
        if ($json) {
            $parsed = json_decode($json, true);
            if (is_array($parsed)) {
                $settings = $parsed;
            }
        }
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

    // 1. Guardar siempre en archivo local JSON como garantía de persistencia
    $existing = [];
    if (file_exists($dataFile)) {
        $existing = json_decode(@file_get_contents($dataFile), true) ?: [];
    }
    $merged = array_merge($existing, $input);
    @file_put_contents($dataFile, json_encode($merged, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    // 2. Si MySQL está disponible, sincronizar en la tabla settings
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO settings (setting_key, setting_value) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            ");

            $pdo->beginTransaction();
            foreach ($input as $key => $val) {
                $stmt->execute([$key, is_string($val) ? $val : json_encode($val, JSON_UNESCAPED_UNICODE)]);
            }
            $pdo->commit();
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            // Aunque MySQL falle, ya guardamos en data_settings.json
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Configuración actualizada correctamente.'
    ]);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
