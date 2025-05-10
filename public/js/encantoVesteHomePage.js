document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu ul li a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        testimonials[index].classList.add('active');
    }
    
    prevBtn.addEventListener('click', function() {
        currentTestimonial--;
        if (currentTestimonial < 0) {
            currentTestimonial = testimonials.length - 1;
        }
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', function() {
        currentTestimonial++;
        if (currentTestimonial >= testimonials.length) {
            currentTestimonial = 0;
        }
        showTestimonial(currentTestimonial);
    });
    
    // Auto rotate testimonials
    setInterval(function() {
        currentTestimonial++;
        if (currentTestimonial >= testimonials.length) {
            currentTestimonial = 0;
        }
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Quick View Modal
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    const modalProductImage = document.getElementById('modalProductImage');
    const modalProductTitle = document.getElementById('modalProductTitle');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductDescription = document.getElementById('modalProductDescription');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img').src;
            const productTitle = productCard.querySelector('.product-info h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productData = {
                id: this.dataset.id,
                productInformation: this.dataset.productinformation,
                description: this.dataset.description,
                size:JSON.parse(this.dataset.size)
            };

            modalProductImage.src = productImage;
            modalProductTitle.textContent = productTitle;
            modalProductPrice.textContent = productPrice;
            modalProductDescription.textContent = productData.description + "\n" + productData.productInformation;
            const modalSizesSelect = document.getElementById("modalSizes");

            // Clear previous options
            modalSizesSelect.innerHTML = "";

            // Add new options dynamically
            productData.size.forEach(size => {
                const option = document.createElement("option");
                option.value = size;
                option.textContent = size;
                modalSizesSelect.appendChild(option);
            });

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Quantity Selector
    const quantityMinusBtns = document.querySelectorAll('.quantity-minus');
    const quantityPlusBtns = document.querySelectorAll('.quantity-plus');
    
    quantityMinusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });
    
    quantityPlusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });
    
    // Add to Cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            cartItems++;
            cartCount.textContent = cartItems;
            
            // Add animation to cart icon
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.classList.add('animate');
            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
        });
    });
    
    // Wishlist functionality
    const wishlistBtns = document.querySelectorAll('.add-to-wishlist');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff0000';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
        } else {
            header.style.padding = '15px 0';
        }
    });
});