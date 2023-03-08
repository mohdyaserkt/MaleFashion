
function validateform() {
    const name = document.sub.name.value;
    const email = document.sub.email.value;
    const phone = document.sub.phone.value;
    const username = document.sub.username.value;
    const password = document.sub.password.value;
    const reenterpassword = document.sub.reenterpassword.value;
    const emailRegx =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passwordRegx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    const nameRegex =/^\s*([a-zA-Z]+\s*){1,3}$/
    const usernameRegex=/^[a-zA-Z0-9.\-_$@*!]{5,30}$/
    const phoneRegex=/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    const err = document.getElementById("error-message");
    if (name == "") {
        err.innerHTML = 'The Name is Empty'

        return false;
    }
    if (name.length < 5) {
        err.innerHTML = 'Name must be Contain five Elements Please Include Fullname';
        return false;
    }
    if (nameRegex.test(name) == false) {
        err.innerHTML = 'invalid name';
        return false;
    }
    
    if (username == "") {
        err.innerHTML = 'username is Empty';
        return false;
    }
    if (username.length < 5) {
        err.innerHTML = 'username must be morethan 5';
        return false
    }
    if (usernameRegex.test(username) == false) {
        err.innerHTML = 'invalid username';
        return false
    }

    if (email == "") {
        err.innerHTML = 'Email is Empty';
        return false;
    }

    if (emailRegx.test(email) == false) {
        err.innerHTML = 'Invalid Email'
        return false
    }

    if (phone == "") {
        err.innerHTML = 'The phone is Empty'

        return false;
    }
    // if (phone.length < 10 || phone.length > 10) {
    //     err.innerHTML = 'invalid phone Number';
    //     return false;
    // }

    if (phoneRegex.test(phone) == false) {
        err.innerHTML = 'invalid phone Numberg';
        return false;
    }

    if (passwordRegx.test(password) == false) {
        err.innerHTML = 'Password must contain - 8 inputs, at least 1 capital and 1 Special Character, at least 1 number'
        return false
    }
    
    if (reenterpassword != password) {
        err.innerHTML = 'Password are not Matching';
        return false
    }
    return true;

}
