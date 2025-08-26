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
        // PC用カテゴリボタンのクラスを切り替え
        categoryTabsPC.forEach(tab => tab.classList.remove('active'));
        const activeTabPC = document.querySelector(`.category-tab[data-category="${category}"]`);
        if (activeTabPC) {
            activeTabPC.classList.add('active');
        }

        // モバイル用カテゴリボタンのクラスを切り替え
        categoryTabsMobile.forEach(tab => tab.classList.remove('active'));
        const activeTabMobile = document.querySelector(`.category-tab-mobile[data-category="${category}"]`);
        if (activeTabMobile) {
            activeTabMobile.classList.add('active');
        }

        // 製品アイテムの表示/非表示を切り替え
        productItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterProducts(initialCategory);

    // PC用カテゴリボタンのクリックイベント
    categoryTabsPC.forEach(tab => {
        tab.addEventListener('click', () => {
            const selectedCategory = tab.getAttribute('data-category');
            filterProducts(selectedCategory);
            window.history.pushState({ path: `?category=${selectedCategory}` }, '', `?category=${selectedCategory}`);
        });
    });

    // モバイル用カテゴリボタンのクリックイベント
    categoryTabsMobile.forEach(tab => {
        tab.addEventListener('click', () => {
            const selectedCategory = tab.getAttribute('data-category');
            filterProducts(selectedCategory);
            window.history.pushState({ path: `?category=${selectedCategory}` }, '', `?category=${selectedCategory}`);
            
            // カテゴリを選択したらメニューを閉じる
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
    let startX = 0;
    const swipeThreshold = 50; // スワイプと認識する距離 (px)

    // メニューを開く関数
    function openMobileMenu() {
        mobileMenu.classList.add('is-open');
        menuOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    // メニューを閉じる関数
    function closeMobileMenu() {
        mobileMenu.classList.remove('is-open');
        menuOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    // スワイプイベントリスナー
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        // 右へのスワイプでメニューを開く (画面左端付近で発火)
        if (deltaX > swipeThreshold && startX < 50) {
            openMobileMenu();
        }
        
        // 左へのスワイプでメニューを閉じる (メニューが開いている場合に発火)
        else if (deltaX < -swipeThreshold && mobileMenu.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });

    // 開閉ボタンのクリックイベント
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    if (mobileMenuToggleBtn) {
        mobileMenuToggleBtn.addEventListener('click', openMobileMenu);
    }
    
    // 閉じるボタンとオーバーレイのクリックイベント
    const closeBtn = document.getElementById('close-menu-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }
});