const express = require ('express');
const router =  express.Router();
// const { userRoleAuth } = require('../config/userRoleCheck')
// const { loginRoleRedirect } = require('../config/loginRoleRedirect')


/*------------------------------------------ */
/*                   Home                    */
/*------------------------------------------ */
router.get('/',  (req, res)=>{
    console.log('Username => ' + req.user)
    console.log('req.session => ' + req.session[0])
    if (req.user){
        return res.render('home', {
            title: 'Home',
            loginUser: req.user 
        })
    } else {
        return res.render('home', {
            title: 'Home',
            loginUser: undefined 
        })
    }
});



// /*------------------------------------------ */
// /*                Contact Us                 */
// /*------------------------------------------ */
// router.post('/index', function (req, res) {
//     console.log(req.body)

//     const nodemailer = require("nodemailer");
//     async function main() {
//         let testAccount = await nodemailer.createTestAccount();
//         let transporter = nodemailer.createTransport({
//           host: 'smtp.gmail.com',
//           port: 465,
//           secure: true,
//           auth: {
//             user: 'qwopa08@gmail.com', // generated ethereal user
//             pass: 'xcusqmdudishelgk', //  generated ethereal password
//           },   
//         });

//         // const url = 'https://PM-Hunarmand-Portal.herokuapp.com/new-password'
//         const url = 'http://localhost:4000/new-password'
//         let info = await transporter.sendMail({
//           from: req.body.name + ' ' + req.body.email, // sender address
//           to: 'mustafaalvi21@gmail.com', // list of receivers
//           subject: "From contat us form", // Subject line
//           text: req.body.subject, // plain text body
//           html: "<h3 style='display: inline-block;'>The email is sended from: </h3> "+ `${req.body.email}` + "<br>" + req.body.subject, // html body
//         });  
//         console.log("Message sent: %s", info.messageId);
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//         }
      
//         main().catch(console.error);
  
//     if (req.user){
//         // req.flash('error_msg', 'Please log in through valid portal');
//         return res.redirect('/');
//     } else {
//         // req.flash('error_msg', 'Please log in through valid portal');
//         return res.redirect('/');
//     }
// })



module.exports = router