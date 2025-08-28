document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const resultsList = document.getElementById('results-list');
  const noResultsMessage = document.getElementById('no-results');

  let searchData = [];

  // 検索データを非同期で読み込む
  fetch('search-data.json')
    .then(response => response.json())
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
    performSearch();
  });

  // 検索を実行する関数
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    resultsList.innerHTML = ''; // 以前の結果をクリア

    if (query.length === 0) {
      noResultsMessage.style.display = 'none';
      return;
    }

    const filteredResults = searchData.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );

    if (filteredResults.length > 0) {
      filteredResults.forEach(item => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        li.appendChild(link);
        resultsList.appendChild(li);
      });
      noResultsMessage.style.display = 'none';
    } else {
      noResultsMessage.style.display = 'block';
    }
  }
});