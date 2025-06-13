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

    // Quantity controls
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('.quantity-input');
        
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateCartItem(control.closest('.cart-item'));
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateCartItem(control.closest('.cart-item'));
        });
        
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            updateCartItem(control.closest('.cart-item'));
        });
    });

    // Remove item from cart
    const removeBtns = document.querySelectorAll('.remove-btn');
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.classList.add('removing');
            
            setTimeout(() => {
                cartItem.remove();
                updateCartTotals();
            }, 300);
        });
    });

    // Update cart button
    const updateCartBtn = document.querySelector('.update-cart');
    
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            updateCartTotals();
            // Show success message
            alert('Cart updated successfully!');
        });
    }

    // Coupon form
    const couponForm = document.querySelector('.coupon-form');
    
    if (couponForm) {
        couponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const couponInput = this.querySelector('input');
            
            // Here you would typically validate the coupon code with your backend
            if (couponInput.value.trim() === '') {
                alert('Please enter a coupon code');
                return;
            }
            
            // Simulate coupon validation
            if (couponInput.value.toLowerCase() === 'encanto20') {
                alert('Coupon applied successfully! 20% discount added.');
                // Update totals with discount
                document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = '-$50.00';
                updateCartTotals();
            } else {
                alert('Invalid coupon code');
            }
        });
    }

    // Function to update cart item subtotal
    function updateCartItem(cartItem) {
        const price = parseFloat(cartItem.querySelector('.item-price').textContent.replace('$', ''));
        const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
        const subtotal = cartItem.querySelector('.item-subtotal');
        
        subtotal.textContent = '$' + (price * quantity).toFixed(2);
        updateCartTotals();
    }

    // Function to update cart totals
    function updateCartTotals() {
        let subtotal = 0;
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const itemSubtotal = parseFloat(item.querySelector('.item-subtotal').textContent.replace('$', ''));
            subtotal += itemSubtotal;
        });
        
        // Update subtotal in summary
        document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = '$' + subtotal.toFixed(2);
        
        // Calculate shipping (example: free shipping over $200)
        const shipping = subtotal > 200 ? 0 : 9.99;
        document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
        
        // Check if discount exists
        const discountText = document.querySelector('.summary-row:nth-child(3) span:last-child').textContent;
        const discount = discountText.includes('-$') ? parseFloat(discountText.replace('-$', '')) : 0;
        
        // Calculate total
        const total = subtotal + shipping - discount;
        document.querySelector('.summary-row.total span:last-child').textContent = '$' + total.toFixed(2);
        
        // Update cart count in header
        let itemCount = 0;
        cartItems.forEach(item => {
            itemCount += parseInt(item.querySelector('.quantity-input').value);
        });
        document.querySelector('.cart-count').textContent = itemCount;
    }

    // Initialize cart totals
    updateCartTotals();
});