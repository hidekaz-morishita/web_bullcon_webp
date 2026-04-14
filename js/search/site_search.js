// search/site-search.js

import { setupSearch } from './common_search.js';

document.addEventListener('DOMContentLoaded', () => {
    setupSearch({
        tabId: 'site-search',
        dataPath: './search_data.json',
        filterLogic: (query, searchData) => {
            const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
            if (keywords.length === 0) return [];

            const filtered = searchData.filter(item => {
                const title = (item.title || '').toLowerCase();
                const kws = (item.keywords || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();

                // すべてのキーワードがどこか（タイトル、キーワード、ディスクリプション）に含まれているか
                return keywords.every(word =>
                    title.includes(word) || kws.includes(word) || desc.includes(word)
                );
            });

            return filtered.sort((a, b) => {
                const aTitleMatch = keywords.some(word => (a.title || '').toLowerCase().includes(word));
                const bTitleMatch = keywords.some(word => (b.title || '').toLowerCase().includes(word));
                return (aTitleMatch && !bTitleMatch) ? -1 : (!aTitleMatch && bTitleMatch) ? 1 : 0;
            });
        },
        onDataLoaded: () => {
            // サイト内検索ではオートコンプリートは不要
        }
    });
});