const mongoose = require('mongoose');

var adminSchema  = new mongoose.Schema(
    {
        name : { type: String, required: true} ,
        email : { type: String, required: true} ,
        password : { type: String, required: true} ,
        role: { type: String , require: true , enum : ['user','shop', 'admin'], },
        date : { type: String, required: true} ,
    
      }    
  );
  
  var adminDataModule = mongoose.model('admin', adminSchema);
  module.exports =  adminDataModule;