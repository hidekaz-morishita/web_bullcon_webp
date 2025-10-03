<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *'); // CORS対策のため追加
header('Access-Control-Allow-Methods: GET');

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'web_page');
define('DB_USER', 'fuji23f6');
define('DB_PASS', 'fuji-buru-');
define('DB_PORT', '5432');

$tableName  = 'monitor_number_list';

try {
    $dsn = 'pgsql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM $tableName";

    $stmt = $pdo->query($sql);
    $result = $stmt->fetchAll();

    $organizedData = [];

foreach ($result as $row) {
    // 必要なデータを抽出
    $makerName = $row['maker'] ?? '不明なメーカー';
    $year = $row['year'] ?? '不明な年度';
    $monitorNum = $row['monitor_number'] ?? '不明なモニター品番';
    
    $organizedData[$makerName][] = [
        'year' => $year,
        'product_code' => $monitorNum
    ];
}

// JSONオブジェクトを直接出力
echo json_encode($organizedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>