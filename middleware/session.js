//user


let verifyadminlogin = (req, res, next) => {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/admin/login')
    }

}

let verifyadminnotlogin = (req, res, next) => {
    if (req.session.admin) {
        res.redirect('/admin/dashboard')
    } else {
        next()
    }

}

//session function user

let verifylogin = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/user-login-email')
    }

}

let verifynotlogin = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/')
    } else {
        next()
    }

}




module.exports = {
    verifyadminlogin,
    verifyadminnotlogin,
    verifylogin,
    verifynotlogin
}