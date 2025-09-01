document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーを非同期で読み込む
    fetch('/html/_header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            
            if (headerPlaceholder) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const headerContent = doc.body.innerHTML;

                headerPlaceholder.innerHTML = headerContent;
                
                const headerBottom = headerPlaceholder.querySelector('.header-bottom');
                const headerTop = headerPlaceholder.querySelector('.header-top');
                
                if (headerBottom) {
                    headerPlaceholder.after(headerBottom);
                }
                
                if (headerTop) {
                    headerPlaceholder.before(headerTop);
                }

                const mobileNav = document.querySelector('.mobile-nav');
                const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
                
                if (headerTop && mobileNav) {
                    const setMobileNavPosition = () => {
                        mobileNav.style.top = `${headerTop.offsetHeight}px`;
                        mobileNavOverlay.style.top = `${headerTop.offsetHeight}px`;
                    };
                    setMobileNavPosition();
                    window.addEventListener('resize', setMobileNavPosition);
                }

                initializeHeaderFunctions();
            } else {
                console.error("Error: Element with id 'header-placeholder' not found.");
            }
        })
        .catch(error => {
            console.error('Error fetching header:', error);
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = '<p>ヘッダーの読み込みに失敗しました。</p>';
            }
        });

    //==================================
    // ヘッダー関連の機能を初期化する関数
    //==================================
    function initializeHeaderFunctions() {
        const topContainer = document.querySelector('.header-top');
        const bottomContainer = document.querySelector('.header-bottom');
        const mobileNav = document.querySelector('.mobile-nav');
        const overlay = document.querySelector('.mobile-nav-overlay');

        if (topContainer && bottomContainer) {
            initializeMegaMenu();
            initializeHeaderScroll(topContainer, bottomContainer);
        }

        const hamburgerMenu = document.querySelector('.hamburger-menu');
        if (hamburgerMenu && mobileNav) {
            const openMenu = () => {
                hamburgerMenu.classList.add('is-active');
                mobileNav.classList.add('is-visible');
                overlay.classList.add('is-visible');
                document.body.style.overflow = 'hidden';
            };

            const closeMenu = () => {
                hamburgerMenu.classList.remove('is-active');
                mobileNav.classList.remove('is-visible');
                overlay.classList.remove('is-visible');
                document.body.style.overflow = '';
            };

            hamburgerMenu.addEventListener('click', () => {
                if (mobileNav.classList.contains('is-visible')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            overlay.addEventListener('click', closeMenu);
        }
    }
    
    //==================================
    // メガメニューの機能を初期化する関数 (更新版)
    //==================================
    function initializeMegaMenu() {
        const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');
        let activeDropdown = null;
        let timeoutId = null;

        navItemsWithDropdown.forEach(navItem => {
            const targetDropdown = document.getElementById(navItem.dataset.dropdownTarget);
            
            navItem.addEventListener('mouseenter', () => {
                // ドロップダウンを非表示にしてから、新しいものを表示
                if (activeDropdown) {
                    activeDropdown.classList.remove('is-visible');
                    const parentNavItem = document.querySelector(`.nav-item[data-dropdown-target="${activeDropdown.id}"]`);
                    if (parentNavItem) {
                        parentNavItem.classList.remove('is-active');
                    }
                }
                
                if (targetDropdown) {
                    targetDropdown.classList.add('is-visible');
                    navItem.classList.add('is-active'); // 親アイテムにクラスを追加
                    activeDropdown = targetDropdown;
                    // メニュー表示時にボーダーの高さを調整
                    if (targetDropdown.id === 'product-dropdown') {
                        adjustDropdownBorderHeight(targetDropdown);
                    }
                }
            });

            // 親要素からマウスが離れた時の処理
            navItem.addEventListener('mouseleave', () => {
                timeoutId = setTimeout(() => {
                    if (!navItem.matches(':hover') && (!activeDropdown || !activeDropdown.matches(':hover'))) {
                        if (activeDropdown) {
                            activeDropdown.classList.remove('is-visible');
                            activeDropdown = null;
                        }
                        navItem.classList.remove('is-active'); // 親アイテムからクラスを削除
                    }
                }, 150);
            });

            // ドロップダウンメニューにマウスが入った時の処理
            if (targetDropdown) {
                targetDropdown.addEventListener('mouseenter', () => {
                    clearTimeout(timeoutId);
                    navItem.classList.add('is-active'); // 親アイテムにクラスを追加
                });

                // ドロップダウンメニューからマウスが離れた時の処理
                targetDropdown.addEventListener('mouseleave', () => {
                    if (activeDropdown) {
                        activeDropdown.classList.remove('is-visible');
                        activeDropdown = null;
                    }
                    navItem.classList.remove('is-active'); // 親アイテムからクラスを削除
                });
            }
        });

        const productCategories = document.getElementById('product-categories');
        const subDropdownContainer = document.querySelector('.sub-dropdown-list-container');
        const imageContainer = document.querySelector('.dropdown-image-container');

        if (productCategories && subDropdownContainer && imageContainer) {
            // ドロップダウンリスト項目にマウスホバーイベントを追加
            const listItemsWithSublist = productCategories.querySelectorAll('.has-sub-list');
            listItemsWithSublist.forEach(listItem => {
                listItem.addEventListener('mouseenter', () => {
                    // 他のハイライトをリセット
                    productCategories.querySelectorAll('li').forEach(li => li.classList.remove('is-hovered'));
                    listItem.classList.add('is-hovered');
                    
                    const subList = listItem.querySelector('.sub-dropdown-menu');
                    if (subList) {
                        subDropdownContainer.innerHTML = subList.innerHTML;
                    } else {
                        subDropdownContainer.innerHTML = '';
                    }
                    // 子リスト表示時にボーダーの高さを再調整
                    adjustDropdownBorderHeight(document.getElementById('product-dropdown'));
                });
            });

            // サブドロップダウンコンテナにマウスが入った時の処理
            subDropdownContainer.addEventListener('mouseenter', () => {
                // 親のリストアイテムのハイライトを維持
                const hoveredItem = productCategories.querySelector('li.is-hovered');
                if (hoveredItem) {
                    hoveredItem.classList.add('is-hovered');
                }
            });

            // サブドロップダウンコンテナからマウスが離れた時の処理
            subDropdownContainer.addEventListener('mouseleave', () => {
                // ハイライトを削除
                productCategories.querySelectorAll('li').forEach(li => li.classList.remove('is-hovered'));
                subDropdownContainer.innerHTML = '';
                imageContainer.innerHTML = '';
            });

            // 画像コンテナにマウスが入った時の処理
            imageContainer.addEventListener('mouseenter', () => {
                    // 親のリストアイテムのハイライトを維持
                const hoveredItem = productCategories.querySelector('li.is-hovered');
                if (hoveredItem) {
                    hoveredItem.classList.add('is-hovered');
                }
            });

            subDropdownContainer.addEventListener('mouseenter', (event) => {
                const link = event.target.closest('a');
                if (link) {
                    const targetId = link.getAttribute('data-image-target');
                    const dataElement = document.getElementById(targetId);
                    if (dataElement) {
                        imageContainer.innerHTML = dataElement.innerHTML;
                    } else {
                        imageContainer.innerHTML = '';
                    }
                }
            }, true);

            const productDropdown = document.getElementById('product-dropdown');
            if (productDropdown) {
                productDropdown.addEventListener('mouseleave', () => {
                    subDropdownContainer.innerHTML = '';
                    imageContainer.innerHTML = '';
                });
            }
        }
    }

    //==================================
    // ボーダーの高さを調整する新しい関数
    //==================================
    function adjustDropdownBorderHeight(dropdownMenu) {
        const leftContainer = dropdownMenu.querySelector('.dropdown-list-container');
        const middleContainer = dropdownMenu.querySelector('.sub-dropdown-list-container');
        
        if (leftContainer && middleContainer) {
            // コンテナの高さをリセットして再計算
            leftContainer.style.height = 'auto';
            middleContainer.style.height = 'auto';

            // 両方のコンテナの高さを取得
            const leftHeight = leftContainer.offsetHeight;
            const middleHeight = middleContainer.offsetHeight;

            // 高い方の高さを設定
            const maxHeight = Math.max(leftHeight, middleHeight);
            
            // `min-height`を使って、コンテンツが増えても対応できるようにする
            leftContainer.style.minHeight = `${maxHeight}px`;
            middleContainer.style.minHeight = `${maxHeight}px`;
        }
    }

    //==================================
    // 製品ページの機能（変更なし）
    //==================================
    const categoryTabs = document.querySelectorAll('.category-tab');
    const productItems = document.querySelectorAll('.product-item');
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || 'all';

    function filterProducts(category) {
        categoryTabs.forEach(tab => tab.classList.remove('active'));
        const activeTab = document.querySelector(`.category-tab[data-category="${category}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        productItems.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterProducts(initialCategory);

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const selectedCategory = tab.getAttribute('data-category');
            filterProducts(selectedCategory);
            const newUrl = window.location.origin + window.location.pathname + `?category=${selectedCategory}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        });
    });

    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        filterProducts(category);
    });

    //==================================
    // モバイル用アコーディオンメニュー
    //==================================
    document.querySelectorAll('.category-title').forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            title.classList.toggle('is-open');
            content.classList.toggle('is-visible');
        });
    });

    const mobileCategoryLinks = document.querySelectorAll('.category-items li a');
    mobileCategoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedCategory = link.getAttribute('data-category');
            filterProducts(selectedCategory);
            
            const parentContainer = link.closest('.category-list-container');
            if (parentContainer) {
                const title = parentContainer.querySelector('.category-title');
                const content = parentContainer.querySelector('.category-items');
                if (title && content) {
                    title.classList.remove('is-open');
                    content.classList.remove('is-visible');
                }
            }
        });
    });
});

function initializeHeaderScroll(topContainer, bottomContainer) {
    const headerTopHeight = topContainer.offsetHeight;
    window.addEventListener('scroll', () => {
        if (window.scrollY > headerTopHeight) {
            bottomContainer.classList.add('is-stuck');
        } else {
            bottomContainer.classList.remove('is-stuck');
        }
    });
}