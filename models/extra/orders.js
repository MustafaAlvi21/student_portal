const mongoose = require('mongoose');

var order = new mongoose.Schema(
    {
        userId  : { type: String, required: true }  ,
        name    : { type: String, required: true }  ,
        email   : { type: String, required: true }  ,
        phone   : { type: String, required: true }  ,
        address : { type: String, required: true }  ,
        city    : { type: String, required: true }  ,
        zip     : { type: String, required: true }  ,
        product : { type: Array,  required: true }  ,  
        total   : { type: String, required: false } ,
    }    
  );


var orderDataModule = mongoose.model('order', order);
module.exports =  orderDataModule;