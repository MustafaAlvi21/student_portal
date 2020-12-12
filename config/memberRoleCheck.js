module.exports = {
    //      stop patients to access page pnly members can access
        MemberRoleAuth: function(req, res, next) {
            // console.log('check  ' + req.user)
            if (req.user){
                if (req.user.role == 'patient') {
                    req.flash('error_msg', 'Please log in through valid portal');
                    return res.redirect('/');
                }
            
                if (req.user.role == 'B-Admin') {
                    req.flash('error_msg', 'Please log in through valid portal');
                    return res.redirect('/blood-admin');
                }
            }
                    return next();
          }
        }