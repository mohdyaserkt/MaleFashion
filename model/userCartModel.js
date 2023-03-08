const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const userCartSchema=new mongoose.Schema({
    


    userId:{
        type:String,
    required:true},

    cartProducts:{
        type:Array,
    required:true},

    

    

})


const userCartCollection=new mongoose.model("userCartCollection",userCartSchema)

module.exports=userCartCollection

