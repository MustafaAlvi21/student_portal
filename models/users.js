const mongoose = require('mongoose');

var userSchema  = new mongoose.Schema(
    {
        fullname : { type: String, required: true} ,
        email : { type: String, required: true} ,
        encryptedPassword : { type: String, require: true} ,
        course : { type: String, require: true} ,
        // cnic : { type: String ,  max: 13, } l,
        role: { type: String , require: true , enum : ['user','shop', 'admin'], },
        verified: { type: String, default: 'false'},
        git : { type: String, require: false} ,
        roll_no : { type: String, require: false} ,
        gender : { type: String, require: false} ,

        coverImage: {
            type: Buffer,
            
          },
          coverImageType: {
            type: String,
            
          },

          resetPasswordExpiry:  {type: String, required: false},
      }    
  );

  userSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  });

  
  var userDataModel = mongoose.model('users', userSchema);
  module.exports =  userDataModel;