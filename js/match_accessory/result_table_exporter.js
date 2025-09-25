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

    // CSSプロパティを一時的に無効にするための設定
    const originalOverflowY = targetElement.style.overflowY;
    const originalWidth = targetElement.style.width;
    let originalPosition = 'static';
    const originalMaxHeight = resultTableContainer.style.maxHeight;

    if (tableHeader) {
        originalPosition = tableHeader.style.position;
        tableHeader.style.position = 'static';
    }

    // スクロール制限を全て解除し、テーブル全体が表示されるようにする
    targetElement.style.overflowY = 'visible';
    // キャプチャ前に要素の幅を強制的にテーブルの全幅に合わせる
    targetElement.style.width = `${targetElement.scrollWidth}px`;
    resultTableContainer.style.setProperty('max-height', 'none', 'important');
    if (exportButton) exportButton.disabled = true;

    // html2canvasのオプションを定義
    const canvasOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        // 横幅をclientWidthからscrollWidthに変更
        width: targetElement.scrollWidth, 
        height: targetElement.scrollHeight
    };

    try {
        const canvas = await html2canvas(targetElement, canvasOptions);
        const imgData = canvas.toDataURL('image/jpeg', 0.98);

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

            pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);

            heightLeft -= pdfHeight;
            position += pdfHeight;
        }

        pdf.save('compatibility_result.pdf');

    } catch (error) {
        console.error('PDF生成中にエラーが発生しました:', error);
        alert('PDF生成中にエラーが発生しました。コンソールを確認してください。');
    } finally {
        // 元のスタイルに戻す
        targetElement.style.overflowY = originalOverflowY;
        targetElement.style.width = originalWidth;

        resultTableContainer.style.removeProperty('max-height');
        resultTableContainer.style.maxHeight = originalMaxHeight;

        if (tableHeader) {
            tableHeader.style.position = originalPosition;
        }
        if (exportButton) exportButton.disabled = false;
    }
}
