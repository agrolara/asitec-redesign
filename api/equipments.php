<?php
/**
 * ASITEC S.A. - Endpoint CRUD de Equipos de Laboratorio SAG
 * GET /api/equipments.php
 * POST /api/equipments.php
 * PUT /api/equipments.php
 * DELETE /api/equipments.php?id=...
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

function formatEquipment(array $row): array {
    $specs = [];
    if (!empty($row['specs'])) {
        $decoded = json_decode($row['specs'], true);
        if (is_array($decoded)) $specs = $decoded;
    }

    return [
        'id'           => $row['id'],
        'name'         => $row['name'],
        'brand'        => $row['brand'] ?? '',
        'model'        => $row['model'] ?? '',
        'tagline'      => $row['tagline'] ?? '',
        'description'  => $row['description'],
        'specs'        => $specs,
        'sagCertified' => (bool)($row['sag_certified'] ?? 1),
        'image'        => $row['image'] ?? ''
    ];
}

// -------------------------------------------------------------
// 1. GET: Listar todos o por ID
// -------------------------------------------------------------
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM equipments WHERE id = ? LIMIT 1");
        $stmt->execute([$_GET['id']]);
        $eq = $stmt->fetch();
        if (!$eq) {
            jsonResponse(['success' => false, 'error' => 'Equipo no encontrado.'], 404);
        }
        jsonResponse(['success' => true, 'equipment' => formatEquipment($eq)]);
    }

    $stmt = $pdo->query("SELECT * FROM equipments ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $equipments = array_map('formatEquipment', $rows);
    jsonResponse(['success' => true, 'equipments' => $equipments]);
}

// -------------------------------------------------------------
// OPERACIONES PROTEGIDAS (POST, PUT, DELETE)
// -------------------------------------------------------------
$user = requireAuth();
$input = getJsonInput();

// -------------------------------------------------------------
// 2. POST: Crear Equipo
// -------------------------------------------------------------
if ($method === 'POST') {
    $name = trim($input['name'] ?? '');
    $brand = trim($input['brand'] ?? '');
    $model = trim($input['model'] ?? '');
    $tagline = trim($input['tagline'] ?? '');
    $description = trim($input['description'] ?? '');
    $specs = is_array($input['specs'] ?? null) ? json_encode($input['specs'], JSON_UNESCAPED_UNICODE) : '[]';
    $sagCertified = !empty($input['sagCertified']) ? 1 : 0;
    $image = trim($input['image'] ?? '');

    if (empty($name)) {
        jsonResponse(['success' => false, 'error' => 'El nombre del equipo es obligatorio.'], 400);
    }

    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
        $id = substr($slug, 0, 50) . '-' . rand(100, 999);
    }

    $stmt = $pdo->prepare("
        INSERT INTO equipments (id, name, brand, model, tagline, description, specs, sag_certified, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$id, $name, $brand, $model, $tagline, $description, $specs, $sagCertified, $image]);

    jsonResponse([
        'success' => true,
        'message' => 'Equipo creado exitosamente.',
        'equipment' => [
            'id' => $id,
            'name' => $name,
            'brand' => $brand,
            'model' => $model,
            'tagline' => $tagline,
            'description' => $description,
            'specs' => json_decode($specs, true),
            'sagCertified' => (bool)$sagCertified,
            'image' => $image
        ]
    ], 201);
}

// -------------------------------------------------------------
// 3. PUT: Actualizar Equipo
// -------------------------------------------------------------
if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de equipo no proporcionado.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM equipments WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) {
        jsonResponse(['success' => false, 'error' => 'Equipo no encontrado.'], 404);
    }

    $name = isset($input['name']) ? trim($input['name']) : $current['name'];
    $brand = isset($input['brand']) ? trim($input['brand']) : $current['brand'];
    $model = isset($input['model']) ? trim($input['model']) : $current['model'];
    $tagline = isset($input['tagline']) ? trim($input['tagline']) : $current['tagline'];
    $description = isset($input['description']) ? trim($input['description']) : $current['description'];
    $specs = isset($input['specs']) && is_array($input['specs']) 
        ? json_encode($input['specs'], JSON_UNESCAPED_UNICODE) 
        : $current['specs'];
    $sagCertified = isset($input['sagCertified']) ? (!empty($input['sagCertified']) ? 1 : 0) : $current['sag_certified'];
    $image = isset($input['image']) ? trim($input['image']) : $current['image'];

    $upd = $pdo->prepare("
        UPDATE equipments 
        SET name = ?, brand = ?, model = ?, tagline = ?, description = ?, specs = ?, sag_certified = ?, image = ?
        WHERE id = ?
    ");
    $upd->execute([$name, $brand, $model, $tagline, $description, $specs, $sagCertified, $image, $id]);

    jsonResponse([
        'success' => true,
        'message' => 'Equipo actualizado correctamente.',
        'equipment' => [
            'id' => $id,
            'name' => $name,
            'brand' => $brand,
            'model' => $model,
            'tagline' => $tagline,
            'description' => $description,
            'specs' => json_decode($specs, true),
            'sagCertified' => (bool)$sagCertified,
            'image' => $image
        ]
    ]);
}

// -------------------------------------------------------------
// 4. DELETE: Eliminar Equipo
// -------------------------------------------------------------
if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de equipo no proporcionado.'], 400);
    }

    $del = $pdo->prepare("DELETE FROM equipments WHERE id = ?");
    $del->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Equipo eliminado correctamente.']);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
