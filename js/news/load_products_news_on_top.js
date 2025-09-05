document.addEventListener('DOMContentLoaded', () => {
    const topProductsList = document.getElementById('top-products-news-list');
    if (!topProductsList) {
        return;
    }

    // 企業イメージカラーとスタイルを定義したマップ
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

    // JSONファイルを読み込む
    fetch('./html/news/products_news_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // 日付で並び替え（新しい順）
            const sortedData = data.sort((a, b) => {
                const dateA = a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3');
                const dateB = b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3');
                return new Date(dateB) - new Date(dateA);
            });

            sortedData.slice(0, 10).forEach(item => {
                const li = document.createElement('li');
                li.classList.add('products-news-item');

                // ブランド情報の表示
                const brandSpan = document.createElement('span');
                brandSpan.classList.add('products-news-brand');
                brandSpan.textContent = item.brand;

                // 長方形の枠線スタイルを適用
                Object.assign(brandSpan.style, {
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '24px',
                    minHeight: '24px',
                    borderRadius: '0',
                    padding: '0 8px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    marginRight: '10px',
                    backgroundColor: '#ffffff'
                });

                // ブランド名に基づいてテキストカラーと枠線の色を適用
                const style = brandStyles[item.brand];
                if (style) {
                    brandSpan.style.color = style.color;
                    brandSpan.style.border = `2px solid ${style.color}`;
                } else {
                    // デフォルトのスタイル
                    brandSpan.style.color = '#6c757d';
                    brandSpan.style.border = '2px solid #6c757d';
                }

                const headerDiv = document.createElement('div');
                headerDiv.classList.add('products-news-header');

                const dateSpan = document.createElement('span');
                dateSpan.classList.add('products-news-date');
                dateSpan.textContent = item.date;

                const titleSpan = document.createElement('span');
                titleSpan.classList.add('products-news-title');
                
                // Newバッジ処理
                let newsTitle = item.title;
                const hasNewTag = newsTitle.includes('[New]');
                if (hasNewTag) {
                    newsTitle = newsTitle.replace('[New]', '').trim();
                }
                titleSpan.textContent = newsTitle; 

                if (hasNewTag) {
                    const newBadge = document.createElement('span');
                    newBadge.textContent = 'New';
                    newBadge.style.color = '#fff';
                    newBadge.style.fontWeight = 'bold';
                    newBadge.style.fontSize = '12px';
                    newBadge.style.backgroundColor = 'red';
                    newBadge.style.borderRadius = '10px';
                    newBadge.style.padding = "1px 5px 3px 5px";
                    newBadge.style.marginLeft = "30px";
                    titleSpan.appendChild(newBadge); 
                }

                 // body部のレンダリング
                const bodyDiv = document.createElement('div');
                bodyDiv.classList.add('products-news-fulltext-body');

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

                // 新しい構造で要素を組み立てる
                headerDiv.appendChild(dateSpan);
                headerDiv.appendChild(titleSpan);
                li.appendChild(brandSpan);
                li.appendChild(headerDiv);
                li.appendChild(bodyDiv);
                
                topProductsList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('トップページの製品情報の読み込みに失敗しました:', error);
            topProductsList.innerHTML = '<li>製品情報を読み込めませんでした。</li>';
        });
});