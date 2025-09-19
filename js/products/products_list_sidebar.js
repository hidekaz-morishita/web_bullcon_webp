document.addEventListener('DOMContentLoaded', () => {
    const mainTable = document.querySelector('body > table[width="1000"]');
    const mainContainer = document.getElementById('container');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const headerPlaceholder = document.getElementById('header-placeholder');

    if (!mainTable || !footerPlaceholder || !headerPlaceholder) {
        console.error("主要な要素（テーブル、ヘッダー、またはフッター）が見つかりません。");
        return;
    }

    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'product-sidebar-container';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'product-detail-page-wrapper';

    if (mainTable) {
        contentWrapper.appendChild(mainTable);
    }

    footerPlaceholder.parentNode.insertBefore(contentWrapper, footerPlaceholder);
    footerPlaceholder.parentNode.insertBefore(sidebarContainer, contentWrapper);

    const setSidebarHeight = () => {
        const headerHeight = headerPlaceholder.offsetHeight + 40;
        const footerHeight = footerPlaceholder.offsetHeight;
        const documentHeight = document.body.scrollHeight;

        const newHeight = documentHeight - headerHeight - footerHeight - 150;

        sidebarContainer.style.maxHeight = `${newHeight}px`;
    };

    setSidebarHeight();
    window.addEventListener('resize', setSidebarHeight);

    // products_data.jsonから製品データを読み込む
    fetch('/html/products/products_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const currentUrlPath = window.location.pathname.replace(/\/+$/, '') + window.location.search;

            const title = document.createElement('h3');
            title.textContent = '製品一覧';
            sidebarContainer.appendChild(title);

            const productList = document.createElement('ul');
            productList.className = 'category-list';
            sidebarContainer.appendChild(productList);

            data.products_data.categories.forEach(category => {
                const categoryItem = document.createElement('li');
                categoryItem.className = 'category-item';

                // カテゴリヘッダー
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'category-header';
                const categoryName = document.createElement('strong');
                categoryName.textContent = category.name;
                const categoryToggleBtn = document.createElement('img');
                categoryToggleBtn.src = '/images/common/right_arrow_icon.png';
                categoryToggleBtn.alt = 'トグル';
                categoryToggleBtn.className = 'toggle-btn';
                categoryHeader.appendChild(categoryName);
                categoryHeader.appendChild(categoryToggleBtn);
                categoryItem.appendChild(categoryHeader);

                const productsUl = document.createElement('ul');
                productsUl.className = 'products-sublist';
                productsUl.style.display = 'none';
                categoryItem.appendChild(productsUl);

                let isCurrentCategory = false;

                category.products.forEach(product => {
                    const productListItem = document.createElement('li');
                    
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product-item-header';

                    const productLink = document.createElement('a');
                    productLink.href = product.main_page.url;
                    productLink.textContent = product.name;
                    
                    productDiv.appendChild(productLink);

                    let isCurrentProduct = false;
                    const productUrlPath = product.main_page.url.replace(/\/+$/, '');
                    if (currentUrlPath.endsWith(productUrlPath)) {
                        productDiv.classList.add('current-product');
                        isCurrentCategory = true;
                        isCurrentProduct = true;
                    }

                    // sub_pagesがある場合、開閉用画像を配置
                    if (product.sub_pages && product.sub_pages.length > 0) {
                        const productToggleBtn = document.createElement('img');
                        productToggleBtn.src = '/images/common/right_arrow_icon.png';
                        productToggleBtn.alt = 'トグル';
                        productToggleBtn.className = 'toggle-btn sub-toggle-btn';
                        productDiv.appendChild(productToggleBtn);

                        const subPagesUl = document.createElement('ul');
                        subPagesUl.className = 'sub-pages-list';
                        subPagesUl.style.display = 'none';

                        product.sub_pages.forEach(subPage => {
                            const subPageListItem = document.createElement('li');
                            const subPageLink = document.createElement('a');
                            subPageLink.href = subPage.url;
                            subPageLink.textContent = subPage.name;
                            
                            const subPageUrlPath = subPage.url.replace(/\/+$/, '');
                            if (currentUrlPath.endsWith(subPageUrlPath)) {
                                subPageLink.classList.add('current-product');
                                isCurrentCategory = true;
                                isCurrentProduct = true;
                            }
                            
                            subPageListItem.appendChild(subPageLink);
                            subPagesUl.appendChild(subPageListItem);
                        });
                        
                        productListItem.appendChild(productDiv);
                        productListItem.appendChild(subPagesUl);
                        productsUl.appendChild(productListItem);

                        // 製品名、または画像をクリックしたときにサブページリストの開閉を制御
                        productDiv.addEventListener('click', () => {
                            if (subPagesUl.style.display === 'none') {
                                subPagesUl.style.display = 'block';
                                productToggleBtn.style.transform = 'rotate(90deg)';
                            } else {
                                subPagesUl.style.display = 'none';
                                productToggleBtn.style.transform = 'rotate(0deg)';
                            }
                        });
                        
                        if (isCurrentProduct) {
                            subPagesUl.style.display = 'block';
                            productToggleBtn.style.transform = 'rotate(90deg)';
                        }

                    } else {
                         productListItem.appendChild(productDiv);
                         productsUl.appendChild(productListItem);
                    }
                });

                productList.appendChild(categoryItem);

                categoryHeader.addEventListener('click', () => {
                    if (productsUl.style.display === 'none') {
                        productsUl.style.display = 'block';
                        categoryToggleBtn.style.transform = 'rotate(90deg)';
                    } else {
                        productsUl.style.display = 'none';
                        categoryToggleBtn.style.transform = 'rotate(0deg)';
                    }
                });
                
                if (isCurrentCategory) {
                    productsUl.style.display = 'block';
                    categoryToggleBtn.style.transform = 'rotate(90deg)';
                    categoryToggleBtn.style.paddingBottom = '10px';
                }
            });
        })
        .catch(error => {
            console.error('製品データの読み込みに失敗しました:', error);
            sidebarContainer.style.display = 'none';
        });
});