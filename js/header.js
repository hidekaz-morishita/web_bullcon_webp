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
                // DOMParserを使ってHTML文字列を解析
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const headerContent = doc.body.innerHTML;

                // 既存のコンテンツをクリアしてからヘッダーを挿入
                headerPlaceholder.innerHTML = headerContent;

                // ヘッダーの初期化とイベントリスナーを再設定
                const topContainer = document.querySelector('.header-top');
                const bottomContainer = document.querySelector('.header-bottom');
                const mobileNav = document.querySelector('.mobile-nav');

                if (topContainer && bottomContainer) {
                    initializeDropdowns(bottomContainer);
                    initializeDropdownImages(bottomContainer);
                    initializeHeaderScroll(topContainer, bottomContainer);
                }
                
                const hamburgerMenu = document.querySelector('.hamburger-menu');
                if (hamburgerMenu && mobileNav) {
                    hamburgerMenu.addEventListener('click', () => {
                        hamburgerMenu.classList.toggle('is-active');
                        mobileNav.classList.toggle('is-visible');
                    });
                }
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
    // 製品ページの機能
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

function initializeDropdowns(container) {
    const navItemsWithDropdown = container.querySelectorAll('.nav-item.has-dropdown');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    let activeDropdown = null;
    let timeoutId = null;

    navItemsWithDropdown.forEach(navItem => {
        const targetId = navItem.dataset.dropdownTarget;
        const targetDropdown = document.querySelector(`#${targetId}`);
        navItem.addEventListener('mouseenter', () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            dropdownMenus.forEach(menu => {
                menu.classList.remove('is-visible');
            });
            if (targetDropdown) {
                targetDropdown.classList.add('is-visible');
                activeDropdown = targetDropdown;
            }
        });
        navItem.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                if (activeDropdown && !navItem.matches(':hover') && !activeDropdown.matches(':hover')) {
                    activeDropdown.classList.remove('is-visible');
                    activeDropdown = null;
                }
            }, 150);
        });
    });
    dropdownMenus.forEach(menu => {
        menu.addEventListener('mouseleave', () => {
            if (activeDropdown) {
                activeDropdown.classList.remove('is-visible');
                activeDropdown = null;
            }
        });
    });
}

function initializeDropdownImages(container) {
    const dropdownLinks = container.querySelectorAll('.dropdown-list a');
    const dropdownImageContainer = document.querySelector('.dropdown-image-container');
    const dropdownImage = dropdownImageContainer ? dropdownImageContainer.querySelector('img') : null;
    const dropdownDescription = dropdownImageContainer ? dropdownImageContainer.querySelector('p') : null;

    if (!dropdownImage || !dropdownDescription) return;

    dropdownLinks.forEach(link => {
        const imageUrl = link.getAttribute('data-image');
        const description = link.getAttribute('data-description');
        
        link.addEventListener('mouseenter', () => {
            if (imageUrl) {
                dropdownImage.src = imageUrl;
                dropdownDescription.textContent = description;
                dropdownImageContainer.classList.add('is-visible');
            }
        });
        
        link.addEventListener('mouseleave', () => {
            const isHoveringAnotherLink = Array.from(dropdownLinks).some(otherLink => otherLink.matches(':hover'));
            if (!isHoveringAnotherLink) {
                dropdownImageContainer.classList.remove('is-visible');
            }
        });
    });

    const productDropdown = container.querySelector('#product-dropdown');
    if (productDropdown) {
        productDropdown.addEventListener('mouseleave', () => {
            dropdownImageContainer.classList.remove('is-visible');
        });
    }
}