// pdf_exporter.js (または result_table_exporter.js)

// ライブラリのグローバル参照
const html2canvas = window.html2canvas;
const jsPDF = window.jspdf ? window.jspdf.jsPDF : null;

/**
 * 適合結果テーブルを画像としてキャプチャし、PDFに出力します。
 * @param {string} targetElementId - PDF化したい要素のID ('results-table-container')
 */
export async function exportTableToPdf(targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    const resultTableContainer = document.getElementById('results-table-container');
    
    // ライブラリとターゲット要素の存在チェック
    if (!html2canvas || !jsPDF) {
        alert('PDF出力ライブラリがロードされていません。match.htmlを確認してください。');
        return;
    }
    if (!targetElement) {
        console.error(`ERROR: ターゲット要素 (#${targetElementId}) が見つかりません。`);
        alert('PDF出力に失敗しました: ターゲット要素が見つかりません。');
        return;
    }
    
    const tableHeader = targetElement.querySelector('thead');
    const exportButton = document.getElementById('exportPdfButton');

    // 1. CSSプロパティを一時的に無効にするための設定
    const originalOverflowY = targetElement.style.overflowY;
    let originalPosition = 'static';
    
    // 元のmax-heightとheightを保存
    const originalMaxHeight = resultTableContainer.style.maxHeight;
    const originalHeight = targetElement.style.height;

    // theadが存在する場合のみposition:stickyを解除
    if (tableHeader) {
        originalPosition = tableHeader.style.position;
        tableHeader.style.position = 'static';
    }
    
    // スクロール制限を全て解除し、テーブル全体が表示されるようにする
    targetElement.style.overflowY = 'visible';
    // !importantを使い、クラスやIDに設定されたmax-heightを強制的に解除
    resultTableContainer.style.setProperty('max-height', 'none', 'important'); 
    targetElement.style.setProperty('height', 'auto', 'important');
    
    if (exportButton) exportButton.disabled = true;

    // 2. html2canvasのオプションを定義
    const canvasOptions = { 
        scale: 2,           
        useCORS: true,      
        allowTaint: true,   
        letterRendering: true,
        // 横幅は表示領域の幅を使用し、見切れを解消
        width: targetElement.clientWidth, 
        // 縦幅はscrollHeightを使用し、上記CSS解除によりテーブルの全高を取得
        height: targetElement.scrollHeight
    };

    try {
        // 3. html2canvasでDOMからCanvasを生成
        const canvas = await html2canvas(targetElement, canvasOptions);
        const imgData = canvas.toDataURL('image/jpeg', 0.98); 

        // 4. jsPDFインスタンスの生成 (横長のテーブルに合わせ横向き)
        const pdf = new jsPDF({
            orientation: 'landscape', 
            unit: 'mm',
            format: 'a4'
        });

        // A4横向きのサイズを取得
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // 画像の縦横比から、PDFのページ幅いっぱいに収まるサイズを計算
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasHeight / canvasWidth; 
        
        // 画像の幅をPDFの幅に合わせる
        const imgWidth = pdfWidth;
        const imgHeight = imgWidth * ratio; // 縮小後の高さ
        
        // 5. ページ分割ロジック
        let heightLeft = imgHeight; // PDFでの残り高さ (mm)
        let position = 0;           // 画像のY座標オフセット (mm)

        // 画像の高さが1ページを超える場合、分割してページを追加
        while (heightLeft > -1) { 
            
            // ページを追加 (最初のページ以外)
            if (position !== 0) {
                pdf.addPage();
            }

            // 画像の追加 (x=0, y=-positionに配置することで、ページに収まる部分をクリッピング表示)
            pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);

            // 次のページのために高さを更新
            heightLeft -= pdfHeight;
            position += pdfHeight; 
        }

        // 6. PDFを保存
        pdf.save('compatibility_result.pdf');

    } catch (error) {
        console.error('PDF生成中にエラーが発生しました:', error);
        alert('PDF生成中にエラーが発生しました。コンソールを確認してください。');
    } finally {
        // 7. 元のスタイルに戻す (クリーンアップ)
        targetElement.style.overflowY = originalOverflowY;
        
        // ★【修正】!importantで設定したプロパティをリセットし、元の値を戻す
        resultTableContainer.style.removeProperty('max-height');
        targetElement.style.removeProperty('height');
        resultTableContainer.style.maxHeight = originalMaxHeight;
        targetElement.style.height = originalHeight;
        
        if (tableHeader) {
            tableHeader.style.position = originalPosition;
        }
        if (exportButton) exportButton.disabled = false;
    }
}