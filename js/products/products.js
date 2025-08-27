document.addEventListener('DOMContentLoaded', () => {
    //==================================
    // 製品ページの機能
    //==================================
    const categoryTabsPC = document.querySelectorAll('.category-tab');
    const categoryTabsMobile = document.querySelectorAll('.category-tab-mobile');
    const productItems = document.querySelectorAll('.product-item');
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || 'all';

    function filterProducts(category) {
        categoryTabsPC.forEach(tab => tab.classList.remove('active'));
        const activeTabPC = document.querySelector(`.category-tab[data-category="${category}"]`);
        if (activeTabPC) {
            activeTabPC.classList.add('active');
        }

        categoryTabsMobile.forEach(tab => tab.classList.remove('active'));
        const activeTabMobile = document.querySelector(`.category-tab-mobile[data-category="${category}"]`);
        if (activeTabMobile) {
            activeTabMobile.classList.add('active');
        }

        productItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterProducts(initialCategory);

    categoryTabsPC.forEach(tab => {
        tab.addEventListener('click', () => {
            const selectedCategory = tab.getAttribute('data-category');
            filterProducts(selectedCategory);
            window.history.pushState({ path: `?category=${selectedCategory}` }, '', `?category=${selectedCategory}`);
        });
    });

    categoryTabsMobile.forEach(tab => {
        tab.addEventListener('click', () => {
            const selectedCategory = tab.getAttribute('data-category');
            filterProducts(selectedCategory);
            window.history.pushState({ path: `?category=${selectedCategory}` }, '', `?category=${selectedCategory}`);
            closeMobileMenu();
        });
    });

    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        filterProducts(category);
    });

    //==================================
    // モバイル用スライドインメニュー
    //==================================
    const mobileMenu = document.getElementById('mobile-category-menu');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
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
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }
});