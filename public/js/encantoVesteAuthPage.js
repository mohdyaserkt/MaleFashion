// Toggle Password Visibility
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', function() {
    const icon = this.querySelector('i');
    const input = this.parentElement.querySelector('input');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// Form Submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  // Add your authentication logic here
  console.log('Login form submitted');
});