require('dotenv').config();
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const userCollection = require('../model/userModel')

const nodeMailerOtp = require('../nodeMailer/nodeMail')
const productCollection = require('../model/productModel')
const CategoryManagementCollection = require('../model/CategoryManagementModel')
const userCartCollection = require('../model/userCartModel')
const userOrdersCollection = require('../model/ordersModel')
const adminBannerCollection = require('../model/bannerModel')
const session = require('express-session');
const addressCollection = require('../model/addressModel')
const Razorpay = require('razorpay')
const verifyOtpCollection = require('../model/otpVerifyModel')
const nodemailer = require('nodemailer')



const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})

const { v4: uuidv4 } = require('uuid')
const adminCouponCollection = require('../model/couponModel');
const { log } = require('console');




let productCategory
let userCartAllProducts = []


//let savedAddressId









const userGetHome = async function (req, res, next) {

    try {
        const user = req.session.user


        const banners = await adminBannerCollection.find({ status: true, bannerType: "Hero_Section" }).lean()
        const Deal_Of_the_Week = await adminBannerCollection.find({ status: true, bannerType: "Deal_Of_the_Week" }).lean()
        const Banner_1 = await adminBannerCollection.find({ status: true, bannerType: "Banner_1" }).lean()
        const Banner_2 = await adminBannerCollection.find({ status: true, bannerType: "Banner_2" }).lean()
        const Banner_3 = await adminBannerCollection.find({ status: true, bannerType: "Banner_3" }).lean()
        const latestProducts = await productCollection.find({ status: true }).sort({ _id: -1 }).limit(8).lean()

        res.render('home', { banners, user, layout: 'userlayout', Banner_1, Banner_2, Banner_3, Deal_Of_the_Week, latestProducts });
    } catch (error) {
        next()
    }



}

const userGetSignup = function (req, res, next) {
    try {
        res.render('user-signup', { message: req.session.message, layout: 'userlayout' });
        message = null
    } catch (error) {
        next()
    }




}

const userGetLoginEmail = function (req, res, next) {

    try {
        res.render('user-login-email', { message: req.session.message, layout: 'userlayout' })
        req.session.message = null
    } catch (error) {
        next()
    }



}

const userGetLoginOtp = function (req, res, next) {




    try {



        let forget = false
        if (req.query.type == "forgetpassword") {
            forget = true
            console.log("foget type ok");
        }


        res.render('user-login-phone', { message: req.session.message, layout: 'userlayout', forget });
        req.session.message = null
    } catch (error) {
        next()
    }
}

const userGetOtpVerification = function (req, res, next) {


    try {

        console.log(req.query.email);
        const email = req.query.email
        console.log("hiiiiiiiiiiiiiiiiia545454");


        res.render('user-otp-verification', { message: req.session.message, email, layout: 'userlayout' })
        req.session.message = null
    } catch (error) {
        next()
    }



}

const userGetShop = async function (req, res, next) {

    try {

        const productDetails = await CategoryManagementCollection.find({ status: true }).lean()
        console.log(productDetails);

        if (productCategory == "All Products" || productCategory == null) {

            if (req.session.pricefilter == null && req.session.sort == null) {


                const products = await productCollection.find({ status: true }).lean()
                console.log(products);
                res.render('shop', { products, productDetails, layout: 'userlayout' });

            }

            else if (req.session.pricefilter != null && req.session.sort == null) {

                console.log("llllllllllllll");
                const filterproducts = req.session.pricefilter
                const products = await productCollection.find({ status: true, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).lean()
                res.render('shop', { products: products, productDetails, layout: 'userlayout' });
                req.session.pricefilter = null

            }

            else if (req.session.pricefilter == null && req.session.sort != null) {
                const sort = req.session.sort
                let sortedProducts
                if (sort == "LTH") {
                    const products = await productCollection.find({ status: true }).sort({ price: -1 }).lean()
                    sortedProducts = products
                } else if (sort == "HTL") {
                    const products = await productCollection.find({ status: true }).sort({ price: 1 }).lean()
                    sortedProducts = products
                }
                else {
                    const products = await productCollection.find({ status: true }).lean()
                    sortedProducts = products

                }

                res.render('shop', { products: sortedProducts, productDetails, layout: 'userlayout' });

               
                req.session.sort=null
               


            }

            else if (req.session.pricefilter != null && req.session.sort != null) {


                const filterproducts = req.session.pricefilter

                const sort = req.session.sort
                let sortandfiltProducts
                if (sort == "LTH") {
                    const products = await productCollection.find({ status: true, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).sort({ price: -1 }).lean()
                    sortandfiltProducts = products
                } else if (sort == "HTL") {
                    const products = await productCollection.find({ status: true, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).sort({ price: 1 }).lean()
                    sortandfiltProducts = products
                }
                else {
                    const products = await productCollection.find({ status: true, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).lean()
                    sortandfiltProducts = products

                }

                res.render('shop', { products: sortandfiltProducts, productDetails, layout: 'userlayout' });


                req.session.pricefilter=null
                req.session.sort=null


            }

            // if (req.session.pricefilter) {




            //     console.log("llllllllllllll");
            //     const filterproducts = req.session.pricefilter
            //     const products = await productCollection.find({ status: true, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).lean()
            //     res.render('shop', { products: products, productDetails, layout: 'userlayout' });
            //     req.session.pricefilter = null

            // }

            // else {


            //         const products = await productCollection.find({ status: true }).lean()
            //         console.log(products);
            //         res.render('shop', { products, productDetails, layout: 'userlayout' });




            // }
        }





        else {

            if (req.session.pricefilter == null && req.session.sort == null) {

                 console.log("check else");
            console.log(productCategory);
            const products = await productCollection.find({ category: productCategory, status: true }).lean()
            console.log(products);
            res.render('shop', { products, productDetails, layout: 'userlayout' });
            // productCategory = null

            }

            else if (req.session.pricefilter != null && req.session.sort == null) {

                console.log("llllllllllllll");
                const filterproducts = req.session.pricefilter
                const products = await productCollection.find({ status: true,category: productCategory, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).lean()
                res.render('shop', { products: products, productDetails, layout: 'userlayout' });
                req.session.pricefilter = null

                req.session.pricefilter=null
               
                // productCategory = null


            }

            else if (req.session.pricefilter == null && req.session.sort != null) {


                const sort = req.session.sort
                let sortedProducts
                if (sort == "LTH") {
                    const products = await productCollection.find({ status: true,category: productCategory}).sort({ price: -1 }).lean()
                    sortedProducts = products
                } else if (sort == "HTL") {
                    const products = await productCollection.find({ status: true,category: productCategory }).sort({ price: 1 }).lean()
                    sortedProducts = products
                }
                else {
                    const products = await productCollection.find({ status: true,category: productCategory }).lean()
                    sortedProducts = products

                }

                res.render('shop', { products: sortedProducts, productDetails, layout: 'userlayout' });
                
                req.session.sort=null
                // productCategory = null


            }

            else if (req.session.pricefilter != null && req.session.sort != null) {


                const filterproducts = req.session.pricefilter

                const sort = req.session.sort
                let sortandfiltProducts
                if (sort == "LTH") {
                    const products = await productCollection.find({ status: true,category: productCategory, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).sort({ price: -1 }).lean()
                    sortandfiltProducts = products
                } else if (sort == "HTL") {
                    const products = await productCollection.find({ status: true,category: productCategory, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).sort({ price: 1 }).lean()
                    sortandfiltProducts = products
                }
                else {
                    const products = await productCollection.find({ status: true,category: productCategory, price: { $gte: filterproducts.from, $lte: filterproducts.to } }).lean()
                    sortandfiltProducts = products

                }

                res.render('shop', { products: sortandfiltProducts, productDetails, layout: 'userlayout' });


                req.session.pricefilter=null
                req.session.sort=null
                // productCategory = null


            }


            // console.log("check else");
            // console.log(productCategory);
            // const products = await productCollection.find({ category: productCategory, status: true }).lean()
            // console.log(products);
            // res.render('shop', { products, productDetails, layout: 'userlayout' });
            // productCategory = null
        }







    } catch (error) {
        next()
    }


}


const userGetCategory = async function (req, res, next) {

    try {
        productCategory = req.params.id
        console.log(productCategory);

        res.redirect('/shop')




    } catch (error) {
        next()
    }


}


const userGetProductDetails = async function (req, res, next) {



    try {
        const adCrtMsg = req.session.adcartqtychk
        const productDetailsId = req.params.id
        const product = await productCollection.find({ _id: productDetailsId }).lean()
        console.log(product);
        const image = product[0].image
        console.log(image);
        console.log(product[0].category);
        const relatedProducts = await productCollection.find({ category: product[0].category, status: true }).sort({ _id: -1 }).limit(4).lean()
        console.log(relatedProducts);
        res.render('product-details', { product, image, layout: 'userlayout', adCrtMsg, relatedProducts })

    } catch (error) {
        next()
    }


}



const userGetUserLogout = async function (req, res, next) {

    try {
        req.session.user = null
        res.redirect('/user-login-email')

    } catch (error) {
        next()
    }


}

const userGetCart = async function (req, res, next) {



    try {

        req.session.discountedAmount = null
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
        req.session.userCartAllProducts = userCartAllProducts
        console.log("hiiiiiiiiii");
        console.log(userCartAllProducts);
        console.log(req.session.user);
        const checkout = true
        //quantity greater than Stock
        for (i = 0; i < userCartAllProducts.length; i++) {
            if (userCartAllProducts[i].quantity > userCartAllProducts[i].product.stock) {
                checkout = false
            }

        }


        let totalprice
        let total

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

        //coupon check

        if (req.session.coupon) {

            const coupon = await adminCouponCollection.findOne({ couponCode: req.session.coupon }).lean()
            console.log(coupon);

            if (coupon.discountType == "Percentage") {

                if (subtotal >= coupon.minPurchase) {
                    const couponDiscount = subtotal * coupon.discount / 100
                    let discount
                    couponDiscount > coupon.maxDiscountAmount ? discount = coupon.maxDiscountAmount : discount = couponDiscount;

                    total = subtotal - discount
                    req.session.discountedAmount = discount
                    req.session.coupon = null
                }
                else {
                    console.log("minum amount for this coupon is ");
                    req.session.cpnMessage = "Purchase Amount Must Be greater than" + coupon.minPurchase + "For Applying This Coupon"
                }
            }
            else {
                if (subtotal >= coupon.minPurchase) {

                    req.session.coupon = null
                    let discount = coupon.discount

                    total = subtotal - discount

                    req.session.discountedAmount = discount

                } else {
                    console.log("minum amount for this coupon is ");
                    req.session.cpnMessage = "Purchase Amount Must Be greater than" + coupon.minPurchase + "For Applying This Coupon"
                }
            }

        }
        let discount1 = req.session.discountedAmount
        const cpnMessage = req.session.cpnMessage
        req.session.totalamntcart = total





        res.render('user-cart', { userCartAllProducts, subtotal, cpnMessage, discount1, total, layout: 'userlayout', checkout })

        req.session.cpnMessage = null
    } catch (error) {
        next()
    }



}
const userGetCheckout = async function (req, res, next) {



    try {

        const walletBalance= await userCollection.findOne({email:req.session.user}).lean()
        console.log("heloooooooooooooooooooooooooo");
        console.log(walletBalance);

        const cartProducts=await userCartCollection.findOne({userId:req.session.user})
        let cart=false
        if(cartProducts){cart=true}

        let checkoutAddress
        const defaultAddress = await addressCollection.findOne({ userId: req.session.user, })
        if (req.session.choosedAddress) {

            checkoutAddress = await addressCollection.aggregate([

                {
                    $match: { userId: req.session.user }
                },
                {
                    $unwind: "$address"
                },
                {
                    $match: { "address.addressId": req.session.choosedAddress }
                }

            ])

        } else {

            checkoutAddress = await addressCollection.aggregate([

                {
                    $match: { userId: req.session.user }
                },
                {
                    $unwind: "$address"
                },
                {
                    $match: { "address.default": true }
                }

            ])

        }







        //const products = await userCartCollection.find({userId:req.session.user})
        let chooseaddress
        let savedAddress = false
        const address = await addressCollection.findOne({ userId: req.session.user }).lean()
        if (address) {
            savedAddress = true
            chooseaddress = address.address
        }
        const chkoutorders = req.session.userCartAllProducts
        console.log(chkoutorders);
        let subtotal = 0
       if(req.session.userCartAllProducts){
        for (var i = 0; i < chkoutorders.length; i++) {
            subtotal = (chkoutorders[i].quantity * chkoutorders[i].product.price) + subtotal
        }}

        const total = req.session.totalamntcart


        res.render('user-checkout', { layout: 'userlayout',cart, chkoutorders, subtotal, total, userData: checkoutAddress, chooseaddress, savedAddress,walletBalance })

    } catch (error) {
        next()
    }

}

const userGetUserProfile = async function (req, res, next) {

    try {
        const user = await userCollection.find({ email: req.session.user }).lean()
        console.log(user);
        const userAddress = user[0].userAddress
        console.log(userAddress);
        const message = req.session.message
        const messagechp = req.session.messagechp
        res.render('user-profile', { user, message,messagechp, userAddress, layout: 'userlayout' })
        req.session.req.session.message = null
    } catch (error) {
        next()
    }


}




const userGetUserOrders = async function (req, res, next) {


    try {
        const id = mongoose.Types.ObjectId(req.session.ordersId)

        const user = req.session.user
        const orders = await userOrdersCollection.aggregate([
            {
                $match: { _id: id }
            },
            {
                $unwind: '$products'
            }
        ])


        console.log(orders);

        res.render('user-orders', { orders, layout: 'userlayout' })

    } catch (error) {
        next()
    }


}


const userGetCartDelete = async function (req, res, next) {



    try {
        const productId = req.query.productId
        const colour = req.query.colour
        const size = req.query.size

        console.log("check delete cart");

        await userCartCollection.updateOne({ userId: req.session.user }, { $pull: { cartProducts: { productId: productId, colour: colour, size: size } } })

        res.redirect('/user-cart')
    } catch (error) {
        next()
    }



}



const userGetUserOrdersCancel = async function (req, res, next) {

    try {
        const id = req.query.id
        const status = "canceled"
        const productid = req.query.productid
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhh" + id);
        console.log(req.query.paymentmethod);
        const paymentmethod=req.query.paymentmethod
        console.log(req.query.totalprice);
        const totalprice=req.query.totalprice
        console.log(productid);
        await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.status": status } })
        if(paymentmethod=="online payments")
        {
            await userCollection.updateOne({email:req.session.user},{ $inc: { wallet: totalprice } })
        }
        res.redirect('/user-orders')
    } catch (error) {
        next()
    }




}



const userPostOtpresend = async function (req, res, next) {

    try {

        const otpEmail = req.body.email
        let otpCode = Math.floor(100000 + Math.random() * 499999)

        await verifyOtpCollection.updateOne({ email: otpEmail }, {
            $set: {
                otpTime: true, otpCode: otpCode
            }
        })


        nodeMailerOtp(otpCode, otpEmail)

        setTimeout(async function () {
            await verifyOtpCollection.updateOne({ email: otpEmail }, { $set: { otpTime: false } })
            console.log("resend_otp_timeout");
        }, 5 * 60000);







        console.log("otp resended");

    } catch (error) {
        next()
    }





}

const userGetSavedAddress = async function (req, res, next) {

    try {
        let allSavedAdress
        const address = await addressCollection.findOne({ userId: req.session.user }).lean()
        if (address) {
            allSavedAdress = address.address
        }


        res.render('user-saved-address', { alladdress: allSavedAdress, layout: 'userlayout' })
    } catch (error) {
        next()
    }

}


const userGetSavedAddressChoose = async function (req, res, next) {

    try {

        req.session.choosedAddress = req.params.id
        res.redirect('/user-checkout')
    } catch (error) {
        next()
    }

}


const userGetDeleteAddress = async function (req, res, next) {

    try {
        const deleteId = req.params.id

        await addressCollection.collection.updateOne(
            { userId: req.session.user },
            { $pull: { address: { addressId: deleteId } } })

        res.redirect('/saved-address')

    } catch (error) {
        next()
    }



}


const userGetForgetPassword = async function (req, res, next) {

    try {

        const email = req.query.email
        res.render('user-forget-password', { layout: 'userlayout', email })

    } catch (error) {
        next()
    }

}

const userGetForgetPasswordClick = async function (req, res, next) {
    try {
        req.session.user = null


        res.redirect('/user-login-otp/?type=' + "forgetpassword")

    } catch (error) {
        next()
    }

}


const userGetPriceFilter = async function (req, res, next) {

    try {

        const PriceFilterObj = {
            from: req.query.from,
            to: req.query.to
        }

        // const from = req.query.from
        // const to = req.query.to
        // console.log(from, to);




        // const products = await productCollection.find({ status: true, price: { $gte: from, $lte: to } }).lean()

        req.session.pricefilter = PriceFilterObj
        res.redirect('/shop')
    } catch (error) {
        next()
    }


}


const userGetOrdersList = async function (req, res, next) {

    try {
        const orders = await userOrdersCollection.find({ ordereduser: req.session.user }).sort({ _id: -1 }).lean()
        console.log(orders);
        res.render('user-orders-list', { orders, layout: 'userlayout' })
    } catch (error) {
        next()
    }

}


const userGetUserOrdersId = async function (req, res, next) {

    try {
        req.session.ordersId = req.params.id
        res.redirect('/user-orders')
    } catch (error) {
        next()
    }


}


const userGetReturnRequest = async function (req, res, next) {

    try {
        const id = req.query.id
        const returnreq = "Return Requested"
        const productid = req.query.productid
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhh" + id);
        console.log(productid);
        await userOrdersCollection.updateOne({ _id: id, "products.productid": productid }, { $set: { "products.$.status": returnreq } })
        res.redirect('/user-orders')
    } catch (error) {
        next()
    }

}

const userGetWishlist = async function (req, res, next) {
    // try {
    const products = await userCollection.aggregate
        (
            [
                {
                    $match: { email: req.session.user }
                },
                {
                    $unwind: '$wishlist'
                },
                {
                    $lookup:
                    {
                        from: 'productcollections',
                        localField: 'wishlist',
                        foreignField: 'productid',
                        as: 'product'
                    }
                },
                {
                    $project:
                    {
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]
        )

    console.log(products);
    console.log("hiiiiiiii");
    res.render('user-wishlist', { layout: 'userlayout', products })
    // } catch (error) {
    //     next()
    // }
}


const userPostAddToWishlist = async function (req, res, next) {
    try {

        const productId = req.body.productid

        console.log(req.body);

        const existWishList = await userCollection.findOne({ email: req.session.user, wishlist: { $in: [productId] } }).lean()
        if (existWishList) { }
        else {
            await userCollection.updateOne(
                { email: req.session.user },
                { "$push": { "wishlist": productId } }
            )
        }
        res.json({ status: true })

    } catch (error) {
        next()
    }
}


const userGetOrderSuccess = async function (req, res, next) {
    res.render('order-success', { layout: 'userlayout' })
}


const userGetDefaultAddress = async function (req, res, next) {
    const addressId = req.params.id
    await userCollection.updateOne({ email: req.session.user }, { $set: { defaultAddress: addressId } })

    await addressCollection.updateOne(
        { userId: req.session.user, "address.default": true },
        { "$set": { "address.$.default": false } }
    )


    await addressCollection.updateOne(
        { userId: req.session.user, "address.addressId": addressId },
        { "$set": { "address.$.default": true } }
    )

    res.redirect('/saved-address')
}

const userGetRemoveWishlist = async function (req, res, next) {
    const productId = req.params.id

    await userCollection.updateOne({ email: req.session.user }, { $pull: { wishlist: productId } })
    res.redirect('/user-wishlist')


}

const userGetSort = async function (req, res, next) {

    const sort = req.params.id
    req.session.sort = sort
    console.log(sort);

    // if (sort == "LTH") {
    //     const products = await productCollection.find({ status: true }).sort({ price: -1 }).lean()
    //     req.session.sort = products
    // } else if (sort == "HTL") {
    //     const products = await productCollection.find({ status: true }).sort({ price: 1 }).lean()
    //     req.session.sort = products
    // }
    // else {
    //     const products = await productCollection.find({ status: true }).lean()
    //     req.session.sort = products

    // }

    res.redirect('/shop')
}




//post requests

const userPostSignup = (req, res, next) => {


    const registerDetails = req.body

    async function existcheckandinsert() {

        try {

            const findUsername = await userCollection.findOne({ username: registerDetails.username }).lean()
            const findEmail = await userCollection.findOne({ email: registerDetails.email }).lean()
            const findPhone = await userCollection.findOne({ phone: registerDetails.phone }).lean()

            if (findUsername == null && findEmail == null && findPhone == null) {
                let otpCode = Math.floor(100000 + Math.random() * 499999)
                registerDetails.otpCode = otpCode
                registerDetails.otpTime = true
                registerDetails.password = await bcrypt.hash(registerDetails.password, 10)
                registerDetails.type = "register"
                const exstchkvrifyotpclction = await verifyOtpCollection.findOne({ email: registerDetails.email })
                if (exstchkvrifyotpclction) {
                    await verifyOtpCollection.updateOne({ email: registerDetails.email }, {
                        $set: {
                            name: registerDetails.name, otpTime: true, otpCode: registerDetails.otpCode, password: registerDetails.password, phone: registerDetails.phone,
                            username: registerDetails.username, type: registerDetails.type
                        }
                    })
                }
                else {
                    await verifyOtpCollection.insertMany([registerDetails])
                }



                setTimeout(async function () {
                    await verifyOtpCollection.updateOne({ email: registerDetails.email }, { $set: { otpTime: false } })
                    console.log("otp_timeouts");
                }, 5 * 60000);

                const otpEmail = registerDetails.email

                nodeMailerOtp(otpCode, otpEmail)






                res.redirect('/user-otp-verification/?email=' + registerDetails.email)
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
                    req.session.message = "entered username not Available"
                    res.redirect("/user-signup")
                } else if (exist.email) {
                    req.session.message = "already have a account with this  email"
                    res.redirect("/user-signup")
                } else if (exist.phone) {
                    req.session.message = "entered phone  already used"
                    res.redirect("/user-signup")
                }

            }

        } catch (error) {

            next()

        }

    }

    existcheckandinsert()

}

const userPostLoginEmail = async (req, res, next) => {

    try {

        const status = { email: false, password: false }


        const loginDetails = req.body
        console.log(loginDetails);

        const user = await userCollection.findOne({ email: loginDetails.email }).lean()

        if (user) {
            status.email = true
            const passwordCheck = await bcrypt.compare(loginDetails.password, user.password)
            if (user.status) {
                if (passwordCheck == true) {
                    status.password = true
                    req.session.user = loginDetails.email
                    res.redirect('/')
                }
                else {

                    req.session.message = "You entered Password is Incorrect"
                    res.redirect('/user-login-email')

                }
            }
            else {

                req.session.message = "Your account is blocked by Admin"
                res.redirect('/user-login-email')

            }


        }
        else {

            req.session.message = "You Entered username is incorrect"
            res.redirect('/user-login-email')
        }

    } catch (error) {

        next();

    }





}



const userPostOtpVerification = async (req, res, next) => {

    // try {

    console.log(req.body);
    let otpDetails = req.body
    const userEmail = req.params.email


    const otpData = await verifyOtpCollection.findOne({ email: userEmail })

    const otpCode = otpData.otpCode



    if (otpDetails.otp == otpCode) {


        if (otpData.otpTime) {



            if (otpData.type == "login") {
                console.log("logined successssss");
                req.session.user = otpData.email

                res.redirect('/')
            }

            else if (otpData.type == "forgetpassword") {

                res.redirect('/forget-password/?email=' + otpData.email)
            }
            else if (otpData.type == "register") {

                const user =
                {
                    name: otpData.name,
                    username: otpData.username,
                    status: true,
                    password: otpData.password,
                    email: otpData.email,
                    phone: otpData.phone
                }

                await userCollection.insertMany([user])
                req.session.user = otpData.email;
                res.redirect('/')
            }
        } else {

            req.session.message = " entered otp is expired!!!"
            res.redirect('/user-otp-verification')

        }





    }

    else {
        req.session.message = " entered otp incorrect"
        res.redirect('/user-otp-verification')
    }



    // } catch (error) {
    //     next()

    // }


}


const userPostLoginOtp = async (req, res, next) => {



    try {
        let emailLogindetails = req.body

        const findUser = await userCollection.findOne({ email: emailLogindetails.email }).lean()


        if (findUser) {


            if (findUser.status) {



                let otpCode = Math.floor(100000 + Math.random() * 499999)
                emailLogindetails.otpCode = otpCode
                emailLogindetails.otpTime = true

                const exstchkvrifyotpclction = await verifyOtpCollection.findOne({ email: emailLogindetails.email })
                if (exstchkvrifyotpclction) {
                    await verifyOtpCollection.updateOne({ email: emailLogindetails.email }, {
                        $set: {
                            otpTime: true, otpCode: emailLogindetails.otpCode, type: emailLogindetails.type
                        }
                    })
                }
                else {
                    await verifyOtpCollection.insertMany([emailLogindetails])
                }






                const otpEmail = emailLogindetails.email
                nodeMailerOtp(otpCode, otpEmail)


                setTimeout(async function () {
                    await verifyOtpCollection.updateOne({ email: emailLogindetails.email }, { $set: { otpTime: false } })
                    console.log("otp_timeouts");
                }, 5 * 60000);





                res.redirect('/user-otp-verification/?email=' + emailLogindetails.email)
            }

            else {
                res.redirect('/user-login-otp')
                req.session.message = "entered account is Blocked"
                console.log("entered account is Blocked");
            }
        }

        else {

            res.redirect('/user-login-otp')
            req.session.message = "entered phone not exist"
            console.log("entered phone not exist");
        }




    } catch (error) {

        console.log(error);

    }
}


const userPostAddToCart = async (req, res, next) => {


    try {
        const id = req.params.id
        const cartProductDetails = req.body
        cartProductDetails.productId = id
        console.log(cartProductDetails);
        console.log("");
        console.log(id);
        console.log(req.session.user);
        cartProductDetails.quantity = parseInt(cartProductDetails.quantity)
        const product = await productCollection.findOne({ productid: cartProductDetails.productId }).lean()
        console.log(product);
        console.log(cartProductDetails);
        if (cartProductDetails.quantity <= product.stock) {
            const sameprdct = await userCartCollection.findOne({ userId: req.session.user, "cartProducts.productId": cartProductDetails.productId, "cartProducts.colour": cartProductDetails.colour, "cartProducts.size": cartProductDetails.size }).lean()
            if (sameprdct) {
                console.log("");

                await userCartCollection.updateOne({ userId: req.session.user, "cartProducts.productId": cartProductDetails.productId, "cartProducts.colour": cartProductDetails.colour, "cartProducts.size": cartProductDetails.size }, { $inc: { "cartProducts.$.quantity": cartProductDetails.quantity } }).lean()
                res.redirect('/user-cart')
            }
            else {
                const userCart = await userCartCollection.findOne({ userId: req.session.user }).lean()
                if (userCart) {

                    await userCartCollection.updateOne({ userId: req.session.user }, { $push: { cartProducts: { productId: cartProductDetails.productId, size: cartProductDetails.size, colour: cartProductDetails.colour, quantity: cartProductDetails.quantity } } })




                }
                else {
                    await userCartCollection.insertMany([{ userId: req.session.user, cartProducts: [{ productId: cartProductDetails.productId, size: cartProductDetails.size, colour: cartProductDetails.colour, quantity: cartProductDetails.quantity }] }])
                }

                res.redirect('/user-cart')
            }
        }

        else {
            req.session.adcartqtychk = "Product Stock is Low Decrease The Quantity"
            res.redirect('/product-details')
        }
    } catch (error) {
        next()
    }



}


const userPostAddAddress = async (req, res, next) => {


    try {
        console.log(req.body);
        let userAddress = {}
        userAddress.userId = req.session.user
        userAddress.address = req.body
        userAddress.address.addressId = uuidv4()
        console.log(userAddress);

        console.log(req.session.user);

        //await userCollection.updateOne({ email: req.session.user }, { $set: { "userAddress.name": userAddress.name, "userAddress.phone": userAddress.phone, "userAddress.pincode": userAddress.pincode, "userAddress.locality": userAddress.locality, "userAddress.address": userAddress.address, "userAddress.city": userAddress.city, "userAddress.state": userAddress.state, "userAddress.landmark": userAddress.landmark, "userAddress.alternativephone": userAddress.alternativephone } })
        //await addressCollection.updateOne({ userId: req.session.user }, { $push:{"address.name":userAddress.name,"address.phone":userAddress.phone,"address.pincode":userAddress.pincode,"address.locality":userAddress.locality,"address.address":userAddress.address,"address.city":userAddress.city,"address.state":userAddress.state,"address.landmark":userAddress.landmark,"address.alternativephone":userAddress.alternativephone} } )



        const address = await addressCollection.findOne({ userId: req.session.user }).lean()
        if (address) {

            await addressCollection.updateOne({ userId: req.session.user }, { $push: { address: { name: userAddress.address.name, phone: userAddress.address.phone, pincode: userAddress.address.pincode, locality: userAddress.address.locality, address: userAddress.address.address, city: userAddress.address.city, state: userAddress.address.state, landmark: userAddress.address.landmark, alternativephone: userAddress.address.alternativephone, addressId: userAddress.address.addressId } } })




        }
        else {
            await addressCollection.insertMany([userAddress])
        }


        res.redirect('/saved-address')


    } catch (error) {
        next()
    }





}

const userPostPlaceOrder = async (req, res, next) => {


    try {
        console.log(req.body);

        const deliveryAddress = req.body






        let subtotal = 0

        for (var i = 0; i < userCartAllProducts.length; i++) {
            subtotal = (userCartAllProducts[i].quantity * userCartAllProducts[i].product.price) + subtotal
        }

        //discounting

        subtotal = subtotal - req.session.discountedAmount

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
            alternativephone: deliveryAddress.alternativephone,


        }
        orders.totalprice = subtotal
        for (var i = 0; i < userCartAllProducts.length; i++) {
            orders.products[i] = userCartAllProducts[i].product
            orders.products[i].quantity = userCartAllProducts[i].quantity
            orders.products[i].totalprice = userCartAllProducts[i].totalprice
            orders.products[i].status = "pending"
            orders.products[i].return = null

        }
        orders.ordereddate = new Date()
        orders.ordereddate = orders.ordereddate.toISOString().slice(0, 10);

        let d = new Date()
        orders.deliverydate = new Date(d.setDate(d.getDate() + 7))
        orders.deliverydate = orders.deliverydate.toISOString().slice(0, 10);
        orders.paymentmethod = deliveryAddress.paymentmethod
        // orders.orderstatus="pending"
        console.log(orders);
        console.log(deliveryAddress)
        req.session.orders = orders


        console.log("5555555555555555555555555555555555555555555555555");
        console.log(req.session.orders);
        payReciept = uuidv4()


        if (deliveryAddress.paymentmethod == "online payments") {


            var options = {

                amount: subtotal * 100, //to convert 1
                currency: "INR",
                receipt: payReciept,
            }

            instance.orders.create(options, function (err, order) {
                console.log(order);
                console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
                res.json({ status: true, order: order })
            })



        }
        else if(deliveryAddress.paymentmethod == "Wallet"){
            const paymentid=uuidv4()
            for (i = 0; i < orders.products.length; i++) {
                orders.products[i].paymentid =paymentid

            }
            await userCollection.updateOne({email:req.session.user},{ $inc: { wallet: "-" + orders.totalprice} })
            await userOrdersCollection.insertMany([orders])
            await userCartCollection.deleteOne({ userId: req.session.user })
            res.json({ status: false })

        }
        else {
            const paymentid=uuidv4()
            for (i = 0; i < orders.products.length; i++) {
                orders.products[i].paymentid =paymentid

            }
            console.log("HIIIIIIIIIIIIII");
            await userOrdersCollection.insertMany([orders])
            await userCartCollection.deleteOne({ userId: req.session.user })

            res.json({ status: false })
        }



    } catch (error) {
        next()
    }












}


const userPostEditPersonalDetails = async (req, res, next) => {


    try {
        const userDetails = req.body









        const findUsername = await userCollection.findOne({ username: userDetails.username }).lean()
        const findEmail = await userCollection.findOne({ email: userDetails.email }).lean()
        const findPhone = await userCollection.findOne({ phone: userDetails.phone }).lean()

        if (findUsername == null && findEmail == null && findPhone == null) {
            await userCollection.updateOne({ email: req.session.user }, { $set: { name: userDetails.name, username: userDetails.username, phone: userDetails.phone, email: userDetails.email } })
            req.session.user = userDetails.email
            req.session.message = "profile edited Succesfully"
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
                req.session.message = "entered username not Available"
                res.redirect("/user-profile")
            } else if (exist.email) {
                req.session.message = "already have a account with this  email"
                res.redirect("/user-profile")
            } else if (exist.phone) {
                req.session.message = "entered phone  already used"
                res.redirect("/user-profile")
            }

        }

    } catch (error) {
        next()
    }



}

const userPostChangePassword = async (req, res, next) => {


    try {
        const user = await userCollection.findOne({ email: req.session.user }).lean()
        console.log(user);
        const loginDetails = req.body
        const passwordCheck = await bcrypt.compare(loginDetails.password, user.password)
        console.log(passwordCheck);

        if (passwordCheck) {

            loginDetails.newpassword = await bcrypt.hash(loginDetails.newpassword, 10)
            await userCollection.updateOne({ email: req.session.user }, { $set: { password: loginDetails.newpassword } })

            req.session.message = "password change succesfully"
            console.log("password change succesfully");
            res.redirect('/user-profile#chang-pwd')
        }
        else {

            req.session.messagechp = "current password is incorrect"
            console.log("current password is incorrect");
            res.redirect('/user-profile#chang-pwd')
        }


        console.log(req.body);
    } catch (error) {
        next()
    }




}

const userPostEditAddress = async (req, res, next) => {

    try {
        const newAddress = req.body
        console.log(newAddress);
        const editId = req.params.id
        console.log(editId);
        await addressCollection.collection.updateOne(
            { userId: req.session.user, 'address.addressId': editId },
            { $set: { 'address.$.name': newAddress.name, 'address.$.phone': newAddress.phone, 'address.$.pincode': newAddress.pincode, 'address.$.locality': newAddress.locality, 'address.$.address': newAddress.address, 'address.$.city': newAddress.city, 'address.$.state': newAddress.state, 'address.$.landmark': newAddress.landmark, 'address.$.alternativephone': newAddress.alternativephone } }
        )

        res.redirect('/saved-address')
    } catch (error) {
        next()
    }


}

const userPostForgetPassword = async (req, res, next) => {

    try {
        const newpassword = req.body
        console.log(req.body);


        newpassword.password = await bcrypt.hash(newpassword.password, 10)
        await userCollection.updateOne({ email: newpassword.email }, { $set: { password: newpassword.password } })

        req.session.message = "password changed succesfully please login"
        console.log("password change succesfully");
        res.redirect('/user-login-email')
    } catch (error) {
        next()
    }


}


const userPostVerifyPayment = async (req, res, next) => {

    try {
        console.log(req.body);

        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', 'O9IRml5Y0u2dKD356Snuu2o9');
        hmac.update(req.body['payment[razorpay_order_id]'] + '|' + req.body['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')

        if (hmac == req.body['payment[razorpay_signature]']) {
            console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccc");
            const orders = req.session.orders
            orders.ordereddate = new Date()
            orders.ordereddate = orders.ordereddate.toISOString().slice(0, 10);
            let d = new Date()
            orders.deliverydate = new Date(d.setDate(d.getDate() + 7))
            orders.deliverydate = orders.deliverydate.toISOString().slice(0, 10);
            orders.products.paymentid = uuidv4()
            for (i = 0; i < orders.products.length; i++) {
                orders.products[i].paymentid = req.body['payment[razorpay_payment_id]']

            }
            await userOrdersCollection.insertMany([orders])
            await userCartCollection.deleteOne({ userId: req.session.user })







            req.session.user.orders = null

            res.json({ status: true })
        }
        else {
            console.log("hiiiiiiiiiiiiiiiii");
        }

    } catch (error) {
        next()
    }

}


const userPostChangeCartQuantity = async (req, res, next) => {


    try {
        console.log(req.body);
        const updatedetails = req.body
        updatedetails.count = parseInt(updatedetails.count)
        await userCartCollection.updateOne({ userId: req.session.user, 'cartProducts.productId': updatedetails.productid }, { $inc: { 'cartProducts.$.quantity': updatedetails.count } })
        console.log("quantity changed");




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
        let totalprice
        

        for (var i = 0; i < userCartAllProducts.length; i++) {
            totalprice = userCartAllProducts[i].quantity * userCartAllProducts[i].product.price
            userCartAllProducts[i].totalprice = totalprice
        }

        req.session.userCartAllProducts=userCartAllProducts

        let subtotal = 0

        for (var i = 0; i < userCartAllProducts.length; i++) {
            subtotal = (userCartAllProducts[i].quantity * userCartAllProducts[i].product.price) + subtotal
        }
        let total
        if(req.session.discountedAmount){
            total=subtotal-req.session.discountedAmount
        }else{
            total=subtotal
        }
        req.session.totalamntcart=total

        res.json({ quantity: updatedetails.quantity,productId: updatedetails.productid,total:total,subtotal:subtotal,size:updatedetails.size });

        
    } catch (error) {
        next()
    }




}


const userPostGetProducts = async (req, res, next) => {

    try {
        console.log(req.body);
        let payload = req.body.payload.trim();
        console.log(payload);
        let search = await productCollection.find({status:true, title: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        console.log(search);
        //limit serch result
        search = search.slice(0, 10)
        res.send({ payload: search });

    } catch (error) {
        next()
    }

}

const userPostApplyCoupon = async (req, res, next) => {

    try {
        console.log(req.body);
        const code = req.body.couponCode

        const coupon = await adminCouponCollection.findOne({ couponCode: code }).lean()
        console.log(coupon);
        if (coupon) {
            const date = new Date()
            const formattedDate = date.toISOString().slice(0, 10);
            if (date < coupon.expiryDate && date > coupon.expiryDate && coupon.status) {
                console.log("cou[pon invalid");
                req.session.cpnMessage = "Coupon Is Invalid"
                res.redirect('/user-cart')
            } else {
                req.session.coupon = code
                res.redirect('/user-cart')
            }
        }
        else {
            console.log("cou[pon invalid");
            req.session.cpnMessage = "Coupon Is Invalid"
            res.redirect('/user-cart')
        }
    } catch (error) {
        next()
    }

}


module.exports = {

    userGetCartDelete,
    userGetHome
    , userGetSignup
    , userGetCheckout,
    userGetUserProfile
    , userGetLoginEmail,
    userGetUserLogout,
    userGetLoginOtp,
    userGetShop,

    userGetOtpVerification,
    userGetProductDetails,
    userGetCart,
    userGetCategory,
    userGetUserOrders,
    userGetUserOrdersCancel,

    userGetSavedAddress,
    userGetSavedAddressChoose,
    userGetDeleteAddress,
    userGetForgetPassword,
    userGetForgetPasswordClick,
    userGetPriceFilter,
    userGetOrdersList,
    userGetUserOrdersId,
    userGetReturnRequest,
    userGetWishlist,
    userPostAddToWishlist,
    userGetOrderSuccess,
    userGetDefaultAddress,
    userGetRemoveWishlist,
    userGetSort,





    userPostLoginEmail,
    userPostOtpVerification,
    userPostLoginOtp,
    userPostAddAddress,
    userPostPlaceOrder,
    userPostEditPersonalDetails,
    userPostChangePassword,
    userPostAddToCart,
    userPostSignup,
    userPostEditAddress,
    userPostForgetPassword,
    userPostVerifyPayment,
    userPostChangeCartQuantity,
    userPostGetProducts,
    userPostApplyCoupon,
    userPostOtpresend
}





