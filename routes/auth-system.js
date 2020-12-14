const express = require ('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const userDataModel = require ('../models/users')
// const { isVerified } = require('../middlewares/isVerifiedAccount')
// const { ensureAuthenticated } = require('../config/auth')
const { u_loginPage } = require('../config/U_stopLogin')



/*  ---------------------------------------------  */
/*                Global login                     */
/*  ---------------------------------------------  */

router.get('/login', u_loginPage, (req, res)=>{
  if (req.user){
      return res.render('login', {
        title: 'PM-Hunarmand-Portal - Sign-in',
        loginUser: req.user
      })     
  } else {
        return res.render('login', {
          title: 'PM-Hunarmand-Portal - Sign-in',
          loginUser: undefined 
        })
    }

});


router.post('/login', u_loginPage, (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next)
  })
  
  
// /*          Email  Verification          */
// router.get('/verify/:id', u_loginPage, function(req, res){
//     let id = req.params.id;
//     userDataModel.findByIdAndUpdate( id, {verified: 'true'}, function(err, data){
//       res.render('verify', {
//           title: 'PM-Hunarmand-Portal - Verify',
//           msg: 'Account verified!!!',
//           loginUser: undefined, 
//       })
//     })
// });
  
/*  ---------------------------------------------  */
/*                 Forget password                 */
/*  ---------------------------------------------  */
router.get('/forget-password', u_loginPage, function(req, res){
    return res.render('forgetPassword', {
        title: 'PM-Hunarmand-Portal - Forget Password',
        msg: '',
        loginUser: undefined,
    })
});
  
router.post('/forget-password', u_loginPage, function(req, res){
    const email = req.body.email;
    userDataModel.findOne({email: email }).exec(function(err, data){
    if (err) throw err;
      if (data){
      const nodemailer = require("nodemailer");
      async function main() {
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'catchnoreply0@gmail.com', // generated ethereal user
          pass: 'vcxtpslqeanommar', //  generated ethereal password
        },   
      });
      const userId = data._id;
      const url = 'https://student-portal-v.herokuapp.com/new-password'
      //const url = 'http://localhost:4000/new-password'
      let info = await transporter.sendMail({
        from: '"Musto 👻" <foo@example.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Forget password link", // Subject line
        text: "Through below link you can reset your password", // plain text body
        html: "<h3>Reset password link: </h3> "+ `${url}`+"/"+`${userId}`, // html body
      });  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      let d = new Date();
      d = d.getTime();
      new_d = d + 600000
          
      userDataModel.findOneAndUpdate({email: email}, {
        resetPasswordExpiry: new_d
      }).exec((err, data) => {
        if (err) throw error; 
        if (data){
          console.log('resetPasswordExpiry')
          console.log(data)
        }
      })
      }
    
      main().catch(console.error);
      // ====================================
      
      return res.render('login', { title: 'PM-Hunarmand-Portal - Forget Password', success_msg:'Reset password link is emailed...', loginUser: undefined, })
      } else {
        return res.render('forgetPassword', { title: 'PM-Hunarmand-Portal - Forget Password', error:'Invalid email', loginUser: undefined, })          
      }
    })
  })
   
/* ------------------------------------- */
/*              New password             */
/* ------------------------------------- */
resetPassword()
function resetPassword(){
  resetPasswordUserId = ''
  router.get('/new-password/:id', u_loginPage, function(req, res){
    const id = req.params.id;
    resetPasswordUserId = id
    console.log('resetPasswordUserId: ' + resetPasswordUserId)

    let d = new Date();
    time = d.getTime();

    userDataModel.findOne({_id: id}, (err, data) => {
      if (err) throw err;
      if(data){  // data found hone pay check hoga k link expiry hogai hay ya nahi is behalf pay page render hoga
        console.log(data.resetPasswordExpiry)
        if(typeof data.resetPasswordExpiry != 'undefined' && data.resetPasswordExpiry != null && parseInt(data.resetPasswordExpiry) > time){
          console.log('access 1')
          res.render('newPassword', {title : 'PM-Hunarmand-Portal - New Password', id: id, loginUser: undefined, })
        } else {
          res.render('newPasswordLinkExpired', {title : 'PM-Hunarmand-Portal - New Password', id: id, loginUser: undefined, })
        }
      } else {
        res.render('newPasswordLinkExpired', {title : 'PM-Hunarmand-Portal - New Password', id: id, loginUser: undefined, })
      }
    })

  })
     
  router.post('/new-password', u_loginPage, function(req, res){
    console.log('yse')
    let id = resetPasswordUserId
    let enteredPassword = req.body.password;
    console.log('id = > ' + id)
    console.log('enteredPassword = > ' + enteredPassword)

    //            H a s h   P a s s w o r d 
   bcrypt.genSalt(10, (err, salt) => 
   bcrypt.hash(enteredPassword, salt, (err, hash) => {
//            S e t   p a s s w o r d   t o   h a s h e d               
//  user.encryptedPassword = hash; 

userDataModel.findOne({_id: id}, {_id: 1}, (err, data) => {
  if (err) throw err;
  if (data){

    userDataModel.findOneAndUpdate({_id: id}, {
      encryptedPassword: hash,
      resetPasswordExpiry: '0.00000001'
    }).exec((err, data) => {
       return res.render('login', {
        title: 'PM-Hunarmand-Portal - New Password',
      msg: 'Password updated successfully!!!',
      loginUser: undefined,
      success_msg: "Password updated"
      })
    })
     
    } else {
      req.flash('error', 'Password not reset due to invalid or expire link.')
      return res.redirect(`/new-password/${id}`) 
  }
}).limit(1)
  }) )
});

}


/*  ---------------------------------------------  */
/*                User Register                    */
/*  ---------------------------------------------  */

router.get('/register', u_loginPage, (req, res)=>{
    return res.render('register', {
        title: 'PM-Hunarmand-Portal - Sign Up',
        msg:'',
        loginUser:undefined,
    })
});

router.post('/register', u_loginPage, (req, res)=>{
    const fullname = req.body.name;
    const email = req.body.email;
    const course = req.body.course;
    const password= req.body.password;
    const re_password= req.body.re_password;
    console.log(fullname)
    console.log(email)
    console.log(course)
    console.log(password)
    console.log(re_password)
    let errors = [];

    if ( !fullname || !email || !course || !password ){
        errors.push({ msg: 'Please fill in all fields'});
      }
      
      if ( password.length < 6 ){
        errors.push({ msg: 'Password should be atleast 6 characters'});
      }

      if ( password !== re_password){
        errors.push({ msg: 'Password must be match with Confirm Password'});
      }

      if(errors.length > 0) {
        res.render('register', { title : 'PM-Hunarmand-Portal - Sign Up', errors, fullname, email, password,loginUser:undefined,  } )
      } else {
        userDataModel.findOne({email : req.body.email}).then( data => {
            if (data) {
              //   U s e r   o r   E m a i l   i s   e x i s t 
            errors.push({ msg : 'Email is already registered'});
            res.render('register', { title : 'PM-Hunarmand-Portal - Register', errors, fullname, email, password, loginUser:undefined,} )   
            } else {
                const user = new userDataModel({
                    fullname : req.body.name ,
                    email : req.body.email ,
                    encryptedPassword : req.body.password ,
                    course: course ,
                    role : 'user' , 
                });

                //            H a s h   P a s s w o r d               
                bcrypt.genSalt(10, (err, salt) =>  
                  bcrypt.hash(user.encryptedPassword, salt, (err, hash) => {
                                      if (err) throw err;
                  //            S e t   p a s s w o r d   t o   h a s h e d               
                  user.encryptedPassword = hash;
                  //            S a v e   u s e r   o r   c r e a t e   u s e r  
                  user.save().then( user => {
                      // console.log('user -- ' + user)
                      req.flash('success_msg', 'Sign Up successfully.')
                      res.redirect('/login');
                    })               
                    .catch(err => console.log(err) );
                  }) 
                )
            }
        })
    }
})    //  End of post router

    
/*  ---------------------------------------------  */
/*                     Logout                      */
/*  ---------------------------------------------  */

    router.get('/logout', function(req, res){
      req.logout();
      req.flash('success_msg', 'You are Sign out');
      res.redirect('/login')
    })

    
    

module.exports = router
