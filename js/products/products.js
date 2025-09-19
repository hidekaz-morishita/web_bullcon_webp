document.addEventListener('DOMContentLoaded', () => {
    //==================================
    // 製品ページの機能
    //==================================
    const productGrid = document.querySelector('.product-grid');
    const categoryListPC = document.getElementById('category-list');
    const categoryListMobile = document.getElementById('mobile-category-list');
    const urlParams = new URLSearchParams(window.location.search);
    let initialCategory = urlParams.get('category');
    
    // JSONデータをフェッチして製品情報を動的に生成
    fetch('../../html/products/products_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const categories = data.products_data.categories;
            
            // カテゴリリストに「すべて」を追加
            const allCategory = { id: 'all', name: 'すべて', url: '/html/products/products.html?category=all' };
            const allCategoryItemPC = createCategoryButton(allCategory, false);
            const allCategoryItemMobile = createCategoryButton(allCategory, true);
            categoryListPC.appendChild(allCategoryItemPC);
            categoryListMobile.appendChild(allCategoryItemMobile);

            // JSONデータからカテゴリリストを生成
            categories.forEach(category => {
                categoryListPC.appendChild(createCategoryButton(category, false));
                categoryListMobile.appendChild(createCategoryButton(category, true));
            });

            // JSONデータから製品リストを生成
            renderProducts(categories);

            // URLパラメータに基づいて初期カテゴリを設定
            if (!initialCategory || !categories.find(cat => cat.id === initialCategory)) {
                initialCategory = 'all';
            }
            filterProducts(initialCategory);

            // カテゴリボタンのイベントリスナーを設定（動的に生成された要素に対して）
            document.querySelectorAll('.category-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const selectedCategory = event.target.getAttribute('data-category-id');
                    filterProducts(selectedCategory);
                    window.history.pushState({ path: `?category=${selectedCategory}` }, '', `?category=${selectedCategory}`);
                    
                    // モバイルメニューがアクティブな場合は閉じる
                    if (document.getElementById('mobile-category-menu').classList.contains('is-open')) {
                        closeMobileMenu();
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching product data:', error));

    // カテゴリボタンを作成するヘルパー関数
    function createCategoryButton(category, isMobile) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = category.name;
        button.classList.add('category-button');
        if (isMobile) {
            button.classList.add('category-tab-mobile');
        } else {
            button.classList.add('category-tab');
        }
        button.setAttribute('data-category', category.id);
        button.setAttribute('data-category-id', category.id);
        li.appendChild(button);
        return li;
    }

    // 製品リストをレンダリングする関数
    function renderProducts(categories) {
        productGrid.innerHTML = '';
        categories.forEach(category => {
            category.products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item', category.id);
                
                const productLink = document.createElement('a');
                productLink.href = product.main_page.url;
                
                const productImageContainer = document.createElement('div');
                productImageContainer.classList.add('product-image-container');
                const productImage = document.createElement('img');
                productImage.src = `${product.image_path}`;
                productImage.alt = product.name;
                productImageContainer.appendChild(productImage);
                
                const productDetails = document.createElement('div');
                productDetails.classList.add('product-details');
                const productTitle = document.createElement('h3');
                productTitle.classList.add('product-title');
                productTitle.textContent = product.name;
                const productDescription = document.createElement('p');
                productDescription.classList.add('product-description');
                productDescription.textContent = product.short_description;
                
                productDetails.appendChild(productTitle);
                productDetails.appendChild(productDescription);
                
                productLink.appendChild(productImageContainer);
                productLink.appendChild(productDetails);
                
                productItem.appendChild(productLink);
                productGrid.appendChild(productItem);
            });
        });
    }

    // 製品をカテゴリでフィルタリングする関数
    function filterProducts(category) {
        const allButtons = document.querySelectorAll('.category-button');
        allButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll(`[data-category="${category}"]`).forEach(btn => btn.classList.add('active'));

        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        filterProducts(category);
    });

    //==================================
    // モバイル用スライドインメニュー
    //==================================
    const mobileMenu = document.getElementById('mobile-category-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    let startX = 0;
    const swipeThreshold = 50;

    // メニューを開く関数
    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add('is-open');
        if (menuOverlay) menuOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        mobileMenuToggleBtn.classList.add('is-active');
    }

    // メニューを閉じる関数
    function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove('is-open');
        if (menuOverlay) menuOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
        mobileMenuToggleBtn.classList.remove('is-active');
    }

    // スワイプイベントリスナー
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (deltaX > swipeThreshold && startX < 50) {
            openMobileMenu();
        } else if (deltaX < -swipeThreshold && mobileMenu && mobileMenu.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });

    // 開閉ボタンのクリックイベント
    if (mobileMenuToggleBtn) {
        mobileMenuToggleBtn.addEventListener('click', () => {
            if (mobileMenu && mobileMenu.classList.contains('is-open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    // 閉じるボタンとオーバーレイのクリックイベント
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
    // ここがオーバーレイをタップして閉じる機能
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }
});