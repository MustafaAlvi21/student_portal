module.exports = {
  verifyProfile: function(req, res, next) {

        const userDataModel = require ('../models/users')

        userDataModel.find({_id: req.user._id },function(err, data){
            if (err) throw err;
            if (data){
                const fullname = data[0].fullname;
                const email = data[0].email;
                const gender = data[0].gender;
                const roll_no = data[0].roll_no;
                // const phone = data[0].phone;
                // const city = data[0].city;
                // const area = data[0].area;
                // const address = data[0].address;
                if ( !fullname || !email || !gender|| !roll_no ){
                    req.flash('error', 'To access this feature you need to complete your profile');
                    return res.redirect('/my-profile')
                }
                next();
            }
        })
  }    
}
  