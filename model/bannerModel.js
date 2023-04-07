const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const adminBannerSchema=new mongoose.Schema({
    


    image:{
        type:String,
    required:true},

    mainTitle1:{
        type:String,
    required:true},

    mainTitle2:{
        type:String,
    },

    description:{
        type:String,
    },
    status:{
        type:Boolean,
    required:true},
    bannerType:{
        type:String,
    required:true},
    bannerId:{
        type:String,
    required:true}
    

    

})


const adminBannerCollection=new mongoose.model("adminBannerCollection",adminBannerSchema)

module.exports=adminBannerCollection

