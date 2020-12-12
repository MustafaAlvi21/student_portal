module.exports = {
    //      stop members to access page pnly patients can access
    loginRoleRedirect: function(req, res, next) {
            // console.log('check  ' + req.user)
            if (req.user){                
                if (req.user.role == 'admin') {
                    return res.redirect('/admin/users');
                }
    
            }
                    return next();
          }
        }