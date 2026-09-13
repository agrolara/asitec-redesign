<?php
/**
 * ASITEC S.A. - Endpoint CRUD de Certificaciones y Acreditaciones Oficiales
 * GET /api/certifications.php
 * POST /api/certifications.php
 * PUT /api/certifications.php
 * DELETE /api/certifications.php?id=...
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

function formatCertification(array $row): array {
    return [
        'id'          => $row['id'],
        'badge'       => $row['badge'],
        'institution' => $row['institution'],
        'resolution'  => $row['resolution'],
        'detail'      => $row['detail'],
        'status'      => $row['status'],
        'documentUrl' => $row['document_url'] ?? '',
        'year'        => $row['year'] ?? ''
    ];
}

// -------------------------------------------------------------
// 1. GET: Listar todas las certificaciones o una por ID
// -------------------------------------------------------------
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM certifications WHERE id = ? LIMIT 1");
        $stmt->execute([$_GET['id']]);
        $cert = $stmt->fetch();
        if (!$cert) {
            jsonResponse(['success' => false, 'error' => 'Certificación no encontrada.'], 404);
        }
        jsonResponse(['success' => true, 'certification' => formatCertification($cert)]);
    }

    $stmt = $pdo->query("SELECT * FROM certifications ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $certifications = array_map('formatCertification', $rows);
    jsonResponse(['success' => true, 'certifications' => $certifications]);
}

// -------------------------------------------------------------
// OPERACIONES PROTEGIDAS (POST, PUT, DELETE)
// -------------------------------------------------------------
$user = requireAuth();
$input = getJsonInput();

// -------------------------------------------------------------
// 2. POST: Crear Certificación
// -------------------------------------------------------------
if ($method === 'POST') {
    $institution = trim($input['institution'] ?? '');
    $resolution = trim($input['resolution'] ?? '');
    $badge = trim($input['badge'] ?? 'Acreditación Oficial');
    $detail = trim($input['detail'] ?? '');
    $status = trim($input['status'] ?? '100% Vigente');
    $year = trim($input['year'] ?? date('Y'));
    $documentUrl = trim($input['documentUrl'] ?? '');

    if (empty($institution) || empty($resolution)) {
        jsonResponse(['success' => false, 'error' => 'Institución y Resolución son obligatorios.'], 400);
    }

    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $institution . '-' . $year));
        $id = substr($slug, 0, 50) . '-' . rand(100, 999);
    }

    $stmt = $pdo->prepare("
        INSERT INTO certifications (id, badge, institution, resolution, detail, status, document_url, year)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$id, $badge, $institution, $resolution, $detail, $status, $documentUrl, $year]);

    jsonResponse([
        'success' => true,
        'message' => 'Certificación creada exitosamente.',
        'certification' => [
            'id' => $id,
            'badge' => $badge,
            'institution' => $institution,
            'resolution' => $resolution,
            'detail' => $detail,
            'status' => $status,
            'documentUrl' => $documentUrl,
            'year' => $year
        ]
    ], 201);
}

// -------------------------------------------------------------
// 3. PUT: Actualizar Certificación
// -------------------------------------------------------------
if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de certificación no proporcionado.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM certifications WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) {
        jsonResponse(['success' => false, 'error' => 'La certificación no existe.'], 404);
    }

    $badge = trim($input['badge'] ?? $current['badge']);
    $institution = trim($input['institution'] ?? $current['institution']);
    $resolution = trim($input['resolution'] ?? $current['resolution']);
    $detail = trim($input['detail'] ?? $current['detail']);
    $status = trim($input['status'] ?? $current['status']);
    $year = trim($input['year'] ?? $current['year']);
    $documentUrl = trim($input['documentUrl'] ?? $current['document_url']);

    $updateStmt = $pdo->prepare("
        UPDATE certifications 
        SET badge = ?, institution = ?, resolution = ?, detail = ?, status = ?, document_url = ?, year = ?
        WHERE id = ?
    ");
    $updateStmt->execute([$badge, $institution, $resolution, $detail, $status, $documentUrl, $year, $id]);

    jsonResponse([
        'success' => true,
        'message' => 'Certificación actualizada exitosamente.',
        'certification' => [
            'id' => $id,
            'badge' => $badge,
            'institution' => $institution,
            'resolution' => $resolution,
            'detail' => $detail,
            'status' => $status,
            'documentUrl' => $documentUrl,
            'year' => $year
        ]
    ]);
}

// -------------------------------------------------------------
// 4. DELETE: Eliminar Certificación
// -------------------------------------------------------------
if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de certificación no proporcionado.'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM certifications WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Certificación eliminada exitosamente.']);
}

jsonResponse(['success' => false, 'error' => 'Método HTTP no soportado.'], 405);
