document.addEventListener('DOMContentLoaded', () => {
    const mainTable = document.querySelector('body > table[width="1000"]');
    const mainContainer = document.getElementById('container');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const headerPlaceholder = document.getElementById('header-placeholder');

    if ((!mainTable && !mainContainer) || !footerPlaceholder || !headerPlaceholder) {
        console.error("主要な要素（テーブル、ヘッダー、またはフッター）が見つかりません。");
        return;
    }

    const sidebarContainer = document.createElement('div');
    sidebarContainer.className = 'product-sidebar-container';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'product-detail-page-wrapper';
    
    if (mainTable) {
        contentWrapper.appendChild(mainTable);
    } else {
        contentWrapper.appendChild(mainContainer);
    }

    footerPlaceholder.parentNode.insertBefore(contentWrapper, footerPlaceholder);
    footerPlaceholder.parentNode.insertBefore(sidebarContainer, contentWrapper);

    const setSidebarHeight = () => {
        const headerHeight = headerPlaceholder.offsetHeight + 40;
        const footerHeight = footerPlaceholder.offsetHeight;
        const documentHeight = document.body.scrollHeight;
        
        const newHeight = documentHeight - headerHeight - footerHeight - 50;
        
        sidebarContainer.style.maxHeight = `${newHeight}px`;
    };

    setSidebarHeight();
    window.addEventListener('resize', setSidebarHeight);

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

                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'category-header';
                
                const categoryName = document.createElement('strong');
                categoryName.textContent = category.name;
                
                const toggleBtn = document.createElement('img');
                toggleBtn.src = '/images/common/right_arrow_icon.png';
                toggleBtn.alt = 'トグル';
                toggleBtn.className = 'toggle-btn';

                categoryHeader.appendChild(categoryName);
                categoryHeader.appendChild(toggleBtn);
                categoryItem.appendChild(categoryHeader);
                
                const productsUl = document.createElement('ul');
                productsUl.className = 'products-sublist';
                productsUl.style.display = 'none'; // デフォルトで非表示
                categoryItem.appendChild(productsUl);

                let isCurrentCategory = false;

                category.products.forEach(product => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = product.main_page.url;
                    link.textContent = product.name;

                    const productUrlPath = product.main_page.url.replace(/\/+$/, '');
                    if (currentUrlPath.endsWith(productUrlPath)) {
                        link.classList.add('current-product');
                        isCurrentCategory = true;
                    }

                    listItem.appendChild(link);
                    productsUl.appendChild(listItem);
                });
                
                productList.appendChild(categoryItem);
                
                // 現在のページがこのカテゴリに属する場合、リストを開く
                if (isCurrentCategory) {
                    productsUl.style.display = 'block';
                    toggleBtn.style.transform = 'rotate(90deg)';
                }

                categoryHeader.addEventListener('click', () => {
                    if (productsUl.style.display === 'none') {
                        productsUl.style.display = 'block';
                        toggleBtn.style.transform = 'rotate(90deg)';
                        toggleBtn.style.paddingBottom = '10px'
                    } else {
                        productsUl.style.display = 'none';
                        toggleBtn.style.transform = 'rotate(0deg)';
                        toggleBtn.style.paddingBottom = '0'
                    }
                });
            });
        })
        .catch(error => {
            console.error('製品データの読み込みに失敗しました:', error);
            sidebarContainer.style.display = 'none';
        });
});