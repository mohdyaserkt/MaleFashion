var express = require('express');
const nocache = require('nocache');
var router = express.Router();
 



// requiring Get Request
const userGet=require('../controlers/user-controler')

// requiring Post Requests
const userPost=require('../controlers/user-controler')

//session
const verifylogin=userGet.verifylogin
const verifynotlogin=userGet.verifynotlogin
//getRequests
router.get('/home',verifylogin,nocache(),userGet.userGetHome)
router.get('/user-signup',verifynotlogin,nocache(),userGet.userGetSignup)
router.get('/user-login-email',verifynotlogin,nocache(),userGet.userGetLoginEmail)
router.get('/user-login-phone',verifynotlogin,nocache(),userGet.userGetLoginPhone)
router.get('/user-otp-verification',verifynotlogin,userGet.userGetOtpVerification)
router.get('/shop',verifylogin,userGet.userGetShop)
router.get('/category/:id',verifylogin,userGet.userGetCategory)
router.get('/product-details',verifylogin,userGet.userGetProductDetails)
router.get('/product-search/:id',verifylogin,userGet.userGetProductSearch)
router.get('/user-logout/',verifylogin,userGet.userGetUserLogout)
router.get('/user-cart/',verifylogin,userGet.userGetCart)
router.get('/user-cart-delete/:id',verifylogin,userGet.userGetCartDelete)
router.get('/user-checkout/',verifylogin,userGet.userGetCheckout)
router.get('/user-profile/',verifylogin,userGet.userGetUserProfile)
router.get('/user-orders/',verifylogin,userGet.userGetUserOrders)
router.get('/user-orders-cancel/',verifylogin,userGet.userGetUserOrdersCancel)
router.get('/otp-resend/',verifylogin,userGet.userGetOtpresend)
router.get('/saved-address',verifylogin,userGet.userGetSavedAddress)
router.get('/saved-address-choose/:id',verifylogin,userGet.userGetSavedAddressChoose)
router.get('/delete-address/:id',verifylogin,userGet.userGetDeleteAddress)
router.get('/forget-password',verifynotlogin,userGet.userGetForgetPassword)
router.get('/forget-password-click',verifynotlogin,userGet.userGetForgetPasswordClick)


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
router.post('/user-edit-address/:id',userPost.userPostEditAddress)
router.post('/user-foget-password',userPost.userPostForgetPassword)




module.exports = router;
