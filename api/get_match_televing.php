<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *'); // CORS対策のため追加
header('Access-Control-Allow-Methods: GET');

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'match_products');
define('DB_USER', 'fuji23f6');
define('DB_PASS', 'fuji-buru-');
define('DB_PORT', '5432');

// PostgreSQLデータベース接続設定
$dsn = 'pgsql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME;

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'データベース接続エラー: ' . $e->getMessage()]);
    exit;
}

// ユーザーからのGETパラメータを取得
// パラメータが存在しない場合は空文字列を設定し、エラーを防ぐ
$selectedMaker = $_GET['maker'] ?? '';
$selectedModel = $_GET['model'] ?? '';
$selectedYear = $_GET['year'] ?? '';
$selectedMonth = $_GET['month'] ?? '';

// ユーザーが選択した年月のタイムスタンプを作成
// 例: 2021年3月 -> '2021-03-01'
$userDateTimestamp = strtotime("{$selectedYear}-{$selectedMonth}-01");
if ($userDateTimestamp === false) {
    http_response_code(400);
    echo json_encode(['error' => '無効な日付形式です。']);
    exit;
}

// データベースから、メーカーとモデル名に一致するすべての適合データを取得
try {
    // テーブル名とカラム名は実際のデータベースに合わせて変更してください
    /*$sql = "SELECT * FROM televing WHERE col1 = :maker AND col2 = :model";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['maker' => $selectedMaker, 'model' => $selectedModel]);*/
    $sql = "SELECT * FROM televing  WHERE col1 = ? AND col2 = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$selectedMaker, $selectedModel]);
    $allPartsData = $stmt->fetchAll();
    //echo json_encode(['all'=> $allPartsData]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'データの取得中にエラーが発生しました。']);
    exit;
}

$filteredData = [];

// データベースの年式文字列を解析するための正規表現パターン
$regexTo = '/[〜～]\s*([RH]\d+\((\d{4})\))(\d{1,2})/'; // 例: 〜H27(2015)2
$regexFrom = '/^([RH]\d+\((\d{4})\))(\d{1,2})\s*[〜～]/'; // 例: R3(2020)8～
$regexRange = '/^([RH]\d+\((\d{4})\))(\d{1,2})\s*[〜～]\s*([RH]\d+\((\d{4})\))(\d{1,2})/'; // 例: H27(2015)2～ R1(2019)12


// 取得した各レコードをループして年式をチェック
foreach ($allPartsData as $part) {
    $dateString = $part['col3']; 
    $isMatch = false;

    // パターン1: 範囲指定（例: H27(2015)2～ R1(2019)12）
    if (preg_match($regexRange, $dateString, $matches)) {
        //echo json_encode(['reng start' =>  $matches]);
        $startYear = $matches[2];
        $startMonth = $matches[3];
        $endYear = $matches[5];
        $endMonth = $matches[6];
        $startTimestamp = strtotime("{$startYear}-{$startMonth}-01");
        $endTimestamp = strtotime("{$endYear}-{$endMonth}-01");

        if ($userDateTimestamp >= $startTimestamp && $userDateTimestamp <= $endTimestamp) {
            $isMatch = true;
        }
    }
    
    // パターン2: 〜以前（例: 〜H27(2015)2）
    else if (preg_match($regexTo, $dateString, $matches)) {
        //echo json_encode(['to start' =>  $matches]);
        $endYear = $matches[2];
        $endMonth = $matches[3];
        $endTimestamp = strtotime("{$endYear}-{$endMonth}-01");
        
        if ($userDateTimestamp <= $endTimestamp) {
            $isMatch = true;
        }
    }

    // パターン3: 〜以降（例: R3(2020)8～）
    else if (preg_match($regexFrom, $dateString, $matches)) {
        //echo json_encode(['from start' =>  $matches]);
        $startYear = $matches[2];
        $startMonth = $matches[3];
        $startTimestamp = strtotime("{$startYear}-{$startMonth}-01");
        
        if ($userDateTimestamp >= $startTimestamp) {
            $isMatch = true;
        }
    }
    
    // その他のパターン（例: 単一の年式など）はここに追加
    // 例: 特定の年式のみを対象とする場合
    else if (false) { // 実際のフォーマットに合わせて変更
        $isMatch = true;
    }

    else {
        $isMatch = true;
    }

    // 条件に一致したデータを結果に追加
    if ($isMatch) {
        $filteredData[] = $part;
    }
}

// フィルタリングされたデータをJSON形式で返す
echo json_encode($filteredData);

?>