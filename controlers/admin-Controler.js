const mongoose = require('mongoose')
const { Redirect } = require('twilio/lib/twiml/VoiceResponse')
const userCollection = require('../model/userModel')
const adminCollection = require('../model/adminModel')
const productCollection = require('../model/productModel')
const CategoryManagementCollection = require('../model/CategoryManagementModel')
const adminBannerCollection = require('../model/bannerModel')
const userOrdersCollection = require('../model/ordersModel')
const CouponCollection = require('../model/couponModel')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid')
const xlsx = require('xlsx')
const sharp=require('sharp')
let orderDetailsId


const fs = require('fs')
const adminCouponCollection = require('../model/couponModel')
let editCategoryId
let message

let editId






//session function







//get requests

const adminGetLogin = (req, res, next) => {


    try {
        res.render('admin-login', { message: message, layout: 'adminlayout' })
        message = null

    } catch (error) {
        next()
    }






}
const adminGetDashboard = async (req, res, next) => {

    //try {
        console.log("hhhhhhhhhhhhhhhhh");
        const totalIncome1 = await userOrdersCollection.aggregate([{ $match: { "products.status": "delivered" } }, { $unwind: "$products" }, { $group: { _id: null, sum: { $sum: "$products.totalprice" } } }])
        console.log(totalIncome1.length);
        let totalIncome
        if(totalIncome1.length==0){
            totalIncome=0
        }else{
             totalIncome = totalIncome1[0].sum
        }
        
        const totalOrders = await userOrdersCollection.countDocuments({})
        console.log(totalOrders);
        const totalUsers = await userCollection.countDocuments({})
        const latestProducts = await productCollection.find().sort({ _id: -1 }).limit(4).lean()
        console.log(latestProducts);
        const dlvrdOrderCount= await userOrdersCollection.find({"products.status": "delivered"}).count()
        const pendOrderCount= await userOrdersCollection.find({"products.status": "pending"}).count()


        res.render('adminDashboard', { layout: 'adminlayout', totalIncome, totalOrders, totalUsers, latestProducts,dlvrdOrderCount,pendOrderCount})


    // } catch (error) {
    //     next()
    // }



}

const adminGetUsersTable = async (req, res, next) => {

    try {

        const userData = await userCollection.find({}).lean()

        res.render('admin-users-table', { userData, layout: 'adminlayout' })


    } catch (error) {
        next()
    }


}

const adminGetUsersBlock = async (req, res, next) => {

    try {
        console.log("check");

        const id = req.params.id
        await userCollection.updateOne({ _id: id }, { $set: { status: false } })
        req.session.user = null
        res.redirect('/admin/users-table')


    } catch (error) {
        next()
    }


}


const adminGetUsersUnblock = async (req, res, next) => {

    try {
        const id = req.params.id
        await userCollection.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/admin/users-table')


    } catch (error) {
        next()
    }



}

const adminGetAddItems = async (req, res, next) => {



    try {

        const productDetails = await CategoryManagementCollection.find({}).lean()
        console.log(productDetails);
        res.render('admin-add-products', { productDetails, layout: 'adminlayout' })

    } catch (error) {
        next()
    }




}


const adminGetCategoryManagement = async (req, res, next) => {


    try {

        const categoryDetails = await CategoryManagementCollection.find({}).lean()
        res.render('admin-category-management', { categoryDetails, message, layout: 'adminlayout' })


    } catch (error) {
        next()
    }


}



const adminGetAllProducts = async (req, res, next) => {


    try {
        const allProducts = await productCollection.find({}).lean()


        res.render('admin-all-products', { allProducts, layout: 'adminlayout' })


    } catch (error) {
        next()
    }



}

const adminGetEditProducts = async (req, res, next) => {

    try {

        const editProduct = await productCollection.find({ _id: editId }).lean()

        const products = editProduct[0]
        const productDetails = await CategoryManagementCollection.find({}).lean()
        console.log(productDetails);
        console.log(editProduct);
        res.render('admin-edit-products', { productDetails, products, layout: 'adminlayout' })


    } catch (error) {
        next()
    }


}
const adminGetEditProductsId = async (req, res, next) => {

    try {

        editId = req.params.id


        res.redirect('/admin/edit-products')

    } catch (error) {
        next()
    }

}

const adminGetDeleteProductsId = async (req, res, next) => {

    try {
        const id = req.query._id
        console.log(id);
        const status = req.query.status

        


        await productCollection.updateOne({_id:id},{$set:{status:status}})

        res.redirect('/admin/all-products')


    } catch (error) {
        next()
    }



}


const adminGetDeleteCategory = async (req, res, next) => {

    try {
        
        const id = req.query.id
        const status=req.query.status
        console.log(id);
        const category= await CategoryManagementCollection.findOne({_id: id})
        const categoryName=category.categoryname
        await CategoryManagementCollection.updateOne({ _id: id },{$set:{status:status}})
        await productCollection.updateMany({category:categoryName},{$set:{status:status}})

        res.redirect('/admin/category-management')

       



    } catch (error) {
        next()
    }






}

const adminGetEditCategoryId = async (req, res, next) => {

    try {
        editCategoryId = req.params.id
        console.log(editCategoryId);
        res.redirect('/admin/edit-category')
    } catch (error) {
        next()
    }


}

const adminGetEditCategory = async (req, res, next) => {

    try {
        const category = await CategoryManagementCollection.findOne({ _id: editCategoryId }).lean()

        res.render('admin-edit-category', { _id: category._id, categoryname: category.categoryname, layout: 'adminlayout' })


    } catch (error) {
        next()
    }

}

const adminGetLogout = async (req, res, next) => {

    try {
        req.session.admin = null
        res.redirect('/admin/login')

    } catch (error) {
        next()
    }

}


const adminGetUserOrdersList = async (req, res, next) => {

    try {
        const orders = await userOrdersCollection.find({}).lean()
        console.log(orders);
        const revorders = orders.reverse();
        res.render('admin-orders-list', { revorders, layout: 'adminlayout' })

    } catch (error) {
        next()
    }


}

const adminGetUserOrdersDetailsId = async (req, res, next) => {

    try {
        orderDetailsId = mongoose.Types.ObjectId(req.params.id)
        res.redirect('/admin/orders-details')
    } catch (error) {
        next()
    }

}

const adminGetUserOrdersDetails = async (req, res, next) => {

    try {
        console.log(orderDetailsId);

        const orders = await userOrdersCollection.aggregate([
            {
                $match: { _id: orderDetailsId }
            },
            {
                $unwind: '$products'
            }

        ])
        console.log(orders);
        res.render('admin-orders-details', { orders, layout: 'adminlayout' })
    } catch (error) {
        next()
    }

}

const adminGetChangeOrderStatus = async (req, res, next) => {

    try {
        const id = req.query.id
        const status = req.query.status
        const productid = req.query.productid
        const quantity = req.query.quantity
        const paymentmethod = req.query.paymentmethod
        const totalprice= req.query.totalprice
        const ordereduser= req.query.ordereduser
        console.log(quantity);
        console.log(productid);
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhh" + id);
        if (status == "delivered") {
            let deliveryDate= new Date()
            deliveryDate=deliveryDate.toISOString().slice(0, 10);

            const salesdate=new Date()
            await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.status": status } })
            await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.salesdate": salesdate } })
            await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "deliverydate": deliveryDate } })

            await productCollection.updateOne({ productid: productid }, { $inc: { stock: "-" + quantity } })
            if (paymentmethod == "Cash on delivery") {
                await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.paymentid": uuidv4() } })
            }

            res.redirect('/admin/orders-list')
        }
        else if(status=="Return Accepted"){

            
            await userCollection.updateOne({email:ordereduser},{ $inc: { wallet: totalprice } })
            await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.status": status } })

            res.redirect('/admin/orders-list')
        }
        else {
            await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.status": status } })

            res.redirect('/admin/orders-list')
        }

    } catch (error) {
        next()
    }



}


const adminGetCoupon = async (req, res, next) => {

    try {
        const coupons = await CouponCollection.find({}).lean()

        const adCpnMsg = req.session.adCpnMsg

        res.render('admin-coupon', { layout: 'adminlayout', coupons, adCpnMsg })
        req.session.adCpnMsg = null
    } catch (error) {
        next()
    }


}



const adminGetDisableCoupon = async (req, res, next) => {

    try {
        const couponCode = req.params.id
        await adminCouponCollection.updateOne({ couponId: couponCode }, { $set: { status: false } })

        res.redirect('/admin/coupon')
    } catch (error) {
        next()
    }


}



const adminGetBanners = async (req, res, next) => {
    try {
        const banners = await adminBannerCollection.find({}).lean()
        console.log(banners);
        res.render('admin-banners', { banners, layout: 'adminlayout' })
    } catch (error) {
        next()
    }

}



const adminGetDisableBanners = async (req, res, next) => {
    try {
        const bannerId = req.query.bannerId
        const status = req.query.status
        await adminBannerCollection.updateOne({ bannerId: bannerId }, { $set: { status: status } })
        res.redirect('/admin/banners')
    } catch (error) {
        next()
    }

}

const adminGetSalesReport = async (req, res, next) => {
    try {
        if(req.session.salefilt){
            const salesReport=req.session.salefilt
            console.log(salesReport);
            res.render('admin-sales-report', { layout: 'adminlayout', salesReport })

        }
        else{
        const salesReport = await userOrdersCollection.aggregate([{ $match: { "products.status": "delivered" } }, { $unwind: "$products" }])
        console.log(salesReport);
        res.render('admin-sales-report', { layout: 'adminlayout', salesReport })}
    } catch (error) {
        next()
    }


}
const adminGetSalesReportFilter = async (req, res, next) => {
    const salesParam=req.params.id
    let salesReportfilt
    if (salesParam == "day") {

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
         salesReportfilt = await userOrdersCollection.aggregate([
  
          {
            $unwind: "$products"
          },
          {
            $match: { "products.status": "delivered" }
          },
          {
            $match:{
              "products.salesdate":{ $gte: startOfToday, $lte: endOfToday }
            }
          } 
        ])
        
  
  
        
  
      } else if (salesParam == "month") {
  
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  
       
        salesReportfilt = await userOrdersCollection.aggregate([
          {
            $unwind: "$products"
          },
          {
            $match: { "products.status": "delivered" }
          },
          {
            $match:{
              "products.salesdate":{ $gte: startOfMonth, $lte: endOfMonth }
            }
          }, 
        ])
        
  
  
        
        
      }else{
        salesReportfilt = await userOrdersCollection.aggregate([
            {
              $unwind: "$products"
            },
            {
              $match: { "products.status": "delivered" }
            },
             
          ])
      }
   req.session.salefilt=salesReportfilt
   res.redirect('/admin/sales-report')

}







//post requests

const adminPostLogin = async (req, res, next) => {


    try {
        loginDetails = req.body
        const admin = await adminCollection.findOne({ username: loginDetails.username }).lean()
        const status = { username: false, password: false }
        if (admin) {

            status.email = true
            const passwordCheck = await bcrypt.compare(loginDetails.password, admin.password)

            if (passwordCheck == true) {
                status.password = true
                req.session.admin = loginDetails.username;
                res.redirect('/admin/dashboard')
            }
            else {

                message = "You entered Password is Incorrect"
                res.redirect('/admin/login')

            }


        }
        else {

            message = "You Entered username is incorrect"
            res.redirect('/admin/login')
        }

    } catch (error) {
        next()
    }







}


const adminPostAddItems = async (req, res, next) => {

    try {
        console.log(req.body);
        console.log("check");
        let image = []
        image = req.files.image
        console.log(image);
        let productdetails = req.body
        productdetails.productid = uuidv4()


        if (image.length > 1) {

            for (i = 0; i < image.length; i++) {

            let path=""+image[i].tempFilePath
            console.log(path);
            await sharp(path)
            .rotate()
            .resize(1000,1500)
            .jpeg({mozjpeg:true})
            .toFile('./public/productimages/' + productdetails.productid + i + '.jpg')
                // image[i].mv('./public/productimages/' + productdetails.productid + i + '.jpg')
                image[i] = productdetails.productid + i + '.jpg'
            }
            productdetails.image = image
        }
        else {
            let path=""+image.tempFilePath
            console.log(path);
            await sharp(path)
            .rotate()
            .resize(1000,1500)
            .jpeg({mozjpeg:true})
            .toFile('./public/productimages/' + productdetails.productid + '.jpg')
            //image.mv('./public/productimages/' + productdetails.productid + '.jpg')
            productdetails.image = productdetails.productid + '.jpg'
        }


        productdetails.date = new Date()
        productdetails.status=true

        console.log(productdetails)
        await productCollection.insertMany([productdetails])

        res.redirect('/admin/all-products')


     } catch (error) {
         next()
    }





}





const adminPostCategoryManagement = async (req, res, next) => {

    try {
        console.log(req.body);
        categorydetails = req.body
        categoryname = req.body.categoryname
        const findcategory = await CategoryManagementCollection.findOne({ categoryname: categoryname }).lean()

        if (findcategory == null) {




            categorydetails.date = new Date()
            categorydetails.status = true
            
            categorydetails.date = categorydetails.date.toISOString().slice(0, 10);
            await CategoryManagementCollection.insertMany([categorydetails])

            res.redirect('/admin/category-management')

        }
        else {
            message = "category already exist"

            console.log(message);
            res.redirect('/admin/category-management')
        }


    } catch (error) {
        next()
    }



}

const adminPostEditFormSubmit = async (req, res, next) => {

    try {
        const id = req.params.id
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        console.log(id);
        console.log(req.body);
        let productdetails = req.body
        let image = []
        productdetails.date = new Date()
        let checkempty
        req.files?checkempty=true:checkempty=false;
        
        if(checkempty){
        image = req.files.image
        

        console.log(image.length);
        console.log("llllllllaaaaaaaaaaaaaaaaaaaaaaaaaalalla");
        console.log(productdetails.productid);

        if (image.length > 1) {

            for (var i = 0; i < image.length; i++) {

                let path=""+image[i].tempFilePath
            console.log(path);
            await sharp(path)
            .rotate()
            .resize(1000,1500)
            .jpeg({mozjpeg:true})
            .toFile('./public/productimages/' + productdetails.productid + i + '.jpg')
                //image[i].mv('./public/productimages/' + productdetails.productid + i + '.jpg')
                image[i] = productdetails.productid + i + '.jpg'
            }
            productdetails.image = image
        }
        else {
            let path=""+image.tempFilePath
            console.log(path);
            await sharp(path)
            .rotate()
            .resize(1000,1500)
            .jpeg({mozjpeg:true})
            .toFile('./public/productimages/' + productdetails.productid + '.jpg')
            //image.mv('./public/productimages/' + productdetails.productid + '.jpg')
            productdetails.image = productdetails.productid + '.jpg'


        }
    
        



        console.log(productdetails)
        await productCollection.updateOne({ _id: id }, { $set: { title: productdetails.title, price: productdetails.price, category: productdetails.category, stock: productdetails.stock, brand: productdetails.brand, subcategory: productdetails.subcategory, productid: productdetails.productid, image: productdetails.image, description: productdetails.description,productInformation: productdetails.productInformation } })
        }else{


            await productCollection.updateOne({ _id: id }, { $set: { title: productdetails.title, price: productdetails.price, category: productdetails.category, stock: productdetails.stock, brand: productdetails.brand, subcategory: productdetails.subcategory, productid: productdetails.productid, description: productdetails.description,productInformation: productdetails.productInformation } })

        }
        
        
        res.redirect('/admin/all-products')

    } catch (error) {
        next()
    }



}


const adminPostEditCategory = async (req, res, next) => {


    try {

        const edit=req.body
        
        
       
        await CategoryManagementCollection.updateOne({ _id: edit.id }, { $set: { categoryname: edit.editedcategory } })
        await productCollection.updateMany({category:edit.category},{$set: { category: edit.editedcategory } })
        res.redirect('/admin/category-management')

    } catch (error) {
        next()
    }


}

const adminPostAddCoupon = async (req, res, next) => {
    try {
        console.log(req.body);

        let newCoupon = req.body
        newCoupon.status = true
        newCoupon.couponId = uuidv4()

        const cpnExistChk = await adminCouponCollection.findOne({ couponCode: newCoupon.couponCode })
        if (cpnExistChk) {

            req.session.adCpnMsg = "Coupon Already Exist"

            res.redirect('/admin/coupon')
        } else {
            CouponCollection.insertMany([newCoupon])
            res.redirect('/admin/coupon')
        }
    } catch (error) {
        next()
    }

}


const adminPostAddNewBanner = async (req, res, next) => {
    try {
        const image = req.files.image
        console.log(image);
        const bannerDetails = req.body
        console.log(bannerDetails);
        const name = uuidv4()

        

        // image.mv('./public/bannerImages/' + name + '.jpg')
        bannerDetails.image = name + '.jpg'
        bannerDetails.status = true
        bannerDetails.bannerId = uuidv4()

        if (bannerDetails.bannerType == "Hero_Section") {
            let path=""+image.tempFilePath
        console.log(path);
        await sharp(path)
            .rotate()
            .resize(1920,801)
            .jpeg({mozjpeg:true})
            .toFile('./public/bannerImages/' + name + '.jpg')

            await adminBannerCollection.insertMany([bannerDetails])
        }
        else {
            let path=""+image.tempFilePath
            console.log(path);
            await sharp(path)
            .rotate()
            .resize(470,470)
            .jpeg({mozjpeg:true})
            .toFile('./public/bannerImages/' + name + '.jpg')
            await adminBannerCollection.updateMany({ bannerType: bannerDetails.bannerType }, { $set: { status: false } })
            await adminBannerCollection.insertMany([bannerDetails])
        }
        res.redirect('/admin/banners')

    } catch (error) {
        next()
    }

}








module.exports = {
    
    adminGetLogin, adminPostLogin,
    adminGetDashboard, adminGetEditCategoryId, adminGetEditCategory,
    adminGetUsersTable, adminPostEditCategory,
    adminGetUsersBlock, adminGetDeleteCategory, adminPostAddNewBanner,
    adminGetUsersUnblock, adminGetDeleteProductsId, adminPostAddCoupon,
    adminGetAddItems, adminPostEditFormSubmit, adminGetBanners,
    adminPostAddItems, adminGetEditProductsId, adminGetLogout, adminGetSalesReport,
    adminGetCategoryManagement, adminGetEditProducts, adminGetUserOrdersDetails,
    adminPostCategoryManagement, adminGetAllProducts, adminGetUserOrdersList,
    adminGetUserOrdersDetailsId, adminGetChangeOrderStatus, adminGetCoupon,
    adminGetDisableCoupon,
    adminGetDisableBanners,adminGetSalesReportFilter
}