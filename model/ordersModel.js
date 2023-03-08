const mongoose=require('mongoose')



mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const userOrdersSchema=new mongoose.Schema({
    


    ordereduser:{
        type:String,
    required:true},

    deliveryaddress:{
        name:{
            type:String,
        },
    
        phone:{
            type:Number,
        },
    
        pincode:{
            type:Number,
        },
        locality:{
            type:String,
        },
        address:{
            type:String,
        },
        city:{
            type:String,
        },
        state:{
            type:String,
        },
        landmark:{
            type:String,
        },
        alternativephone:{
            type:Number,
        }
    },
    totalprice:{
        type:Number,
    required:true},

    products:{
        type:Array,
    required:true},

    couponid:{
        type:String,
    },

    coupondiscount:{
        type:String,
    },
    ordereddate:{
        type:String,
    required:true},
    deliverydate:{
        type:String,
    required:true}
    

    

    

})


const userOrdersCollection=new mongoose.model("userOrdersCollection",userOrdersSchema)

module.exports=userOrdersCollection

