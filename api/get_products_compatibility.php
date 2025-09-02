<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *'); // CORS対策のため追加
header('Access-Control-Allow-Methods: GET');

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'web_page');
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
$selectedProduct = $_GET['product'] ?? '';
$selectedOption = $_GET['option'] ?? '';
$selectedMaker = $_GET['maker'] ?? '';
$selectedModel = $_GET['model'] ?? '';
$selectedYear = $_GET['year'] ?? '';
$selectedMonth = $_GET['month'] ?? '';

// ★修正: 製品とオプションタイプからテーブル名、年式カラム名、SQLクエリを動的に決定するマップ
$PRODUCT_TABLE_MAP = [
    'televing' => [
        'maker' => [
            'year_col' => 'year',
            'sql' => "SELECT * FROM televing_maker WHERE maker = ? AND car_model LIKE ?",
            'sql_pattern' => 'pattern_1', 
        ],
        'dealer' => [
            'year_col' => 'col2', 
            'sql' => "SELECT * FROM televing_dealer WHERE col1 = ?",
            'sql_pattern' => 'pattern_2',
        ],
    ],
    // 'new_product' => [
    //     'maker' => [
    //         'table' => 'products_new_product_maker',
    //         'year_col' => 'custom_year_column',
    //         'sql' => "SELECT * FROM products_new_product_maker WHERE col1 = ? AND col2 = ?",
    //     ],
    // ],
];

// 選択された製品とオプションがマップに存在するかチェック
if (!isset($PRODUCT_TABLE_MAP[$selectedProduct][$selectedOption])) {
    http_response_code(400);
    echo json_encode(['error' => '無効な製品名またはオプションタイプです。']);
    exit;
}

// 動的にテーブル名、年式カラム名、SQLクエリを決定
$config = $PRODUCT_TABLE_MAP[$selectedProduct][$selectedOption];
$yearColName = $config['year_col'];
$sql = $config['sql'];
$sqlPattern = $config['sql_pattern'];

// ユーザーが選択した年月のタイムスタンプを作成
if ($selectedProduct === 'televing' && $selectedOption === 'dealer') {
    $selectedMonth = '01';
}
$userDateTimestamp = strtotime("{$selectedYear}-{$selectedMonth}-01");
if ($userDateTimestamp === false) {
    http_response_code(400);
    echo json_encode(['error' => '無効な日付形式です。']);
    exit;
}

// データベースから適合データを取得
try {
    $stmt = $pdo->prepare($sql);
    // sqlパターンによって実行パラメータを分岐
    if ($sqlPattern === 'pattern_1') {
        $stmt->execute([$selectedMaker, "{$selectedModel}%"]);
    } else if ($sqlPattern === 'pattern_2') {
        $stmt->execute([$selectedMaker]); 
    }
    $allPartsData = $stmt->fetchAll();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'データの取得中にエラーが発生しました。']);
    exit;
}

$filteredData = [];

// 取得した各レコードをループして年式をチェック
foreach ($allPartsData as $part) {
    // 取得した年式カラムを動的に指定
    $dateString = $part[$yearColName] ?? '';
    
    // 独立した関数を呼び出す
    if (isDateMatch($dateString, $userDateTimestamp)) {
        $filteredData[] = $part;
    }
}

// フィルタリングされたデータをJSON形式で返す
echo json_encode($filteredData);


/**
 * 年式文字列が指定された日付と一致するかを判定する。
 *
 * @param string $dateString データベースから取得した年式文字列（例: 'H27(2015)2～ R1(2019)12'）
 * @param int $userDateTimestamp ユーザーが選択した年月のタイムスタンプ
 * @return bool 一致する場合はtrue、そうでなければfalse
 */
function isDateMatch($dateString, $userDateTimestamp) {
    $dateString = trim($dateString);

    // パターン1: 範囲指定（例: H27(2015)2～ R1(2019)12）
    $regexRange = '/^([RH]\d+\((\d{4})\))\/*(\d{1,2})\s*[〜～]\s*([RH]\d+\((\d{4})\))\/*(\d{1,2})/';
    if (preg_match($regexRange, $dateString, $matches)) {
        $startYear = $matches[2];
        $startMonth = $matches[3];
        $endYear = $matches[5];
        $endMonth = $matches[6];
        $startTimestamp = strtotime("{$startYear}-{$startMonth}-01");
        $endTimestamp = strtotime("{$endYear}-{$endMonth}-01");
        return $userDateTimestamp >= $startTimestamp && $userDateTimestamp <= $endTimestamp;
    }

    // パターン2: 〜以前（例: 〜H27(2015)2）
    $regexTo = '/[〜～]\s*([RH]\d+\((\d{4})\))\/*(\d{1,2})/';
    if (preg_match($regexTo, $dateString, $matches)) {
        $endYear = $matches[2];
        $endMonth = $matches[3];
        $endTimestamp = strtotime("{$endYear}-{$endMonth}-01");
        return $userDateTimestamp <= $endTimestamp;
    }

    // パターン3: 〜以降（例: R3(2020)8～）
    $regexFrom = '/^([RH]\d+\((\d{4})\))\/*(\d{1,2})\s*[〜～]/';
    if (preg_match($regexFrom, $dateString, $matches)) {
        $startYear = $matches[2];
        $startMonth = $matches[3];
        $startTimestamp = strtotime("{$startYear}-{$startMonth}-01");
        return $userDateTimestamp >= $startTimestamp;
    }

    // パターン2-1: 2025(R7)年モデル
    $regexYear = '/^(\d{4})\([RH]\d+/';
    if (preg_match($regexYear, $dateString, $matches)) {
        $startYear = $matches[1];
        // ユーザーが選択した年を取得
        $userYear = date('Y', $userDateTimestamp);
        return $userYear == $startYear;
    }
    
    // どのパターンにも一致しない場合は、常に適合とみなす（またはfalseを返す）
    return false;
}
?>