// event_handler.js

import { renderForm, checkFieldsFilled } from './form_ui.js';
import { PRODUCTS_DATA } from './data_mapper.js';
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

// フォームのイベントリスナーを設定する関数
export function setupEventListeners() {
    const formContainer = document.getElementById('form-container');
    const searchButton = document.getElementById('search-button');

    // change イベントのリスナー
    formContainer.addEventListener('change', (event) => {
        const target = event.target;
        resetResultArea();

        // radioボタンの変更を処理
        if (target.name === 'option-type') {
            formState.selectedOptionType = target.value;
            formState.selectedMaker = null;
            formState.selectedModel = null;
            formState.selectedYear = null;
            formState.selectedMonth = null;
            formState.selectedProductCode = null;
        }
        
        // select要素の変更を処理
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
                break;
            case 'month-select':
                formState.selectedMonth = target.value || null;
                break;
            case 'product-code-select':
                formState.selectedProductCode = target.value || null;
                break;
        }
        
        renderForm('form-container', formState);
        setupEventListeners();
    });

    // click イベントのリスナー
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            const { selectedProduct, selectedOptionType, selectedMaker, selectedModel, selectedYear, selectedMonth, selectedProductCode } = formState;

            const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
            const optionFlow = productInfo?.optionFlows[selectedOptionType];

            if (!productInfo || !optionFlow) {
                console.error('製品またはオプションが選択されていません。');
                return;
            }

            // form_ui.jsからインポートした関数を呼び出す
            if (!checkFieldsFilled(formState, productInfo)) {
                alert('すべての必須項目を入力してください。');
                return;
            }

            const productKey = productInfo.productKey;
            const headerData = optionFlow.header;

            let queryModel = selectedModel;
            let queryMonth = selectedMonth;
            let queryProductCode = selectedProductCode;

            if (optionFlow.processType === 'dealerYears') {
                queryModel = '';
                queryMonth = '1';
            }

            const yearMatch = selectedYear ? selectedYear.match(/\d{4}/) : null;
            const yearForQuery = yearMatch ? yearMatch[0] : '';
            
            const params = {
                product: productKey,
                option: selectedOptionType,
                maker: selectedMaker,
                model: queryModel,
                year: yearForQuery,
                month: queryMonth,
                productCode: queryProductCode
            };

            const pdfPath = productInfo.optionFlows[selectedOptionType]?.pdf_paths?.[selectedMaker];

            // 検索結果の処理を別の関数に委譲
            await handleSearchResults(params, headerData, pdfPath);
        });
    }
}

// 検索結果エリアをリセットする関数 (このファイルに保持)
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