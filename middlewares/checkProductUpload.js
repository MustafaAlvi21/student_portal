// It checks before upload product that the shop is activated by admin or not

module.exports= {
    checkProductUpload: function(req, res, next){
        const shopDataModel = require('../models/shop')

        
        shopDataModel.find({shopOwnerId: req.user._id, shopStatus: 'non-active'}, function(err, data ){
            console.log('before data checkProductUpload => ' + data)
           
            if(err) throw err;
            if( data.length < 0 ){
                console.log('data checkProductUpload => ' + data)
                console.log('data working = > ' +typeof data + data.length)
                return res.render('shopDashboard', { title: 'Student Portal - Shop Dashboard', error: 'Can not add products because your shop is not activated by Admin.', data:'', loginUser: req.user.fullname})
            }
        next();
        })
    }
}

