const PRODUCTS_NEWS_API_URL_FOR_DETAIL = '../../api/get_products_news.php';

// news_list_page.js の中身
let productsNewsData = []; // ニュースデータを格納するグローバル変数

document.addEventListener('DOMContentLoaded', () => {
    const newsListSection = document.getElementById('products-news-section-placeholder');
    
    // 表示するアイテムの初期数と増加数を設定
    let itemsToShow = 5;
    const itemsToAdd = 10;

    // もっと見るボタンを作成
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'もっと見る';
    loadMoreButton.className = 'load-more-button';

    const renderNews = () => {
        // 表示するお知らせの配列を切り出し
        const displayedNews = productsNewsData.slice(0, itemsToShow);

        const newsListHtml = displayedNews.map(news => {
            const itemTag = news.url ? 'a' : 'div';
            const hrefAttribute = news.url ? `href="${news.url}"` : '';
            const icon = news.url ? '<img src="../../images/common/new_window_icon.png" class="new-window-icon">' : '';

            return `
                <${itemTag} ${hrefAttribute} class="news-list-item ${news.url ? '' : 'non-clickable'}">
                    <div class="news-main-line">
                        <time datetime="${news.date}">${news.date}</time>
                        <span class="news-title">${news.title}${icon}</span>
                    </div>
                    ${news.summary}
                </${itemTag}>
            `;
        }).join('');

        newsListSection.innerHTML = `
            <div class="news-list-container">
                ${newsListHtml}
            </div>
        `;

        // 全てのお知らせが表示されたらボタンを非表示にする
        if (itemsToShow < productsNewsData.length) {
            newsListSection.parentElement.appendChild(loadMoreButton);
        } else {
            if (loadMoreButton.parentNode) {
                loadMoreButton.parentNode.removeChild(loadMoreButton);
            }
        }
    };

    // もっと見るボタンがクリックされた時の処理
    loadMoreButton.addEventListener('click', () => {
        itemsToShow += itemsToAdd;
        renderNews();
    });

    // ニュースデータを取得する非同期関数
    const fetchNews = async () => {
        try {
            const response = await fetch(PRODUCTS_NEWS_API_URL_FOR_DETAIL);
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
                "title": "LED HEAD LAMP GLORIOUS の新発売",
                "summary": `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <p style="font-size: 12px; color: #e50020; font-weight: bold; margin-top: 0; margin-bottom: 20px;">
                        <span style="font-size: 14px; font-weight: normal; color: #666;">（新製品）</span>
                        驚異の明るさと長寿命！
                    </p>

                    <div style="margin-bottom: 16px;">
                        <h4 style="font-size: 12px; color: #333;  margin-bottom: 10px;">ハロゲン交換タイプ</h4>
                        <ul style="list-style: none; padding-left: 0; margin: 0;">
                            <li style="margin-bottom: 5px;">
                                <span style="font-size: 8px; color: #000;">LED HEAD LAMP GLORIOUS</span>
                            </li>
                            <li>
                                <span style="font-size: 8px; color: #000;">【H4】【H11】</span>
                            </li>
                        </ul>
                    </div>`,
                "url": ""
            }
        ]; // test*/
            console.log('取得したニュースデータ:', productsNewsData); // データの確認
            renderNews(); // データを取得後、レンダリングを開始
        } catch (error) {
            console.error('ニュースデータの取得に失敗しました:', error);
            newsListSection.innerHTML = '<p>ニュースの読み込みに失敗しました。時間をおいて再度お試しください。</p>';
        }
    };

    // 初回実行
    fetchNews();
});