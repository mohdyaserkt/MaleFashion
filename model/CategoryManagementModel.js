const mongoose=require('mongoose')

require('../config/connection')

// mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const CategoryManagementSchema=new mongoose.Schema({
    


    categoryname:{
        type:String,
    required:true},

    date:{
        type:String,
    required:true},
    status:{
        type:Boolean,
    required:true},

    

    

})


const CategoryManagementCollection=new mongoose.model("CategoryManagementCollection",CategoryManagementSchema)

module.exports=CategoryManagementCollection

