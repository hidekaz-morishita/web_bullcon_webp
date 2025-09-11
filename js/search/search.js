document.addEventListener('DOMContentLoaded', () => {
    // フォームと入力フィールドの要素をIDで取得
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    // 検索結果の表示要素
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
    if (resultsList && resultsList.parentNode) {
        resultsList.parentNode.insertBefore(resultsSummary, resultsList.nextSibling);
        resultsList.parentNode.insertBefore(paginationControls, resultsSummary.nextSibling);
    }

    let searchData = [];
    let filteredResults = [];
    let currentPage = 1;
    const resultsPerPage = 10;

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
            // URLからクエリパラメータを取得して検索を実行
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if (query) {
                searchInput.value = query; // 検索ボックスにキーワードをセット
                performSearch(query);
            }
        })
        .catch(error => {
            console.error('Error loading search data:', error);
            noResultsMessage.textContent = '検索データの読み込みに失敗しました。';
            noResultsMessage.style.display = 'block';
        });

    // フォームの送信イベントを処理
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentPage = 1; // 検索ごとにページをリセット
            const query = searchInput.value.trim();
            // 検索ページ内での検索時にURLを更新
            window.history.pushState({}, '', `?q=${encodeURIComponent(query)}`);
            performSearch(query);
        });
    }

    // 検索を実行する関数
    function performSearch(query) {
        if (!query) {
            resultsSection.style.display = 'none';
            return;
        }

        resultsSection.style.display = 'block';

        filteredResults = searchData.filter(item =>
            (item.title && item.title.toLowerCase().includes(query.toLowerCase())) ||
            (item.keywords && item.keywords.toLowerCase().includes(query.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );
        
        filteredResults.sort((a, b) => {
            const aTitleMatch = a.title && a.title.toLowerCase().includes(query.toLowerCase());
            const bTitleMatch = b.title && b.title.toLowerCase().includes(query.toLowerCase());

            if (aTitleMatch && !bTitleMatch) {
                return -1;
            }
            if (!aTitleMatch && bTitleMatch) {
                return 1;
            }
            return 0;
        });

        renderResults();
    }

    // 検索結果を表示する関数
    function renderResults() {
        if (!resultsList || !resultsSummary || !paginationControls) {
            console.error("検索結果のDOM要素が見つかりません。");
            return;
        }

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

            const absoluteUrl = link.href;

            const resultUrl = document.createElement('span');
            resultUrl.classList.add('result-url');
            resultUrl.textContent = absoluteUrl;
            
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
            window.scrollTo({ top: 150, behavior: 'smooth' });
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = '次へ';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            currentPage++;
            renderResults();
            window.scrollTo({ top: 150, behavior: 'smooth' });
        });

        paginationControls.appendChild(prevButton);
        paginationControls.appendChild(nextButton);
    }
});