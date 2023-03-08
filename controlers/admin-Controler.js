const mongoose=require('mongoose')
const { Redirect } = require('twilio/lib/twiml/VoiceResponse')
const userCollection=require('../model/userModel')
const adminCollection=require('../model/adminModel')
const productCollection=require('../model/productModel')
const CategoryManagementCollection=require('../model/CategoryManagementModel')
const userOrdersCollection=require('../model/ordersModel')
const bcrypt=require('bcrypt')
const fileUpload=require('express-fileupload')
const {v4 : uuidv4} = require('uuid')
let orderDetailsId


const fs=require('fs')
let editCategoryId
let message

let  editId
//get requests

const adminGetLogin=(req,res,next)=>{

    if(req.session.admin){res.redirect('/admin/dashboard')}
else{res.render('admin-login',{message:message})
message=null
    
}

    
}
const adminGetDashboard=(req,res,next)=>{

    if(req.session.admin){res.render('adminDashboard')}
else{
    res.redirect('/admin/login')
}

    
}

const adminGetUsersTable=async(req,res,next)=>{

    if(req.session.admin){const userData=await userCollection.find({})

    res.render('admin-users-table',{userData})}
else{
    res.redirect('/admin/login')
}

    
}

const adminGetUsersBlock=async(req,res,next)=>{


    if(req.session.admin){console.log("check");

    const id=req.params.id
    await userCollection.updateOne({_id:id},{$set:{status:false}})
    res.redirect('/admin/users-table')}
else{
    res.redirect('/admin/login')
}
    

}


const adminGetUsersUnblock=async(req,res,next)=>{

    if(req.session.admin){ const id=req.params.id
    await userCollection.updateOne({_id:id},{$set:{status:true}})
    res.redirect('/admin/users-table')}
else{
    res.redirect('/admin/login')
}
   

}

const adminGetAddItems=async(req,res,next)=>{

    if(req.session.admin){const productDetails=await CategoryManagementCollection.find({})
    console.log(productDetails);
    res.render('admin-add-products',{productDetails})}
else{
    res.redirect('/admin/login')
}

    

}


const adminGetCategoryManagement=async(req,res,next)=>{

    if(req.session.admin){ const categoryDetails=await CategoryManagementCollection.find({})
    res.render('admin-category-management',{categoryDetails})}
else{
    res.redirect('/admin/login')
}
   

}



const adminGetAllProducts=async(req,res,next)=>{


    if(req.session.admin){const allProducts=await productCollection.find({})


    res.render('admin-all-products',{allProducts})}
else{
    res.redirect('/admin/login')
}
    
}

const adminGetEditProducts=async(req,res,next)=>{

    if(req.session.admin){const editProduct=await productCollection.find({_id:editId})

const products=editProduct[0]
const productDetails=await CategoryManagementCollection.find({})
    console.log(productDetails);
    res.render('admin-edit-products',{productDetails,products})}
    else{
        res.redirect('/admin/login')
    }

    
}
const adminGetEditProductsId=async(req,res,next)=>{

    editId=req.params.id


    res.redirect('/admin/edit-products')

}

const adminGetDeleteProductsId=async(req,res,next)=>{

    if(req.session.admin){const id=req.params.id
console.log(id);

const deleteProduct=await productCollection.findOne({_id:id})
console.log(deleteProduct);
const length=deleteProduct.image.length
console.log(length);


if(length>1){

for(var i=0;i<length;i++){

    fs.unlink('./public/productimages/'+deleteProduct.productid+i+'.jpg',(err)=>{
        if(err){
            console.log(err);
        }
    })


}}
else{
    fs.unlink('./public/productimages/'+deleteProduct.productid+'.jpg',(err)=>{
        if(err){
            console.log(err);
        }
    })
}





 await productCollection.deleteOne({_id:id})
 console.log(id+"000000000000000000000000000");
 res.redirect('/admin/all-products')}
else{
    res.redirect('/admin/login')
}


}


const adminGetDeleteCategory=async(req,res,next)=>{


    if(req.session.admin){const id=req.params.id
console.log(id);

await CategoryManagementCollection.deleteOne({_id:id})

res.redirect('/admin/category-management')}
else{
    res.redirect('/admin/login')
}





}

const adminGetEditCategoryId=async(req,res,next)=>{


    
    editCategoryId=req.params.id
    console.log(editCategoryId);
    res.redirect('/admin/edit-category')
}

const adminGetEditCategory=async(req,res,next)=>{
    if(req.session.admin){const category=await CategoryManagementCollection.findOne({_id:editCategoryId})

    res.render('admin-edit-category',{_id:category._id,categoryname:category.categoryname})}
else{
    res.redirect('/admin/login')
}


    
}

const adminGetLogout=async(req,res,next)=>{

    req.session.admin=null
    res.redirect('/admin/login')

}


const adminGetUserOrdersList=async(req,res,next)=>{

    const orders=await userOrdersCollection.find({})
    console.log(orders);
    res.render('admin-orders-list',{orders})

}

const adminGetUserOrdersDetailsId=async(req,res,next)=>{
    orderDetailsId=mongoose.Types.ObjectId(req.params.id)     
    res.redirect('/admin/orders-details')
}

const adminGetUserOrdersDetails=async(req,res,next)=>{
    console.log(orderDetailsId);

    const orders=await userOrdersCollection.aggregate([
        {
           $match:{_id:orderDetailsId} 
        },
        {
            $unwind:'$products' 
        }

    ])
    console.log(orders );
    res.render('admin-orders-details',{orders})
}

const adminGetChangeOrderStatus=async(req,res,next)=>{

   const id=req.query.id
   const status=req.query.status
   const  productid=req.query.productid
   console.log("hhhhhhhhhhhhhhhhhhhhhhhhh"+id);

   await userOrdersCollection.updateOne({_id:id,"products.productid":productid},{$set:{"products.$.status":status}}) 

   res.redirect('/admin/orders-list')

}

//post requests

const adminPostLogin=async(req,res,next)=>{
      loginDetails=req.body
      const admin=await adminCollection.findOne({username:loginDetails.username})
      const status={username:false,password:false}
    if(admin){
    
        status.email=true
        const passwordCheck=await bcrypt.compare(loginDetails.password,admin.password)

        if(passwordCheck==true){
            status.password=true
            req.session.admin=loginDetails.username;
            res.redirect('/admin/dashboard')
        }
        else{

            message="You entered Password is Incorrect"
            res.redirect('/admin/login')
            
        }
        
        
    }
    else{

        message="You Entered username is incorrect"
        res.redirect('/admin/login')
    }



    
    
    
}


const adminPostAddItems=async(req,res,next)=>{

console.log(req.body);
console.log("check");
let image=[]
image=req.files.image
console.log(image);
let productdetails=req.body
productdetails.productid=uuidv4()

    
    if(image.length>1){

        for(i=0;i<image.length;i++){
            image[i].mv('./public/productimages/'+productdetails.productid+i+'.jpg')
            image[i]=productdetails.productid+i+'.jpg'
        }
        productdetails.image=image
    }
    else{
    image.mv('./public/productimages/'+productdetails.productid+'.jpg')
    productdetails.image=productdetails.productid+'.jpg'
}

    
    productdetails.date=new Date()
    
    console.log(productdetails)
    await productCollection.insertMany([productdetails])

    res.redirect('/admin/all-products')


    


}





const adminPostCategoryManagement=async(req,res,next)=>{

    console.log(req.body);
    categorydetails=req.body
    categorydetails.date=new Date()
    await CategoryManagementCollection.insertMany([categorydetails])

    res.redirect('/admin/category-management')

    

}

const adminPostEditFormSubmit=async(req,res,next)=>{
   const id=req.params.id
   console.log(id);
    console.log(req.body);
     let productdetails=req.body
    let image=[]
    image=req.files.image
    console.log(image.length);
console.log(productdetails.productid);

    if(image.length>1){

        for(var i=0;i<image.length;i++){
            image[i].mv('./public/productimages/'+productdetails.productid+i+'.jpg')
            image[i]=productdetails.productid+i+'.jpg'
        }
        productdetails.image=image
    }
    else{
    image.mv('./public/productimages/'+productdetails.productid+'.jpg')
    productdetails.image=productdetails.productid+'.jpg'


}
productdetails.date=new Date()
    
    console.log(productdetails)
    await productCollection.updateOne({_id:id},{$set:{title:productdetails.title,price:productdetails.price,category:productdetails.category,stock:productdetails.stock,brand:productdetails.brand,subcategory:productdetails.subcategory,productid:productdetails.productid,image:productdetails.image,description:productdetails.description}})
    res.redirect('/admin/all-products')
}


const adminPostEditCategory=async(req,res,next)=>{

    const id=req.params.id
    console.log(id);
    console.log(req.body);
    const categoryedit=req.body
     await CategoryManagementCollection.updateOne({_id:id},{$set:{categoryname:categoryedit.newcategoryname}})

     res.redirect('/admin/category-management')

}










module.exports={
    adminGetLogin,adminPostLogin,
    adminGetDashboard,adminGetEditCategoryId,adminGetEditCategory,
    adminGetUsersTable,adminPostEditCategory,
    adminGetUsersBlock,adminGetDeleteCategory,
    adminGetUsersUnblock,adminGetDeleteProductsId,
    adminGetAddItems,adminPostEditFormSubmit,
    adminPostAddItems,adminGetEditProductsId,adminGetLogout,
    adminGetCategoryManagement,adminGetEditProducts,adminGetUserOrdersDetails,
    adminPostCategoryManagement,adminGetAllProducts,adminGetUserOrdersList,
    adminGetUserOrdersDetailsId,adminGetChangeOrderStatus
}