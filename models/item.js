const mongoose = require('mongoose')
const Schema = mongoose.Schema;
 
const ItemSchema = new Schema({
    name:String,
    manufacturer:String,
    category :String,
    rating:Number,
    price:String,
    about:String,
    image:String

}) ;
module.exports = mongoose.model('Item',ItemSchema)