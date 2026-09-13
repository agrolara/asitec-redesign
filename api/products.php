<?php
/**
 * ASITEC S.A. - Endpoint CRUD de Productos
 * GET /api/products.php
 * POST /api/products.php
 * PUT /api/products.php
 * DELETE /api/products.php?id=...
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

// Función helper para formatear producto a camelCase (frontend React)
function formatProduct(array $row): array {
    return [
        'id'          => $row['id'],
        'name'        => $row['name'],
        'category'    => $row['category'],
        'subcategory' => $row['subcategory'],
        'description' => $row['description'],
        'format'      => $row['format'] ?? '',
        'shelfLife'   => $row['shelf_life'] ?? '',
        'country'     => $row['country'] ?? 'Chile',
        'image'       => $row['image'] ?? '',
        'popular'     => (bool)($row['popular'] ?? 0),
        'sourceUrl'   => $row['source_url'] ?? null
    ];
}

// -------------------------------------------------------------
// 1. GET: Listar todos o filtrar
// -------------------------------------------------------------
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
        $stmt->execute([$_GET['id']]);
        $prod = $stmt->fetch();
        if (!$prod) {
            jsonResponse(['success' => false, 'error' => 'Producto no encontrado.'], 404);
        }
        jsonResponse(['success' => true, 'product' => formatProduct($prod)]);
    }

    $query = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if (!empty($_GET['category']) && $_GET['category'] !== 'Todos') {
        $query .= " AND category = ?";
        $params[] = $_GET['category'];
    }

    if (!empty($_GET['q'])) {
        $query .= " AND (name LIKE ? OR description LIKE ? OR subcategory LIKE ?)";
        $term = '%' . $_GET['q'] . '%';
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $query .= " ORDER BY id ASC";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $products = array_map('formatProduct', $rows);
    jsonResponse(['success' => true, 'products' => $products]);
}

// -------------------------------------------------------------
// OPERACIONES PROTEGIDAS (POST, PUT, DELETE)
// -------------------------------------------------------------
$user = requireAuth();
$input = getJsonInput();

// -------------------------------------------------------------
// 2. POST: Crear Producto
// -------------------------------------------------------------
if ($method === 'POST') {
    $name = trim($input['name'] ?? '');
    $category = trim($input['category'] ?? 'Pastelería');
    $subcategory = trim($input['subcategory'] ?? 'Bases para preparar');
    $description = trim($input['description'] ?? '');
    $format = trim($input['format'] ?? '');
    $shelfLife = trim($input['shelfLife'] ?? '12 meses');
    $country = trim($input['country'] ?? 'Chile');
    $image = trim($input['image'] ?? '');
    $popular = !empty($input['popular']) ? 1 : 0;
    $sourceUrl = trim($input['sourceUrl'] ?? '');

    if (empty($name)) {
        jsonResponse(['success' => false, 'error' => 'El nombre del producto es obligatorio.'], 400);
    }

    // Generar ID único
    $id = trim($input['id'] ?? '');
    if (empty($id)) {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
        $id = substr($slug, 0, 50) . '-' . rand(100, 999);
    }

    $stmt = $pdo->prepare("
        INSERT INTO products (id, name, category, subcategory, description, format, shelf_life, country, image, popular, source_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$id, $name, $category, $subcategory, $description, $format, $shelfLife, $country, $image, $popular, $sourceUrl]);

    jsonResponse([
        'success' => true,
        'message' => 'Producto creado exitosamente.',
        'product' => [
            'id' => $id,
            'name' => $name,
            'category' => $category,
            'subcategory' => $subcategory,
            'description' => $description,
            'format' => $format,
            'shelfLife' => $shelfLife,
            'country' => $country,
            'image' => $image,
            'popular' => (bool)$popular,
            'sourceUrl' => $sourceUrl
        ]
    ], 201);
}

// -------------------------------------------------------------
// 3. PUT: Actualizar Producto
// -------------------------------------------------------------
if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de producto no proporcionado.'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
    $stmt->execute([$id]);
    $current = $stmt->fetch();
    if (!$current) {
        jsonResponse(['success' => false, 'error' => 'Producto no encontrado.'], 404);
    }

    $name = isset($input['name']) ? trim($input['name']) : $current['name'];
    $category = isset($input['category']) ? trim($input['category']) : $current['category'];
    $subcategory = isset($input['subcategory']) ? trim($input['subcategory']) : $current['subcategory'];
    $description = isset($input['description']) ? trim($input['description']) : $current['description'];
    $format = isset($input['format']) ? trim($input['format']) : $current['format'];
    $shelfLife = isset($input['shelfLife']) ? trim($input['shelfLife']) : $current['shelf_life'];
    $country = isset($input['country']) ? trim($input['country']) : $current['country'];
    $image = isset($input['image']) ? trim($input['image']) : $current['image'];
    $popular = isset($input['popular']) ? (!empty($input['popular']) ? 1 : 0) : $current['popular'];
    $sourceUrl = isset($input['sourceUrl']) ? trim($input['sourceUrl']) : $current['source_url'];

    $upd = $pdo->prepare("
        UPDATE products 
        SET name = ?, category = ?, subcategory = ?, description = ?, format = ?, shelf_life = ?, country = ?, image = ?, popular = ?, source_url = ?
        WHERE id = ?
    ");
    $upd->execute([$name, $category, $subcategory, $description, $format, $shelfLife, $country, $image, $popular, $sourceUrl, $id]);

    jsonResponse([
        'success' => true,
        'message' => 'Producto actualizado correctamente.',
        'product' => [
            'id' => $id,
            'name' => $name,
            'category' => $category,
            'subcategory' => $subcategory,
            'description' => $description,
            'format' => $format,
            'shelfLife' => $shelfLife,
            'country' => $country,
            'image' => $image,
            'popular' => (bool)$popular,
            'sourceUrl' => $sourceUrl
        ]
    ]);
}

// -------------------------------------------------------------
// 4. DELETE: Eliminar Producto
// -------------------------------------------------------------
if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        jsonResponse(['success' => false, 'error' => 'ID de producto no proporcionado.'], 400);
    }

    $del = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $del->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Producto eliminado correctamente.']);
}

jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
