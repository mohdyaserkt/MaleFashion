const nodemailer = require('nodemailer')
require('dotenv').config();



const nodeMailerOtp=(otpCode,otpEmail)=>{


    // const otpEmail = registerDetails.email
                let mailTransporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user:process.env.NODEMAILER_EMAIL,
                        pass:process.env.NODEMAILER_PASS 
                    }
                })
                let docs = {
                    from:process.env.NODEMAILER_EMAIL,
                    to: otpEmail,
                    subject: "MALE_FASHION Verification Code",
                    text: otpCode + " MALE_FASHION Verfication Code,Do not share with others"
                }
                mailTransporter.sendMail(docs, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
}



module.exports=nodeMailerOtp