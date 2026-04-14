<?php
/**
 * 業務お問い合わせフォーム 送信処理
 * 
 * 送信先: (業務部用のアドレスに要変更)
 */

session_start();

// フォームから送信されたデータの取得
$naiyou      = isset($_POST['naiyou']) ? $_POST['naiyou'] : []; // チェックボックスなので配列を想定
$name        = isset($_POST['name']) ? $_POST['name'] : '';
$kana        = isset($_POST['kana']) ? $_POST['kana'] : '';
$zip         = isset($_POST['zip']) ? $_POST['zip'] : '';
$address     = isset($_POST['adress']) ? $_POST['adress'] : '';
$tel         = isset($_POST['tel']) ? $_POST['tel'] : '';
$mailaddress = isset($_POST['mailaddress']) ? $_POST['mailaddress'] : '';
$opinion     = isset($_POST['opinion']) ? $_POST['opinion'] : '';

// --- バリデーション ---
$errors = [];

if (empty($naiyou)) {
    $errors[] = 'お問い合わせ内容にチェックを入れてください。';
}
if (empty($name)) {
    $errors[] = 'お名前を入力してください。';
}
if (empty($kana)) {
    $errors[] = 'フリガナを入力してください。';
} elseif (!preg_match('/^[ァ-ヶー\s]+$/u', $kana)) {
    $errors[] = 'フリガナは全角カタカナで入力してください。';
}
if (empty($zip)) {
    $errors[] = '郵便番号を入力してください。';
} elseif (!preg_match('/^\d{7}$/', $zip)) {
    $errors[] = '郵便番号はハイフンなしの7桁で入力してください。';
}
if (empty($address)) {
    $errors[] = 'ご住所を入力してください。';
}
if (empty($mailaddress)) {
    $errors[] = 'メールアドレスを入力してください。';
} elseif (!filter_var($mailaddress, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'メールアドレスの形式が正しくありません。';
}
if (empty($opinion)) {
    $errors[] = '内容を入力してください。';
}

if (!empty($errors)) {
    echo "<h1>入力エラーがあります</h1><ul>";
    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . "</li>";
    }
    echo "</ul><a href='javascript:history.back()'>戻る</a>";
    exit;
}

// --- メール送信設定 ---
// TODO: ここを業務部のメールアドレスに変更してください
$to = 'bullcon@fuji-denki.co.jp'; // 仮のアドレス
$subject = "【お問い合わせ】{$name}様より";

$naiyou_text = is_array($naiyou) ? implode(', ', $naiyou) : $naiyou;

$body = "お問い合わせフォームより以下の内容で送信されました。\n\n";
$body .= "--------------------------------------------------\n";
$body .= "お問い合わせ内容: {$naiyou_text}\n";
$body .= "お名前: {$name}\n";
$body .= "フリガナ: {$kana}\n";
$body .= "郵便番号: {$zip}\n";
$body .= "ご住所: {$address}\n";
$body .= "電話番号: {$tel}\n";
$body .= "メールアドレス: {$mailaddress}\n";
$body .= "--------------------------------------------------\n\n";
$body .= "内容:\n" . $opinion . "\n";

$headers = "From: " . mb_encode_mimeheader("Bullconお問い合わせ") . " <{$mailaddress}>\r\n";
$headers .= "Reply-To: {$mailaddress}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

mb_language("Japanese");
mb_internal_encoding("UTF-8");

if (mb_send_mail($to, $subject, $body, $headers)) {
    // 成功時：既存のcontact.htmlの構造に合わせ、サンクスページがあればそこへ
    header("Location: ../../html/contact/thanks.html"); // 既存のthanksがあれば活用、なければ新規作成
    exit;
} else {
    echo "メールの送信に失敗しました。時間をおいて再度お試しいただくか、お電話でお問い合わせください。";
    exit;
}
