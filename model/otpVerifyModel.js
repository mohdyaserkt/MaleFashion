const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const verifyOtpSchema=new mongoose.Schema({
    


    name:{
        type:String},


    username:{
        type:String},

    email:{
        type:String,
    required:true},

    phone:{
        type:String},


    password:{
        type:String},

    otpCode:{
        type:Number,
    required:true},
    otpTime:{
        type:Boolean,
    required:true},

    registerStatus:{
        type:Boolean,
    },
    type:{
        type:String,
    required:true},

    

    

})


const verifyOtpCollection=new mongoose.model("verifyOtpCollection",verifyOtpSchema)

module.exports=verifyOtpCollection

