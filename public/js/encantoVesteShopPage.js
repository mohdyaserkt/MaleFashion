
// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortBy = document.getElementById('sortBy');
const viewButtons = document.querySelectorAll('.view-btn');
const searchModal = document.getElementById('searchModal');
const searchBtn = document.querySelector('.search-btn');
const closeModal = document.querySelector('.close-modal');
const mobileSearchBtn = document.querySelector('.mobile-search-btn');

// Initialize the shop
function initShop() {
  setupEventListeners();
}



// Filter and sort products
function filterAndSortProducts() {
  const category = categoryFilter.value;
  const priceRange = priceFilter.value;
  const sortOption = sortBy.value;
  
  let filteredProducts = [...products];
  
  // Category filter
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  
  // Price filter
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    if (priceRange.endsWith('+')) {
      filteredProducts = filteredProducts.filter(product => product.price >= min);
    } else {
      filteredProducts = filteredProducts.filter(product => product.price >= min && product.price <= max);
    }
  }
  
  // Sort products
  switch (sortOption) {
    case 'low-high':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'high-low':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // Assuming newer products have higher IDs
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
  }
  
  renderProducts(filteredProducts);
}

// Setup event listeners
function setupEventListeners() {
  // Filter/sort changes
  categoryFilter.addEventListener('change', filterAndSortProducts);
  priceFilter.addEventListener('change', filterAndSortProducts);
  sortBy.addEventListener('change', filterAndSortProducts);
  
  // View toggle
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      viewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      productsGrid.classList.toggle('list-view', this.dataset.view === 'list');
    });
  });
  
  // Search modal
  searchBtn?.addEventListener('click', function(e) {
    e.preventDefault();
    searchModal.style.display = 'flex';
  });
  
  mobileSearchBtn?.addEventListener('click', function() {
    searchModal.style.display = 'flex';
  });
  
  closeModal?.addEventListener('click', function() {
    searchModal.style.display = 'none';
  });
  
  window.addEventListener('click', function(e) {
    if (e.target === searchModal) {
      searchModal.style.display = 'none';
    }
  });
  
  // Quick view and wishlist buttons (event delegation)
  productsGrid.addEventListener('click', function(e) {
    if (e.target.closest('.quick-view')) {
      const productId = e.target.closest('.quick-view').dataset.id;
      // Implement quick view functionality
      console.log('Quick view product:', productId);
    }
    
    if (e.target.closest('.add-to-wishlist')) {
      const wishlistBtn = e.target.closest('.add-to-wishlist');
      const icon = wishlistBtn.querySelector('i');
      wishlistBtn.classList.toggle('active');
      
      if (wishlistBtn.classList.contains('active')) {
        icon.classList.replace('far', 'fas');
        icon.style.color = 'var(--error)';
      } else {
        icon.classList.replace('fas', 'far');
        icon.style.color = '';
      }
    }
    
    if (e.target.closest('.add-to-cart')) {
      // Implement add to cart functionality
      console.log('Product added to cart');
    }
  });
}

// Initialize the shop when DOM is loaded
document.addEventListener('DOMContentLoaded', initShop);