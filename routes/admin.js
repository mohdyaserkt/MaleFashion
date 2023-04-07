var express = require('express');
var router = express.Router();
var nocache=require('nocache')


module.exports = router;


//requiring session
const sessions=require('../middleware/session')


// requiring Get Request
const adminGet=require('../controlers/admin-Controler')

// requiring Post Requests
const adminPost=require('../controlers/admin-Controler')
//session

const verifyadminlogin=sessions.verifyadminlogin
const verifyadminnotlogin=sessions.verifyadminnotlogin
//getRequests

router.get('/login',verifyadminnotlogin,nocache(),adminGet.adminGetLogin)
router.get('/dashboard',verifyadminlogin,nocache(),adminGet.adminGetDashboard)
router.get('/users-table',verifyadminlogin,adminGet.adminGetUsersTable)
router.get('/users-block/:id',verifyadminlogin,adminGet.adminGetUsersBlock)
router.get('/users-unblock/:id',verifyadminlogin,adminGet.adminGetUsersUnblock)
router.get('/add-items',verifyadminlogin,adminGet.adminGetAddItems)
router.get('/category-management',verifyadminlogin,adminGet.adminGetCategoryManagement)
router.get('/all-products',verifyadminlogin,adminGet.adminGetAllProducts)
router.get('/edit-products',verifyadminlogin,adminGet.adminGetEditProducts)
router.get('/edit-products/:id',verifyadminlogin,adminGet.adminGetEditProductsId)
router.get('/delete-products/',verifyadminlogin,adminGet.adminGetDeleteProductsId)
router.get('/delete-category/',verifyadminlogin,adminGet.adminGetDeleteCategory)
router.get('/edit-category/:id',verifyadminlogin,adminGet.adminGetEditCategoryId)
router.get('/edit-category',verifyadminlogin,adminGet.adminGetEditCategory)
router.get('/logout',verifyadminlogin,adminGet.adminGetLogout)
router.get('/orders-list',verifyadminlogin,adminGet.adminGetUserOrdersList)
router.get('/orders-details',verifyadminlogin,adminGet.adminGetUserOrdersDetails)
router.get('/orders-details/:id',verifyadminlogin,adminGet.adminGetUserOrdersDetailsId)
router.get('/change-order-status/',verifyadminlogin,adminGet.adminGetChangeOrderStatus)
router.get('/coupon',verifyadminlogin,adminGet.adminGetCoupon)
router.get('/disable-coupon/:id',verifyadminlogin,adminGet.adminGetDisableCoupon)
router.get('/banners',verifyadminlogin,adminGet.adminGetBanners)
router.get('/disable-banner/',verifyadminlogin,adminGet.adminGetDisableBanners)
router.get('/sales-report',verifyadminlogin,adminGet.adminGetSalesReport)
router.get('/sales-report-filter/:id',verifyadminlogin,adminGet.adminGetSalesReportFilter)




//postRequests
router.post('/login',adminPost.adminPostLogin)
router.post('/add-items',adminPost.adminPostAddItems)
router.post('/category-management',adminPost.adminPostCategoryManagement)
router.post('/edit-form-submit/:id',adminPost.adminPostEditFormSubmit)
router.post('/edit-category',adminPost.adminPostEditCategory)
router.post('/add-coupon',adminPost.adminPostAddCoupon)
router.post('/add-new-banner',adminPost.adminPostAddNewBanner)













module.exports = router;