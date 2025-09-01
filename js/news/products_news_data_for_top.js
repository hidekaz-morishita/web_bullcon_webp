const PRODUCTS_NEWS_API_URL_FOR_TOP = './api/get_products_news.php';
let productsNewsData = []; // ニュースデータを格納するグローバル変数

// ニュースデータをレンダリングする関数
const renderProductsNewsForTop = () => {
    const topNewsList = document.getElementById('products-announce-placeholder');

    if (!topNewsList) {
        console.error('Error: Element with ID "announce-placeholder" not found.');
        return;
    }

    // 最新3件のお知らせを取得
    const latestNews = productsNewsData.slice(0, 5);

    let newsHtml = '';
    latestNews.forEach(news => {
        // urlパラメータが存在するかどうかでタグとクラスを切り替える
        const itemTag = news.url ? 'a' : 'div';
        const hrefAttribute = news.url ? `href="${news.url}"` : '';
        const icon = news.url ? '<img src="./images/common/new_window_icon.png" class="new-window-icon">' : '';

        newsHtml += `
            <${itemTag} ${hrefAttribute} class="news-list-item ${news.url ? '' : 'non-clickable'}">
                <div class="news-main-line">
                    <time datetime="${news.date}">${news.date}</time>
                    <span class="news-title">${news.title}${icon}</span>
                </div>
            </${itemTag}>
        `;
    });

    topNewsList.innerHTML = `<div class="news-list-container">${newsHtml}</div>`;
};


// ニュースデータを取得する非同期関数
const fetchProductsNewsForTop = async () => {
    try {
        const response = await fetch(PRODUCTS_NEWS_API_URL_FOR_TOP);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productsNewsData = await response.json();
        /*productsNewsData = [
            {
                "id": 3,
                "date": "2027-08-22",
                "title": "ああああ",
                "summary": "ｔｔｔｔｔ",
                "url": ""
            },
            {
                "id": 1,
                "date": "2025-08-22",
                "title": "test＿ホームページをリニューアルしました。",
                "summary": "テストです",
                "url": "/web_test/html/products/CAR_ACCESSORY/sph/sph.htm"
            },
            {
                "id": 2,
                "date": "2025-08-22",
                "title": "test",
                "summary": "てｓつぇｔｓつぇつぇ",
                "url": ""
            }
        ]; // test*/
        console.log('取得したニュースデータ:', productsNewsData); // データの確認
        renderProductsNewsForTop(); // データを取得後、レンダリングを開始
    } catch (error) {
        console.error('ニュースデータの取得に失敗しました:', error);
        // エラーメッセージを表示するHTML要素を取得し、メッセージを挿入
        const container = document.getElementById('announce-placeholder');
        if (container) {
            container.innerHTML = '<p>ニュースの読み込みに失敗しました。時間をおいて再度お試しください。</p>';
        }
    }
};

// DOMContentLoadedはHTML要素が読み込まれた後に実行されることを保証します
document.addEventListener('DOMContentLoaded', () => {
    fetchProductsNewsForTop();
});