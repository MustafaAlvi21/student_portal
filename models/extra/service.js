const mongoose = require('mongoose');

var serviceSchema  = new mongoose.Schema(
    {
        serviceProviderID : { type: String, required: true} ,
        serviceProviderName : { type: String, required: false} ,
        status : { type: String, required: true, enum : ['active','non-active', 'removed'], } ,
        phone : { type: String, requiret: true} ,
        serviceName : { type: String, required: true} ,
        serviceType : { type: String, required: true} ,
        city : { type: String, require: true} ,
        area: { type: String , require: true ,} ,
        description : { type: String, require: true} ,
        date : { type: String, require: true} ,
        
        cover1Image: { type: Buffer, required: true },
        cover1ImageType: { type: String, required: true },

      }    
  );

  serviceSchema.virtual('cover1ImagePath').get(function() {
    if (this.cover1Image != null && this.cover1ImageType != null) {
      return `data:${this.cover1ImageType};charset=utf-8;base64,${this.cover1Image.toString('base64')}`
    }
  });
  
  var serviceDataModule = mongoose.model('services', serviceSchema);
  module.exports =  serviceDataModule;