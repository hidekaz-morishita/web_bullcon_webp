// メーカー名をキーとしてリスト化
const manufacturerKeys = ["toyota", "lexus", "nissan", "honda", "mitsubishi", "subaru", "suzuki", "daihatsu", "mazda"];
const tbody = document.querySelector('table tbody');

/**
 * PDFファイルの最終更新日を取得する非同期関数
 * @param {string} url - PDFファイルのURL
 * @returns {Promise<string>} - フォーマットされた更新日、またはエラーメッセージ
 */
async function getPdfLastModified(url) {
    try {
        // HEADリクエストでヘッダー情報のみを取得（ファイルはダウンロードしない）
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            const lastModified = response.headers.get('Last-Modified');
            if (lastModified) {
                const date = new Date(lastModified);
                // YYYY.MM.DD形式にフォーマット
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}.${month}.${day}`;
            }
        }
        return '日付取得失敗';
    } catch (error) {
        console.error('Error fetching file date:', error);
        return '日付取得失敗';
    }
}

/**
 * データを元にテーブルの<tbody>を構築する
 * @param {Array<Object>} data - 製品データの配列
 */
async function createTable(data) {
    if (!tbody) return;

    tbody.innerHTML = ''; // テーブルの中身をクリア

    for (const product of data) {
        // 新しいカテゴリ行の処理
        if (product.type === "category") {
            const tr = document.createElement('tr');
            const tdCategory = document.createElement('td');
            // colspanはHTMLヘッダーの列数に合わせて12に設定
            tdCategory.setAttribute('colspan', 12); 
            tdCategory.classList.add('category-row');
            tdCategory.textContent = product.categoryName;
            tr.appendChild(tdCategory);
            tbody.appendChild(tr);
        } else {
            // 既存の製品行の処理
            for (const [rowIndex, rowData] of product.rows.entries()) {
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

                // 区分2セル (補足)
                const tdCategory2 = document.createElement('td');
                tdCategory2.innerHTML = rowData.category2;
                tr.appendChild(tdCategory2);
                
                // 適合情報セル
                if (rowData.links.note) {
                    const tdNote = document.createElement('td');
                    tdNote.setAttribute('colspan', 9); // メーカー9列分を結合
                    tdNote.classList.add('bg-yellow');
                    const a = document.createElement('a');
                    a.href = rowData.links.link;
                    a.textContent = rowData.links.note;
                    tdNote.appendChild(a);
                    tr.appendChild(tdNote);
                } else {
                    for (const manufacturer of manufacturerKeys) {
                        const linkData = rowData.links[manufacturer];
                        const tdLink = document.createElement('td');

                        if (!linkData || linkData.pdf === "-") {
                            tdLink.textContent = "-";
                        } else if (linkData.pdf === "動作未確認") {
                            tdLink.textContent = "動作未確認";
                        } else {
                            const a = document.createElement('a');
                            a.href = linkData.pdf;
                            a.target = "_blank";
                            const img = document.createElement('img');
                            img.src = "../../images/common/pdf_icon.webp";
                            img.alt = "PDFアイコン";
                            img.classList.add('pdf-icon');
                            a.appendChild(img);

                            const dateElement = document.createElement('div');
                            dateElement.textContent = '日付取得中...'; // ローディングテキスト
                            dateElement.style.fontSize = "0.7em";
                            dateElement.style.marginTop = "5px";
                            dateElement.classList.add('date-text');
                            tdLink.appendChild(a);
                            tdLink.appendChild(dateElement);
                            
                            // 非同期で日付を取得し、表示を更新
                            getPdfLastModified(linkData.pdf).then(date => {
                                dateElement.textContent = `${date} 更新`;
                            }).catch(() => {
                                dateElement.textContent = '取得エラー';
                            });
                        }
                        tr.appendChild(tdLink);
                    }
                }
                tbody.appendChild(tr);
            }
        }
    }
    // テーブル生成後、幅同期とスクロール同期設定を行う
    setupScrollSynchronization(); 
    syncTableWidths();
}

/**
 * ヘッダーの列幅をボディの列幅に合わせて調整する & 上部スクロールバーの幅をテーブルに合わせる
 */
function syncTableWidths() {
    const table = document.querySelector('table');
    const headerCells = table ? table.querySelectorAll('thead th') : [];
    const bodyRows = table ? table.querySelectorAll('tbody tr') : [];
    const topScrollerInner = document.querySelector('#top-scroller > div');

    if (!table || bodyRows.length === 0 || !topScrollerInner) {
        return;
    }

    // colspanのない最初のデータ行を見つける (カテゴリ行はスキップ)
    let firstDataRowCells = null;
    for (const row of bodyRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length === headerCells.length) {
            firstDataRowCells = cells;
            break;
        }
    }

    if (firstDataRowCells) {
        // 1. ヘッダーの列幅をボディに合わせる
        headerCells.forEach((headerCell, index) => {
            if (firstDataRowCells[index]) {
                headerCell.style.width = `${firstDataRowCells[index].offsetWidth}px`;
            }
        });
    }

    // 2. テーブル全体の幅を上部スクロールバーに反映
    // table.scrollWidth は table-wrapperのwidthを無視した実際のコンテンツ幅を返します
    const scrollWidth = table.scrollWidth; 
    topScrollerInner.style.width = `${scrollWidth}px`;
}

/**
 * 上部ダミーバーとメインテーブルラッパーのスクロールを同期させる
 */
function setupScrollSynchronization() {
    const topScroller = document.getElementById('top-scroller');
    const tableWrapper = document.querySelector('.table-wrapper');
    
    if (!topScroller || !tableWrapper) return;
    
    let isSyncing = false;

    // 上部スクロールバーを動かしたとき、テーブルラッパーを同期
    topScroller.addEventListener('scroll', () => {
        if (!isSyncing) {
            isSyncing = true;
            tableWrapper.scrollLeft = topScroller.scrollLeft;
            // 次のイベントループでフラグをリセットすることで、無限ループを防ぐ
            setTimeout(() => { isSyncing = false; }, 0); 
        }
    });

    // テーブルラッパーを動かしたとき、上部スクロールバーを同期
    tableWrapper.addEventListener('scroll', () => {
        if (!isSyncing) {
            isSyncing = true;
            topScroller.scrollLeft = tableWrapper.scrollLeft;
            // 次のイベントループでフラグをリセットすることで、無限ループを防ぐ
            setTimeout(() => { isSyncing = false; }, 0);
        }
    });
}


// データのロードとテーブル生成の開始
document.addEventListener('DOMContentLoaded', () => {
    const tableWrapper = document.querySelector('.table-wrapper');
    const targetTbody = document.querySelector('tbody');
    
    // 必要なDOM要素が存在しない場合は終了
    if (!tableWrapper || !targetTbody) {
        console.error("Required DOM elements (.table-wrapper or tbody) not found.");
        return;
    }

    // MutationObserverを使って<tbody>の中身が変更されたことを検知
    // これにより、動的にテーブルが生成された後の幅調整を確実に行う
    const observer = new MutationObserver((mutationsList, observer) => {
        // tbodyの内容が確定した後、幅の同期とスクロール同期設定を呼び出す
        syncTableWidths();
        setupScrollSynchronization();
        observer.disconnect(); // 一度だけ実行
    });

    // childList: 子ノードの追加・削除を監視
    observer.observe(targetTbody, { childList: true });


    // JSONデータを読み込む
    fetch('match_pdf.json')
        .then(response => {
            if (!response.ok) {
                // ファイルが見つからない、またはネットワークエラー
                throw new Error(`match_pdf.json の読み込みに失敗しました (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            createTable(data); // テーブル生成開始
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // エラー表示処理
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="12" style="color: red; text-align: left;">適合データの読み込みに失敗しました。ファイルパスまたはJSON形式を確認してください。</td></tr>';
            }
        });
});

// ウィンドウのリサイズ時にも幅を再同期
window.addEventListener('resize', () => {
     // リサイズ処理が重くなるのを避けるため、setTimeoutでディレイをかけるとより良いですが、ここではシンプルに
     syncTableWidths();
});
