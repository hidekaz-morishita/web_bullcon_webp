import { BRAND_STYLE, NEWS_TYPE_STYLE } from './const_data.js';

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const newsTypeTabs = document.getElementById('news-type-tabs');
    const brandTabsContainer = document.getElementById('brand-tabs');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    let allProductsData = [];
    let processedProductsData = [];
    let currentNewsType = 'all';
    let currentBrand = 'all';
    let searchTerm = '';
    let searchTimeout;

    const DYNAMIC_NEWS_TYPES = ['all', '適合情報', '新製品情報']; 
    const DYNAMIC_BRANDS = ['all', ...Object.keys(BRAND_STYLE).sort()];

    if (!productsList || !newsTypeTabs || !brandTabsContainer || !searchInput || !searchButton) {
        console.error("必要なDOM要素が見つかりませんでした。products-list, news-type-tabs, brand-tabs, search-input, search-button が存在するか確認してください。");
        return;
    }

    function updateActiveTabUnderline(tabElement) {
        // 何もしないか、あるいは将来的に別の視覚的効果を追加する場所として残しておく
        // この関数はもはや下線幅を計算・設定しない
    }

    // createTabItemWithWrapper関数は変更なし。text-content-wrapperはそのまま残します。
    // (将来的な拡張性や、タブのコンテンツを中央寄せにするため)
    function createTabItemWithWrapper(typeOrBrand, text, currentActiveValue, isNewsTypeTab) {
        const tab = document.createElement('div');
        tab.classList.add('tab-item');
        if (currentActiveValue === typeOrBrand) {
            tab.classList.add('active');
        }
        if (isNewsTypeTab) {
            tab.dataset.type = typeOrBrand;
        } else {
            tab.dataset.brand = typeOrBrand;
        }

        const textWrapper = document.createElement('span');
        textWrapper.classList.add('text-content-wrapper');
        textWrapper.textContent = text;
        tab.appendChild(textWrapper);

        return tab;
    }

    // 1段目のタブを初期化
    renderNewsTypeTabs();
    // 2段目のタブを初期化
    renderBrandTabs();


    fetch('./products_news_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allProductsData = data;
            processAndRenderProducts();
        })
        .catch(error => {
            console.error('製品情報の読み込みに失敗しました:', error);
            productsList.innerHTML = '<li class="product-item">製品情報を読み込めませんでした。</li>';
        });

    function processAndRenderProducts() {
        processedProductsData = allProductsData.map(item => {
            const newsType = DYNAMIC_NEWS_TYPES.includes(item.type) ? item.type : '新製品情報'; 
            const brands = Array.isArray(item.brand) ? item.brand : (item.brand ? [item.brand] : []);

            let displayTitle = '';
            if (typeof item.title === 'object' && item.title !== null) {
                if (item.title.product) {
                    displayTitle += `[${item.title.product}] `;
                }
                if (item.title.car_model) {
                    displayTitle += item.title.car_model;
                }
            } else {
                displayTitle = item.title || '';
            }

            return {
                ...item,
                newsType: newsType,
                brands: brands,
                displayTitle: displayTitle
            };
        }).sort((a, b) => {
            const dateA = new Date(a.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
            const dateB = new Date(b.date.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1-$2-$3'));
            return dateB - dateA;
        });

        renderProducts(10);
    }

    // 1段目のNEWS_TYPEタブを生成する関数
    function renderNewsTypeTabs() {
        newsTypeTabs.innerHTML = '';

        DYNAMIC_NEWS_TYPES.forEach(type => {
            const tabText = type === 'all' ? 'すべて' : type;
            const tab = createTabItemWithWrapper(type, tabText, currentNewsType, true); 
            newsTypeTabs.appendChild(tab);
        });
    }

    // 2段目のブランドタブを生成する関数
    function renderBrandTabs() {
        brandTabsContainer.innerHTML = '';

        DYNAMIC_BRANDS.forEach(brand => {
            const tabText = brand === 'all' ? 'すべて' : brand;
            const tab = createTabItemWithWrapper(brand, tabText, currentBrand, false);
            brandTabsContainer.appendChild(tab);
        });
    }

    // 1段目のタブ (NEWS_TYPE) のクリックイベント
    newsTypeTabs.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.tab-item');
        if (clickedTab) {
            newsTypeTabs.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('active');
                // tab.style.removeProperty('--active-tab-underline-width'); // 不要になったため削除
            });
            clickedTab.classList.add('active');
            // updateActiveTabUnderline(clickedTab); // 不要になったため削除

            currentNewsType = clickedTab.dataset.type;
            renderProducts(10);
        }
    });

    // 2段目のタブ (Brand) のクリックイベント
    brandTabsContainer.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.tab-item');
        if (clickedTab) {
            brandTabsContainer.querySelectorAll('.tab-item').forEach(tab => {
                tab.classList.remove('active');
                // tab.style.removeProperty('--active-tab-underline-width'); // 不要になったため削除
            });
            clickedTab.classList.add('active');
            // updateActiveTabUnderline(clickedTab); // 不要になったため削除

            currentBrand = clickedTab.dataset.brand;
            renderProducts(10);
        }
    });

    searchButton.addEventListener('click', () => {
        clearTimeout(searchTimeout);
        searchTerm = searchInput.value.toLowerCase();
        renderProducts(10);
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = searchInput.value.toLowerCase();
            renderProducts(10);
        }, 300);
    });

    function renderProducts(limit = 0) {
        productsList.innerHTML = '<li class="product-item">読み込み中...</li>';

        let filteredData = processedProductsData;

        if (currentNewsType !== 'all') { 
            filteredData = filteredData.filter(item => item.newsType === currentNewsType);
        }

        if (currentBrand !== 'all') {
            filteredData = filteredData.filter(item => item.brands.includes(currentBrand));
        }
        
        if (searchTerm) {
            filteredData = filteredData.filter(item => {
                const titleMatch = item.displayTitle.toLowerCase().includes(searchTerm);
                const newsTypeMatch = item.newsType.toLowerCase().includes(searchTerm);
                const brandMatch = item.brands.some(b => b.toLowerCase().includes(searchTerm));
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
                return titleMatch || newsTypeMatch || brandMatch || bodyMatch;
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
        
        productsList.innerHTML = '';

        displayData.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('product-item');

            const labelsContainer = document.createElement('div');
            labelsContainer.classList.add('product-labels');

            const newsTypeLabelGroup = document.createElement('div');
            newsTypeLabelGroup.classList.add('news-type-label-group');

            const newsTypeLabel = document.createElement('span');
            newsTypeLabel.classList.add('products-news-label');
            newsTypeLabel.textContent = item.newsType;
            const newsTypeStyle = NEWS_TYPE_STYLE[item.newsType];
            if (newsTypeStyle) {
                newsTypeLabel.style.color = newsTypeStyle.color;
                newsTypeLabel.style.borderColor = newsTypeStyle.borderColor;
            } else {
                newsTypeLabel.style.color = '#6c757d'; 
                newsTypeLabel.style.borderColor = '#6c757d';
            }
            newsTypeLabelGroup.appendChild(newsTypeLabel);
            labelsContainer.appendChild(newsTypeLabelGroup);

            const brandLabelGroup = document.createElement('div');
            brandLabelGroup.classList.add('brand-label-group');

            item.brands.forEach(brandName => {
                const brandLabel = document.createElement('span');
                brandLabel.classList.add('products-news-label');
                brandLabel.textContent = brandName;
                const brandStyle = BRAND_STYLE[brandName];
                if (brandStyle) {
                    brandLabel.style.color = brandStyle.color;
                    brandLabel.style.borderColor = brandStyle.borderColor;
                } else {
                    brandLabel.style.color = '#6c757d';
                    brandLabel.style.borderColor = '#6c757d';
                }
                brandLabelGroup.appendChild(brandLabel);
            });
            labelsContainer.appendChild(brandLabelGroup);

            li.appendChild(labelsContainer);


            const headerDiv = document.createElement('div');
            headerDiv.classList.add('product-header-content');
            
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('product-date');
            dateSpan.textContent = item.date;
            headerDiv.appendChild(dateSpan);

            const titleSpan = document.createElement('span');
            titleSpan.classList.add('product-title');
            titleSpan.textContent = item.displayTitle;
            headerDiv.appendChild(titleSpan);

            const date_match = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
            const newsDate = date_match ? new Date(date_match[1], date_match[2] - 1, date_match[3]) : null;

            if (newsDate && newsDate > oneWeekAgo) {
                const newBadge = document.createElement('span');
                newBadge.textContent = 'New';
                newBadge.classList.add('new-badge');
                titleSpan.appendChild(newBadge);
            }
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

        const showMoreButton = document.createElement('button');
        showMoreButton.id = 'show-more-button';
        showMoreButton.textContent = 'もっと見る';
        showMoreButton.style.display = 'none';

        if (filteredData.length > displayData.length) {
            showMoreButton.style.display = 'block';
            showMoreButton.addEventListener('click', () => {
                renderProducts(filteredData.length);
            });
            productsList.appendChild(showMoreButton);
        }
    }
});