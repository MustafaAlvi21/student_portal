const mongoose = require('mongoose');

var userSchema  = new mongoose.Schema(
    {
        fullname : { type: String, required: true} ,
        email : { type: String, required: true} ,
        encryptedPassword : { type: String, require: true} ,
        course : { type: String, require: true} ,
        // cnic : { type: String ,  max: 13, } l,
        role: { type: String , require: true , enum : ['user', 'admin'], },
        verified: { type: String, default: 'false'},
        roll_no : { type: String, require: false} ,
        gender : { type: String, require: false} ,

        banner1: { type: Buffer, required: false },
        banner1Type: { required: false },

        resetPasswordExpiry:  {type: String, required: false},
    }    
  );


  userSchema.virtual('banner1Path').get(function() {
    if (this.banner1 != null && this.banner1Type != null) {
      return `data:${this.banner1Type};charset=utf-8;base64,${this.banner1.toString('base64')}`
    }
  });

  
  var userDataModel = mongoose.model('users', userSchema);
  module.exports =  userDataModel;