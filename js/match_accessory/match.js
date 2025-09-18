// match.js
import { renderForm } from './form_ui.js';
import { setupEventListeners } from './event_handler.js';

// フォームの状態を管理するオブジェクト
let formState = {
    selectedProduct: null,
    selectedOptionType: null,
    selectedMaker: null,
    selectedModel: null,
    selectedYear: null,
    selectedMonth: null
};

// DOM読み込み後の初期処理
document.addEventListener('DOMContentLoaded', () => {
    // フォームの初期描画
    renderForm('form-container', formState);

    // イベントリスナーを設定
    setupEventListeners();
});