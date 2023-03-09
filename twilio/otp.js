require('dotenv').config();
const accountSid=process.env.AUTH_SID
const authToken=process.env.AUTH_TOKEN
const client = require('twilio')(accountSid,authToken)


const otp =(verifiedNumber,otpValue)=>{
  
        client.messages.create({
        to: "+1"+verifiedNumber,
        from: process.env.FROM_NUMBER,
        body:otpValue+`is your otp for male fashion`
    }).then((message)=>{
        console.log(message.sid);
    }).catch((err)=>{
        console.log(err);
    })
} 




module.exports=otp