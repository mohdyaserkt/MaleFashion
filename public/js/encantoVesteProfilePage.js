// Edit Personal Info Toggle
const editPersonalBtn = document.getElementById('editPersonalInfo');
const cancelPersonalBtn = document.getElementById('cancelPersonalEdit');
const savePersonalBtn = document.getElementById('savePersonalInfo');
const personalInfoActions = document.getElementById('personalInfoActions');

if (editPersonalBtn) {
  editPersonalBtn.addEventListener('click', function() {
    // Show edit inputs
    document.querySelectorAll('.edit-input').forEach(input => {
      input.style.display = 'block';
    });
    
    // Hide display values
    document.querySelectorAll('.info-value').forEach(value => {
      value.style.display = 'none';
    });
    
    personalInfoActions.style.display = 'flex';
    this.style.display = 'none';
  });

  cancelPersonalBtn.addEventListener('click', function() {
    // Hide edit inputs
    document.querySelectorAll('.edit-input').forEach(input => {
      input.style.display = 'none';
    });
    
    // Show display values
    document.querySelectorAll('.info-value').forEach(value => {
      value.style.display = 'inline';
    });
    
    personalInfoActions.style.display = 'none';
    editPersonalBtn.style.display = 'flex';
  });

  
}


// Password Form Submission
const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
  passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirmPass) {
      alert('New passwords do not match!');
      return;
    }
    
    // Simulate API call
    console.log('Password change requested', { currentPass, newPass });
    alert('Password updated successfully!');
    this.reset();
  });
}
