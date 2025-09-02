// match.js
// このスクリプトは、2つのWeb APIエンドポイントと連携することを想定しています。
// 1. 車種情報を取得するAPI (例: /api/get_car_type.php)
// 2. 適合品番を検索するAPI (例: /api/get_match.php)

// データベースから車種情報を取得するAPIのURL
const CARS_API_URL = '../../api/get_car_type.php';

// 適合品番を検索するAPIの共通URL
const MATCH_API_URL = '../../api/get_match.php';

// ★修正: 検索対象の製品情報と、それに紐づく適合表のカラム情報をオプションタイプ別に定義
// 統一されたAPIを使用するため、個別のAPI URLはPRODUCTS_DATAから削除
const PRODUCTS_DATA = {
    'FreeTVing': {
        name: 'フリーテレビング/テレナビング',
        productKey: 'televing', // APIに渡す製品識別子

        // メーカーオプションの結合ヘッダー定義
        makerHeader: [
            { label: '共通情報', subHeaders: [
                { key: 'col1', label: 'メーカー' },
                { key: 'col2', label: '車名' },
                { key: 'col3', label: '年式' },
                { key: 'col4', label: '型式' },
                { key: 'col5', label: 'ナビ種類' }
            ]},
            { label: 'オートタイプ', subHeaders: [
                { key: 'col6', label: '品番' },
                { key: 'col7', label: 'ナビ操作' },
                { key: 'col8', label: '自車位置' }
            ]},
            { label: '切替タイプ', subHeaders: [
                { key: 'col9', label: '小型LEDｽｲｯﾁ品番' },
                { key: 'col10', label: 'ｻｰﾋﾞｽﾎｰﾙｽｲｯﾁ品番' },
                { key: 'col11', label: 'ｽﾃｱﾘﾝｸﾞｽｲｯﾁ品番' },
                { key: 'col12', label: 'ナビ操作' },
                { key: 'col13', label: '自車位置' },
                { key: 'col14', label: 'DVD視聴' },
                { key: 'col15', label: '取付場所' }
            ]},
            { label: '注意事項', subHeaders: [
                { key: 'col23', label: '備考' }
            ]}
        ],
        // ディーラーオプションの結合ヘッダー定義
        dealerHeader: [
            { label: '共通情報', subHeaders: [
                { key: 'col1', label: 'メーカー' },
                { key: 'col2', label: '車名' },
                { key: 'col3', label: '年式' },
                { key: 'col4', label: '型式' },
                { key: 'col5', label: 'ナビ種類' }
            ]},
            { label: '品番', subHeaders: [
                { key: 'col16', label: '交換用ｵﾌﾟｼｮﾝｽｲｯﾁ品番' },
                { key: 'col17', label: '小型LEDｽｲｯﾁ切替ﾀｲﾌﾟ品番' },
                { key: 'col18', label: 'ｻｰﾋﾞｽﾎｰﾙｽｲｯﾁ切替ﾀｲﾌﾟ品番' },
                { key: 'col19', label: 'DVD視聴' }
            ]},
            { label: '取付場所', subHeaders: [
                { key: 'col20', label: 'TV' },
                { key: 'col21', label: 'ナビ' },
                { key: 'col22', label: '交換用ｽｲｯﾁ' }
            ]},
            { label: '注意事項', subHeaders: [
                { key: 'col23', label: '備考' }
            ]}
        ],
    },
    // 他の製品情報も同様に追加できます
};

// 月の固定データ
const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// Web APIから車種情報を取得
const carsDataPromise = fetch(CARS_API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
    const selectedProduct = document.getElementById('product-select').value;
    const selectedMaker = document.getElementById('maker-select').value;
    const selectedModel = document.getElementById('model-select').value;
    const selectedYear = document.getElementById('year-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    const searchButton = document.getElementById('search-button');

    const isMakerOption = document.getElementById('maker-option').checked;
    const isDealerOption = document.getElementById('dealer-option').checked;
    
    if (selectedProduct && (isMakerOption || isDealerOption) && selectedMaker && selectedModel && selectedYear && selectedMonth) {
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

// ページロード時に製品の選択肢を生成
document.addEventListener('DOMContentLoaded', async () => {
    const productSelect = document.getElementById('product-select');
    const productNames = Object.values(PRODUCTS_DATA).map(p => p.name);
    populateOptions(productSelect, productNames, '製品を選択してください');
    
    // 他の要素の初期化
    const data = await carsDataPromise;
    if (data) {
        const makerNames = data.map(car => car.maker);
        const makerSelect = document.getElementById('maker-select');
        populateOptions(makerSelect, makerNames, 'メーカーを選択してください');
    }

    const monthSelect = document.getElementById('month-select');
    populateOptions(monthSelect, MONTHS, '月');
});

// 製品選択時のイベントリスナー
document.getElementById('product-select').addEventListener('change', () => {
    resetResultArea();
    const productSelect = document.getElementById('product-select');
    const makerSelect = document.getElementById('maker-select');
    
    // 製品が選択されたら、メーカー選択を有効化
    makerSelect.disabled = !productSelect.value;
    updateSearchButtonState();
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

// ラジオボタンの変更時に検索ボタンの状態を更新
document.getElementById('maker-option').addEventListener('change', updateSearchButtonState);
document.getElementById('dealer-option').addEventListener('change', updateSearchButtonState);


// 適合品番検索ボタンのイベントリスナー
document.getElementById('search-button').addEventListener('click', async () => {
    const selectedProduct = document.getElementById('product-select').value;
    const selectedMaker = document.getElementById('maker-select').value;
    const selectedModelName = document.getElementById('model-select').value;
    const selectedYearString = document.getElementById('year-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    
    const tableContainer = document.getElementById('results-table-container');
    const messageContainer = document.getElementById('message-container');

    const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
    if (!productInfo) {
        console.error('選択された製品が見つかりません。');
        return;
    }
    const productKey = productInfo.productKey;
    
    // 選択されたオプションタイプに基づいてAPIに渡すパラメータを設定
    const isMakerOption = document.getElementById('maker-option').checked;
    const optionKey = isMakerOption ? 'maker' : 'dealer';
    const headerData = isMakerOption ? productInfo.makerHeader : productInfo.dealerHeader;

    const yearMatch = selectedYearString.match(/(\d{4})/);
    const selectedYear = yearMatch ? yearMatch[1] : null;

    // APIクエリ文字列を構築
    const query = `${MATCH_API_URL}?product=${productKey}&option=${optionKey}&maker=${selectedMaker}&model=${selectedModelName}&year=${selectedYear}&month=${selectedMonth}`;
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
            // 動的なテーブル生成関数を呼び出し、ヘッダー情報も渡す
            generateTable(partsData, headerData);
            if (tableContainer) tableContainer.style.display = 'block';
        } else {
            if (messageContainer) {
                messageContainer.textContent = 'お探しの条件に適合する品番は見つかりませんでした。';
                messageContainer.style.display = 'block';
            }
            if (tableContainer) tableContainer.style.display = 'none';
        }
    } catch (error) {
        if (messageContainer) {
            messageContainer.textContent = `検索中にエラーが発生しました: ${error.message}`;
            messageContainer.style.display = 'block';
        }
        if (tableContainer) tableContainer.style.display = 'none';
    }
});

// ★修正: 検索結果から動的にテーブルを生成する関数
// 2行のヘッダーを生成するように変更
function generateTable(data, headerData) {
    const table = document.querySelector('.result-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // 既存のテーブルをクリア
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // 1行目のヘッダー（結合ヘッダー）を生成
    const mainHeaderRow = document.createElement('tr');
    headerData.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.label;
        th.setAttribute('colspan', header.subHeaders.length);
        mainHeaderRow.appendChild(th);
    });
    thead.appendChild(mainHeaderRow);

    // 2行目のヘッダー（サブヘッダー）を生成
    const subHeaderRow = document.createElement('tr');
    headerData.forEach(header => {
        header.subHeaders.forEach(subHeader => {
            const th = document.createElement('th');
            th.textContent = subHeader.label;
            subHeaderRow.appendChild(th);
        });
    });
    thead.appendChild(subHeaderRow);

    // テーブルボディを生成
    data.forEach(item => {
        const row = document.createElement('tr');
        // ヘッダー情報からキーのフラットなリストを作成してボディを生成
        const allColumns = headerData.flatMap(header => header.subHeaders);
        allColumns.forEach(col => {
            const td = document.createElement('td');
            // 注意事項カラムは、文字列を加工して表示
            if (col.key === 'col23') {
                td.innerHTML = (item[col.key] || '').replace(/[{}]/g, '').replace(/,/g, '<br>');
            } else {
                td.textContent = item[col.key] || '';
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}