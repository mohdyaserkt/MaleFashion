const mongoose=require('mongoose')


require('../config/connection')
// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
    },


    username:{
        type:String,
    required:true},

    email:{
        type:String,
    },

    phone:{
        type:String,
    },


    password:{
        type:String,
    required:true},

    address:{
        type:String,
    },

    

})


const adminCollection=new mongoose.model("adminCollection",LogInSchema)

module.exports=adminCollection

