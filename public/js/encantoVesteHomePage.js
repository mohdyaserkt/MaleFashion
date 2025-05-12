document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  mobileMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu ul li a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Testimonial Slider
  const testimonials = document.querySelectorAll(".testimonial");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial) => {
      testimonial.classList.remove("active");
    });
    testimonials[index].classList.add("active");
  }

  prevBtn.addEventListener("click", function () {
    currentTestimonial--;
    if (currentTestimonial < 0) {
      currentTestimonial = testimonials.length - 1;
    }
    showTestimonial(currentTestimonial);
  });

  nextBtn.addEventListener("click", function () {
    currentTestimonial++;
    if (currentTestimonial >= testimonials.length) {
      currentTestimonial = 0;
    }
    showTestimonial(currentTestimonial);
  });

  // Auto rotate testimonials
  setInterval(function () {
    currentTestimonial++;
    if (currentTestimonial >= testimonials.length) {
      currentTestimonial = 0;
    }
    showTestimonial(currentTestimonial);
  }, 5000);

  
  // Wishlist functionality
  const wishlistBtns = document.querySelectorAll(".add-to-wishlist");

  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      const icon = this.querySelector("i");
      if (this.classList.contains("active")) {
        icon.classList.remove("far");
        icon.classList.add("fas");
        icon.style.color = "#ff0000";
      } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
        icon.style.color = "";
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Header scroll effect
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 100) {
      header.style.padding = "10px 0";
    } else {
      header.style.padding = "15px 0";
    }
  });

 
  // Attach the event listener ONCE outside the loop
document
  .getElementById("quickViewAddToCart")
  .addEventListener("click", function () {
    const productId = this.getAttribute("data-id");
    const selectedSize = document.getElementById("sizeSelect").value;
    const quantity = document.querySelector(
      ".quantity-control input[type='number']"
    ).value;

    const selectedColorElement = document.querySelector(".color-option.selected");
    const selectedColor = selectedColorElement ? selectedColorElement.title : null;

    addToCart(productId, selectedSize, quantity, selectedColor, "aaaa");
  });


  // Quick View Modal functionality
  const quickViewBtns = document.querySelectorAll(".quick-view");
  const modal = document.getElementById("quickViewModal");
  const closeModal = document.querySelector(".close-modal");
  const modalProductImage = document.getElementById("modalProductImage");
  const modalProductTitle = document.getElementById("modalProductTitle");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const modalProductDescription = document.getElementById(
    "modalProductDescription"
  );
  const colorOptions = document.getElementById("colorOptions");
  const sizeSelect = document.getElementById("sizeSelect");
  const productQuantity = document.getElementById("productQuantity");
  const thumbnailsContainer = document.querySelector(".image-thumbnails");

  quickViewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log("here is iam");

      const productData = {
        id: this.dataset.id,
        productInformation: this.dataset.productinformation,
        description: this.dataset.description,
        size: JSON.parse(this.dataset.size),
        images: JSON.parse(this.dataset.images),
        sku: this.dataset.sku,
        category: this.dataset.category,
        colors: JSON.parse(this.dataset.colors),
        price: this.dataset.price,
      };

      if (productData) {
        // Set main product info
        modalProductImage.src = productData.images[0];
        modalProductTitle.textContent = productData.title;
        modalProductPrice.textContent = `₹${productData.price}`;
        modalProductDescription.textContent =
          productData.description + "\n" + productData.productInformation;
        document.getElementById("productSKU").textContent = "EV-2023-001";
        document.getElementById("productCategory").textContent =
          productData.category;
          // Set data attributes on Add to Cart button
            const quickViewAddToCartButton = document.getElementById("quickViewAddToCart");
            quickViewAddToCartButton.setAttribute("data-id", productData.id);
   
        // Create thumbnails
        thumbnailsContainer.innerHTML = "";
        productData.images.forEach((img, index) => {
          const thumbnail = document.createElement("img");
          thumbnail.src = img;
          thumbnail.alt = `Thumbnail ${index + 1}`;
          thumbnail.addEventListener("click", () => {
            modalProductImage.src = img;
          });
          thumbnailsContainer.appendChild(thumbnail);
        });

        // Create color options
        colorOptions.innerHTML = "";
        productData.colors.forEach((color, index) => {
          const colorOption = document.createElement("div");
          colorOption.className = "color-option";
          colorOption.style.backgroundColor = color;
          colorOption.title = color;
          if (index === 0) colorOption.classList.add("selected");

          colorOption.addEventListener("click", () => {
            document.querySelectorAll(".color-option").forEach((opt) => {
              opt.classList.remove("selected");
            });
            colorOption.classList.add("selected");
          });

          colorOptions.appendChild(colorOption);
        });

        // Create size options
        sizeSelect.innerHTML = "";
        productData.size.forEach((size) => {
          const option = document.createElement("option");
          option.value = size;
          option.textContent = size;
          sizeSelect.appendChild(option);
        });

        // Reset quantity
        productQuantity.value = 1;

        // Show modal
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    document.body.style.overflow = "";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Quantity controls
  document.querySelectorAll(".quantity-minus").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (parseInt(productQuantity.value) > 1) {
        productQuantity.value = parseInt(productQuantity.value) - 1;
      }
    });
  });

  document.querySelectorAll(".quantity-plus").forEach((btn) => {
    btn.addEventListener("click", function () {
      productQuantity.value = parseInt(productQuantity.value) + 1;
    });
  });
});


  function addToCart(id, size, quantity,colour) {
    $.ajax({
      url: `/user-addtocart/${id}`,
      data: {
        size,
        quantity,
        colour
      },
      method: "POST",
      success: (response) => {
        if (response.status == true) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            iconColor: "#a5dc86",
            background: "black",
            color: "#a5dc86",

            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "Product Added TO Wishlist",
          });
        } else {
          window.location.href = "/user-login-email";
        }
      },
    });
  }

 function addToWishlist(id) {
    $.ajax({
      url: "/add-to-wishlist",
      data: {
        productid: id,
      },
      method: "POST",
      success: (response) => {
        if (response.status == true) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            iconColor: "#a5dc86",
            background: "black",
            color: "#a5dc86",

            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "Product Added TO Wishlist",
          });
        } else {
          window.location.href = "/user-login-email";
        }
      },
    });
  }
