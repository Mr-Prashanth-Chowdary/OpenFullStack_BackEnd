const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(()=>{
    console.log("connected to db")
    }).catch((err)=>{
    console.log("error while connecting to db",err)
    })

const Contact = new mongoose.Schema({
    name:String,
    number:String,
})
Contact.set('toJSON',{
    transform : (doc, returnObj)=>{
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
    }
})
module.exports = new mongoose.model('PhoneBook',Contact);

