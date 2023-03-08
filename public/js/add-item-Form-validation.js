
function validateform() {
    
    const title = document.sub.title.value;
    const price = document.sub.price.value;
    const category = document.sub.category.value;
    const stock = document.sub.stock.value;
    const brand = document.sub.brand.value;
    const subbrand = document.sub.subbrand.value;
    const productid = document.sub.productid.value;
    const image = document.sub.image.value;
    
    const description = document.sub.description.value;
    const err = document.getElementById("error-message");


    if (title == "") {
        err.innerHTML = 'The title is Empty'

        return false;
    }
    if (title.length < 5) {
        err.innerHTML = 'title must be Contain five Elements ';
        return false;
    }
    if (price == "") {
        err.innerHTML = 'price is Empty';
        return false;
    }

    if (isNaN(price)) {
        err.innerHTML = 'enter price in numbers';
        return false;
    }
    // if (username.length < 5) {
    //     err.innerHTML = 'username must be morethan 5';
    //     return false
    // }

    if (category == "") {
        err.innerHTML = 'Category is Empty';
        return false;
    }

    if (stock == "") {
        err.innerHTML = 'Stock is Empty';
        return false;
    }

    if (isNaN(stock)) {
        err.innerHTML = 'Stock is invalid   ';
        return false;
    }

    if (brand == "") {
        err.innerHTML = 'Brand is Empty';
        return false;
    }

    if (subcategory == "") {
        err.innerHTML = 'Sub Brand is Empty';
        return false;
    }

   

    if (image=="") {
        err.innerHTML = 'Image is empty';
        return false;
    }

    // const imagecheck=image.isArray()

    // if (imagecheck&&imagecheck.length>4) {
    //     err.innerHTML = 'maximum 4 photos';
    //     return false;
    // }



    if (description =="") {
        err.innerHTML = 'Description is Empty';
        return false;
    }


    if (description.length<10) {
        err.innerHTML = 'Description must contain 10 letters';
        return false;
    }

    // if (emailRegx.test(email) == false) {
    //     err.innerHTML = 'Invalid Email'
    //     return false
    // }

    // if (phone == "") {
    //     err.innerHTML = 'The phone is Empty'

    //     return false;
    // }
    // if (phone.length < 10 || phone.length > 10) {
    //     err.innerHTML = 'invalid phone Number';
    //     return false;
    // }

    // if (passwordRegx.test(password) == false) {
    //     err.innerHTML = 'Password must contain - 8 inputs, at least 1 capital and 1 Special Character, at least 1 number'
    //     return false
    // }
    
    // if (reenterpassword != password) {
    //     err.innerHTML = 'Password are not Matching';
    //     return false
    // }
    return true;

}
