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
            'sql' => "SELECT * FROM televing_maker WHERE maker = ? AND car_model LIKE ?",
            'sql_pattern' => 'pattern_1', 
        ],
        'dealer' => [
            'sql' => "SELECT * FROM televing_dealer WHERE maker = ?",
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
$sql = $config['sql'];
$sqlPattern = $config['sql_pattern'];

// ユーザーが選択した年月のタイムスタンプを作成
// テレビングかつディーラーの場合はDBにモデル月の情報がないため1月を固定する
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
    $startDateString = $part['start_date'] ?? '';
    $endDateString = $part['end_date'] ?? '';

    // 💡 nullを空文字に変換する明示的な処理を追加
    if ($startDateString === null) {
        $startDateString = '';
    }
    if ($endDateString === null) {
        $endDateString = '';
    }
    
    // 独立した関数を呼び出す
    if (isDateMatch($startDateString, $endDateString, $userDateTimestamp)) {
        $filteredData[] = $part;
    }
}

// フィルタリングされたデータをJSON形式で返す
echo json_encode($filteredData);


/**
 * 年式文字列が指定された日付と一致するかを判定する。
 *
 * @param string $startDateString データベースから取得した年式文字列（例: 'yyyy-mm-dd'）
 * @param string $endDateString データベースから取得した年式文字列（例: 'yyyy-mm-dd'）
 * @param int $userDateTimestamp ユーザーが選択した年月のタイムスタンプ
 * @return bool 一致する場合はtrue、そうでなければfalse
 */
function isDateMatch($startDateString, $endDateString, $userDateTimestamp) {
    // ユーザーが選択した日付の情報を取得
    $userYear = (int)date('Y', $userDateTimestamp);
    $userMonth = (int)date('n', $userDateTimestamp);

    // デバッグ出力は開発時のみ使用
    // echo json_encode(["start in"=>$startDateString, "end in"=>$endDateString]);

    // 開始日と終了日が両方存在する場合
    if ($startDateString && $endDateString) {
        $startTimestamp = strtotime($startDateString);
        // 💡 終了日のタイムスタンプをその月の最終日に設定
        $endTimestamp = strtotime("last day of {$endDateString}");

        // デバッグ出力は開発時のみ使用
        // echo json_encode(["start: $startTimestamp end: $endTimestamp user: $userDateTimestamp"]);

        if ($startTimestamp === false || $endTimestamp === false) {
            return false;
        }

        return $userDateTimestamp >= $startTimestamp && $userDateTimestamp <= $endTimestamp;
    }

    // 開始日のみ存在する場合
    if ($startDateString && !$endDateString) {
        $startTimestamp = strtotime($startDateString);

        // デバッグ出力は開発時のみ使用
        // echo json_encode(["start: $startTimestamp user: $userDateTimestamp"]);

        if ($startTimestamp === false) {
            return false;
        }
        return $userDateTimestamp >= $startTimestamp;
    }

    // 終了日のみ存在する場合
    if (!$startDateString && $endDateString) {
        // 💡 終了日のタイムスタンプをその月の最終日に設定
        $endTimestamp = strtotime("last day of {$endDateString}");

        // デバッグ出力は開発時のみ使用
        // echo json_encode(["end: $endTimestamp user: $userDateTimestamp"]);

        if ($endTimestamp === false) {
            return false;
        }
        return $userDateTimestamp <= $endTimestamp;
    }
    
    // どちらも存在しない場合は適合しない
    return false;
}
?>