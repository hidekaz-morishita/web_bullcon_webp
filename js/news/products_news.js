import { BRAND_STYLE } from './const_data.js';

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const brandTabs = document.getElementById('brand-tabs'); // HTML側のbrand-tabsをそのまま使用
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    let allProductsData = [];
    let currentCategory = 'all'; // currentBrandをcurrentCategoryに変更
    let searchTerm = '';
    let searchTimeout;

    if (!productsList || !brandTabs || !searchInput || !searchButton) {
        console.error("必要なDOM要素が見つかりませんでした。products-list, brand-tabs, search-input, search-button が存在するか確認してください。");
        return;
    }

    fetch('./products_news_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // 新しいJSON構造に対応するため、データを前処理
            allProductsData = data.map(item => {
                // 'type'フィールドがない場合は'その他'をデフォルトとする
                // 'brand'フィールドが存在する場合はそれを優先し、なければ'type'を使用
                const actualBrand = item.brand || item.type || 'その他';

                // titleを結合して表示用の文字列にする
                let displayTitle = '';
                if (typeof item.title === 'object' && item.title !== null) {
                    if (item.title.product) {
                        displayTitle += `[${item.title.product}] `;
                    }
                    if (item.title.car_model) {
                        displayTitle += item.title.car_model;
                    }
                } else {
                    displayTitle = item.title; // 既存の文字列形式のtitleも対応できるように
                }

                return {
                    ...item,
                    actualBrand: actualBrand, // フィルタリング・表示用のブランド/カテゴリ
                    displayTitle: displayTitle // 表示用のタイトル文字列
                };
            }).sort((a, b) => {
                const dateA = new Date(a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
                const dateB = new Date(b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
                return dateB - dateA;
            });
            renderProducts(currentCategory, 10);
        })
        .catch(error => {
            console.error('製品情報の読み込みに失敗しました:', error);
            productsList.innerHTML = '<li class="product-item">製品情報を読み込めませんでした。</li>';
        });

    brandTabs.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.tab-item');
        if (clickedTab) {
            brandTabs.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('active');
            });
            clickedTab.classList.add('active');

            currentCategory = clickedTab.dataset.brand; // data-brandでカテゴリを判別
            // 検索キーワードはリセットしない
            renderProducts(currentCategory, 10);
        }
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = searchInput.value.toLowerCase();
            renderProducts(currentCategory, 10);
        }, 300);
    });

    searchButton.addEventListener('click', () => {
        clearTimeout(searchTimeout);
        searchTerm = searchInput.value.toLowerCase();
        renderProducts(currentCategory, 10);
    });

    function renderProducts(category, limit = 0) {
        productsList.innerHTML = '';

        let filteredData = allProductsData;

        // カテゴリ（brandまたはtype）によるフィルタリング
        if (category !== 'all') {
            filteredData = filteredData.filter(item => item.actualBrand === category);
        }

        // 検索キーワードによるフィルタリング
        if (searchTerm) {
            filteredData = filteredData.filter(item => {
                // displayTitle、bodyの内容、actualBrand を検索対象とする
                const titleMatch = item.displayTitle.toLowerCase().includes(searchTerm);
                const brandMatch = item.actualBrand.toLowerCase().includes(searchTerm);
                const bodyMatch = item.body.some(block => {
                    if (block.type === 'paragraph' || block.type === 'heading') {
                        return block.content.toLowerCase().includes(searchTerm);
                    }
                    if (block.type === 'html') {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = block.content;
                        return tempDiv.textContent.toLowerCase().includes(searchTerm);
                    }
                    return false;
                });
                return titleMatch || brandMatch || bodyMatch;
            });
        }

        const moreButtonExists = document.querySelector('#show-more-button');
        if (moreButtonExists) {
            moreButtonExists.remove();
        }

        if (filteredData.length === 0) {
            productsList.innerHTML = '<li class="product-item">該当する製品情報は見つかりませんでした。</li>';
            return;
        }

        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 14);

        const displayData = limit > 0 ? filteredData.slice(0, limit) : filteredData;
        
        displayData.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('product-item');

            const brandSpan = document.createElement('span');
            brandSpan.classList.add('products-news-brand');
            brandSpan.textContent = item.actualBrand; // actualBrand を表示
            const style = BRAND_STYLE[item.actualBrand]; // actualBrand でスタイルを検索
            Object.assign(brandSpan.style, {
                color: style.color,
                border: `2px solid ${style.color}`,
                display: 'inline-block',
                padding: '0 8px',
                fontWeight: 'bold',
                borderRadius: '0',
                lineHeight: '20px',
                marginBottom: '15px'
            });
            li.appendChild(brandSpan);

            const dateSpan = document.createElement('span');
            dateSpan.classList.add('product-date');
            dateSpan.textContent = item.date;

            const titleSpan = document.createElement('span');
            titleSpan.classList.add('product-title');
            titleSpan.textContent = item.displayTitle; // displayTitle を表示

            const date_match = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
            const newsDate = date_match ? new Date(date_match[1], date_match[2] - 1, date_match[3]) : null;

            if (newsDate && newsDate > oneWeekAgo) {
                const newBadge = document.createElement('span');
                newBadge.textContent = 'New';
                newBadge.classList.add('new-badge');
                titleSpan.appendChild(newBadge);
            }

            const headerDiv = document.createElement('div');
            headerDiv.style.display = 'flex';
            headerDiv.style.alignItems = 'center';
            headerDiv.appendChild(dateSpan);
            headerDiv.appendChild(titleSpan);
            li.appendChild(headerDiv);

            const bodyDiv = document.createElement('div');
            bodyDiv.classList.add('product-fulltext-body');

            item.body.forEach(block => {
                let element;
                switch (block.type) {
                    case 'html':
                        element = document.createElement('div');
                        element.innerHTML = block.content;
                        break;
                    case 'paragraph':
                        element = document.createElement('p');
                        element.textContent = block.content;
                        break;
                    case 'heading':
                        element = document.createElement('h3');
                        element.textContent = block.content;
                        break;
                    case 'image':
                        element = document.createElement('img');
                        element.src = block.url;
                        element.alt = block.alt;
                        break;
                    case 'list':
                        element = document.createElement('ul');
                        block.items.forEach(itemText => {
                            const li_item = document.createElement('li'); 
                            li_item.textContent = itemText;
                            element.appendChild(li_item);
                        });
                        break;
                }
                if (element) {
                    if (block.align) {
                        element.style.textAlign = block.align;
                    }
                    bodyDiv.appendChild(element);
                }
            });
            li.appendChild(bodyDiv);
            
            productsList.appendChild(li);
        });

        if (filteredData.length > displayData.length) {
            const moreButton = document.createElement('button');
            moreButton.id = 'show-more-button';
            moreButton.textContent = 'もっと見る';
            
            moreButton.addEventListener('click', () => {
                renderProducts(currentCategory, filteredData.length);
            });
            productsList.appendChild(moreButton);
        }
    }
});