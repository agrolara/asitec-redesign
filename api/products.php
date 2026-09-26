<?php
/**
 * ASITEC S.A. - Endpoint CRUD de Productos con Auto-Recuperación y Soporte de Foto Opcional
 * GET /api/products.php
 * POST /api/products.php
 * PUT /api/products.php
 * DELETE /api/products.php?id=...
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();
$dataFile = __DIR__ . '/data_products.json';

// Función helper para formatear producto a camelCase (frontend React) y sanitizar UTF-8
function formatProduct(array $row): array {
    $cat = cleanUtf8($row['category'] ?? 'Pastelería');
    $name = cleanUtf8($row['name'] ?? '');
    $sub = cleanUtf8($row['subcategory'] ?? 'General');
    $desc = cleanUtf8($row['description'] ?? '');
    // Permite que image quede vacía si el usuario decide eliminarla
    $image = trim($row['image'] ?? '');

    return [
        'id'          => $row['id'] ?? '',
        'name'        => $name,
        'category'    => $cat,
        'subcategory' => $sub,
        'description' => $desc,
        'format'      => $row['format'] ?? '',
        'shelfLife'   => $row['shelf_life'] ?? ($row['shelfLife'] ?? ''),
        'country'     => $row['country'] ?? 'Chile',
        'image'       => $image,
        'popular'     => (bool)($row['popular'] ?? 0),
        'sourceUrl'   => $row['source_url'] ?? ($row['sourceUrl'] ?? null)
    ];
}

// -------------------------------------------------------------
// AUTO-REPARACIÓN: Si la base de datos tiene menos de 25 productos, auto-poblar los 43 oficiales
// -------------------------------------------------------------
if ($pdo && file_exists($dataFile)) {
    try {
        $count = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        if ($count < 25) {
            $seedProducts = json_decode(@file_get_contents($dataFile), true) ?: [];
            if (!empty($seedProducts)) {
                $ins = $pdo->prepare("
                    INSERT INTO products (id, name, category, subcategory, description, format, shelf_life, country, image, popular, source_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        name = VALUES(name),
                        category = VALUES(category),
                        subcategory = VALUES(subcategory),
                        description = VALUES(description),
                        format = VALUES(format),
                        shelf_life = VALUES(shelf_life),
                        country = VALUES(country),
                        image = VALUES(image),
                        popular = VALUES(popular)
                ");
                $pdo->beginTransaction();
                foreach ($seedProducts as $sp) {
                    $ins->execute([
                        $sp['id'],
                        $sp['name'],
                        $sp['category'],
                        $sp['subcategory'],
                        $sp['description'],
                        $sp['format'] ?? '',
                        $sp['shelfLife'] ?? '',
                        $sp['country'] ?? 'Chile',
                        $sp['image'] ?? '',
                        !empty($sp['popular']) ? 1 : 0,
                        $sp['sourceUrl'] ?? null
                    ]);
                }
                $pdo->commit();
            }
        }
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
    }
}

// -------------------------------------------------------------
// MANEJO OFFLINE / SIN BASE DE DATOS INICIALIZADA
// -------------------------------------------------------------
if (!$pdo) {
    $products = [];
    if (file_exists($dataFile)) {
        $json = @file_get_contents($dataFile);
        if ($json) $products = json_decode($json, true) ?: [];
    }

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            foreach ($products as $p) {
                if ($p['id'] === $id) jsonResponse(['success' => true, 'product' => formatProduct($p)]);
            }
            jsonResponse(['success' => false, 'error' => 'Producto no encontrado.'], 404);
        }

        $filtered = $products;
        if (!empty($_GET['category']) && $_GET['category'] !== 'Todos') {
            $cat = $_GET['category'];
            $filtered = array_values(array_filter($filtered, fn($p) => ($p['category'] ?? '') === $cat));
        }
        if (!empty($_GET['q'])) {
            $q = strtolower($_GET['q']);
            $filtered = array_values(array_filter($filtered, fn($p) => 
                str_contains(strtolower($p['name'] ?? ''), $q) ||
                str_contains(strtolower($p['description'] ?? ''), $q) ||
                str_contains(strtolower($p['subcategory'] ?? ''), $q)
            ));
        }

        jsonResponse(['success' => true, 'products' => array_map('formatProduct', $filtered)]);
    }

    // Operaciones con Auth
    $user = requireAuth();
    $input = getJsonInput();

    // Restauración manual vía API
    if (isset($_GET['restore']) && $_GET['restore'] === '1' && file_exists($dataFile)) {
        $seed = json_decode(@file_get_contents($dataFile), true) ?: [];
        jsonResponse(['success' => true, 'message' => 'Catálogo oficial restaurado.', 'products' => array_map('formatProduct', $seed)]);
    }

    if ($method === 'POST') {
        $name = trim($input['name'] ?? '');
        if (empty($name)) jsonResponse(['success' => false, 'error' => 'El nombre del producto es obligatorio.'], 400);

        $id = trim($input['id'] ?? '');
        if (empty($id)) {
            $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
            $id = substr($slug, 0, 50) . '-' . rand(100, 999);
        }
        $newProd = formatProduct(array_merge($input, ['id' => $id]));
        array_unshift($products, $newProd);
        @file_put_contents($dataFile, json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'message' => 'Producto guardado.', 'product' => $newProd], 201);
    }

    if ($method === 'PUT') {
        $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
        if (empty($id)) jsonResponse(['success' => false, 'error' => 'ID no proporcionado.'], 400);

        $found = false;
        foreach ($products as $i => $p) {
            if ($p['id'] === $id) {
                // Conserva o actualiza todos los campos, permitiendo image=""
                $products[$i] = formatProduct(array_merge($p, $input));
                $found = true;
                break;
            }
        }
        if (!$found) {
            $products[] = formatProduct(array_merge($input, ['id' => $id]));
        }
        @file_put_contents($dataFile, json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'message' => 'Producto actualizado.', 'product' => formatProduct(array_merge($input, ['id' => $id]))]);
    }

    if ($method === 'DELETE') {
        $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
        if (empty($id)) jsonResponse(['success' => false, 'error' => 'ID no proporcionado.'], 400);

        $products = array_values(array_filter($products, fn($p) => $p['id'] !== $id));
        @file_put_contents($dataFile, json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        jsonResponse(['success' => true, 'message' => 'Producto eliminado.']);
    }

    jsonResponse(['success' => false, 'error' => 'Método no soportado.'], 405);
}

// -------------------------------------------------------------
// MANEJO CON MYSQL ACTIVO
// -------------------------------------------------------------
// 1. GET: Listar todos o filtrar
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

// OPERACIONES PROTEGIDAS (POST, PUT, DELETE)
$user = requireAuth();
$input = getJsonInput();

// 2. POST: Restaurar o Crear Producto
if ($method === 'POST') {
    // Si se solicita restaurar el catálogo completo oficial
    if (isset($_GET['restore']) && $_GET['restore'] === '1' && file_exists($dataFile)) {
        $seedProducts = json_decode(@file_get_contents($dataFile), true) ?: [];
        $ins = $pdo->prepare("
            INSERT INTO products (id, name, category, subcategory, description, format, shelf_life, country, image, popular, source_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name),
                category = VALUES(category),
                subcategory = VALUES(subcategory),
                description = VALUES(description),
                format = VALUES(format),
                shelf_life = VALUES(shelf_life),
                country = VALUES(country),
                image = VALUES(image),
                popular = VALUES(popular)
        ");
        $pdo->beginTransaction();
        foreach ($seedProducts as $sp) {
            $ins->execute([
                $sp['id'],
                $sp['name'],
                $sp['category'],
                $sp['subcategory'],
                $sp['description'],
                $sp['format'] ?? '',
                $sp['shelfLife'] ?? '',
                $sp['country'] ?? 'Chile',
                $sp['image'] ?? '',
                !empty($sp['popular']) ? 1 : 0,
                $sp['sourceUrl'] ?? null
            ]);
        }
        $pdo->commit();
        jsonResponse(['success' => true, 'message' => 'Catálogo oficial de 43 productos restaurado exitosamente en MySQL.', 'products' => array_map('formatProduct', $seedProducts)]);
    }

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

// 3. PUT: Actualizar Producto (Permite dejar imagen vacía sin sobrescribir con default)
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
    // Si el usuario borró la foto (input['image'] === ""), se guarda exactamente como ""
    $image = array_key_exists('image', $input) ? trim($input['image']) : $current['image'];
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

// 4. DELETE: Eliminar Producto
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
