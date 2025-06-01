document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.has-dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.mobile-toggle');
        const mainLink = dropdown.querySelector('.main-link');

        if (toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown && other.classList.contains('active')) {
                        other.classList.remove('active');
                    }
                });

                dropdown.classList.toggle('active');
            });
        }

        if (mainLink) {
            mainLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // Allow normal link behavior
                } else {
                    // Desktop behavior
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});