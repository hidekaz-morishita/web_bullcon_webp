const NEWS_API_URL_FOR_TOP = './api/get_news.php';
let newsData = []; // ニュースデータを格納するグローバル変数

// ニュースデータをレンダリングする関数
const renderNewsForTop = () => {
    const topNewsList = document.getElementById('announce-placeholder');

    if (!topNewsList) {
        console.error('Error: Element with ID "announce-placeholder" not found.');
        return;
    }

    // 最新3件のお知らせを取得
    const latestNews = newsData.slice(0, 5);

    let newsHtml = '';
    latestNews.forEach(news => {
        // urlパラメータが存在するかどうかでタグとクラスを切り替える
        const itemTag = news.url ? 'a' : 'div';
        const hrefAttribute = news.url ? `href="${news.url}"` : '';
        const icon = news.url ? '<img src="./images/common/new_window_icon.png" class="new-window-icon">' : '';

        newsHtml += `
            <${itemTag} ${hrefAttribute} class="news-list-item ${news.url ? '' : 'non-clickable'}">
                <div class="news-main-line"> <time datetime="${news.date}">${news.date}</time>
                    <span class="news-title">${news.title}${icon}</span>
                </div>
            </${itemTag}>
        `;
    });

    topNewsList.innerHTML = `<div class="news-list-container">${newsHtml}</div>`;
};


// ニュースデータを取得する非同期関数
const fetchNewsForTop = async () => {
    try {
        const response = await fetch(NEWS_API_URL_FOR_TOP);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        newsData = await response.json();
        /*newsData = [
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
        console.log('取得したニュースデータ:', newsData); // データの確認
        renderNewsForTop(); // データを取得後、レンダリングを開始
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
    fetchNewsForTop();
});