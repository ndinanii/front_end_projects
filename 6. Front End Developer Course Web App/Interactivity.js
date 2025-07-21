document.addEventListener('DOMContentLoaded', () => {
    // --- Burger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- Content Tabs Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentCategories = document.querySelectorAll('.content-category');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor link behavior

            // Update active link style
            navLinks.forEach(item => item.classList.remove('active-link'));
            link.classList.add('active-link');

            // Show the correct content category
            const targetId = link.getAttribute('href').substring(1); // Get the id from href (e.g., "fundamentals")
            contentCategories.forEach(category => {
                if (category.id === targetId) {
                    category.classList.add('active-content');
                } else {
                    category.classList.remove('active-content');
                }
            });

            // Close mobile menu after clicking a link
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
});