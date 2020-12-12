const mongoose = require('mongoose');

var classifiedSchema  = new mongoose.Schema(
    {
        sellerName : { type: String, required: true} ,
        status : { type: String, required: true,  enum : ['active','non-active', 'removed'], } ,
        publisherId : { type: String, required: true} ,
        productName : { type: String, required: true} ,
        price : { type: String, required: true} ,
        brand : { type: String, require: true} ,
        condition : { type: String, require: true} ,
        phone : { type: String, requiret: true} ,
        city : { type: String, require: true} ,
        area: { type: String , require: true ,} ,
        description : { type: String, require: true} ,
        date : { type: String, require: true} ,
        
        cover1Image: { type: Buffer, required: true },
        cover1ImageType: { type: String, required: true },

        cover2Image: { type: Buffer },
        cover2ImageType: { type: String },

        cover3Image: { type: Buffer },
        cover3ImageType: { type: String },

        cover4Image: { type: Buffer },
        cover4ImageType: { type: String },

      }    
  );

  classifiedSchema.virtual('cover1ImagePath').get(function() {
    if (this.cover1Image != null && this.cover1ImageType != null) {
      return `data:${this.cover1ImageType};charset=utf-8;base64,${this.cover1Image.toString('base64')}`
    }
  });

  classifiedSchema.virtual('cover2ImagePath').get(function() {
    if (this.cover2Image != null && this.cover2ImageType != null) {
      return `data:${this.cover2ImageType};charset=utf-8;base64,${this.cover2Image.toString('base64')}`
    }
  });

  classifiedSchema.virtual('cover3ImagePath').get(function() {
    if (this.cover3Image != null && this.cover3ImageType != null) {
      return `data:${this.cover3ImageType};charset=utf-8;base64,${this.cover3Image.toString('base64')}`
    }
  });

  classifiedSchema.virtual('cover4ImagePath').get(function() {
    if (this.cover4Image != null && this.cover4ImageType != null) {
      return `data:${this.cover4ImageType};charset=utf-8;base64,${this.cover4Image.toString('base64')}`
    }
  });

  
  var classifiedDataModule = mongoose.model('classified', classifiedSchema);
  module.exports =  classifiedDataModule;