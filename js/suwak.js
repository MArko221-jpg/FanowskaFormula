// JavaScript dla responsywnego menu z suwakiem przewijania
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const menuCollapseBtn = document.getElementById('menu-collapse-btn');
    const nav = document.querySelector('nav');
    const menuScrollbar = document.getElementById('menu-scrollbar');
    const menuScrollbarThumb = document.getElementById('menu-scrollbar-thumb');
    
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    
    // Funkcja sprawdzająca czy menu potrzebuje przewijania i aktualizująca suwak
    function updateScrollbar() {
        if (window.innerWidth > 768 && mainMenu) {
            const menuScrollWidth = mainMenu.scrollWidth;
            const menuClientWidth = mainMenu.clientWidth;
            
            if (menuScrollWidth > menuClientWidth) {
                // Menu potrzebuje przewijania - pokaż suwak
                menuScrollbar.classList.add('visible');
                
                // Oblicz wielkość i pozycję suwaka
                const thumbWidth = (menuClientWidth / menuScrollWidth) * 100;
                const thumbPosition = (mainMenu.scrollLeft / (menuScrollWidth - menuClientWidth)) * (100 - thumbWidth);
                
                menuScrollbarThumb.style.width = thumbWidth + '%';
                menuScrollbarThumb.style.left = thumbPosition + '%';
            } else {
                // Menu nie potrzebuje przewijania - ukryj suwak
                menuScrollbar.classList.remove('visible');
            }
        } else {
            menuScrollbar.classList.remove('visible');
        }
    }
    
    // Obsługa przeciągania suwaka
    menuScrollbarThumb.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        scrollLeft = mainMenu.scrollLeft;
        menuScrollbarThumb.classList.add('dragging');
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const scrollbarWidth = menuScrollbar.offsetWidth;
        const thumbWidth = menuScrollbarThumb.offsetWidth;
        const maxScroll = mainMenu.scrollWidth - mainMenu.clientWidth;
        const scrollRatio = deltaX / (scrollbarWidth - thumbWidth);
        
        mainMenu.scrollLeft = scrollLeft + (scrollRatio * maxScroll);
        updateScrollbar();
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            menuScrollbarThumb.classList.remove('dragging');
        }
    });
    
    // Kliknięcie na pasek suwaka (poza suwakiem)
    menuScrollbar.addEventListener('click', function(e) {
        if (e.target === menuScrollbar) {
            const rect = menuScrollbar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const scrollbarWidth = menuScrollbar.offsetWidth;
            const clickRatio = clickX / scrollbarWidth;
            const maxScroll = mainMenu.scrollWidth - mainMenu.clientWidth;
            
            mainMenu.scrollLeft = clickRatio * maxScroll;
            updateScrollbar();
        }
    });
    
    // Aktualizuj suwak gdy menu się przewija
    mainMenu.addEventListener('scroll', function() {
        updateScrollbar();
    });
    
    // Sprawdź przewijanie przy ładowaniu i zmianie rozmiaru
    updateScrollbar();
    window.addEventListener('resize', function() {
        updateScrollbar();
        
        if (window.innerWidth > 768) {
            mainMenu.classList.remove('show');
            mobileMenuToggle.classList.remove('active');
            
            // Zamknij submenu tylko na mobile
            const openSubmenus = document.querySelectorAll('.show-submenu');
            openSubmenus.forEach(item => item.classList.remove('show-submenu'));
        }
        
        if (window.innerWidth > 1024) {
            mainMenu.classList.remove('collapsed');
            menuCollapseBtn.classList.remove('collapsed');
        }
    });
    
    // Toggle głównego menu na mobile
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainMenu.classList.toggle('show');
        
        // Zamknij submenu tylko na mobile
        if (window.innerWidth <= 768) {
            const openSubmenus = document.querySelectorAll('.show-submenu');
            openSubmenus.forEach(item => item.classList.remove('show-submenu'));
        }
    });
    
    // Przycisk zwijania menu
    menuCollapseBtn.addEventListener('click', function() {
        mainMenu.classList.toggle('collapsed');
        this.classList.toggle('collapsed');
        
        // Zamknij submenu tylko przy zwijaniu
        const openSubmenus = document.querySelectorAll('.show-submenu');
        openSubmenus.forEach(item => item.classList.remove('show-submenu'));
        
        setTimeout(updateScrollbar, 300);
    });
    
    // Obsługa dropdown menu - FLOATING MODAL NAD STRONĄ
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const hasDropdownItems = document.querySelectorAll('.has-dropdown');
    
    // Obsługa kliknięć na mobile - MODAL DROPDOWN
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const parentLi = this.parentElement;
                const submenu = parentLi.querySelector('ul');
                const isCurrentlyOpen = parentLi.classList.contains('show-submenu');
                
                // Zamknij wszystkie inne submenu
                document.querySelectorAll('.has-dropdown').forEach(item => {
                    if (item !== parentLi) {
                        item.classList.remove('show-submenu');
                    }
                });
                
                // Toggle aktualnego submenu
                if (isCurrentlyOpen) {
                    parentLi.classList.remove('show-submenu');
                } else {
                    parentLi.classList.add('show-submenu');
                    
                    // Dodaj tytuł do dropdown
                    if (submenu) {
                        const menuTitle = this.textContent.trim();
                        submenu.setAttribute('data-title', menuTitle);
                        
                        // Dodaj event listener dla przycisku zamknij
                        setTimeout(() => {
                            const closeBtn = submenu.querySelector('li:last-child');
                            if (closeBtn) {
                                closeBtn.addEventListener('click', function() {
                                    parentLi.classList.remove('show-submenu');
                                });
                            }
                        }, 100);
                    }
                }
            }
        });
    });
    
    // Obsługa hover na desktop - NATYCHMIASTOWE REAKCJE
    hasDropdownItems.forEach(item => {
        const submenu = item.querySelector('ul');
        let isInDropdownArea = false;
        
        // Funkcja pozycjonowania dropdown
        function positionDropdown() {
            if (submenu && window.innerWidth > 768) {
                const rect = item.getBoundingClientRect();
                const submenuHeight = submenu.offsetHeight || 200;
                const viewportHeight = window.innerHeight;
                const gap = 5;
                
                submenu.style.left = rect.left + 'px';
                
                if (rect.bottom + submenuHeight + gap > viewportHeight) {
                    submenu.style.top = (rect.top - submenuHeight - gap) + 'px';
                } else {
                    submenu.style.top = (rect.bottom + gap) + 'px';
                }
            }
        }
        
        // NATYCHMIASTOWE pojawianie przy mouseenter
        item.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                isInDropdownArea = true;
                positionDropdown();
                this.classList.add('show-hover');
            }
        });
        
        // NATYCHMIASTOWE znikanie przy mouseleave
        item.addEventListener('mouseleave', function(e) {
            if (window.innerWidth > 768) {
                // Sprawdź czy kursor przechodzi do submenu
                const relatedTarget = e.relatedTarget;
                if (!submenu.contains(relatedTarget)) {
                    isInDropdownArea = false;
                    this.classList.remove('show-hover');
                }
            }
        });
        
        // Obsługa submenu
        if (submenu) {
            submenu.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) {
                    isInDropdownArea = true;
                }
            });
            
            submenu.addEventListener('mouseleave', function() {
                if (window.innerWidth > 768) {
                    isInDropdownArea = false;
                    item.classList.remove('show-hover');
                }
            });
        }
    });
    
    // NATYCHMIASTOWE zamknięcie przy kliknięciu, scroll, resize + OVERLAY SUPPORT
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
            // Desktop - zamknij hover dropdown
            if (!nav.contains(e.target)) {
                hasDropdownItems.forEach(item => {
                    item.classList.remove('show-hover');
                });
            }
        } else {
            // Mobile - zamknij dropdown jeśli kliknięto w tło overlay
            const activeDropdown = document.querySelector('.has-dropdown.show-submenu ul');
            if (activeDropdown && e.target === activeDropdown) {
                // Kliknięto w overlay (::before pseudo-element)
                hasDropdownItems.forEach(item => {
                    item.classList.remove('show-submenu');
                });
            }
            // Zamknij też jeśli kliknięto poza menu (ale nie w dropdown)
            else if (!nav.contains(e.target) && !e.target.closest('.has-dropdown ul')) {
                hasDropdownItems.forEach(item => {
                    item.classList.remove('show-submenu');
                });
            }
        }
    });
    
    // Dodaj obsługę kliknięcia w overlay
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const clickedDropdown = e.target.closest('nav ul li ul');
            if (clickedDropdown && e.target === clickedDropdown) {
                // Kliknięto w tło dropdown - zamknij
                hasDropdownItems.forEach(item => {
                    item.classList.remove('show-submenu');
                });
            }
        }
    });
    
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 768) {
            hasDropdownItems.forEach(item => {
                item.classList.remove('show-hover');
            });
        } else {
            // Na mobile też zamknij przy scroll
            hasDropdownItems.forEach(item => {
                item.classList.remove('show-submenu');
            });
        }
    });
    
    window.addEventListener('resize', function() {
        hasDropdownItems.forEach(item => {
            item.classList.remove('show-hover');
            item.classList.remove('show-submenu');
        });
    });
    
    // ESC key - natychmiastowe zamknięcie
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hasDropdownItems.forEach(item => {
                item.classList.remove('show-hover');
                item.classList.remove('show-submenu');
            });
        }
    });
    
    // Zamknij menu po kliknięciu linku (na mobile)
    const menuLinks = document.querySelectorAll('#main-menu a:not(.dropdown-toggle)');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainMenu.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
                
                const openSubmenus = document.querySelectorAll('.show-submenu');
                openSubmenus.forEach(item => item.classList.remove('show-submenu'));
            }
        });
    });
    
    // Funkcja do oznaczania aktywnej strony
    function setActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'Menu.html';
        const menuLinks = document.querySelectorAll('#main-menu a');
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveMenuItem();
    
    // Sprawdzenie przewijania po załadowaniu fontów
    if (document.fonts) {
        document.fonts.ready.then(function() {
            updateScrollbar();
        });
    }
});