document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const brandTabs = document.getElementById('brand-tabs');
    let allProductsData = []; // すべてのデータを保持する変数

    if (!productsList || !brandTabs) {
        return;
    }

    // 企業イメージカラーとスタイルを定義したマップ (このコードには使用されていませんが、念のため残しています)
    const brandStyles = {
        'トヨタ': { color: '#e00021' },
        'レクサス': { color: '#c0c0c0' },
        'ホンダ': { color: '#e4002b' },
        'マツダ': { color: '#a0122e' },
        'スバル': { color: '#003366' },
        'スズキ': { color: '#fcdb00' },
        'ダイハツ': { color: '#ef3340' },
        'ミツビシ': { color: '#800000' },
        '新製品情報': { color: '#0c7edbff' }
    };

    // 最初にすべてのデータを取得
    fetch('./products_news_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allProductsData = data.sort((a, b) => {
                const dateA = new Date(a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
                const dateB = new Date(b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
                return dateB - dateA;
            });
            renderProducts('all'); // 初回は「すべて」を表示
        })
        .catch(error => {
            console.error('製品情報の読み込みに失敗しました:', error);
            productsList.innerHTML = '<li>製品情報を読み込めませんでした。</li>';
        });

    // タブのクリックイベントを処理
    brandTabs.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.tab-item');
        if (clickedTab) {
            // アクティブなタブを切り替える
            brandTabs.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('active');
            });
            clickedTab.classList.add('active');

            const brand = clickedTab.dataset.brand;
            renderProducts(brand); // 選択されたブランドで表示を更新
        }
    });

    // フィルタリングと表示を管理する関数
    function renderProducts(brand) {
        productsList.innerHTML = ''; // 一旦リストをクリア

        let filteredData;
        if (brand === 'all') {
            filteredData = allProductsData;
        } else {
            filteredData = allProductsData.filter(item => item.brand === brand);
        }

        // 現在の日付から2週間前の日付を計算
        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 14);
        
        // フィルタリングされたデータをレンダリング
        filteredData.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('product-item');

            const dateSpan = document.createElement('span');
            dateSpan.classList.add('product-date');
            dateSpan.textContent = item.date;

            const titleSpan = document.createElement('span');
            titleSpan.classList.add('product-title');

            // --- Newバッジ処理 - 日付で判定 ---
            const date_match = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
            const newsDate = date_match ? new Date(date_match[1], date_match[2] - 1, date_match[3]) : null;

            if (newsDate && newsDate > oneWeekAgo) {
                const newBadge = document.createElement('span');
                newBadge.textContent = 'New';
                
                Object.assign(newBadge.style, {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: 'red',
                    borderRadius: '10px',
                    padding: '1px 5px 2px 5px',
                    marginLeft: '30px',
                });
                titleSpan.appendChild(newBadge);
            }
            // --- Newバッジのロジックここまで ---

            // タイトルテキストから'[New]'タグを削除して設定
            let newsTitle = item.title;
            if (newsTitle.includes('[New]')) {
                 newsTitle = newsTitle.replace('[New]', '').trim();
            }
            titleSpan.prepend(newsTitle);

            // body部のレンダリング
            const bodyDiv = document.createElement('div');
            bodyDiv.classList.add('product-fulltext-body');

            item.body.forEach(block => {
                switch (block.type) {
                    case 'html':
                        const div = document.createElement('div');
                        div.style.textAlign = block.align || 'left';
                        div.innerHTML = block.content;
                        bodyDiv.appendChild(div);
                        break;
                    case 'paragraph':
                        const p = document.createElement('p');
                        p.style.textAlign = block.align || 'left';
                        p.textContent = block.content;
                        bodyDiv.appendChild(p);
                        break;
                    case 'heading':
                        const h3 = document.createElement('h3');
                        h3.style.textAlign = block.align || 'left';
                        h3.textContent = block.content;
                        bodyDiv.appendChild(h3);
                        break;
                    case 'image':
                        const img = document.createElement('img');
                        img.src = block.url;
                        img.alt = block.alt;
                        bodyDiv.appendChild(img);
                        break;
                    case 'list':
                        const ul = document.createElement('ul');
                        ul.style.listStyle = "none";
                        block.items.forEach(itemText => {
                            const li = document.createElement('li');
                            li.textContent = itemText;
                            ul.appendChild(li);
                        });
                        bodyDiv.appendChild(ul);
                        break;
                }
            });

            li.appendChild(dateSpan);
            li.appendChild(titleSpan);
            li.appendChild(bodyDiv);

            productsList.appendChild(li);
        });
    }
});