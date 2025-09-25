// search/common_search.js

export function setupSearch(options) {
    const { tabId, dataPath, filterLogic, onDataLoaded, isManualSearch = false } = options;
    const tabContent = document.getElementById(tabId);
    const form = tabContent.querySelector('.search-form');
    const input = tabContent.querySelector('.search-input');
    const resultsList = tabContent.querySelector('.results-list');
    const noResultsMessage = tabContent.querySelector('.no-results');

    // ヘッダー検索の検索文字表示ロジック
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q'); // ヘッダー検索で使われているクエリパラメータ名（例：'q'）を指定
    if (initialQuery) {
        input.value = initialQuery; // 検索フィールドに値を設定
    }

    let searchData = null;

    // データ取得
    fetch(dataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            searchData = data;
            console.log(`LOG: Data loaded for ${tabId}.`);
            onDataLoaded(searchData, input, performSearch);

            if (initialQuery) {
                performSearch(initialQuery);
            }
        })
        .catch(error => {
            console.error(`Error loading data for ${tabId}:`, error);
            // エラー表示処理
        });

    // 検索実行関数
    const performSearch = (query) => {
        if (!searchData) {
            return;
        }

        const filteredResults = filterLogic(query, searchData);
        displayResults(filteredResults);
    };

    // 結果表示関数
    const displayResults = (results) => {
        resultsList.innerHTML = '';
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }

        if (results.length === 0) {
            if (noResultsMessage) {
                noResultsMessage.style.display = 'block';
            }
            return;
        }

        results.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.target = '_brank';
            if (isManualSearch) {
                if (item.manual_url) {
                    const absoluteUrl = new URL(item.manual_url, window.location.href).href;
                    link.href = item.manual_url;
                    link.innerHTML = `
                        <div class="result-product-name">${item.product_name}</div>
                        <div class="result-title">${item.product_code}　<img src="../../images/common/pdf_icon.webp"></div>
                        <div class="result-url">${absoluteUrl}</div>
                    `;
                } else if (item.url) {
                    link.href = item.url;
                    link.innerHTML = `
                        <div class="result-product-name">${item.product_name}</div>
                        <div class="result-title">${item.product_code}　<img src="../../images/common/new_window_icon.png"></div>
                        <div class="result-url">取扱説明については詳細ページ をご確認ください。</div>
                    `;
                } else {
                    link.href = '../contact/contact.html';
                    link.innerHTML = `
                        <div class="result-product-name">${item.product_name}</div>
                        <div class="result-title">${item.product_code}</div>
                        <div class="result-url">申し訳ございませんが、本商品の詳細についてはお問い合わせよりご連絡ください。<br><span style=color:red;>※クリックでお問い合わせページを開きます。</span></div>
                    `;
                }
                
            } else {
                const absoluteUrl = new URL(item.url, window.location.href).href;
                link.href = item.url;
                link.innerHTML = `
                    <div class="result-title">${item.title}</div>
                    <!-- <div class="result-description">${item.description}</div> -->
                    <div class="result-url">${absoluteUrl}</div>
                `;
            }
            li.appendChild(link);
            resultsList.appendChild(li);
        });
    };

    // フォーム送信イベントの処理
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = input.value.trim();
        if (query) {
            performSearch(query);
        }
    });
}