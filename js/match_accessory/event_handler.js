// event_handler.js

import { renderForm } from './form_ui.js';
import { PRODUCTS_DATA } from './data_mapper.js';
import { handleSearchResults } from './result_renderer.js';

let formState = {
    selectedProduct: null,
    selectedOptionType: null,
    selectedMaker: null,
    selectedModel: null,
    selectedYear: null,
    selectedMonth: null
};

// フォームのイベントリスナーを設定する関数
export function setupEventListeners() {
    const formContainer = document.getElementById('form-container');
    const searchButton = document.getElementById('search-button');

    // change イベントのリスナー
    formContainer.addEventListener('change', (event) => {
        const target = event.target;
        resetResultArea();

        if (target.id === 'product-select') {
            formState.selectedProduct = target.value || null;
            formState.selectedOptionType = 'maker';
            formState.selectedMaker = null;
            formState.selectedModel = null;
            formState.selectedYear = null;
            formState.selectedMonth = null;
        } else if (target.name === 'option-type') {
            formState.selectedOptionType = target.value;
            formState.selectedMaker = null;
            formState.selectedModel = null;
            formState.selectedYear = null;
            formState.selectedMonth = null;
        } else if (target.id === 'maker-select') {
            formState.selectedMaker = target.value || null;
            formState.selectedModel = null;
            formState.selectedYear = null;
            formState.selectedMonth = null;
        } else if (target.id === 'model-select') {
            formState.selectedModel = target.value || null;
            formState.selectedYear = null;
            formState.selectedMonth = null;
        } else if (target.id === 'year-select') {
            formState.selectedYear = target.value || null;
            formState.selectedMonth = null;
        } else if (target.id === 'month-select') {
            formState.selectedMonth = target.value || null;
        }
        
        renderForm('form-container', formState);
        setupEventListeners();
    });

    // click イベントのリスナー
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            const { selectedProduct, selectedOptionType, selectedMaker, selectedModel, selectedYear, selectedMonth } = formState;

            const productInfo = Object.values(PRODUCTS_DATA).find(p => p.name === selectedProduct);
            const optionFlow = productInfo?.optionFlows[selectedOptionType];

            if (!productInfo || !optionFlow) {
                console.error('製品またはオプションが選択されていません。');
                return;
            }

            const productKey = productInfo.productKey;
            const headerData = optionFlow.header;

            let queryModel = selectedModel;
            let queryMonth = selectedMonth;

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
                month: queryMonth
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