import { CAR_TYPE } from './car_model.js';
import { NOTES_DATA } from './caution_note.js';

// 適合品番を検索するAPIの共通URL
const MATCH_API_URL = '../../api/get_products_compatibility.php';

// 月の固定データ
const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

// 検索対象の製品情報と、それに紐づく適合表のカラム情報をオプションタイプ別に定義
const PRODUCTS_DATA = {
    'FreeTVing': {
        name: 'フリーテレビング/テレナビング',
        productKey: 'televing',
        makerHeader: [
            { label: '車両情報', subHeaders: [
                { key: 'maker', label: 'メーカー' },
                { key: 'car_model', label: '車名' },
                { key: 'year', label: '年式' },
                { key: 'model_number', label: '型式' },
                { key: 'specification', label: '仕様' },
            ]},
            { label: 'フリーテレビング', subHeaders: [
                { key: 'ft_auto_type', label: 'オートタイプ', priceKeys: { excl: 'ft_auto_price_excl_tax', incl: 'ft_auto_price_incl_tax' } },
                { key: 'ft_auto_navigation_control', label: 'ナビ操作' },
                { key: 'ft_auto_vehicle_position', label: '自車位置' },
                { key: 'ft_led_switch_type', label: 'LEDスイッチ切替タイプ', priceKeys: { excl: 'ft_led_price_excl_tax', incl: 'ft_led_price_incl_tax' } },
                { key: 'ft_service_hole_switch_type', label: 'サービスホールスイッチ切替タイプ', priceKeys: { excl: 'ft_service_hole_price_excl_tax', incl: 'ft_service_hole_price_incl_tax' } },
                { key: 'ft_steering_switch_type', label: 'ステアリングスイッチ切替タイプ', priceKeys: { excl: 'ft_steering_switch_price_excl_tax', incl: 'ft_steering_switch_price_incl_tax' } },
                { key: 'ft_led_sh_st_navigation_control', label: 'ナビ操作' },
                { key: 'ft_led_sh_st_vehicle_position', label: '自車位置' },
                { key: 'ft_led_sh_st_dvd_playback', label: 'DVD視聴' },
            ]},
            { label: 'テレナビング', subHeaders: [
                { key: 'nav_product_number', label: '品番 1', priceKeys: { excl: 'nav_price_excl_tax', incl: 'nav_price_incl_tax' } },
                { key: 'nav_product_number_2', label: '品番 2', priceKeys: { excl: 'nav_price_excl_tax_2', incl: 'nav_price_incl_tax_2' } },
                { key: 'nav_dvd_playback_2', label: 'DVD視聴' },
            ]},
            { label: '注意事項', subHeaders: [
                { key: 'notes', label: '備考' }
            ]}
        ],
        dealerHeader: [
            { label: 'モニター情報', subHeaders: [
                { key: 'maker', label: 'メーカー' },
                { key: 'year', label: 'モデル年' },
                { key: 'model_number', label: 'モニター型番' },
            ]},
            { label: 'フリーテレビング', subHeaders: [
                { key: 'ft_auto_type', label: 'オートタイプ', priceKeys: { excl: 'ft_auto_price_excl_tax', incl: 'ft_auto_price_incl_tax' } },
                { key: 'ft_auto_navigation_control', label: 'ナビ操作' },
                { key: 'ft_auto_vehicle_position', label: '自車位置' },
                { key: 'ft_led_switch_type', label: 'LEDスイッチ切替タイプ', priceKeys: { excl: 'ft_led_price_excl_tax', incl: 'ft_led_price_incl_tax' } },
                { key: 'ft_service_hole_switch_type', label: 'サービスホールスイッチ切替タイプ', priceKeys: { excl: 'ft_service_hole_price_excl_tax', incl: 'ft_service_hole_price_incl_tax' } },
                { key: 'ft_steering_switch_type', label: 'ステアリングスイッチ切替タイプ', priceKeys: { excl: 'ft_steering_switch_price_excl_tax', incl: 'ft_steering_switch_price_incl_tax' } },
                { key: 'ft_led_sh_st_navigation_control', label: 'ナビ操作' },
                { key: 'ft_led_sh_st_vehicle_position', label: '自車位置' },
                { key: 'ft_led_sh_st_dvd_playback', label: 'DVD視聴' },
            ]},
            { label: 'テレナビング', subHeaders: [
                { key: 'nav_product_number', label: '品番 1', priceKeys: { excl: 'nav_price_excl_tax', incl: 'nav_price_incl_tax' } },
                { key: 'nav_product_number_2', label: '品番 2', priceKeys: { excl: 'nav_price_excl_tax_2', incl: 'nav_price_incl_tax_2' } },
                { key: 'nav_dvd_playback_2', label: 'DVD視聴' },
            ]},
            { label: '注意事項', subHeaders: [
                { key: 'notes', label: '備考' }
            ]}
        ]
    },
};

function populateOptions(selectElement, options, emptyOptionText) {
    selectElement.innerHTML = `<option value="">${emptyOptionText}</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
}

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

function resetResultArea() {
    const messageContainer = document.getElementById('message-container');
    const tableContainer = document.getElementById('results-table-container');
    const notesContainer = document.getElementById('notes-list-container');
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
}

document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('product-select');
    const productNames = Object.values(PRODUCTS_DATA).map(p => p.name);
    populateOptions(productSelect, productNames, '製品を選択してください');
    
    // 変更箇所
    const makerNames = Object.keys(CAR_TYPE);
    const makerSelect = document.getElementById('maker-select');
    populateOptions(makerSelect, makerNames, 'メーカーを選択してください');
    
    const monthSelect = document.getElementById('month-select');
    populateOptions(monthSelect, MONTHS, '月');
});

document.getElementById('product-select').addEventListener('change', () => {
    resetResultArea();
    const productSelect = document.getElementById('product-select');
    const makerSelect = document.getElementById('maker-select');
    makerSelect.disabled = !productSelect.value;
    updateSearchButtonState();
});

// 変更箇所
document.getElementById('maker-select').addEventListener('change', async (event) => {
    resetResultArea();
    const selectedMaker = event.target.value;
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
        const selectedMakerData = CAR_TYPE[selectedMaker];
        if (selectedMakerData) {
            const modelNames = selectedMakerData.models.map(model => model.name);
            populateOptions(modelSelect, modelNames, '車種を選択してください');
        }
    }
});

document.getElementById('model-select').addEventListener('change', (event) => {
    resetResultArea();
    const selectedModelName = event.target.value;
    const selectedMaker = document.getElementById('maker-select').value;
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');
    yearSelect.innerHTML = '<option value="">年</option>';
    monthSelect.disabled = true;
    yearSelect.disabled = !selectedModelName;
    updateSearchButtonState();
    if (selectedModelName) {
        const selectedMakerData = CAR_TYPE[selectedMaker];
        if (selectedMakerData) {
            const selectedModel = selectedMakerData.models.find(model => model.name === selectedModelName);
            if (selectedModel) {
                const yearsArray = selectedModel.years;
                populateOptions(yearSelect, yearsArray, '年');
            }
        }
    }
});

document.getElementById('year-select').addEventListener('change', async (event) => {
    resetResultArea();
    const selectedYear = event.target.value;
    const monthSelect = document.getElementById('month-select');
    monthSelect.disabled = !selectedYear;
    updateSearchButtonState();
});

document.getElementById('month-select').addEventListener('change', () => {
    resetResultArea();
    updateSearchButtonState();
});

document.getElementById('maker-option').addEventListener('change', updateSearchButtonState);
document.getElementById('dealer-option').addEventListener('change', updateSearchButtonState);

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
    const isMakerOption = document.getElementById('maker-option').checked;
    const optionKey = isMakerOption ? 'maker' : 'dealer';
    const headerData = isMakerOption ? productInfo.makerHeader : productInfo.dealerHeader;
    const yearMatch = selectedYearString.match(/(\d{4})/);
    const selectedYear = yearMatch ? yearMatch[1] : null;
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
            generateTable(partsData, headerData);
            displayNotes(partsData);
            if (tableContainer) tableContainer.style.display = 'block';
        } else {
            if (messageContainer) {
                messageContainer.textContent = 'お探しの条件に適合する品番は見つかりませんでした。';
                messageContainer.style.display = 'block';
            }
            if (tableContainer) tableContainer.style.display = 'none';
            displayNotes([]);
        }
    } catch (error) {
        if (messageContainer) {
            messageContainer.textContent = `検索中にエラーが発生しました: ${error.message}`;
            messageContainer.style.display = 'block';
        }
        if (tableContainer) tableContainer.style.display = 'none';
    }
});

function generateTable(data, headerData) {
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
            th.textContent = subHeader.label;
            subHeaderRow.appendChild(th);
        });
    });
    thead.appendChild(subHeaderRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        const allColumns = headerData.flatMap(header => header.subHeaders);
        allColumns.forEach(col => {
            const td = document.createElement('td');
            if (col.key === 'notes') {
                const parts = (item[col.key] || '').replace(/[{}]/g, '').split(',');
                td.innerHTML = parts.map(part => `※${part}`).join('<br>');
            } else if (col.priceKeys) {
                const priceExclTax = `<span style="font-size: 0.8em;">税別: ${(item[col.priceKeys.excl] || '').replace('\\', '￥')}</span>`;
                const priceInclTax = `<span style="font-size: 0.8em;">税込: ${(item[col.priceKeys.incl] || '').replace('\\', '￥')}</span>`;
                td.innerHTML = `${item[col.key]}<br>${priceExclTax}<br>${priceInclTax}`;
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
        notesHtml += `<li>※共通: ${common_txt}</li>`;
    });
    if (sortedNotes.length > 0) {
        sortedNotes.forEach(num => {
            const noteText = NOTES_DATA[num];
            if (noteText) {
                notesHtml += `<li>※${num}: ${noteText}</li>`;
            }
        });
        notesHtml += '</ul>';
        notesContainer.innerHTML = notesHtml;
        notesContainer.style.display = 'block';
    } else {
        notesContainer.innerHTML = '';
        notesContainer.style.display = 'none';
    }
}