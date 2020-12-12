
module.exports = {
      isVerified: function(req, res, next) {

        const userDataModel = require ('../models/users')

        const email = req.body.email;
        userDataModel.findOne({email: email, verified: 'false', }).exec(function(err, data){
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
                user: 'qwopa08@gmail.com', // generated ethereal user
                pass: 'xcusqmdudishelgk', // generated ethereal password
              },   
            });
            const userId = data._id;
            // const url = 'https://PM-Hunarmand-Portal.herokuapp.com/verify'
            const url = 'http://localhost:4000/verify'
            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: '"PM-Hunarmand-Portal 👻" <foo@example.com>', // sender address
              to: req.body.email, // list of receivers
              subject: "Please confirm your Email account", // Subject line
              text: "Hello world 123?", // plain text body
              html: "<h3>Account Verification link: </h3> "+ `${url}`+"/"+`${userId}`, // html body
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
      
            main().catch(console.error);
      
            return res.render('login', { title: 'PM-Hunarmand-Portal - Login', error: 'Verify your email, we have send you verification email.', loginUser: undefined, })
          }
        next();
        })
      }
      
            }
    