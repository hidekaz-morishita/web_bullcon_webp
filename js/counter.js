/**
 * アクセスカウンター表示用スクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
    const counterContainer = document.querySelector('.access-counter');
    if (!counterContainer) return;

    // 表示エリアの初期化（モダンなHTML構造へ）
    counterContainer.innerHTML = `
        <div class="counter-display">
            <div class="counter-item total">
                <span class="counter-label"></span>
                <span id="counter-total" class="counter-num">---</span>
            </div>
        </div>
    `;

    // API呼び出し
    fetch('./api/web_page/counter.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('counter-total').textContent = data.total.toLocaleString();
        })
        .catch(error => {
            console.error('Counter error:', error);
            counterContainer.style.display = 'none'; // エラー時は非表示
        });
});
