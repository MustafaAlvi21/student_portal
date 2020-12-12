
//  It stop user to create more than one shop

module.exports = {
    userHaveShop: function(req, res, next){
        const shopDataModel = require ('../models/shop')
        
        shopDataModel.find({shopOwnerId: req.user._id}, function(err, data) {
            if (err) throw err;
            if (data.length >= 1){
                console.log(data.length)
                return res.render('sell_with_us', { title: 'PM-Hunarmand-Portal - Sell With Us', error: 'Can not open more than one shop.', loginUser: req.user.fullname, })
            } 
            next();
       })
    }
}