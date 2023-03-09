var express = require('express');
const nocache = require('nocache');
var router = express.Router();
 



// requiring Get Request
const userGet=require('../controlers/user-controler')

// requiring Post Requests
const userPost=require('../controlers/user-controler')
//getRequests
router.get('/home',nocache(),userGet.userGetHome)
router.get('/user-signup',nocache(),userGet.userGetSignup)
router.get('/user-login-email',nocache(),userGet.userGetLoginEmail)
router.get('/user-login-phone',nocache(),userGet.userGetLoginPhone)
router.get('/user-otp-verification',userGet.userGetOtpVerification)
router.get('/shop',userGet.userGetShop)
router.get('/category/:id',userGet.userGetCategory)
router.get('/product-details',userGet.userGetProductDetails)
router.get('/product-search/:id',userGet.userGetProductSearch)
router.get('/user-logout/',userGet.userGetUserLogout)
router.get('/user-cart/',userGet.userGetCart)
router.get('/user-cart-delete/:id',userGet.userGetCartDelete)
router.get('/user-checkout/',userGet.userGetCheckout)
router.get('/user-profile/',userGet.userGetUserProfile)
router.get('/user-orders/',userGet.userGetUserOrders)
router.get('/user-orders-cancel/',userGet.userGetUserOrdersCancel)
router.get('/otp-resend/',userGet.userGetOtpresend)


//postRequests

router.post('/user-signup',userPost.userPostSignup)
router.post('/user-login-email',userPost.userPostLoginEmail)
router.post('/user-otp-verification',userPost.userPostOtpVerification)
router.post('/user-login-phone',userPost.userPostLoginPhone)
router.post('/user-addtocart/:id',userPost.userPostAddToCart)
router.post('/user-add-address',userPost.userPostAddAddress)
router.post('/user-place-order',userPost.userPostPlaceOrder)
router.post('/user-edit-personal-details',userPost.userPostEditPersonalDetails)
router.post('/user-change-password',userPost.userPostChangePassword)




module.exports = router;
