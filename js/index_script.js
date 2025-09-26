document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの開閉
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.header-nav');

    if (hamburger && nav) { // 要素が存在するか確認
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // カルーセルの動き
    const paginationContainer = document.querySelector('.hero-pagination');
    let currentSlide = 0;
    let autoSlideInterval;

    // 初回表示とリサイズイベントを扱う関数
    const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        // PCまたはモバイルのスライド要素を取得
        const slides = document.querySelectorAll(isMobile ? '.slider-item-mobile' : '.slider-item');

        if (slides.length === 0 || !paginationContainer) {
            // スライダー関連の要素がない場合は、処理を終了
            return;
        }

        // 既存のページネーションをクリア
        paginationContainer.innerHTML = '';

        // ページネーションの点を動的に生成
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('pagination-dot');
            dot.addEventListener('click', () => {
                showSlide(slides, dots, index);
                resetAutoSlide();
            });
            paginationContainer.appendChild(dot);
        });

        // ドット要素を再取得
        const dots = document.querySelectorAll('.pagination-dot');
        showSlide(slides, dots, currentSlide); // ページ表示時に現在のスライドを表示
        startAutoSlide(); // 自動スライドを再開
    };

    function showSlide(slides, dots, index) {
        slides.forEach(slide => slide.style.opacity = 0);
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].style.opacity = 1;
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        // 次のスライドに切り替える際も、現在のスライドセットを再取得
        const isMobile = window.innerWidth < 768;
        const slides = document.querySelectorAll(isMobile ? '.slider-item-mobile' : '.slider-item');
        const dots = document.querySelectorAll('.pagination-dot');
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(slides, dots, currentSlide);
    }

    // 自動スライド機能
    const startAutoSlide = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    // 初期表示とリサイズイベントを設定
    window.addEventListener('resize', handleResize);
    handleResize(); // 初回ロード時にも実行
});
