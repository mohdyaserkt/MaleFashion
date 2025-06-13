document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });

    // In a real application, you would fetch the order details from your backend
    // and dynamically populate the page with the actual order data
    
    // Example of how you might handle printing the order
    const printOrderBtn = document.getElementById('print-order');
    if (printOrderBtn) {
        printOrderBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // Reset cart count in header
    document.querySelector('.cart-count').textContent = '0';
});