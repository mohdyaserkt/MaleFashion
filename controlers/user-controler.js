const bcrypt = require('bcrypt')
const userCollection = require('../model/userModel')
const otp = require('../twilio/otp')
const productCollection = require('../model/productModel')
const CategoryManagementCollection = require('../model/CategoryManagementModel')
const userCartCollection = require('../model/userCartModel')
const userOrdersCollection = require('../model/ordersModel')
const session = require('express-session');
const addressCollection=require('../model/addressModel')

const {v4 : uuidv4} = require('uuid')
let message
let otpValue
let userDetails
let productCategory
let productDetailsId
let phoneLoginUserDetails
let userCartAllProducts = []
let phonenumber
let otptime=true
let savedAddressId




//session function
 
let verifylogin=(req,res,next)=>
{
    if(req.session.user)
    {
        next()
    }else
    {
        res.redirect('/user-login-email')
    }

}

let verifynotlogin=(req,res,next)=>
{
    if(req.session.user)
    {
        res.redirect('/home')
    }else
    {
        next()
    }

}





const userGetHome = function (req, res, next) {
      res.render('home'); 
    
}

const userGetSignup = function (req, res, next) {
    
   
        res.render('user-signup', { message: message });
        message = null

   
}

const userGetLoginEmail = function (req, res, next) {

    
    
        res.render('user-login-email', { message: message })
        message = null
    
}

const userGetLoginPhone = function (req, res, next) {

    
        res.render('user-login-Phone', { message: message });
        message = null

   
}

const userGetOtpVerification = function (req, res, next) {

    
        res.render('user-otp-verification', { message: message, phone: phonenumber })
        message = null
   
}

const userGetShop = async function (req, res, next) {

    
        const productDetails = await CategoryManagementCollection.find({})
        console.log(productDetails);

        if (productCategory == "All Products" || productCategory == null) {

            const products = await productCollection.find({})
            console.log(products);
            res.render('shop', { products, productDetails });
        }



        else {
            console.log("check else");
            console.log(productCategory);
            const products = await productCollection.find({ category: productCategory })
            console.log(products);
            res.render('shop', { products, productDetails });
        }



    
    











}


const userGetCategory = async function (req, res, next) {



    productCategory = req.params.id
    console.log(productCategory);

    res.redirect('/shop')




}


const userGetProductDetails = async function (req, res, next) {

    
        console.log(productDetailsId);
        const product = await productCollection.find({ _id: productDetailsId })
        console.log(product);
        const image = product[0].image

        console.log(image);
        res.render('product-details', { product, image })
   




}

const userGetProductSearch = async function (req, res, next) {

    productDetailsId = req.params.id
    res.redirect('/product-details')

}

const userGetUserLogout = async function (req, res, next) {

    req.session.user = null
    res.redirect('/user-login-email')

}

const userGetCart = async function (req, res, next) {
    userCartAllProducts = await userCartCollection.aggregate([
        { $match: { userId: req.session.user } }, { $unwind: '$cartProducts' }, { $project: { productId: "$cartProducts.productId", quantity: "$cartProducts.quantity", size: "$cartProducts.size", colour: "$cartProducts.colour" } },
        {
            $lookup: {
                from: 'productcollections',
                localField: 'productId',
                foreignField: 'productid',
                as: 'product'
            }
        }, {
            $project: {
                productId: 1, quantity: 1, size: 1, colour: 1, product: { $arrayElemAt: ['$product', 0] }
            }
        }
    ])
    console.log("hiiiiiiiiii");
    console.log(userCartAllProducts);
    console.log(req.session.user);

    let totalprice

    for (var i = 0; i < userCartAllProducts.length; i++) {
        totalprice = userCartAllProducts[i].quantity * userCartAllProducts[i].product.price
        userCartAllProducts[i].totalprice = totalprice
    }
    console.log(userCartAllProducts);
    console.log(totalprice);
    let subtotal = 0

    for (var i = 0; i < userCartAllProducts.length; i++) {
        subtotal = (userCartAllProducts[i].quantity * userCartAllProducts[i].product.price) + subtotal
    }
    console.log(subtotal);

    res.render('user-cart', { userCartAllProducts, subtotal })
}
const userGetCheckout = async function (req, res, next) {
console.log(savedAddressId);
    const userData = await addressCollection.aggregate([

        {
            $match:{userId:req.session.user}
        },
        {
            $unwind:"$address"
        },
        {
            $match:{"address.addressId":savedAddressId}
        }

    ])
    console.log(userData);
    console.log("hiiiiiiiii");
    
    const address=await addressCollection.findOne({userId:req.session.user})
    const chooseaddress=address.address


    res.render('user-Checkout', { userData,chooseaddress })
}

const userGetUserProfile = async function (req, res, next) {

    const user = await userCollection.find({ email: req.session.user })
    console.log(user);
    const userAddress = user[0].userAddress
    console.log(userAddress);
    res.render('user-profile', { user, message, userAddress })
    message = null
}




const userGetUserOrders = async function (req, res, next) {

    const orders = await userOrdersCollection.aggregate([
        {
            $unwind: '$products'
        }
    ])
    console.log(orders);

    res.render('user-orders', { orders })

}


const userGetCartDelete = async function (req, res, next) {
    const id = req.params.id
    console.log(id);
    console.log("check delete cart");

    await userCartCollection.updateOne({ userId: req.session.user }, { $pull: { cartProducts: { productId: id } } })

    res.redirect('/user-cart')

}



const userGetUserOrdersCancel = async function (req, res, next) {


    const id = req.query.id
    const status = "canceled"
    const productid = req.query.productid
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhh" + id);
    console.log(productid);
    await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.status": status } })

}



const userGetOtpresend = async function (req, res, next) {

    otptime=true
     otpValue = Math.floor(100000 + Math.random() * 499999)
     otp(phonenumber, otpValue)

     setTimeout(function(){
        otptime=false
        console.log("resend_otp_timeout");
        }, 60000);
   

    console.log("otp resended");
    



}

const userGetSavedAddress= async function (req, res, next) {
 const address=await addressCollection.findOne({userId:req.session.user})
 const alladdress=address.address

    

res.render('user-saved-address',{alladdress})
}


const userGetSavedAddressChoose= async function (req, res, next) 
{
    savedAddressId=req.params.id
    res.redirect('/user-checkout')
}


const userGetDeleteAddress= async function (req, res, next)
{
    const deleteId=req.params.id

    await addressCollection.collection.updateOne(
        { userId:req.session.user},
        {$pull:{address:{addressId:deleteId}}})

        res.redirect('/saved-address')

}


const userGetForgetPassword= async function (req, res, next)
{
    res.render('user-forget-password')
    
}

const userGetForgetPasswordClick= async function (req, res, next)
{
    userDetails="forgetpassword" 
    res.redirect('/user-login-phone')  
}

















//post requests

const userPostSignup = (req, res, next) => {

    userDetails = req.body
    async function existcheckandinsert() {

        try {

            const findUsername = await userCollection.findOne({ username: userDetails.username })
            const findEmail = await userCollection.findOne({ email: userDetails.email })
            const findPhone = await userCollection.findOne({ phone: userDetails.phone })

            if (findUsername == null && findEmail == null && findPhone == null) {
                otpValue = Math.floor(100000 + Math.random() * 499999)
                otp(userDetails.phone, otpValue)

                setTimeout(function(){
                    otptime=false
                    console.log("otp_timeouts");
                    }, 60000);
                phonenumber=userDetails.phone
                res.redirect('/user-otp-verification')
            }

            else {
                let exist = {
                    username: false,
                    email: false,
                    phone: false
                }
                if (findUsername != null) { exist.username = true }
                if (findEmail != null) { exist.email = true }
                if (findPhone != null) { exist.phone = true }

                console.log("signup failed user exist");


                if (exist.username) {
                    message = "entered username not Available"
                    res.redirect("/user-signup")
                } else if (exist.email) {
                    message = "already have a account with this  email"
                    res.redirect("/user-signup")
                } else if (exist.phone) {
                    message = "entered phone  already used"
                    res.redirect("/user-signup")
                }

            }

        } catch (error) {

            console.log(error.message);

        }

    }

    existcheckandinsert()

}

const userPostLoginEmail = async (req, res, next) => {

    try {

        const status = { email: false, password: false }


        const loginDetails = req.body
        console.log(loginDetails);

        const user = await userCollection.findOne({ email: loginDetails.email })

        if (user) {
            status.email = true
            const passwordCheck = await bcrypt.compare(loginDetails.password, user.password)
            if (user.status) {
                if (passwordCheck == true) {
                    status.password = true
                    req.session.user = loginDetails.email
                    res.redirect('/home')
                }
                else {

                    message = "You entered Password is Incorrect"
                    res.redirect('/user-login-email')

                }
            }
            else {

                message = "Your account is blocked by Admin"
                res.redirect('/user-login-email')

            }


        }
        else {

            message = "You Entered username is incorrect"
            res.redirect('/user-login-email')
        }

    } catch (error) {

        console.log(error.message);

    }





}



const userPostOtpVerification = async (req, res, next) => {

     try {

         console.log(req.body);
        let otpDetails = req.body
        
        
        
       
        

        if (otpDetails.otp == otpValue) {


            if(otptime){



                    if (userDetails == null) {
                                    req.session.user = phoneLoginUserDetails.email

                                    res.redirect('/home')
                                }

                                else if(userDetails=="forgetpassword"){
                                    res.redirect('/forget-password')
                                }
                                else {


                                    userDetails.status = true
                                    userDetails.password = await bcrypt.hash(userDetails.password, 10)
                                    await userCollection.insertMany([userDetails])
                                    req.session.user = userDetails.email;
                                    userDetails = null
                                    res.redirect('/home')
                                }
            }else{

                message = " entered otp is expired!!!"
                res.redirect('/user-otp-verification')

            }

            



        }

        else {
            message = " entered otp incorrect"
            res.redirect('/user-otp-verification')
        }
    

        
     } catch (error) {
         console.log(error.message);

     }


}


const userPostLoginPhone = async (req, res, next) => {



    try {
        const phoneLogindetails = req.body
        phonenumber = phoneLogindetails.phone
        const findUser = await userCollection.findOne({ phone: phoneLogindetails.phone })
        phoneLoginUserDetails = findUser
        if (findUser && findUser.status) {

            
            otpValue = Math.floor(100000 + Math.random() * 499999)
            otp(phoneLogindetails.phone, otpValue)


            setTimeout(function(){
                otptime=false
                console.log("otp_timeoutL");
                }, 60000);


            res.redirect('/user-otp-verification')
        }

        else {
            res.redirect('/user-login-Phone')
            message = "entered phone not exist"
            console.log("entered phone not exist");
        }




    } catch (error) {

        console.log(error);

    }
}


const userPostAddToCart = async (req, res, next) => {

    const id = req.params.id
    const cartProductDetails = req.body
    cartProductDetails.productId = id
    console.log(cartProductDetails);
    console.log("hhhhhhhhhhhhhhhhhhh");
    console.log(id);
    console.log(req.session.user);

    const userCart = await userCartCollection.findOne({ userId: req.session.user })
    if (userCart) {

        await userCartCollection.updateOne({ userId: req.session.user }, { $push: { cartProducts: { productId: cartProductDetails.productId, size: cartProductDetails.size, colour: cartProductDetails.colour, quantity: cartProductDetails.quantity } } })




    }
    else {
        await userCartCollection.insertMany([{ userId: req.session.user, cartProducts: [{ productId: cartProductDetails.productId, size: cartProductDetails.size, colour: cartProductDetails.colour, quantity: cartProductDetails.quantity }] }])
    }

    res.redirect('/user-cart')

}


const userPostAddAddress = async (req, res, next) => {

    console.log(req.body);
    let userAddress={}
    userAddress.userId=req.session.user
    userAddress.address=req.body
    userAddress.address.addressId=uuidv4()
    console.log(userAddress);

    console.log(req.session.user);

    //await userCollection.updateOne({ email: req.session.user }, { $set: { "userAddress.name": userAddress.name, "userAddress.phone": userAddress.phone, "userAddress.pincode": userAddress.pincode, "userAddress.locality": userAddress.locality, "userAddress.address": userAddress.address, "userAddress.city": userAddress.city, "userAddress.state": userAddress.state, "userAddress.landmark": userAddress.landmark, "userAddress.alternativephone": userAddress.alternativephone } })
    //await addressCollection.updateOne({ userId: req.session.user }, { $push:{"address.name":userAddress.name,"address.phone":userAddress.phone,"address.pincode":userAddress.pincode,"address.locality":userAddress.locality,"address.address":userAddress.address,"address.city":userAddress.city,"address.state":userAddress.state,"address.landmark":userAddress.landmark,"address.alternativephone":userAddress.alternativephone} } )



    const address = await addressCollection.findOne({ userId: req.session.user })
    if (address) {

        await addressCollection.updateOne({ userId: req.session.user }, { $push: { address: { name: userAddress.address.name, phone: userAddress.address.phone, pincode: userAddress.address.pincode, locality: userAddress.address.locality,address:userAddress.address.address,city:userAddress.address.city,state:userAddress.address.state,landmark:userAddress.address.landmark,alternativephone:userAddress.address.alternativephone,addressId:userAddress.address.addressId} } })




    }
    else {
        await addressCollection.insertMany([userAddress])
    }


res.redirect('/saved-address')





}

const userPostPlaceOrder = async (req, res, next) => {
    console.log(req.body);
    const deliveryAddress = req.body

    let subtotal = 0

    for (var i = 0; i < userCartAllProducts.length; i++) {
        subtotal = (userCartAllProducts[i].quantity * userCartAllProducts[i].product.price) + subtotal
    }

    let orders = { products: [] }

    orders.ordereduser = req.session.user
    orders.deliveryaddress = {
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        pincode: deliveryAddress.pincode,
        locality: deliveryAddress.locality,
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        landmark: deliveryAddress.landmark,
        alternativephone: deliveryAddress.alternativephone

    }
    orders.totalprice = subtotal

    for (var i = 0; i < userCartAllProducts.length; i++) {
        orders.products[i] = userCartAllProducts[i].product
        orders.products[i].quantity = userCartAllProducts[i].quantity
        orders.products[i].totalprice = userCartAllProducts[i].totalprice
        orders.products[i].status = "pending"
    }

    orders.ordereddate = new Date()

    let d = new Date()
    orders.deliverydate = new Date(d.setDate(d.getDate() + 7))
    // orders.orderstatus="pending"

    console.log(orders);
    await userOrdersCollection.insertMany([orders])




    await userCartCollection.deleteOne({ userId: req.session.user })

    res.redirect('/user-checkout')


}


const userPostEditPersonalDetails = async (req, res, next) => {

    const userDetails = req.body









    const findUsername = await userCollection.findOne({ username: userDetails.username })
    const findEmail = await userCollection.findOne({ email: userDetails.email })
    const findPhone = await userCollection.findOne({ phone: userDetails.phone })

    if (findUsername == null && findEmail == null && findPhone == null) {
        await userCollection.updateOne({ email: req.session.user }, { $set: { name: userDetails.name, username: userDetails.username, phone: userDetails.phone, email: userDetails.email } })
        req.session.user = userDetails.email
        message = "profile edited Succesfully"
        res.redirect('/user-profile')
    }

    else {
        let exist = {
            username: false,
            email: false,
            phone: false
        }
        if (findUsername != null) { exist.username = true }
        if (findEmail != null) { exist.email = true }
        if (findPhone != null) { exist.phone = true }

        console.log("profile edit failed user exist");


        if (exist.username) {
            message = "entered username not Available"
            res.redirect("/user-profile")
        } else if (exist.email) {
            message = "already have a account with this  email"
            res.redirect("/user-profile")
        } else if (exist.phone) {
            message = "entered phone  already used"
            res.redirect("/user-profile")
        }

    }



}

const userPostChangePassword = async (req, res, next) => {


    const user = await userCollection.findOne({ email: req.session.user })
    console.log(user);
    const loginDetails = req.body
    const passwordCheck = await bcrypt.compare(loginDetails.password, user.password)
    console.log(passwordCheck);

    if (passwordCheck) {

        loginDetails.newpassword = await bcrypt.hash(loginDetails.newpassword, 10)
        await userCollection.updateOne({ email: req.session.user }, { $set: { password: loginDetails.newpassword } })

        message = "password change succesfully"
        console.log("password change succesfully");
        res.redirect('/user-profile#chang-pwd')
    }
    else {

        message = "current password is incorrect"
        console.log("current password is incorrect");
        res.redirect('/user-profile#chang-pwd')
    }


    console.log(req.body);

}

const userPostEditAddress = async (req, res, next) => {
    const newAddress=req.body
    console.log(newAddress);
    const editId=req.params.id
    console.log(editId);
    await addressCollection.collection.updateOne(
        { userId:req.session.user, 'address.addressId':editId },
        { $set: { 'address.$.name':newAddress.name,'address.$.phone':newAddress.phone,'address.$.pincode':newAddress.pincode,'address.$.locality':newAddress.locality,'address.$.address':newAddress.address,'address.$.city':newAddress.city,'address.$.state':newAddress.state,'address.$.landmark':newAddress.landmark,'address.$.alternativephone':newAddress.alternativephone } }
      );

      res.redirect('/saved-address')

}

const userPostForgetPassword = async (req, res, next) => 
{
    const newpassword=req.body
    console.log(req.body);
    console.log(phonenumber);

    newpassword.password = await bcrypt.hash(newpassword.password, 10)
        await userCollection.updateOne({ phone: phonenumber }, { $set: { password: newpassword.password } })

        message = "password changed succesfully please login"
        console.log("password change succesfully");
        res.redirect('/user-login-email')
}



module.exports = {
verifylogin,verifynotlogin,    
userGetCartDelete,
userGetHome                              
,userGetSignup
,userGetCheckout,
userGetUserProfile
,userGetLoginEmail,
userGetUserLogout,
userGetLoginPhone,
userGetShop,
userGetProductSearch,
userGetOtpVerification,
userGetProductDetails,
userGetCart,
userGetCategory,
userGetUserOrders , 
userGetUserOrdersCancel,
userGetOtpresend,
userGetSavedAddress,
userGetSavedAddressChoose,
userGetDeleteAddress,
userGetForgetPassword,
userGetForgetPasswordClick,





userPostLoginEmail,
userPostOtpVerification,
userPostLoginPhone,
userPostAddAddress,                                           
userPostPlaceOrder,                                                
userPostEditPersonalDetails,
userPostChangePassword,
userPostAddToCart,
userPostSignup, 
userPostEditAddress, 
userPostForgetPassword                                            
}





