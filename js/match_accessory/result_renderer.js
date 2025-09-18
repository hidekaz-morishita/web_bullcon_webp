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
            if (pdfLinkContainer) {
                 pdfLinkContainer.querySelector('.pdf-link').textContent = '適合品番は見つかりませんでした。詳しくは適合表(PDF)をご参照ください。';
            }
        }
    } catch (error) {
        if (messageContainer) {
            messageContainer.textContent = `検索中にエラーが発生しました: ${error.message}`;
            messageContainer.style.display = 'block';
        }
        if (tableContainer) tableContainer.style.display = 'none';
        if (pdfLinkContainer) {
            pdfLinkContainer.querySelector('.pdf-link').textContent = '適合品番は見つかりませんでした。詳しくはPDFをご参照ください。';
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

// 注意事項を表示する関数
function displayNotes(data) {
    const notesContainer = document.getElementById('notes-list-container');
    if (!notesContainer) return;

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