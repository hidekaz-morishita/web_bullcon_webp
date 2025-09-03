// 本Scriptはwebページの開発者コンソール上で実行するためのスクリプト


// 日本語のストップワードリスト
const japaneseStopWords = new Set([
  'の', 'に', 'は', 'を', 'と', 'が', 'で', 'から', 'まで', 'より',
  'へ', 'も', 'など', 'こと', 'もの', 'よう', 'ため', 'ば', 'し',
  'する', 'いる', 'ある', 'なる', 'ない', 'です', 'ます', 'ました',
  'ました', 'ました', 'ました', 'でしょう', 'ましょう',
  'その', 'これ', 'あれ', 'こちら', 'そこ', 'あそこ', 'どこ', 'いつ', 'なぜ',
  'どう', 'です', 'ます', 'ました', 'でした', 'います', 'ありません',
  'そして', 'しかし', 'また', 'または', '例えば', '特に', '以上', '以下',
  'とても', '少し', '多く', '少なく', 'まず', '次に', '最後に',
  '〜', '・', '、', '。', ',', '.', '(', ')', '[', ']', '{', '}', '?', '!',
  'ー'
]);

// ウェブページのテキストをすべて取得し、解析する関数
function analyzePageKeywords() {
  // bodyタグ内のテキストコンテンツを取得
  const text = document.body.innerText;
  
  // テキストをクリーニングし、単語の出現回数をカウント
  const words = text
    .toLowerCase() // 小文字に変換
    .replace(/[0-9.]/g, '') // 数字とピリオドを削除
    .split(/\s+|\n+|　/g) // 空白、改行、全角スペースで分割
    .filter(word => word.length > 1 && !japaneseStopWords.has(word)); // 1文字以下の単語とストップワードを除外

  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // 出現回数でソート
  const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);

  // 結果を出力
  console.log("--- ページのキーワード分析結果（上位50件） ---");
  if (sortedWords.length === 0) {
    console.log("キーワードが見つかりませんでした。");
    return;
  }
  
  sortedWords.slice(0, 50).forEach(([word, count]) => {
    console.log(`"${word}"：${count}回`);
  });
  console.log("------------------------------------------");
}

// 関数を実行
analyzePageKeywords();