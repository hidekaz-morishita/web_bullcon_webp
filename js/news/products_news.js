document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    if (!productsList) {
        return;
    }

    // JSONファイルを読み込む
    fetch('./products_news_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // 日付で並び替え（新しい順）
            data.sort((a, b) => {
                const dateA = a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3');
                const dateB = b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3');
                return new Date(dateB) - new Date(dateA);
            });

            data.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('product-item');

                const dateSpan = document.createElement('span');
                dateSpan.classList.add('product-date');
                dateSpan.textContent = item.date;

                const titleSpan = document.createElement('span');
                titleSpan.classList.add('product-title');
                titleSpan.textContent = item.title;

                // --- ここから新しいロジック ---
                // タイトルに「新」の文字が含まれているかチェック
                if (item.title.includes('(new)')) {
                    const newBadge = document.createElement('span');
                    newBadge.textContent = ' (New)';
                    newBadge.style.color = 'red';
                    newBadge.style.fontWeight = 'bold';
                    titleSpan.appendChild(newBadge); // タイトルにバッジを追加
                }
                // --- ここまで新しいロジック ---

                const bodyDiv = document.createElement('div');
                bodyDiv.classList.add('product-fulltext-body');
                bodyDiv.innerHTML = item.body;

                li.appendChild(dateSpan);
                li.appendChild(titleSpan);
                li.appendChild(bodyDiv);
                
                productsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('製品情報の読み込みに失敗しました:', error);
            productsList.innerHTML = '<li>製品情報を読み込めませんでした。</li>';
        });
});