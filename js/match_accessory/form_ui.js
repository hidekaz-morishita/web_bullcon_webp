// form_ui.js
import { PRODUCTS_DATA, CAR_TYPE, DEALER_YEARS, CAR_YEARS, MONTHS } from './data_mapper.js';

function populateOptions(selectElement, options, emptyOptionText) {
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">${emptyOptionText}</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
}

/**
 * フォーム全体を動的に生成し、挿入する関数。
 * @param {string} containerId - フォームを挿入する要素のID。
 * @param {object} state - 現在のフォームの状態を保持するオブジェクト。
 */
export function renderForm(containerId, state) {
    const { selectedProduct, selectedOptionType, selectedMaker, selectedModel, selectedYear, selectedMonth } = state;
    const formContainer = document.getElementById(containerId);
    if (!formContainer) {
        console.error('フォームコンテナが見つかりません。');
        return;
    }

    // コンテナを空にする
    formContainer.innerHTML = '';
    
    // --- 常に表示する製品選択 ---
    const productGroup = document.createElement('div');
    productGroup.className = 'form-group';
    productGroup.id = 'product-group';
    productGroup.innerHTML = `
        <label for="product-select">製品名</label>
        <select id="product-select" class="form-select"></select>
    `;
    formContainer.appendChild(productGroup);
    populateOptions(document.getElementById('product-select'), Object.values(PRODUCTS_DATA).map(p => p.name), '製品を選択してください');
    if (selectedProduct) {
        document.getElementById('product-select').value = selectedProduct;
    } else {
        document.getElementById('product-select').disabled = false;
    }

    const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
    
    // --- 製品が選択された場合、オプションタイプを表示 ---
    if (productInfo) {
        const optionGroup = document.createElement('div');
        optionGroup.className = 'form-group';
        optionGroup.id = 'option-group';
        optionGroup.innerHTML = `
            <label>オプションタイプ</label>
            <div class="option-group">
                <input type="radio" id="maker-option" name="option-type" value="maker">
                <label for="maker-option">メーカーオプション</label>
                <input type="radio" id="dealer-option" name="option-type" value="dealer">
                <label for="dealer-option">ディーラーオプション</label>
            </div>
        `;
        formContainer.appendChild(optionGroup);
        if (selectedOptionType) {
            document.getElementById(`${selectedOptionType}-option`).checked = true;
        } else {
            document.getElementById('maker-option').checked = true;
        }

        const currentProcessType = productInfo.optionFlows[selectedOptionType || 'maker']?.processType;

        // --- オプションタイプが選択された場合、メーカー選択を表示 ---
        const makerGroup = document.createElement('div');
        makerGroup.className = 'form-group';
        makerGroup.id = 'maker-group';
        makerGroup.innerHTML = `
            <label for="maker-select">メーカー</label>
            <select id="maker-select" class="form-select"></select>
        `;
        formContainer.appendChild(makerGroup);
        populateOptions(document.getElementById('maker-select'), Object.keys(CAR_TYPE), 'メーカーを選択してください');
        if (selectedMaker) {
            document.getElementById('maker-select').value = selectedMaker;
        }

        if (selectedMaker) {
            // --- メーカーが選択された場合 ---
            if (currentProcessType === 'carModel') {
                const modelGroup = document.createElement('div');
                modelGroup.className = 'form-group';
                modelGroup.id = 'model-group';
                modelGroup.innerHTML = `
                    <label for="model-select">車種</label>
                    <select id="model-select" class="form-select"></select>
                `;
                formContainer.appendChild(modelGroup);
                const modelNames = CAR_TYPE[selectedMaker].models.map(model => model.name);
                populateOptions(document.getElementById('model-select'), modelNames, '車種を選択してください');
                if (selectedModel) {
                    document.getElementById('model-select').value = selectedModel;
                }
                
                if (selectedModel) {
                    const yearMonthGroup = document.createElement('div');
                    yearMonthGroup.className = 'form-group';
                    yearMonthGroup.id = 'year-month-group';
                    yearMonthGroup.innerHTML = `
                        <label for="year-select">年式</label>
                        <div class="year-month-group">
                            <select id="year-select" class="form-select"></select>
                            <span>/</span>
                            <select id="month-select" class="form-select"></select>
                        </div>
                    `;
                    formContainer.appendChild(yearMonthGroup);
                    populateOptions(document.getElementById('year-select'), CAR_YEARS, '年');
                    populateOptions(document.getElementById('month-select'), MONTHS, '月');
                    if (selectedYear) document.getElementById('year-select').value = selectedYear;
                    if (selectedMonth) document.getElementById('month-select').value = selectedMonth;
                }
            } else if (currentProcessType === 'dealerYears') {
                const yearMonthGroup = document.createElement('div');
                yearMonthGroup.className = 'form-group';
                yearMonthGroup.id = 'year-month-group';
                yearMonthGroup.innerHTML = `
                    <label for="year-select">モニターモデル年</label>
                    <div class="year-month-group">
                        <select id="year-select" class="form-select"></select>
                    </div>
                `;
                formContainer.appendChild(yearMonthGroup);
                populateOptions(document.getElementById('year-select'), DEALER_YEARS, '年');
                if (selectedYear) {
                    document.getElementById('year-select').value = selectedYear;
                }
            }
        }
    }

    // 検索ボタン
    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.className = 'btn-primary';
    searchButton.textContent = '適合品番を検索';
    searchButton.disabled = !checkFieldsFilled(state, productInfo);
    formContainer.appendChild(searchButton);
}

// 入力完了をチェックする関数
function checkFieldsFilled(state, productInfo) {
    const { selectedProduct, selectedMaker, selectedModel, selectedYear, selectedMonth, selectedOptionType } = state;
    if (!productInfo) return false;

    const processType = productInfo.optionFlows[selectedOptionType || 'maker']?.processType;
    if (processType === 'carModel') {
        return selectedProduct && selectedMaker && selectedModel && selectedYear && selectedMonth;
    } else if (processType === 'dealerYears') {
        return selectedProduct && selectedMaker && selectedYear;
    }
    return false;
}