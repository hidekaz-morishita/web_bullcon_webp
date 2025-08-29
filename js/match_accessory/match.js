// match.js
// このスクリプトは、2つのWeb APIエンドポイントと連携することを想定しています。
// 1. 車種情報を取得するAPI (例: /api/cars_data.php)
// 2. 適合品番を検索するAPI (例: /api/search_parts.php)

// データベースから車種情報を取得するAPIのURL
const CARS_API_URL = '../../api/get_car_type.php';
// 適合品番を検索するAPIのURL
const PARTS_API_URL = '../../api/get_match_televing.php';

// 月の固定データ
const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// Web APIから車種情報を取得
const carsDataPromise = fetch(CARS_API_URL)
    .then(response => {
        // HTTPステータスコードが200番台以外の場合、エラーを投げる
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // レスポンスをまずテキストとして取得
        return response.text();
    })
    .then(text => {
        try {
            const data = JSON.parse(text);
            const makers = Object.values(data);
            console.log("データベースから取得したデータ:", data);
            return makers;
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.error('Server response:', text);
            document.getElementById('message-container').textContent = '車種情報の取得に失敗しました。サーバーの応答が不正です。';
            return null;
        }
    })
    .catch(error => {
        console.error('Error fetching car data:', error);
        document.getElementById('message-container').textContent = `車種情報の取得に失敗しました: ${error.message}`;
        return null;
    });

// フォームの選択肢を動的に生成する関数
function populateOptions(selectElement, options, emptyOptionText) {
    selectElement.innerHTML = `<option value="">${emptyOptionText}</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
}

// 検索ボタンの有効/無効を切り替える関数
function updateSearchButtonState() {
    const selectedMaker = document.getElementById('maker-select').value;
    const selectedModel = document.getElementById('model-select').value;
    const selectedYear = document.getElementById('year-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    const searchButton = document.getElementById('search-button');

    if (selectedMaker && selectedModel && selectedYear && selectedMonth) {
        searchButton.disabled = false;
    } else {
        searchButton.disabled = true;
    }
}

// 検索結果表示エリアをリセットする関数
function resetResultArea() {
    const messageContainer = document.getElementById('message-container');
    const tableContainer = document.getElementById('results-table-container');

    if (messageContainer) {
        messageContainer.textContent = '検索結果がここに表示されます。';
        messageContainer.style.display = 'block';
    }
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }
}

// ページロード時にメーカーの選択肢を生成
document.addEventListener('DOMContentLoaded', async () => {
    const data = await carsDataPromise;
    if (data) {
        const makerNames = data.map(car => car.maker);
        const makerSelect = document.getElementById('maker-select');
        populateOptions(makerSelect, makerNames, 'メーカーを選択してください');
    }

    // 月のセレクトボックスにオプションを生成
    const monthSelect = document.getElementById('month-select');
    populateOptions(monthSelect, MONTHS, '月');
});

// メーカー選択時のイベントリスナー
document.getElementById('maker-select').addEventListener('change', async (event) => {
    resetResultArea();
    const selectedMaker = event.target.value;
    const data = await carsDataPromise;
    const modelSelect = document.getElementById('model-select');
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');

    modelSelect.innerHTML = '<option value="">車種を選択してください</option>';
    yearSelect.innerHTML = '<option value="">年</option>';
    monthSelect.value = '';

    modelSelect.disabled = !selectedMaker;
    yearSelect.disabled = true;
    monthSelect.disabled = true;
    updateSearchButtonState();

    if (selectedMaker) {
        const selectedMakerData = data.find(car => car.maker === selectedMaker);
        if (selectedMakerData) {
            const modelNames = selectedMakerData.models.map(model => model.name);
            populateOptions(modelSelect, modelNames, '車種を選択してください');
        }
    }
});

// 車種選択時のイベントリスナー
document.getElementById('model-select').addEventListener('change', async (event) => {
    resetResultArea();
    const selectedModelName = event.target.value;
    const selectedMaker = document.getElementById('maker-select').value;
    const data = await carsDataPromise;
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    
    yearSelect.innerHTML = '<option value="">年</option>';
    monthSelect.disabled = true;

    yearSelect.disabled = !selectedModelName;
    updateSearchButtonState();

    if (selectedModelName) {
        const selectedMakerData = data.find(car => car.maker === selectedMaker);
        if (selectedMakerData) {
            const selectedModel = selectedMakerData.models.find(model => model.name === selectedModelName);
            if (selectedModel) {
                const yearsArray = selectedModel.years;
                populateOptions(yearSelect, yearsArray, '年');
            }
        }
    }
});

// 年式選択時のイベントリスナー
document.getElementById('year-select').addEventListener('change', async (event) => {
    resetResultArea();
    const selectedYear = event.target.value;
    const monthSelect = document.getElementById('month-select');
    monthSelect.disabled = !selectedYear;
    updateSearchButtonState();
});

// 月選択時のイベントリスナー
document.getElementById('month-select').addEventListener('change', () => {
    resetResultArea();
    updateSearchButtonState();
});

// 適合品番検索ボタンのイベントリスナー
document.getElementById('search-button').addEventListener('click', async () => {
    const selectedMaker = document.getElementById('maker-select').value;
    const selectedModelName = document.getElementById('model-select').value;
    const selectedYearString = document.getElementById('year-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    const tableContainer = document.getElementById('results-table-container');
    const tableBody = document.querySelector('.result-table tbody');
    const messageContainer = document.getElementById('message-container');

    // 正規表現で年式文字列から4桁の西暦を柔軟に抽出
    // R3 / 2021のような形式にも対応
    const yearMatch = selectedYearString.match(/(\d{4})/);
    const selectedYear = yearMatch ? yearMatch[1] : null;
    
    // APIクエリ文字列を構築
    const query = `${PARTS_API_URL}?maker=${selectedMaker}&model=${selectedModelName}&year=${selectedYear}&month=${selectedMonth}`;
    console.log(query);
    
    if (messageContainer) {
        messageContainer.textContent = '適合品番を検索中...';
        messageContainer.style.display = 'block';
    }
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }

    try {
        const response = await fetch(query);
        
        if (!response.ok) {
            throw new Error(`検索に失敗しました。ステータス: ${response.status}`);
        }
        const partsData = await response.json();

        if (partsData.length > 0) {
            if (messageContainer) messageContainer.style.display = 'none';
            if (tableBody) {
                tableBody.innerHTML = '';
                partsData.forEach(part => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${part.col1}</td>
                        <td>${part.col2}</td>
                        <td>${part.col3}</td>
                        <td>${part.col4}</td>
                        <td>${part.col5}</td>
                        <td>${part.col6}</td>
                        <td>${part.col7}</td>
                        <td>${part.col8}</td>
                        <td>${part.col9}</td>
                        <td>${part.col10}</td>
                        <td>${part.col11}</td>
                        <td>${part.col12}</td>
                        <td>${part.col13}</td>
                        <td>${part.col14}</td>
                        <td>${part.col15}</td>
                        <td>${part.col16}</td>
                        <td>${part.col17}</td>
                        <td>${part.col18}</td>
                        <td>${part.col19}</td>
                        <td>${part.col20}</td>
                        <td>${part.col21}</td>
                        <td>${part.col22}</td>
                        <td>${part.caution_list.replace(/[{}]/g, '').replace(/,/g, '<br>')}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            if (tableContainer) tableContainer.style.display = 'block';
        } else {
            if (messageContainer) {
                messageContainer.textContent = 'お探しの条件に適合する品番は見つかりませんでした。';
                messageContainer.style.display = 'block';
            }
        }
    } catch (error) {
        if (messageContainer) {
            messageContainer.textContent = `検索中にエラーが発生しました: ${error.message}`;
            messageContainer.style.display = 'block';
        }
        if (tableContainer) tableContainer.style.display = 'none';
    }
});