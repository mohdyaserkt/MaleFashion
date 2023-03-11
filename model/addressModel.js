const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const addressSchema=new mongoose.Schema({
    

    userId:{
        type:String,
    required:true},

    address:{
        type:Array,
        required:true
    },
    

    

})


const addressCollection=new mongoose.model("addressCollection",addressSchema)

module.exports=addressCollection

