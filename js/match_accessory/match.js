import { DEALER_YEARS, CAR_YEARS, MONTHS } from './additional_info.js';
import { CAR_TYPE } from './car_model.js';
import { PRODUCTS_DATA } from './products_mapper.js';
import { NOTES_DATA } from './caution_note.js';


// 適合品番を検索するAPIの共通URL
const MATCH_API_URL = '../../api/get_products_compatibility.php';

// 選択肢を動的に生成する関数
function populateOptions(selectElement, options, emptyOptionText) {
    selectElement.innerHTML = `<option value="">${emptyOptionText}</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
}

// 検索ボタンの有効/無効を更新する関数
function updateSearchButtonState() {
    const selectedProduct = document.getElementById('product-select').value;
    const selectedMaker = document.getElementById('maker-select').value;
    const selectedYear = document.getElementById('year-select').value;
    
    const selectedProductInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
    if (!selectedProductInfo) return;

    const selectedOptionType = document.querySelector('input[name="option-type"]:checked')?.value;
    const processType = selectedOptionType ? selectedProductInfo.optionFlows[selectedOptionType]?.processType : null;

    let allFieldsFilled = false;
    if (processType === 'carModel') {
        const selectedModel = document.getElementById('model-select').value;
        const selectedMonth = document.getElementById('month-select').value;
        allFieldsFilled = selectedProduct && selectedMaker && selectedModel && selectedYear && selectedMonth;
    } else if (processType === 'dealerYears') {
        allFieldsFilled = selectedProduct && selectedMaker && selectedYear;
    }

    document.getElementById('search-button').disabled = !allFieldsFilled;
}

// 検索結果エリアをリセットする関数
function resetResultArea() {
    const messageContainer = document.getElementById('message-container');
    const tableContainer = document.getElementById('results-table-container');
    const notesContainer = document.getElementById('notes-list-container');
    const pdfLinkContainer = document.getElementById('pdf-link-container');

    if (messageContainer) {
        messageContainer.textContent = '検索結果がここに表示されます。';
        messageContainer.style.display = 'block';
    }
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }
    if (notesContainer) {
        notesContainer.style.display = 'none';
    }
    if (pdfLinkContainer) {
        pdfLinkContainer.innerHTML = '';
        pdfLinkContainer.style.display = 'none';
    }
}

// 全ての入力欄をリセットし、初期状態に戻す関数
function resetAllFields() {
    // ラジオボタンをリセット
    const optionRadios = document.querySelectorAll('input[name="option-type"]');
    optionRadios.forEach(radio => radio.checked = false);

    // ドロップダウンをリセット
    const selectFields = document.querySelectorAll('select');
    selectFields.forEach(select => {
        select.selectedIndex = 0;
        select.disabled = true; // ドロップダウンを再度無効化
    });

    // 関連するフォームグループを非表示に
    document.getElementById('option-group').style.display = 'none';
    document.getElementById('maker-group').style.display = 'none';
    document.getElementById('model-group').style.display = 'none';
    document.getElementById('year-month-group').style.display = 'none';
    document.getElementById('search-button').disabled = true;

    // 検索結果エリアもリセット
    resetResultArea();
}

// DOM読み込み後の初期処理
document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('product-select');
    const productNames = Object.values(PRODUCTS_DATA).map(p => p.name);
    populateOptions(productSelect, productNames, '製品を選択してください');
    
    // 初期状態では製品選択以外は非表示
    resetAllFields();
    productSelect.disabled = false; // 製品選択だけは有効にする
});

// 製品選択のイベントリスナー
document.getElementById('product-select').addEventListener('change', () => {
    // 製品名以外の要素をリセットし、表示を制御
    document.getElementById('maker-select').selectedIndex = 0;
    document.getElementById('model-select').selectedIndex = 0;
    document.getElementById('year-select').selectedIndex = 0;
    document.getElementById('month-select').selectedIndex = 0;
    document.getElementById('maker-option').checked = true; // メーカーオプションをデフォルトで選択

    document.getElementById('option-group').style.display = 'block';
    
    // デフォルトでメーカーオプションが選択されているため、手動でメーカー選択肢を表示
    const makerSelect = document.getElementById('maker-select');
    const makerNames = Object.keys(CAR_TYPE);
    document.getElementById('maker-group').style.display = 'block';
    makerSelect.disabled = false;
    populateOptions(makerSelect, makerNames, 'メーカーを選択してください');
    
    resetResultArea();
    updateSearchButtonState();
});

// オプション（メーカー/ディーラー）選択のイベントリスナー
document.querySelectorAll('input[name="option-type"]').forEach(radio => {
    radio.addEventListener('change', () => {
        resetResultArea();
        const selectedProduct = document.getElementById('product-select').value;
        const selectedProductInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
        if (!selectedProductInfo) return;

        const processType = selectedProductInfo.optionFlows[radio.value]?.processType;

        // 次の項目をリセットし、表示を制御
        document.getElementById('model-select').disabled = true;
        document.getElementById('model-group').style.display = 'none';
        document.getElementById('year-select').disabled = true;
        document.getElementById('month-select').disabled = true;
        document.getElementById('year-month-group').style.display = 'none';

        document.getElementById('maker-group').style.display = 'block';
        const makerSelect = document.getElementById('maker-select');
        const makerNames = Object.keys(CAR_TYPE);
        makerSelect.disabled = false; // メーカー選択を有効化
        populateOptions(makerSelect, makerNames, 'メーカーを選択してください');
        updateSearchButtonState();
    });
});

// メーカー選択のイベントリスナー
document.getElementById('maker-select').addEventListener('change', (event) => {
    resetResultArea();
    const selectedMaker = event.target.value;
    const selectedProduct = document.getElementById('product-select').value;
    const selectedProductInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
    if (!selectedProductInfo) return;

    const selectedOptionType = document.querySelector('input[name="option-type"]:checked')?.value;
    const processType = selectedOptionType ? selectedProductInfo.optionFlows[selectedOptionType]?.processType : null;
    
    // 次の要素を非表示/無効化してから処理
    document.getElementById('model-select').disabled = true;
    document.getElementById('model-group').style.display = 'none';
    document.getElementById('year-select').disabled = true;
    document.getElementById('month-select').disabled = true;
    document.getElementById('year-month-group').style.display = 'none';
    document.getElementById('year-label').textContent = '年式'; // ラベルをリセット

    if (selectedMaker) {
        if (processType === 'carModel') {
            // 車種選択を表示
            const selectedMakerData = CAR_TYPE[selectedMaker];
            if (selectedMakerData) {
                const modelNames = selectedMakerData.models.map(model => model.name);
                populateOptions(document.getElementById('model-select'), modelNames, '車種を選択してください');
                document.getElementById('model-group').style.display = 'block';
                document.getElementById('model-select').disabled = false; // 車種選択を有効化
            }
        } else if (processType === 'dealerYears') {
            // 年式選択を表示
            const yearSelect = document.getElementById('year-select');
            const yearsArray = DEALER_YEARS || [];
            
            populateOptions(yearSelect, yearsArray, '年');
            document.getElementById('year-label').textContent = 'モニターモデル年'; // ラベルを変更
            document.getElementById('year-month-group').style.display = 'block';
            document.getElementById('year-select').disabled = false; // 年選択を有効化
        }
    }
    updateSearchButtonState();
});

// 車種選択のイベントリスナー（メーカーオプション用）
document.getElementById('model-select').addEventListener('change', (event) => {
    resetResultArea();
    const selectedModelName = event.target.value;
    const selectedMaker = document.getElementById('maker-select').value;
    
    document.getElementById('year-month-group').style.display = 'none';
    document.getElementById('year-select').disabled = true;
    document.getElementById('month-select').disabled = true;

    if (selectedModelName) {
        const selectedMakerData = CAR_TYPE[selectedMaker];
        if (selectedMakerData) {
            const selectedModel = selectedMakerData.models.find(model => model.name === selectedModelName);
            if (selectedModel) {
                populateOptions(document.getElementById('year-select'), CAR_YEARS, '年');
                document.getElementById('year-month-group').style.display = 'block';
                document.getElementById('year-select').disabled = false; // 年選択を有効化
                // 月の選択肢を有効化
                populateOptions(document.getElementById('month-select'), MONTHS, '月');
                document.getElementById('month-select').disabled = false; // 月選択を有効化
            }
        }
    }
    updateSearchButtonState();
});

// 年式選択のイベントリスナー
document.getElementById('year-select').addEventListener('change', () => {
    resetResultArea();
    const selectedProduct = document.getElementById('product-select').value;
    const selectedProductInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
    if (!selectedProductInfo) return;

    const selectedOptionType = document.querySelector('input[name="option-type"]:checked')?.value;
    const processType = selectedOptionType ? selectedProductInfo.optionFlows[selectedOptionType]?.processType : null;

    const selectedYear = document.getElementById('year-select').value;
    
    // carModelフローの場合のみ、月を表示
    document.getElementById('month-select').disabled = !(processType === 'carModel' && selectedYear);
    updateSearchButtonState();
});

// 月選択のイベントリスナー
document.getElementById('month-select').addEventListener('change', () => {
    resetResultArea();
    updateSearchButtonState();
});

// 検索ボタンのクリックイベントリスナー
document.getElementById('search-button').addEventListener('click', async () => {
    const selectedProduct = document.getElementById('product-select').value;
    const selectedMaker = document.getElementById('maker-select').value;
    const selectedOptionType = document.querySelector('input[name="option-type"]:checked')?.value;
    const selectedYearString = document.getElementById('year-select').value;

    const tableContainer = document.getElementById('results-table-container');
    const messageContainer = document.getElementById('message-container');
    const pdfLinkContainer = document.getElementById('pdf-link-container');
    const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
    
    if (!productInfo || !selectedOptionType) {
        console.error('製品またはオプションが選択されていません。');
        return;
    }
    const productKey = productInfo.productKey;
    const optionFlow = productInfo.optionFlows[selectedOptionType];
    const headerData = optionFlow.header;

    // processTypeに応じて動的にパラメータを構築
    let selectedModelName = '';
    let selectedMonth = '';
    const yearMatch = selectedYearString.match(/(\d{4})/);
    const selectedYear = yearMatch ? yearMatch[1] : null;

    if (optionFlow.processType === 'carModel') {
        selectedModelName = document.getElementById('model-select').value;
        selectedMonth = document.getElementById('month-select').value;
    } else if (optionFlow.processType === 'dealerYears') {
        selectedModelName = '';
        selectedMonth = '1';
    }

    const query = `${MATCH_API_URL}?product=${productKey}&option=${selectedOptionType}&maker=${selectedMaker}&model=${selectedModelName}&year=${selectedYear}&month=${selectedMonth}`;
    console.log(query);
    
    // 検索開始時のUI状態を設定
    if (messageContainer) {
        messageContainer.textContent = '適合品番を検索中...';
        messageContainer.style.display = 'block';
    }
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }

    // PDFリンクの表示処理（検索結果の成否に関わらず実行）
    const makerPdfPath = productInfo.optionFlows[selectedOptionType]?.pdf_paths?.[selectedMaker];
    if (makerPdfPath && pdfLinkContainer) {
        const pdfLink = document.createElement('a');
        pdfLink.href = makerPdfPath;
        pdfLink.target = '_blank'; // 新しいタブで開く
        pdfLink.classList.add('pdf-link');
        pdfLinkContainer.innerHTML = '';
        pdfLinkContainer.appendChild(pdfLink);
        pdfLinkContainer.style.display = 'block';
    } else {
        if (pdfLinkContainer) pdfLinkContainer.style.display = 'none';
    }

    try {
        const response = await fetch(query);
        if (!response.ok) {
            throw new Error(`検索に失敗しました。ステータス: ${response.status}`);
        }
        const partsData = await response.json();

        if (partsData.length > 0) {
            // 検索成功時の処理
            if (messageContainer) messageContainer.style.display = 'none';
            generateTable(partsData, headerData);
            displayNotes(partsData);
            if (tableContainer) tableContainer.style.display = 'block';
            
            // 成功時のPDFリンクテキストを設定
            if (pdfLinkContainer && pdfLinkContainer.querySelector('.pdf-link')) {
                pdfLinkContainer.querySelector('.pdf-link').textContent = '適合表(PDF)はこちら';
            }
        } else {
            // 検索失敗時の処理
            if (messageContainer) {
                messageContainer.textContent = 'お探しの条件に適合する品番は見つかりませんでした。';
                messageContainer.style.display = 'block';
            }
            if (tableContainer) tableContainer.style.display = 'none';
            displayNotes([]);

            // 失敗時のPDFリンクテキストを設定
            if (pdfLinkContainer && pdfLinkContainer.querySelector('.pdf-link')) {
                pdfLinkContainer.querySelector('.pdf-link').textContent = '適合品番は見つかりませんでした。詳しくは適合表(PDF)をご参照ください。';
            }
        }
    } catch (error) {
        // エラー発生時の処理
        if (messageContainer) {
            messageContainer.textContent = `検索中にエラーが発生しました: ${error.message}`;
            messageContainer.style.display = 'block';
        }
        if (tableContainer) tableContainer.style.display = 'none';
        
        // エラー時も失敗時のテキストを設定
        if (pdfLinkContainer && pdfLinkContainer.querySelector('.pdf-link')) {
            pdfLinkContainer.querySelector('.pdf-link').textContent = '適合品番は見つかりませんでした。詳しくはPDFをご参照ください。';
        }
    }
});

function generateTable(data, headerData) {
    const selectedMaker = document.getElementById('maker-select').value;
    const table = document.querySelector('.result-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const mainHeaderRow = document.createElement('tr');
    headerData.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.label;
        th.setAttribute('colspan', header.subHeaders.length);
        mainHeaderRow.appendChild(th);
    });
    thead.appendChild(mainHeaderRow);

    const subHeaderRow = document.createElement('tr');
    headerData.forEach(header => {
        header.subHeaders.forEach(subHeader => {
            const th = document.createElement('th');
            // テレナビング ヘッダーカラムの調整
            //col_2 
            if (subHeader.label == 'nav_col_2') {
                if (selectedMaker == 'ホンダ'){
                    th.textContent = 'LEDスイッチ切替タイプ_2';
                } else {
                    th.textContent = 'サービスホールスイッチ切替タイプ';
                }
            } else {
                th.textContent = subHeader.label;
            }
            th.width = '80px';
            subHeaderRow.appendChild(th);
        });
    });
    thead.appendChild(subHeaderRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        const allColumns = headerData.flatMap(header => header.subHeaders);
        allColumns.forEach(col => {
            const td = document.createElement('td');
            if (col.priceKeys) {
                if (item[col.key] == '-' || item[col.key] == '←') {
                    td.innerHTML = item[col.key];
                } else {
                    const priceExclTax = `<span style="font-size: 0.8em;">税別: ${(item[col.priceKeys.excl] || '').replace('\\', '￥')}</span>`;
                    const priceInclTax = `<span style="font-size: 0.8em;">税込: ${(item[col.priceKeys.incl] || '').replace('\\', '￥')}</span>`;
                    const navCtrl = `<span style="font-size: 0.6em;">ナビ操作: ${(item[col.option.nav] || '-').replace('\\', '￥')}</span>`;
                    const vehiclePos = `<span style="font-size: 0.6em;">自車位置: ${(item[col.option.vehicle_pos] || '-').replace('\\', '￥')}</span>`;
                    const dvd = `<span style="font-size: 0.6em;">DVD視聴: ${(item[col.option.dvd] || '-').replace('\\', '￥')}</span>`;
                    td.innerHTML = `<b>${item[col.key]}</b><br>${priceExclTax}<br>${priceInclTax}<br><br>${navCtrl}<br>${vehiclePos}<br>${dvd}`;
                }
            } else if (col.key === 'notes') {
                const parts = (item[col.key] || '').replace(/[{}]/g, '').split(',');
                td.innerHTML = parts.map(part => `※${part}`).join('<br>');
            } else {
                td.innerHTML = (item[col.key] || '').replace(/\n/g, '<br>');
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

function displayNotes(data) {
    const notesContainer = document.getElementById('notes-list-container');
    const uniqueNotes = new Set();
    data.forEach(item => {
        const notesString = item['notes'];
        if (notesString) {
            const numbers = notesString.replace(/[{}]/g, '').split(',').filter(n => n.trim() !== '');
            numbers.forEach(num => uniqueNotes.add(num.trim()));
        }
    });

    const sortedNotes = Array.from(uniqueNotes).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    let notesHtml = '<h3>注意事項</h3><ul>';
    NOTES_DATA['common'].forEach(common_txt => {
        notesHtml += `<li><span class="note-number">※共通</span><span class="note-text">：${common_txt.replace(/\n/g, '<br>')}</span></li>`;
    });

    if (sortedNotes.length > 0) {
        sortedNotes.forEach(num => {
            const noteText = NOTES_DATA[num];
            if (noteText) {
                notesHtml += `<li><span class="note-number">※${num}</span><span class="note-text">：${noteText.replace(/\n/g, '<br>')}</span></li>`;
            }
        });
        
    } 
    
    notesHtml += '</ul>';
    notesContainer.innerHTML = notesHtml;
    notesContainer.style.display = 'block';
}