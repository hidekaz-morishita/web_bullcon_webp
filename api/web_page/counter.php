<?php
/**
 * アクセスカウンター API
 * トータル、本日、今週のアクセス数を管理
 */

header('Content-Type: application/json');

$json_file = __DIR__ . '/counter.json';

// ファイルが存在しない場合は初期化
if (!file_exists($json_file)) {
    $data = [
        'total' => 1100422,
        'today' => 0,
        'weekly' => 0,
        'last_date' => '',
        'last_week' => ''
    ];
} else {
    $json_content = file_get_contents($json_file);
    $data = json_decode($json_content, true);
    if (!$data) {
        $data = ['total' => 1100422, 'today' => 0, 'weekly' => 0, 'last_date' => '', 'last_week' => ''];
    }
}

$today = date('Y-m-d');
$week  = date('Y-W');
$month = date('Y-m');
$year  = date('Y');

// クライアントIPの取得
$ip = $_SERVER['REMOTE_ADDR'];

// 各期間のリセット判定
if ($data['last_date'] !== $today) {
    $data['today'] = 0;
    $data['last_date'] = $today;
    $data['ips'] = []; // 日が変わったらIPリストをクリア
}
if ($data['last_week'] !== $week) {
    $data['weekly'] = 0;
    $data['last_week'] = $week;
}
if (!isset($data['last_month']) || $data['last_month'] !== $month) {
    $data['monthly'] = 0;
    $data['last_month'] = $month;
}
if (!isset($data['last_year']) || $data['last_year'] !== $year) {
    $data['yearly'] = 0;
    $data['last_year'] = $year;
}

// 同一IPで本日未計測の場合のみカウントアップ
if (!isset($data['ips']) || !in_array($ip, $data['ips'])) {
    $data['total']++;
    $data['today']++;
    $data['weekly']++;
    $data['monthly']++;
    $data['yearly']++;
    $data['ips'][] = $ip;

    // 保存（排他ロック推奨だが簡易的に）
    file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT));
}

// 結果を返却
echo json_encode([
    'total' => $data['total'],
    'today' => $data['today'],
    'weekly' => $data['weekly']
]);
