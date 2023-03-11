var express = require('express');
var router = express.Router();
var nocache=require('nocache')


module.exports = router;





// requiring Get Request
const adminGet=require('../controlers/admin-Controler')

// requiring Post Requests
const adminPost=require('../controlers/admin-Controler')
//session

const verifyadminlogin=adminGet.verifyadminlogin
const verifyadminnotlogin=adminGet.verifyadminnotlogin
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
router.get('/delete-products/:id',verifyadminlogin,adminGet.adminGetDeleteProductsId)
router.get('/delete-category/:id',verifyadminlogin,adminGet.adminGetDeleteCategory)
router.get('/edit-category/:id',verifyadminlogin,adminGet.adminGetEditCategoryId)
router.get('/edit-category',verifyadminlogin,adminGet.adminGetEditCategory)
router.get('/logout',verifyadminlogin,adminGet.adminGetLogout)
router.get('/orders-list',verifyadminlogin,adminGet.adminGetUserOrdersList)
router.get('/orders-details',verifyadminlogin,adminGet.adminGetUserOrdersDetails)
router.get('/orders-details/:id',verifyadminlogin,adminGet.adminGetUserOrdersDetailsId)
router.get('/change-order-status/',verifyadminlogin,adminGet.adminGetChangeOrderStatus)




//postRequests
router.post('/login',adminPost.adminPostLogin)
router.post('/add-items',adminPost.adminPostAddItems)
router.post('/category-management',adminPost.adminPostCategoryManagement)
router.post('/edit-form-submit/:id',adminPost.adminPostEditFormSubmit)
router.post('/edit-category/:id',adminPost.adminPostEditCategory)

//router.post('/user-signup',userPost.userPostSignup)










module.exports = router;