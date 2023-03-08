var express = require('express');
var router = express.Router();
var nocache=require('nocache')


module.exports = router;





// requiring Get Request
const adminGet=require('../controlers/admin-Controler')

// requiring Post Requests
const adminPost=require('../controlers/admin-Controler')

//getRequests

router.get('/login',nocache(),adminGet.adminGetLogin)
router.get('/dashboard',nocache(),adminGet.adminGetDashboard)
router.get('/users-table',adminGet.adminGetUsersTable)
router.get('/users-block/:id',adminGet.adminGetUsersBlock)
router.get('/users-unblock/:id',adminGet.adminGetUsersUnblock)
router.get('/add-items',adminGet.adminGetAddItems)
router.get('/category-management',adminGet.adminGetCategoryManagement)
router.get('/all-products',adminGet.adminGetAllProducts)
router.get('/edit-products',adminGet.adminGetEditProducts)
router.get('/edit-products/:id',adminGet.adminGetEditProductsId)
router.get('/delete-products/:id',adminGet.adminGetDeleteProductsId)
router.get('/delete-category/:id',adminGet.adminGetDeleteCategory)
router.get('/edit-category/:id',adminGet.adminGetEditCategoryId)
router.get('/edit-category',adminGet.adminGetEditCategory)
router.get('/logout',adminGet.adminGetLogout)
router.get('/orders-list',adminGet.adminGetUserOrdersList)
router.get('/orders-details',adminGet.adminGetUserOrdersDetails)
router.get('/orders-details/:id',adminGet.adminGetUserOrdersDetailsId)
router.get('/change-order-status/',adminGet.adminGetChangeOrderStatus)




//postRequests
router.post('/login',adminPost.adminPostLogin)
router.post('/add-items',adminPost.adminPostAddItems)
router.post('/category-management',adminPost.adminPostCategoryManagement)
router.post('/edit-form-submit/:id',adminPost.adminPostEditFormSubmit)
router.post('/edit-category/:id',adminPost.adminPostEditCategory)

//router.post('/user-signup',userPost.userPostSignup)










module.exports = router;