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

function formatRecipe(array $row): array {
    $steps = [];
    if (!empty($row['key_steps'])) {
        $decoded = json_decode($row['key_steps'], true);
        if (is_array($decoded)) $steps = $decoded;
    }

    return [
        'id'                 => $row['id'],
        'title'              => $row['title'],
        'category'           => $row['category'],
        'duration'           => $row['duration'],
        'difficulty'         => $row['difficulty'],
        'videoUrl'           => $row['video_url'],
        'thumbnail'          => $row['thumbnail'],
        'description'        => $row['description'],
        'recommendedProduct' => $row['recommended_product'],
        'keySteps'           => $steps
    ];
}

// -------------------------------------------------------------
// 1. GET: Listar todas las recetas o por ID
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

// -------------------------------------------------------------
// OPERACIONES PROTEGIDAS (POST, PUT, DELETE)
// -------------------------------------------------------------
$user = requireAuth();
$input = getJsonInput();

// -------------------------------------------------------------
// 2. POST: Crear Receta
// -------------------------------------------------------------
if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    $category = trim($input['category'] ?? 'Pastelería');
    $duration = trim($input['duration'] ?? '15 min');
    $difficulty = trim($input['difficulty'] ?? 'Fácil');
    $videoUrl = trim($input['videoUrl'] ?? '');
    $thumbnail = trim($input['thumbnail'] ?? '');
    $description = trim($input['description'] ?? '');
    $recommendedProduct = trim($input['recommendedProduct'] ?? '');
    $keySteps = is_array($input['keySteps'] ?? null) ? json_encode($input['keySteps'], JSON_UNESCAPED_UNICODE) : '[]';

    if (empty($title)) {
        jsonResponse(['success' => false, 'error' => 'El título de la receta es obligatorio.'], 400);
    }

    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
        $id = substr($slug, 0, 50) . '-' . rand(100, 999);
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
            'keySteps' => json_decode($keySteps, true)
        ]
    ], 201);
}

// -------------------------------------------------------------
// 3. PUT: Actualizar Receta
// -------------------------------------------------------------
if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de receta no proporcionado.'], 400);
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
    $keySteps = isset($input['keySteps']) && is_array($input['keySteps'])
        ? json_encode($input['keySteps'], JSON_UNESCAPED_UNICODE)
        : $current['key_steps'];

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
            'keySteps' => json_decode($keySteps, true)
        ]
    ]);
}

// -------------------------------------------------------------
// 4. DELETE: Eliminar Receta
// -------------------------------------------------------------
if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de receta no proporcionado.'], 400);
    }

    $del = $pdo->prepare("DELETE FROM recipes WHERE id = ?");
    $del->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Receta eliminada correctamente.']);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
