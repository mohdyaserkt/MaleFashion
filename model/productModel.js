const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const ProductSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },

    stock:{
        type:Number,
        required:true
    },

    brand:{
        type:String,
        required:true
    },

    subcategory:{
        type:String,
        required:true
    },

    productid:{
        type:String,
        required:true
    },

    image:{
        type:Array,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    
    

})


const productCollection=new mongoose.model("productCollection",ProductSchema)

module.exports=productCollection

