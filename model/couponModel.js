const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const adminCouponSchema=new mongoose.Schema({
    


    couponCode:{
        type:String,
    required:true},

    discountType:{
        type:String,
    required:true},

    discount:{
        type:Number,
    required:true},

    maxDiscountAmount:{
        type:Number
    },

    minPurchase:{
        type:Number,
    required:true},

    startingDate:{
        type:String,
    required:true},

    expiryDate:{
        type:String,
    required:true},

    expiryDate:{
        type:String,
    required:true},

    status:{
        type:Boolean,
    required:true},

    couponId:{
        type:String,
    required:true},




    

    

})


const adminCouponCollection=new mongoose.model("adminCouponCollection",adminCouponSchema)

module.exports=adminCouponCollection

