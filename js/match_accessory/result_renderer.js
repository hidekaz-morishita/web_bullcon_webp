// result_renderer.js

import { getCompatibilityData } from './match_api_client.js';
import { NOTES_DATA } from './data_mapper.js';

/**
 * 検索結果を処理してDOMに表示する関数
 * @param {object} params - APIに渡すクエリパラメータ
 * @param {object} headerData - テーブルヘッダー情報
 * @param {string} pdfPath - 適合表PDFのパス
 */
export async function handleSearchResults(params, headerData, pdfPath) {
    const tableContainer = document.getElementById('results-table-container');
    const messageContainer = document.getElementById('message-container');
    const pdfLinkContainer = document.getElementById('pdf-link-container');
    
    // UIを更新してロード中であることを示す
    if (messageContainer) {
        messageContainer.textContent = '適合品番を検索中...';
        messageContainer.style.display = 'block';
    }
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }
    if (pdfLinkContainer) {
        if (pdfPath) {
            const pdfLink = document.createElement('a');
            pdfLink.href = pdfPath;
            pdfLink.target = '_blank';
            pdfLink.classList.add('pdf-link');
            pdfLink.textContent = '適合表(PDF)はこちら';
            pdfLinkContainer.innerHTML = '';
            pdfLinkContainer.appendChild(pdfLink);
            pdfLinkContainer.style.display = 'block';
        } else {
            pdfLinkContainer.style.display = 'none';
        }
    }

    try {
        const partsData = await getCompatibilityData(params);
        
        if (partsData && Array.isArray(partsData) && partsData.length > 0) {
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
            if (pdfLinkContainer) {
                const pdfLink = pdfLinkContainer.querySelector('.pdf-link');
                if (pdfLink) {
                    pdfLink.textContent = '適合品番は見つかりませんでした。詳しくは適合表(PDF)をご参照ください。';
                }
            }
        }
    } catch (error) {
        if (messageContainer) {
            messageContainer.textContent = `検索中にエラーが発生しました: ${error.message}`;
            messageContainer.style.display = 'block';
        }
        if (tableContainer) tableContainer.style.display = 'none';
        if (pdfLinkContainer) {
            const pdfLink = pdfLinkContainer.querySelector('.pdf-link');
            if (pdfLink) {
                pdfLink.textContent = '適合品番は見つかりませんでした。詳しくはPDFをご参照ください。';
            }
        }
    }
}

// テーブルを生成する関数
function generateTable(data, headerData) {
    const selectedMaker = document.getElementById('maker-select')?.value;
    const table = document.querySelector('.result-table');
    if (!table) return;

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
                    const navCtrl = col.option && col.option.nav ? `<span style="font-size: 0.6em;">ナビ操作: ${(item[col.option.nav] || '-').replace('\\', '￥')}</span>` : '';
                    const vehiclePos = col.option && col.option.vehicle_pos ? `<span style="font-size: 0.6em;">自車位置: ${(item[col.option.vehicle_pos] || '-').replace('\\', '￥')}</span>` : '';
                    const dvd = col.option && col.option.dvd ? `<span style="font-size: 0.6em;">DVD視聴: ${(item[col.option.dvd] || '-').replace('\\', '￥')}</span>` : '';
                    td.innerHTML = `<b>${item[col.key]}</b><br>${priceExclTax}<br>${priceInclTax}<br><br>${navCtrl}<br>${vehiclePos}<br>${dvd}`;
                }
            } else if (col.key === 'notes') {
                if (item && item[col.key]) {
                    const notesString = item[col.key];
                    const partsStr = (notesString || '').replace(/[{}]/g, '').split(',').filter(p => p.trim() !== '');
                
                    // スズキ専用注意事項
                    // 各要素に対して処理を行うための新しい配列を作成
                    const processedParts = partsStr.map(part => {
                        const partsInt = parseInt(part.trim(), 10);
                        // パースした値が有効な数値であり、900以上1000未満であることを確認
                        if (!isNaN(partsInt) && partsInt >= 900 && partsInt < 1000) {
                            // 条件を満たす場合、"S" + (値 - 900) の形式に変換
                            return `S${partsInt - 900}`;
                        }
                        // その他の場合、元の文字列をそのまま返す
                        return part.trim();
                    });
                
                    // 処理された配列の各要素に"※"を付けて、改行で結合
                    td.innerHTML = processedParts.map(str => `※${str}`).join('<br>');
                } else {
                    td.innerHTML = '';
                }
            } else {
                td.innerHTML = (item[col.key] || '').replace(/\n/g, '<br>');
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

// 注意事項を表示する関数
function displayNotes(data) {
    const notesContainer = document.getElementById('notes-list-container');
    if (!notesContainer) return;

    const uniqueNotes = new Set();
    data.forEach(item => {
        if (item && item['notes']) {
            const notesString = item['notes'];
            const numbers = notesString.replace(/[{}]/g, '').split(',').filter(n => n.trim() !== '');
            numbers.forEach(num => uniqueNotes.add(num.trim()));
        }
    });

    const sortedNotes = Array.from(uniqueNotes).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    let notesHtml = '<h3>注意事項</h3><ul>';
    if (NOTES_DATA['common'] && NOTES_DATA['common'].length > 0) {
        NOTES_DATA['common'].forEach(common_txt => {
            notesHtml += `<li><span class="note-number">※共通</span><span class="note-text">：${common_txt.replace(/\n/g, '<br>')}</span></li>`;
        });
    }

    if (sortedNotes.length > 0) {
        sortedNotes.forEach(num => {
            const noteText = NOTES_DATA[num];
            if (noteText) {
                // スズキ専用注意事項
                if(num >= 900 && num < 1000) {
                    num = `S${num - 900}`;
                }
                notesHtml += `<li><span class="note-number">※${num}</span><span class="note-text">：${noteText.replace(/\n/g, '<br>')}</span></li>`;
            }
        });
    } 
    
    notesHtml += '</ul>';
    notesContainer.innerHTML = notesHtml;
    notesContainer.style.display = 'block';
}