var express = require('express');
const nocache = require('nocache');
var router = express.Router();
 

//requiring session
const sessions=require('../middleware/session')

// requiring Get Request
const userGet=require('../controlers/user-controler')

// requiring Post Requests
const userPost=require('../controlers/user-controler')

//session
const verifylogin=sessions.verifylogin
const verifynotlogin=sessions.verifynotlogin
//getRequests
router.get('/',nocache(),userGet.userGetHome)
router.get('/user-signup',verifynotlogin,nocache(),userGet.userGetSignup)
router.get('/user-login-email',verifynotlogin,nocache(),userGet.userGetLoginEmail)
router.get('/user-login-otp',verifynotlogin,nocache(),userGet.userGetLoginOtp)
router.get('/user-otp-verification/',verifynotlogin,userGet.userGetOtpVerification)
router.get('/shop',userGet.userGetShop)
router.get('/category/:id',userGet.userGetCategory)
router.get('/product-details/:id',userGet.userGetProductDetails)
// router.get('/product-search/:id',userGet.userGetProductSearch)
router.get('/user-logout/',verifylogin,userGet.userGetUserLogout)
router.get('/user-cart/',verifylogin,userGet.userGetCart)
router.get('/user-cart-delete/',verifylogin,userGet.userGetCartDelete)
router.get('/user-checkout/',verifylogin,nocache(),userGet.userGetCheckout)
router.get('/user-profile/',verifylogin,userGet.userGetUserProfile)
router.get('/user-orders',verifylogin,userGet.userGetUserOrders)
router.get('/user-orders-id/:id',verifylogin,userGet.userGetUserOrdersId)
router.get('/user-orders-cancel/',verifylogin,userGet.userGetUserOrdersCancel)

router.get('/saved-address',verifylogin,userGet.userGetSavedAddress)
router.get('/saved-address-choose/:id',verifylogin,userGet.userGetSavedAddressChoose)
router.get('/delete-address/:id',verifylogin,userGet.userGetDeleteAddress)
router.get('/forget-password',verifynotlogin,userGet.userGetForgetPassword)
router.get('/forget-password-click',userGet.userGetForgetPasswordClick)
router.get('/price-filter/',userGet.userGetPriceFilter)
router.get('/orders-list',verifylogin,userGet.userGetOrdersList)
router.get('/return-request/',verifylogin,userGet.userGetReturnRequest)
router.get('/user-wishlist',verifylogin,userGet.userGetWishlist)

router.get('/orderSuccess',verifylogin,userGet.userGetOrderSuccess)
router.get('/setDefault/:id',verifylogin,userGet.userGetDefaultAddress)
router.get('/removeWishlist/:id',verifylogin,userGet.userGetRemoveWishlist)
router.get('/sort/:id',userGet.userGetSort)


//postRequests

router.post('/user-signup',verifynotlogin,userPost.userPostSignup)
router.post('/user-login-email',verifynotlogin,userPost.userPostLoginEmail)
router.post('/user-otp-verification/:email',verifynotlogin,userPost.userPostOtpVerification)
router.post('/user-login-otp',verifynotlogin,userPost.userPostLoginOtp)
router.post('/user-addtocart/:id',verifylogin,userPost.userPostAddToCart)
router.post('/user-add-address',verifylogin,userPost.userPostAddAddress)
router.post('/user-place-order',verifylogin,userPost.userPostPlaceOrder)
router.post('/user-edit-personal-details',verifylogin,userPost.userPostEditPersonalDetails)
router.post('/user-change-password',verifylogin,userPost.userPostChangePassword)
router.post('/user-edit-address/:id',verifylogin,userPost.userPostEditAddress)
router.post('/user-foget-password',userPost.userPostForgetPassword)
router.post('/verify-payment',verifylogin,userPost.userPostVerifyPayment)
router.post('/change-cart-quantity',verifylogin,userPost.userPostChangeCartQuantity)
router.post('/get-products',userPost.userPostGetProducts)
router.post('/apply-coupon',verifylogin,userPost.userPostApplyCoupon)
router.post('/otp-resend/',userGet.userPostOtpresend)
router.post('/add-to-wishlist',verifylogin,userGet.userPostAddToWishlist)



module.exports = router;
