<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *'); // CORS対策のため追加
header('Access-Control-Allow-Methods: GET');

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'web_page');
define('DB_USER', 'fuji23f6');
define('DB_PASS', 'fuji-buru-');
define('DB_PORT', '5432');

try {
    // データベースに接続
    $dsn = 'pgsql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // SQLクエリを作成
    $sql = "SELECT id, date, title, summary, url FROM products_news ORDER BY date DESC";

    // クエリを実行
    $stmt = $pdo->query($sql);
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ヘッダーをJSON形式に設定
    header('Content-Type: application/json; charset=UTF-8');

    // データをJSON形式で出力
    echo json_encode($news, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    // エラーハンドリング
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>