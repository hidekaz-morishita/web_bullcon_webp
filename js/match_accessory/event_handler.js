// event_handler.js

import { renderForm, checkFieldsFilled } from './form_ui.js';
import { PRODUCTS_DATA, DEALER_NAV } from './data_mapper.js';
import { handleSearchResults } from './result_renderer.js';

let formState = {
    selectedProduct: null,
    selectedOptionType: null,
    selectedMaker: null,
    selectedModel: null,
    selectedYear: null,
    selectedMonth: null,
    selectedProductCode: null
};

/**
 * フォームの変更を処理し、UIの状態を更新する
 * @param {Event} event - changeイベントオブジェクト
 */
function handleFormChange(event) {
    const target = event.target;
    resetResultArea();

    if (target.id === 'product-code-input') {
        return;
    }

    if (target.name === 'option-type') {
        formState.selectedOptionType = target.value;
        formState.selectedMaker = null;
        formState.selectedModel = null;
        formState.selectedYear = null;
        formState.selectedMonth = null;
        formState.selectedProductCode = null;
    } else {
        switch (target.id) {
            case 'product-select':
                formState.selectedProduct = target.value || null;
                formState.selectedOptionType = 'maker';
                formState.selectedMaker = null;
                formState.selectedModel = null;
                formState.selectedYear = null;
                formState.selectedMonth = null;
                formState.selectedProductCode = null;
                break;
            case 'maker-select':
                formState.selectedMaker = target.value || null;
                formState.selectedModel = null;
                formState.selectedYear = null;
                formState.selectedMonth = null;
                formState.selectedProductCode = null;
                break;
            case 'model-select':
                formState.selectedModel = target.value || null;
                formState.selectedYear = null;
                formState.selectedMonth = null;
                formState.selectedProductCode = null;
                break;
            case 'year-select':
                formState.selectedYear = target.value || null;
                formState.selectedMonth = null;
                formState.selectedProductCode = null;
                if (formState.selectedYear === 'unknown') {
                    formState.selectedProductCode = '';
                }
                break;
            case 'month-select':
                formState.selectedMonth = target.value || null;
                break;
            case 'product-code-select':
                formState.selectedProductCode = target.value || null;
                break;
        }
    }

    renderForm('form-container', formState);

    const searchButton = document.getElementById('search-button');
    const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === formState.selectedProduct);
    if (searchButton && checkFieldsFilled(formState, productInfo)) {
        searchButton.removeAttribute('disabled');
    } else if (searchButton) {
        searchButton.setAttribute('disabled', 'true');
    }
}

/**
 * アプリケーションのイベントリスナーを初期設定する
 */
export function setupEventListeners() {
    const formContainer = document.getElementById('form-container');
    if (!formContainer) {
        return;
    }

    formContainer.addEventListener('change', handleFormChange);

    formContainer.addEventListener('input', (event) => {
        const target = event.target;
        if (target.id === 'product-code-input') {
            const inputValue = target.value;
            const suggestionsList = document.getElementById('product-code-suggestions');
            
            // inputイベントでformStateを更新
            formState.selectedProductCode = inputValue;

            if (inputValue.length === 0) {
                suggestionsList.style.display = 'none';
                return;
            }

            suggestionsList.innerHTML = '';
            
            const allCodes = DEALER_NAV[formState.selectedMaker] || [];
            const matchedCodes = allCodes
                .filter(item => item.product_code.toLowerCase().includes(inputValue.toLowerCase()))
                .map(item => item.product_code);

            if (matchedCodes.length > 0) {
                suggestionsList.style.display = 'block';
                matchedCodes.forEach(code => {
                    const li = document.createElement('li');
                    li.textContent = code;
                    li.dataset.code = code;
                    suggestionsList.appendChild(li);
                });
            } else {
                suggestionsList.style.display = 'none';
            }
        }
        
        // 💡 inputイベントでも検索ボタンの状態を更新
        const searchButton = document.getElementById('search-button');
        const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === formState.selectedProduct);
        if (searchButton && checkFieldsFilled(formState, productInfo)) {
            searchButton.removeAttribute('disabled');
        } else if (searchButton) {
            searchButton.setAttribute('disabled', 'true');
        }
    });

    formContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const suggestionsList = document.getElementById('product-code-suggestions');
        
        // オートコンプリートの候補リストのクリックを処理
        if (suggestionsList && suggestionsList.contains(target) && target.tagName === 'LI') {
            const selectedCode = target.dataset.code;
            
            if (selectedCode) {
                formState.selectedProductCode = selectedCode;
                suggestionsList.style.display = 'none';
                renderForm('form-container', formState);
            }
            return;
        }

        // 検索ボタンのクリックを処理
        if (target && target.id === 'search-button' && !target.hasAttribute('disabled')) {
            const { selectedProduct, selectedOptionType } = formState;

            const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
            const optionFlow = productInfo?.optionFlows[selectedOptionType];

            if (!productInfo || !optionFlow || !checkFieldsFilled(formState, productInfo)) {
                alert('すべての必須項目を入力してください。');
                return;
            }

            await handleSearch(formState, productInfo, optionFlow);
        }
    });
}

/**
 * 適合品番検索処理を実行する
 * @param {object} formState - 現在のフォームの状態
 * @param {object} productInfo - 選択された製品の情報
 * @param {object} optionFlow - 選択されたオプションフローの情報
 */
async function handleSearch(formState, productInfo, optionFlow) {
    const { selectedMaker, selectedModel, selectedYear, selectedMonth, selectedProductCode } = formState;

    const productKey = productInfo.productKey;
    const headerData = optionFlow.header;

    let queryModel = selectedModel;
    let queryMonth = selectedMonth;
    let queryProductCode = selectedProductCode;

    if (optionFlow.processType === 'dealerYears') {
        queryModel = '';
        if (selectedYear !== 'unknown') {
            queryMonth = '1';
        } else {
            queryMonth = '';
            queryProductCode = selectedProductCode;
        }
    }

    const yearMatch = selectedYear ? selectedYear.match(/\d{4}/) : null;
    const yearForQuery = yearMatch ? yearMatch[0] : '';
    
    const params = {
        product: productKey,
        option: formState.selectedOptionType,
        maker: selectedMaker,
        model: queryModel,
        year: yearForQuery,
        month: queryMonth,
        productCode: queryProductCode
    };

    const pdfPath = productInfo.optionFlows[formState.selectedOptionType]?.pdf_paths?.[selectedMaker];

    await handleSearchResults(params, headerData, pdfPath);
}

/**
 * 検索結果表示エリアを初期状態にリセットする
 */
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