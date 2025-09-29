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

    if (!html2canvas || !jsPDF) {
        console.error('PDF出力ライブラリがロードされていません。');
        // Custom alert function should be used instead of standard alert()
        console.log('PDF出力ライブラリがロードされていません。match.htmlを確認してください。');
        return;
    }
    if (!targetElement) {
        console.error(`ERROR: ターゲット要素 (#${targetElementId}) が見つかりません。`);
        // Custom alert function should be used instead of standard alert()
        console.log('PDF出力に失敗しました: ターゲット要素が見つかりません。');
        return;
    }

    const tableHeader = targetElement.querySelector('thead');
    const exportButton = document.getElementById('exportPdfButton');

    // 既存のスタイルを保存
    const originalOverflowY = targetElement.style.overflowY;
    const originalOverflowX = targetElement.style.overflowX; 
    const originalWidth = targetElement.style.width;
    const originalMaxWidth = targetElement.style.maxWidth;
    
    let originalPosition = 'static';
    const originalMaxHeight = resultTableContainer.style.maxHeight;

    // 💥 追加: bodyのoverflow-xを保存し、一時的にvisibleにする
    const originalBodyOverflowX = document.body.style.overflowX;
    document.body.style.overflowX = 'visible';
    
    if (tableHeader) {
        // ヘッダーの固定を解除
        originalPosition = tableHeader.style.position;
        tableHeader.style.position = 'static';
    }

    // PDF出力のためのスタイル調整
    try {
        if (exportButton) exportButton.disabled = true;

        // 1. スクロール制限を全て解除
        targetElement.style.overflowY = 'visible';
        targetElement.style.overflowX = 'visible';
        
        // 2. max-height制限の解除 (既存)
        resultTableContainer.style.setProperty('max-height', 'none', 'important');
        
        // 3. 幅の制限を全て解除し、コンテンツの全幅を使用できるようにする
        targetElement.style.maxWidth = 'none'; 
        // キャプチャ前に要素の幅を強制的にテーブルの全幅(scrollWidth)に合わせる
        targetElement.style.width = `${targetElement.scrollWidth}px`;
        
        // html2canvasのオプションを定義
        const canvasOptions = {
            scale: 2, // 高解像度化
            useCORS: true,
            allowTaint: true,
            letterRendering: true,
            // 横幅をscrollWidthに設定
            width: targetElement.scrollWidth, 
            height: targetElement.scrollHeight
        };

        const canvas = await html2canvas(targetElement, canvasOptions);
        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        // PDF生成ロジック (A4横向き、ページ分割)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasHeight / canvasWidth;

        const imgWidth = pdfWidth;
        const imgHeight = imgWidth * ratio;

        let heightLeft = imgHeight;
        let position = 0;

        while (heightLeft > -1) {
            if (position !== 0) {
                pdf.addPage();
            }

            // PDFに追加。Y座標を負にして画像を上方向にシフトさせる
            pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);

            heightLeft -= pdfHeight;
            position += pdfHeight;
        }

        pdf.save('compatibility_result.pdf');

    } catch (error) {
        console.error('PDF生成中にエラーが発生しました:', error);
        // Custom alert function should be used instead of standard alert()
        console.log('PDF生成中にエラーが発生しました。コンソールを確認してください。');
    } finally {
        // 元のスタイルに戻す
        
        // 💥 bodyのoverflow-xを元に戻す
        document.body.style.overflowX = originalBodyOverflowX;

        // targetElementのスタイルを元に戻す
        targetElement.style.overflowY = originalOverflowY;
        targetElement.style.overflowX = originalOverflowX;
        
        targetElement.style.width = originalWidth;
        targetElement.style.maxWidth = originalMaxWidth;

        // max-height の復元
        resultTableContainer.style.removeProperty('max-height');
        resultTableContainer.style.maxHeight = originalMaxHeight;

        if (tableHeader) {
            tableHeader.style.position = originalPosition;
        }
        if (exportButton) exportButton.disabled = false;
    }
}
