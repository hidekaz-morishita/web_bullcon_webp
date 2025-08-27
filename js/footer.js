// フッターの読み込み
fetch('/html/_footer.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load footer: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        footerPlaceholder.innerHTML = data;

        // ボタンのDOM要素を動的に作成
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'to-top-button';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.textContent = '↑';
        
        // footer-placeholderと同じ階層にボタンを挿入
        footerPlaceholder.parentNode.appendChild(backToTopBtn);

        const footer = document.querySelector('.footer');

        if (backToTopBtn && footer) {
            // スクロール位置をチェックし、ボタンの表示と位置を制御する関数
            const checkPosition = () => {
                // スクロール量でボタンの表示/非表示を切り替える
                if (window.scrollY > 200) {
                    backToTopBtn.style.opacity = '1';
                    backToTopBtn.style.visibility = 'visible';
                } else {
                    backToTopBtn.style.opacity = '0';
                    backToTopBtn.style.visibility = 'hidden';
                }

                // フッターの上端が画面の下端に到達したかを判定
                const windowBottom = window.scrollY + window.innerHeight;
                const footerTop = footer.offsetTop;
                
                // フッターが画面に現れたら、ボタンの位置をフッターの高さ分だけ上に移動させる
                if (windowBottom > footerTop) {
                    const buttonBottom = windowBottom - footerTop + 20;
                    document.documentElement.style.setProperty('--back-to-top-bottom', `${buttonBottom}px`);
                } else {
                    document.documentElement.style.setProperty('--back-to-top-bottom', '20px');
                }
            };

            // スクロールイベントを監視
            window.addEventListener('scroll', checkPosition);
            window.addEventListener('resize', checkPosition);
            
            // ページ読み込み時にも位置をチェック
            checkPosition();
            
            // ボタンクリックでトップへスクロール
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    })
    .catch(error => {
        console.error('Error fetching footer:', error);
        document.getElementById('footer-placeholder').innerHTML = '<p>フッターの読み込みに失敗しました。</p>';
    });