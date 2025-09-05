import { BRAND_STYLE } from './const_data.js';

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const brandTabs = document.getElementById('brand-tabs');
    let allProductsData = []; // すべてのデータを保持する変数
    let currentBrand = 'all'; // 現在表示中のブランドを追跡

    if (!productsList || !brandTabs) {
        return;
    }

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
            renderProducts('all', 10); // 初回は「すべて」を表示し、10件に制限
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

            currentBrand = clickedTab.dataset.brand;
            renderProducts(currentBrand, 10); // 選択されたブランドで表示を更新（10件に制限）
        }
    });

    // フィルタリングと表示を管理する関数
    function renderProducts(brand, limit = 0) {
        productsList.innerHTML = ''; // 一旦リストをクリア

        let filteredData;
        if (brand === 'all') {
            filteredData = allProductsData;
        } else {
            filteredData = allProductsData.filter(item => item.brand === brand);
        }

        const moreButtonExists = document.querySelector('#show-more-button');
        if (moreButtonExists) {
            moreButtonExists.remove();
        }

        // 現在の日付から2週間前の日付を計算
        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 14);

        // 表示件数を制限
        const displayData = limit > 0 ? filteredData.slice(0, limit) : filteredData;
        
        // フィルタリングされたデータをレンダリング
        displayData.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('product-item');

            // ブランドラベルの追加
            const brandSpan = document.createElement('span');
            brandSpan.classList.add('products-news-brand');
            brandSpan.textContent = item.brand;
            const style = BRAND_STYLE[item.brand];
            if (style) {
                Object.assign(brandSpan.style, {
                    color: style.color,
                    border: `2px solid ${style.color}`,
                    display: 'inline-block', // CSSで制御する場合は削除
                    padding: '0 8px',
                    fontWeight: 'bold',
                    borderRadius: '0',
                    lineHeight: '20px',
                    marginBottom: '15px'
                });
            } else {
                Object.assign(brandSpan.style, {
                    color: '#6c757d',
                    border: '2px solid #6c757d',
                    display: 'inline-block',
                    padding: '0 8px',
                    fontWeight: 'bold',
                    borderRadius: '0',
                    lineHeight: '20px',
                    marginBottom: '5px'
                });
            }
            li.appendChild(brandSpan);

            const dateSpan = document.createElement('span');
            dateSpan.classList.add('product-date');
            dateSpan.textContent = item.date;

            const titleSpan = document.createElement('span');
            titleSpan.classList.add('product-title');
            titleSpan.textContent = item.title;

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

            // 日付とタイトルをまとめる
            const headerDiv = document.createElement('div');
            headerDiv.style.display = 'flex';
            headerDiv.style.alignItems = 'center';
            headerDiv.appendChild(dateSpan);
            headerDiv.appendChild(titleSpan);
            li.appendChild(headerDiv);

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
                            const li_item = document.createElement('li'); 
                            li_item.textContent = itemText;
                            ul.appendChild(li_item);
                        });
                        bodyDiv.appendChild(ul);
                        break;
                }
            });
            li.appendChild(bodyDiv);
            
            productsList.appendChild(li);
        });

        // 「もっと見る」ボタンの追加
        if (filteredData.length > displayData.length) {
            const moreButton = document.createElement('button');
            moreButton.id = 'show-more-button';
            moreButton.textContent = 'もっと見る';
            
            // ボタンのスタイル
            Object.assign(moreButton.style, {
                display: 'block',
                width: '150px',
                margin: '20px auto',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '5px'
            });

            moreButton.addEventListener('click', () => {
                renderProducts(currentBrand, filteredData.length);
            });
            productsList.appendChild(moreButton);
        }
    }
});