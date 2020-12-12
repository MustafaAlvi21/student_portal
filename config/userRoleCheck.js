module.exports = {
//      stop members to access page pnly patients can access
    userRoleAuth: function(req, res, next) {
        // console.log('check  ' + req.user)
        if (req.user){
            if (req.user.role == 'shop') {
                req.flash('error_msg', 'Please log in through valid portal');
                return res.redirect('/shop-dashboard');
            }
            
            if (req.user.role == 'admin') {
                req.flash('error_msg', 'Please log in through valid portal');
                return res.redirect('/admin');
            }

        }
                return next();
      }
    }