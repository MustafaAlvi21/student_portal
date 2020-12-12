// const mongoose = require('mongoose');

// var cart = new mongoose.Schema(
//     {
//         userId : { type: String, required: true } ,
//         productId : { type: String , require: true } ,  
//         productName : { type: String, required: true} ,
//         price : { type: String, required: true} ,
//         brand : { type: String, require: true} ,
//         category : { type: String, requiret: true} ,
//         quantity : { type: String , require: true } ,    

//         cover1Image: { type: Buffer,  },
//         cover1ImageType: { type: String,  },  
//     }    
//   );
//   for(i=0; i<1; i++){
//     cart.virtual('cover1ImagePath').get(function() {
//       if (this.cover1Image != null && this.cover1ImageType != null) {
//         return `data:${this.cover1ImageType};charset=utf-8;base64,${this.cover1Image.toString('base64')}`
//       }
//     }); 
//   }


// var cartDataModule = mongoose.model('cart', cart);
// module.exports =  cartDataModule;


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const mongoose = require('mongoose');

var cart = new mongoose.Schema(
    {
        userId : { type: String, required: true } ,
        product : { type: Array , required: true } ,  
        total: { type: Number, required: false },
    }    
  );


var cartDataModule = mongoose.model('cart', cart);
module.exports =  cartDataModule;