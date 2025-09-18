// match.js
import { renderForm } from './form_ui.js';
import { setupEventListeners } from './event_handler.js';

// DOM読み込み後の初期処理
document.addEventListener('DOMContentLoaded', () => {
    // フォームを初期描画
    // この時点ではformStateが空なので、製品選択のみが表示されます
    renderForm('form-container', {
        selectedProduct: null,
        selectedOptionType: null,
        selectedMaker: null,
        selectedModel: null,
        selectedYear: null,
        selectedMonth: null,
        selectedProductCode: null
    });

    // イベントリスナーを設定
    setupEventListeners();
});