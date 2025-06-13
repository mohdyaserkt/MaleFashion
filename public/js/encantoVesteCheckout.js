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

    // Address selection
    const addressOptions = document.querySelectorAll('.address-option input[type="radio"]');
    
    addressOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                // In a real application, you would populate the form fields with the selected address data
                console.log('Selected address:', this.id);
            }
        });
    });

    // Add new address button
    const addNewAddressBtn = document.querySelector('.add-new-address');
    
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real application, this would show a form to add a new address
            alert('Add new address functionality would open a form here');
        });
    }

    // Wallet balance toggle
    const useWalletCheckbox = document.getElementById('use-wallet');
    const remainingBalance = document.querySelector('.remaining-balance span');
    const grandTotal = document.querySelector('.grand-total span');
    const walletBalance = 150; // Example wallet balance
    
    if (useWalletCheckbox) {
        useWalletCheckbox.addEventListener('change', function() {
            const total = parseFloat(grandTotal.textContent.replace('$', ''));
            
            if (this.checked) {
                const remaining = total - walletBalance;
                remainingBalance.textContent = '$' + remaining.toFixed(2);
            } else {
                remainingBalance.textContent = '$' + total.toFixed(2);
            }
        });
    }

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-option input[type="radio"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.checked) {
                console.log('Selected payment method:', this.id);
            }
        });
    });

    // Form submission
    const billingForm = document.getElementById('billing-form');
    
    if (billingForm) {
        billingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    isValid = false;
                    
                    // Remove error style when user starts typing
                    field.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.style.borderColor = '';
                        }
                    });
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Validate terms agreement
            const termsAgreement = document.getElementById('terms');
            
            if (!termsAgreement.checked) {
                alert('Please agree to the terms and conditions');
                return;
            }
            
            // In a real application, you would submit the form data to your server
            console.log('Form submitted');
            alert('Order placed successfully!');
            
            // Redirect to order confirmation page
            // window.location.href = 'order-confirmation.html';
        });
    }

    // Initialize wallet display
    if (useWalletCheckbox && remainingBalance && grandTotal) {
        const total = parseFloat(grandTotal.textContent.replace('$', ''));
        remainingBalance.textContent = '$' + total.toFixed(2);
    }
});