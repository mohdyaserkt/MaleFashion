const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
const URL = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASS + "@cluster0.17ktosb.mongodb.net/MALE_FASHION?retryWrites=true&w=majority"

const DB=mongoose.connect(URL).then((data) => {
    console.log("Connection Success");
})


module.exports=DB