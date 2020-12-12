const mongoose = require('mongoose');

var shopSchema  = new mongoose.Schema(
    {
        shopOwnerId : { type: String, required: true, } ,
        shopStatus: { type : String, required : true, enum : ['active','non-active', 'closed'], } ,
        shopname : { type: String, required: true} ,
        category : { type: String, required: true} ,
        phone : { type: String, required: true} ,
        nic : { type: String, required: true} ,
        shopbased : { type: String, require: true, enum : ['home','shop'], },
        city : { type: String, require: false} ,
        area : { type: String, require: false} ,
        address : { type: String, requiret: true} ,
        date : { type: String, required: true },

        profilePic: { type: Buffer, required: true },
        profilePicType: { type: String, required: true },

        nicFront: { type: Buffer, required: true },
        nicFrontType: { type: String, required: true },

        nicBack: { type: Buffer, required: true },
        nicBackType: { type: String, required: true },

        slider1: { type: Buffer, required: false },
        slider1Type: { required: false },

        slider2: { type: Buffer, required: false },
        slider2Type: { required: false },

        slider3: { type: Buffer, required: false },
        slider3Type: { required: false },

        banner1: { type: Buffer, required: false },
        banner1Type: { required: false },

        banner2: { type: Buffer, required: false },
        banner2Type: { required: false },
      }    
  );

  shopSchema.virtual('profilePicPath').get(function() {
    if (this.profilePic != null && this.profilePicType != null) {
      return `data:${this.profilePicType};charset=utf-8;base64,${this.profilePic.toString('base64')}`
    }
  });

  shopSchema.virtual('nicFrontPath').get(function() {
    if (this.nicFront != null && this.nicFrontType != null) {
      return `data:${this.nicFrontType};charset=utf-8;base64,${this.nicFront.toString('base64')}`
    }
  });

  shopSchema.virtual('nicBackPath').get(function() {
    if (this.nicBack != null && this.nicBackType != null) {
      return `data:${this.nicBackType};charset=utf-8;base64,${this.nicBack.toString('base64')}`
    }
  });
  
  shopSchema.virtual('slider1Path').get(function() {
    if (this.slider1 != null && this.slider1Type != null) {
      return `data:${this.slider1Type};charset=utf-8;base64,${this.slider1.toString('base64')}`
    }
    });
  
  shopSchema.virtual('slider2Path').get(function() {
    if (this.slider2 != null && this.slider2Type != null) {
      return `data:${this.slider2Type};charset=utf-8;base64,${this.slider2.toString('base64')}`
    }
    });
  
  shopSchema.virtual('slider3Path').get(function() {
    if (this.slider3 != null && this.slider3Type != null) {
      return `data:${this.slider3Type};charset=utf-8;base64,${this.slider3.toString('base64')}`
    }
    });
  
  shopSchema.virtual('banner1Path').get(function() {
    if (this.banner1 != null && this.banner1Type != null) {
      return `data:${this.banner1Type};charset=utf-8;base64,${this.banner1.toString('base64')}`
    }
  });
  
  shopSchema.virtual('banner2Path').get(function() {
    if (this.banner2 != null && this.banner2Type != null) {
      return `data:${this.banner2Type};charset=utf-8;base64,${this.banner2.toString('base64')}`
    }
  });
  
  var classifiedDataModule = mongoose.model('shop', shopSchema);
  module.exports =  classifiedDataModule;