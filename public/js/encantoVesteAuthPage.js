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

// Updated JavaScript
const setupOTPInputs = () => {
  const otpInputs = document.querySelectorAll('.otp-container input');
  
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && index > 0 && !e.target.value) {
        otpInputs[index - 1].focus();
      }
    });
  });
};

let email = ''; // Store email for resend

document.getElementById('otpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const otpSection = document.getElementById('otpSection');
  const otpBtn = document.getElementById('otpActionBtn');
  const errorElement = document.getElementById('errorMessage');

  if (!otpSection.style.display || otpSection.style.display === 'none') {
    // Send OTP phase
    email = document.getElementById('otpEmail').value.trim();
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      otpSection.style.display = 'block';
      otpBtn.innerHTML = '<span>Verify OTP</span> <i class="fas fa-check"></i>';
      setupOTPInputs();
      startResendCooldown();
    } catch (error) {
      errorElement.textContent = error.message;
    }
  } else {
    // Verify OTP phase
    const otp = Array.from(document.querySelectorAll('.otp-container input'))
                   .map(input => input.value)
                   .join('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      window.location.href = data.redirect || '/';
    } catch (error) {
      errorElement.textContent = error.message;
    }
  }
});

// Resend OTP functionality
document.getElementById('resendOtp').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP');
    }

    startResendCooldown();
  } catch (error) {
    document.getElementById('errorMessage').textContent = error.message;
  }
});

let cooldownInterval;
function startResendCooldown() {
  let seconds = 30;
  const resendLink = document.getElementById('resendOtp');
  resendLink.style.pointerEvents = 'none';
  
  cooldownInterval = setInterval(() => {
    resendLink.textContent = `Resend (${seconds}s)`;
    seconds--;
    
    if (seconds < 0) {
      clearInterval(cooldownInterval);
      resendLink.textContent = 'Resend';
      resendLink.style.pointerEvents = 'auto';
    }
  }, 1000);
}
// Password Strength Check (Signup)
document.getElementById('password')?.addEventListener('input', function() {
  const hints = this.parentElement.querySelector('.password-hints p');
  const strength = checkPasswordStrength(this.value);
  
  hints.style.color = strength.color;
  hints.textContent = strength.message;
});

function checkPasswordStrength(password) {
  if (password.length === 0) {
    return { 
      message: 'Use 8+ characters with mix of letters, numbers & symbols',
      color: 'var(--light-text)'
    };
  } else if (password.length < 8) {
    return { 
      message: 'Too short (min 8 characters)',
      color: 'var(--error)'
    };
  } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { 
      message: 'Good, but could be stronger',
      color: 'orange'
    };
  } else {
    return { 
      message: 'Strong password!',
      color: 'var(--success)'
    };
  }
}