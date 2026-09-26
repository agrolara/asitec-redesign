<?php
/**
 * ASITEC S.A. - Endpoint CRUD de Recetas y Videos
 * GET /api/recipes.php
 * POST /api/recipes.php
 * PUT /api/recipes.php
 * DELETE /api/recipes.php?id=...
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();
$dataFile = __DIR__ . '/data_recipes.json';

function formatRecipe(array $row): array {
    $steps = [];
    if (!empty($row['key_steps'])) {
        $decoded = is_string($row['key_steps']) ? json_decode($row['key_steps'], true) : $row['key_steps'];
        if (is_array($decoded)) $steps = $decoded;
    } else if (!empty($row['keySteps']) && is_array($row['keySteps'])) {
        $steps = $row['keySteps'];
    }

    return [
        'id'                 => $row['id'] ?? '',
        'title'              => $row['title'] ?? '',
        'category'           => $row['category'] ?? 'Pastelería',
        'duration'           => $row['duration'] ?? '30 min',
        'difficulty'         => $row['difficulty'] ?? 'Fácil',
        'videoUrl'           => $row['video_url'] ?? ($row['videoUrl'] ?? ''),
        'thumbnail'          => $row['thumbnail'] ?? '',
        'description'        => $row['description'] ?? '',
        'recommendedProduct' => $row['recommended_product'] ?? ($row['recommendedProduct'] ?? ''),
        'keySteps'           => $steps
    ];
}

// -------------------------------------------------------------
// MANEJO OFFLINE / SIN BASE DE DATOS INICIALIZADA
// -------------------------------------------------------------
if (!$pdo) {
    $recipes = [];
    if (file_exists($dataFile)) {
        $json = @file_get_contents($dataFile);
        if ($json) $recipes = json_decode($json, true) ?: [];
    }

    if ($method === 'GET') {
        jsonResponse(['success' => true, 'recipes' => array_map('formatRecipe', $recipes)]);
    }

    $user = requireAuth();
    $input = getJsonInput();

    if ($method === 'POST') {
        $id = $input['id'] ?? ('rec-' . time());
        $newRec = formatRecipe(array_merge($input, ['id' => $id]));
        $recipes[] = $newRec;
        @file_put_contents($dataFile, json_encode($recipes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'recipe' => $newRec], 201);
    }

    if ($method === 'PUT') {
        $id = $input['id'] ?? ($_GET['id'] ?? '');
        $found = false;
        foreach ($recipes as $i => $r) {
            if ($r['id'] === $id) {
                $recipes[$i] = formatRecipe(array_merge($r, $input));
                $found = true;
                break;
            }
        }
        if (!$found) $recipes[] = formatRecipe(array_merge($input, ['id' => $id]));
        @file_put_contents($dataFile, json_encode($recipes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'recipe' => formatRecipe(array_merge($input, ['id' => $id]))]);
    }

    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? ($input['id'] ?? '');
        $recipes = array_values(array_filter($recipes, fn($r) => $r['id'] !== $id));
        @file_put_contents($dataFile, json_encode($recipes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'message' => 'Receta eliminada.']);
    }

    jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
}

// -------------------------------------------------------------
// MANEJO CON MYSQL ACTIVO
// -------------------------------------------------------------
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM recipes WHERE id = ? LIMIT 1");
        $stmt->execute([$_GET['id']]);
        $rec = $stmt->fetch();
        if (!$rec) {
            jsonResponse(['success' => false, 'error' => 'Receta no encontrada.'], 404);
        }
        jsonResponse(['success' => true, 'recipe' => formatRecipe($rec)]);
    }

    $stmt = $pdo->query("SELECT * FROM recipes ORDER BY id ASC");
    $rows = $stmt->fetchAll();
    $recipes = array_map('formatRecipe', $rows);
    jsonResponse(['success' => true, 'recipes' => $recipes]);
}

$user = requireAuth();
$input = getJsonInput();

if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    $category = trim($input['category'] ?? 'Pastelería');
    $duration = trim($input['duration'] ?? '30 min');
    $difficulty = trim($input['difficulty'] ?? 'Fácil');
    $videoUrl = trim($input['videoUrl'] ?? '');
    $thumbnail = trim($input['thumbnail'] ?? '');
    $description = trim($input['description'] ?? '');
    $recommendedProduct = trim($input['recommendedProduct'] ?? '');
    $keySteps = isset($input['keySteps']) && is_array($input['keySteps']) ? json_encode($input['keySteps'], JSON_UNESCAPED_UNICODE) : '[]';

    if (empty($title)) {
        jsonResponse(['success' => false, 'error' => 'El título de la receta es obligatorio.'], 400);
    }

    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
        $id = substr($slug, 0, 40) . '-' . rand(100, 999);
    }

    $stmt = $pdo->prepare("
        INSERT INTO recipes (id, title, category, duration, difficulty, video_url, thumbnail, description, recommended_product, key_steps)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$id, $title, $category, $duration, $difficulty, $videoUrl, $thumbnail, $description, $recommendedProduct, $keySteps]);

    jsonResponse([
        'success' => true,
        'message' => 'Receta creada exitosamente.',
        'recipe' => [
            'id' => $id,
            'title' => $title,
            'category' => $category,
            'duration' => $duration,
            'difficulty' => $difficulty,
            'videoUrl' => $videoUrl,
            'thumbnail' => $thumbnail,
            'description' => $description,
            'recommendedProduct' => $recommendedProduct,
            'keySteps' => isset($input['keySteps']) ? $input['keySteps'] : []
        ]
    ], 201);
}

if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID no proporcionado.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM recipes WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) {
        jsonResponse(['success' => false, 'error' => 'Receta no encontrada.'], 404);
    }

    $title = isset($input['title']) ? trim($input['title']) : $current['title'];
    $category = isset($input['category']) ? trim($input['category']) : $current['category'];
    $duration = isset($input['duration']) ? trim($input['duration']) : $current['duration'];
    $difficulty = isset($input['difficulty']) ? trim($input['difficulty']) : $current['difficulty'];
    $videoUrl = isset($input['videoUrl']) ? trim($input['videoUrl']) : $current['video_url'];
    $thumbnail = isset($input['thumbnail']) ? trim($input['thumbnail']) : $current['thumbnail'];
    $description = isset($input['description']) ? trim($input['description']) : $current['description'];
    $recommendedProduct = isset($input['recommendedProduct']) ? trim($input['recommendedProduct']) : $current['recommended_product'];
    $keySteps = isset($input['keySteps']) && is_array($input['keySteps']) ? json_encode($input['keySteps'], JSON_UNESCAPED_UNICODE) : $current['key_steps'];

    $upd = $pdo->prepare("
        UPDATE recipes 
        SET title = ?, category = ?, duration = ?, difficulty = ?, video_url = ?, thumbnail = ?, description = ?, recommended_product = ?, key_steps = ?
        WHERE id = ?
    ");
    $upd->execute([$title, $category, $duration, $difficulty, $videoUrl, $thumbnail, $description, $recommendedProduct, $keySteps, $id]);

    jsonResponse([
        'success' => true,
        'message' => 'Receta actualizada correctamente.',
        'recipe' => [
            'id' => $id,
            'title' => $title,
            'category' => $category,
            'duration' => $duration,
            'difficulty' => $difficulty,
            'videoUrl' => $videoUrl,
            'thumbnail' => $thumbnail,
            'description' => $description,
            'recommendedProduct' => $recommendedProduct,
            'keySteps' => isset($input['keySteps']) ? $input['keySteps'] : json_decode($keySteps, true)
        ]
    ]);
}

if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID no proporcionado.'], 400);
    }

    $del = $pdo->prepare("DELETE FROM recipes WHERE id = ?");
    $del->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Receta eliminada correctamente.']);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
