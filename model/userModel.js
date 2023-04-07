const mongoose=require('mongoose')


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1/ecomerce", { useNewUrlParser: true });


const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
    required:true},


    username:{
        type:String,
    required:true},

    email:{
        type:String,
    required:true},

    phone:{
        type:String,
    required:true},


    password:{
        type:String,
    required:true},

    address:{
        type:String,
    },

    status:{
        type:Boolean,
        required:true
    },

    userAddress:{
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
        },
    },
    wishlist:{
        type:Array
        
    },
    defaultAddress:{
        type:String
    },
    wallet:{
        type:Number
    }


})


const userCollection=new mongoose.model("userCollection",LogInSchema)

module.exports=userCollection