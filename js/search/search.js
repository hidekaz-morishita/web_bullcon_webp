document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsSection = document.querySelector('.results-section');
    const resultsList = document.getElementById('results-list');
    const noResultsMessage = document.getElementById('no-results');
    const resultsSummary = document.createElement('div');
    resultsSummary.classList.add('results-summary');
    const paginationControls = document.createElement('div');
    paginationControls.classList.add('pagination-controls');
    
    // 検索結果のコンテナを最初から非表示にする
    resultsSection.style.display = 'none';

    // 検索結果リストの直後に概要とページネーションの要素を追加
    resultsList.parentNode.insertBefore(resultsSummary, resultsList.nextSibling);
    resultsList.parentNode.insertBefore(paginationControls, resultsSummary.nextSibling);

    let searchData = [];
    let filteredResults = [];
    let currentPage = 1;
    const resultsPerPage = 10;

    // ご提供いただいたURLのフォルダ名と日本語カテゴリ名のマッピングを定義
    const categoryMap = {
        'TVING': 'フリーテレビング/テレナビング',
        'MAGICONE': 'マジコネ',
        'LED_BULB': 'LEDバルブ/ルームランプ',
        'AV_ACCESSORY': 'AVアクセサリー',
        'CAR_ACCESSORY': 'カーアクセサリー',
        'CAMERA': 'カメラ',
        'MONITER': 'モニター',
        'HDMI_USB': 'HDMI・USB関係',
        'POWER': '電源関係'
    };

    // 検索データを非同期で読み込む
    fetch('search-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            searchData = data;
        })
        .catch(error => {
            console.error('Error loading search data:', error);
            noResultsMessage.textContent = '検索データの読み込みに失敗しました。';
            noResultsMessage.style.display = 'block';
        });

    // フォームの送信イベントを処理
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1; // 検索ごとにページをリセット
        performSearch();
    });

    // 検索を実行する関数
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        // 検索結果セクションを表示
        resultsSection.style.display = 'block';

        if (query.length === 0) {
            resultsList.innerHTML = '';
            noResultsMessage.style.display = 'none';
            resultsSummary.innerHTML = '';
            paginationControls.innerHTML = '';
            return;
        }

        // 検索結果をフィルタリング
        filteredResults = searchData.filter(item =>
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.keywords && item.keywords.toLowerCase().includes(query)) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
        
        // 検索結果を並び替え（タイトルでのマッチを優先）
        filteredResults.sort((a, b) => {
            const aTitleMatch = a.title && a.title.toLowerCase().includes(query);
            const bTitleMatch = b.title && b.title.toLowerCase().includes(query);

            if (aTitleMatch && !bTitleMatch) {
                return -1; // a を b より前に
            }
            if (!aTitleMatch && bTitleMatch) {
                return 1; // b を a より前に
            }
            return 0; // その他の場合は順序を変えない
        });

        renderResults();
    }

    // 検索結果を表示する関数
    function renderResults() {
        resultsList.innerHTML = '';
        resultsSummary.innerHTML = '';
        paginationControls.innerHTML = '';

        if (filteredResults.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        } else {
            noResultsMessage.style.display = 'none';
        }

        const totalResults = filteredResults.length;
        const start = (currentPage - 1) * resultsPerPage;
        const end = Math.min(start + resultsPerPage, totalResults);
        const resultsToDisplay = filteredResults.slice(start, end);

        // 検索結果件数と表示範囲の表示
        const summaryText = `${totalResults}件中${start + 1}〜${end}件目を表示`;
        resultsSummary.textContent = summaryText;

        resultsToDisplay.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('result-item');
            
            const link = document.createElement('a');
            link.href = item.url;
            link.classList.add('result-link');
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const resultTitle = document.createElement('h3');
            resultTitle.classList.add('result-title');
            resultTitle.textContent = item.title;

            const resultDescription = document.createElement('p');
            resultDescription.classList.add('result-description');
            resultDescription.textContent = item.description;

            // URLを絶対パスに変換
            const absoluteUrl = link.href;

            const resultUrl = document.createElement('span');
            resultUrl.classList.add('result-url');
            resultUrl.textContent = absoluteUrl;

            // 正規表現を使い、URLからカテゴリ名を正確に抽出
            const urlMatch = item.url.match(/\/products\/([^\/]+)\//i); // iフラグで大文字・小文字を無視
            let categoryKey = null;
            if (urlMatch && urlMatch[1]) {
                categoryKey = urlMatch[1].toUpperCase(); // キーを大文字に統一
            }
            
            // カテゴリを判別し、存在すればラベルを追加
            const categoryLabel = categoryMap[categoryKey] || null;
            if (categoryLabel) {
                const categorySpan = document.createElement('span');
                categorySpan.classList.add('result-category');
                categorySpan.textContent = `[${categoryLabel}]`;
                resultTitle.appendChild(categorySpan);
            }
            
            link.appendChild(resultTitle);
            if (item.description) {
                link.appendChild(resultDescription);
            }
            link.appendChild(resultUrl);

            li.appendChild(link);
            resultsList.appendChild(li);
        });

        renderPagination();
    }

    // ページネーションコントロールを表示する関数
    function renderPagination() {
        const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
        
        if (totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }

        const prevButton = document.createElement('button');
        prevButton.textContent = '前へ';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            currentPage--;
            renderResults();
            window.scrollTo({ top: 150, behavior: 'smooth' }); // ページトップへスムーズにスクロール
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = '次へ';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            currentPage++;
            renderResults();
            window.scrollTo({ top: 150, behavior: 'smooth' }); // ページトップへスムーズにスクロール
        });

        paginationControls.appendChild(prevButton);
        paginationControls.appendChild(nextButton);
    }
});