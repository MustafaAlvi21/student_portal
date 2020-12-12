module.exports = {
//  stop members to access page after login
  m_loginPage: function(req, res, next) {
    // console.log('check  ' + req.user)
    if (req.user){
      if (req.user.role == 'member') {
          return res.redirect('/member-dashboard');
      }}
    return next();
  }
}