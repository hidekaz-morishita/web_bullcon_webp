// メーカー名をキーとしてリスト化
const manufacturerKeys = ["toyota", "lexus", "nissan", "honda", "mitsubishi", "subaru", "suzuki", "daihatsu", "mazda"];
const tbody = document.querySelector('table tbody');

function createTable(data) {
    tbody.innerHTML = ''; // テーブルの中身をクリア

    data.forEach(product => {
        // 新しいカテゴリ行の処理
        if (product.type === "category") {
            const tr = document.createElement('tr');
            const tdCategory = document.createElement('td');
            tdCategory.setAttribute('colspan', 12); // 全ての列を結合
            tdCategory.classList.add('category-row'); // スタイリング用のクラスを追加
            tdCategory.textContent = product.categoryName;
            tr.appendChild(tdCategory);
            tbody.appendChild(tr);
        } else {
            // 既存の製品行の処理
            product.rows.forEach((rowData, rowIndex) => {
                const tr = document.createElement('tr');
                
                // rowspanが必要な製品名セル
                if (rowIndex === 0) {
                    const tdProduct = document.createElement('td');
                    tdProduct.setAttribute('rowspan', product.rows.length);
                    const a = document.createElement('a');
                    a.href = product.productLink;
                    a.textContent = product.productName;
                    tdProduct.appendChild(a);
                    tr.appendChild(tdProduct);
                }

                // 区分セル
                const tdCategory = document.createElement('td');
                tdCategory.textContent = rowData.category;
                tr.appendChild(tdCategory);

                // 区分2セル
                const tdCategory2 = document.createElement('td');
                tdCategory2.innerHTML = rowData.category2;
                tr.appendChild(tdCategory2);
                
                // 適合情報セル
                if (rowData.links.note) {
                    const tdNote = document.createElement('td');
                    tdNote.setAttribute('colspan', 9);
                    tdNote.classList.add('bg-yellow');
                    const a = document.createElement('a');
                    a.href = rowData.links.link;
                    a.textContent = rowData.links.note;
                    tdNote.appendChild(a);
                    tr.appendChild(tdNote);
                } else {
                    manufacturerKeys.forEach(manufacturer => {
                        const linkData = rowData.links[manufacturer];
                        const tdLink = document.createElement('td');

                        if (linkData.pdf === "-") {
                            tdLink.textContent = "-";
                        } else if (linkData.pdf === "動作未確認") {
                            tdLink.textContent = "動作未確認";
                        } else {
                            const a = document.createElement('a');
                            a.href = linkData.pdf;
                            a.target = "_blank";
                            const img = document.createElement('img');
                            img.src = "../../images/common/pdf_icon.webp";
                            img.alt = "アイコン";
                            img.classList.add('pdf-icon');
                            a.appendChild(img);

                            const date = document.createElement('div');
                            date.textContent = linkData.date;
                            date.style.fontSize = "0.7em";
                            date.style.marginTop = "5px";

                            tdLink.appendChild(a);
                            tdLink.appendChild(date);
                        }
                        tr.appendChild(tdLink);
                    });
                }

                tbody.appendChild(tr);
            });
        }
    });

    // テーブル生成後に列幅を同期させる
    syncTableWidths();
}

function syncTableWidths() {
    const table = document.querySelector('table');
    const headerCells = table.querySelectorAll('thead th');
    const bodyRows = table.querySelectorAll('tbody tr');

    if (!table || bodyRows.length === 0) {
        return;
    }

    const firstBodyRowCells = bodyRows[0].querySelectorAll('td');

    // 列数が一致しない場合（colspanが存在する場合）の処理
    if (headerCells.length !== firstBodyRowCells.length) {
        let bodyCellIndex = 0;
        headerCells.forEach(headerCell => {
            let colSpan = headerCell.colSpan || 1;
            let combinedWidth = 0;
            for (let i = 0; i < colSpan; i++) {
                if (firstBodyRowCells[bodyCellIndex]) {
                    combinedWidth += firstBodyRowCells[bodyCellIndex].offsetWidth;
                    bodyCellIndex++;
                }
            }
            if (combinedWidth > 0) {
                headerCell.style.width = `${combinedWidth}px`;
            }
        });
    } else {
        // 列数が一致する場合の処理
        headerCells.forEach((headerCell, index) => {
            headerCell.style.width = `${firstBodyRowCells[index].offsetWidth}px`;
        });
    }
}

// データのロードとテーブル生成が完了した後に実行
document.addEventListener('DOMContentLoaded', () => {
    // MutationObserverを使ってテーブルのボディが変更されたことを検知
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                syncTableWidths();
                observer.disconnect(); // 一度だけ実行
                break;
            }
        }
    });

    const tbody = document.querySelector('tbody');
    if (tbody) {
        observer.observe(tbody, { childList: true });
    }
});

// ウィンドウのリサイズ時にも幅を再同期
window.addEventListener('resize', syncTableWidths);

// JSONデータを読み込む
fetch('match_pdf.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        createTable(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });