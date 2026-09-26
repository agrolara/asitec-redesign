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
$dataFile = __DIR__ . '/data_certifications.json';

function formatCertification(array $row): array {
    return [
        'id'          => $row['id'] ?? '',
        'badge'       => $row['badge'] ?? 'Acreditación Oficial',
        'institution' => $row['institution'] ?? '',
        'resolution'  => $row['resolution'] ?? '',
        'detail'      => $row['detail'] ?? '',
        'status'      => $row['status'] ?? '100% Vigente',
        'documentUrl' => $row['document_url'] ?? ($row['documentUrl'] ?? ''),
        'year'        => $row['year'] ?? ''
    ];
}

// -------------------------------------------------------------
// MANEJO OFFLINE / SIN BASE DE DATOS INICIALIZADA
// -------------------------------------------------------------
if (!$pdo) {
    $certs = [];
    if (file_exists($dataFile)) {
        $json = @file_get_contents($dataFile);
        if ($json) $certs = json_decode($json, true) ?: [];
    }

    if ($method === 'GET') {
        jsonResponse(['success' => true, 'certifications' => array_map('formatCertification', $certs)]);
    }

    $user = requireAuth();
    $input = getJsonInput();

    if ($method === 'POST') {
        $id = $input['id'] ?? ('cert-' . time());
        $newCert = formatCertification(array_merge($input, ['id' => $id]));
        $certs[] = $newCert;
        @file_put_contents($dataFile, json_encode($certs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'certification' => $newCert], 201);
    }

    if ($method === 'PUT') {
        $id = $input['id'] ?? ($_GET['id'] ?? '');
        $found = false;
        foreach ($certs as $i => $c) {
            if ($c['id'] === $id) {
                $certs[$i] = formatCertification(array_merge($c, $input));
                $found = true;
                break;
            }
        }
        if (!$found) $certs[] = formatCertification(array_merge($input, ['id' => $id]));
        @file_put_contents($dataFile, json_encode($certs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'certification' => formatCertification(array_merge($input, ['id' => $id]))]);
    }

    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? ($input['id'] ?? '');
        $certs = array_values(array_filter($certs, fn($c) => $c['id'] !== $id));
        @file_put_contents($dataFile, json_encode($certs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'message' => 'Certificación eliminada.']);
    }

    jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
}

// -------------------------------------------------------------
// MANEJO CON MYSQL ACTIVO
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

$user = requireAuth();
$input = getJsonInput();

if ($method === 'POST') {
    $institution = trim($input['institution'] ?? '');
    $resolution = trim($input['resolution'] ?? '');
    $badge = trim($input['badge'] ?? 'Acreditación Oficial');
    $detail = trim($input['detail'] ?? '');
    $status = trim($input['status'] ?? '100% Vigente');
    $documentUrl = trim($input['documentUrl'] ?? '');
    $year = trim($input['year'] ?? date('Y'));

    if (empty($institution) || empty($resolution)) {
        jsonResponse(['success' => false, 'error' => 'Institución y resolución son obligatorios.'], 400);
    }

    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $institution));
        $id = substr($slug, 0, 40) . '-' . rand(100, 999);
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

if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID no proporcionado.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM certifications WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) {
        jsonResponse(['success' => false, 'error' => 'Certificación no encontrada.'], 404);
    }

    $badge = isset($input['badge']) ? trim($input['badge']) : $current['badge'];
    $institution = isset($input['institution']) ? trim($input['institution']) : $current['institution'];
    $resolution = isset($input['resolution']) ? trim($input['resolution']) : $current['resolution'];
    $detail = isset($input['detail']) ? trim($input['detail']) : $current['detail'];
    $status = isset($input['status']) ? trim($input['status']) : $current['status'];
    $documentUrl = isset($input['documentUrl']) ? trim($input['documentUrl']) : $current['document_url'];
    $year = isset($input['year']) ? trim($input['year']) : $current['year'];

    $upd = $pdo->prepare("
        UPDATE certifications 
        SET badge = ?, institution = ?, resolution = ?, detail = ?, status = ?, document_url = ?, year = ?
        WHERE id = ?
    ");
    $upd->execute([$badge, $institution, $resolution, $detail, $status, $documentUrl, $year, $id]);

    jsonResponse([
        'success' => true,
        'message' => 'Certificación actualizada correctamente.',
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

if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID no proporcionado.'], 400);
    }

    $del = $pdo->prepare("DELETE FROM certifications WHERE id = ?");
    $del->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Certificación eliminada correctamente.']);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
