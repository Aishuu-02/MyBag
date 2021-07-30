const mongoose = require('mongoose')
const Schema = mongoose.Schema;
 
const ItemSchema = new Schema({
    name:String,
    manufacturer:String,
    category :String,
    rating:Number,
    price:String,
    about:String,
    author : {
        type:Schema.Types.ObjectId,
        ref:'User'
    }
}) ;
module.exports = mongoose.model('Item',ItemSchema)