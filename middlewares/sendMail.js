const userDataModel = require('../models/users')
const shopDataModel = require('../models/shop')

exports.sendMail = async function (dataOfOrder) {
    // const email = req.body.email != undefined ? res.body.email : 'mustafaalvi21@gmail.com';
    
    shop = await shopDataModel.findById({_id : dataOfOrder[0].shopId}, (err, data)  => {
        console.log(data.shopname)
        // console.log(data[0].shopname)
    })

    // const email = 'mustafaalvi21@gmail.com';
    await userDataModel.findOne({_id: shop.shopOwnerId }).exec(function(err, data){
    if (err) throw err;
      if (data){
          console.log(data.email)


      const nodemailer = require("nodemailer");
      async function main() {
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'qwopa08@gmail.com', // generated ethereal user
          pass: 'xcusqmdudishelgk', //  generated ethereal password
        },   
      });
      const userId = dataOfOrder[0]._id;

      // const url = 'https://PM-Hunarmand-Portal.herokuapp.com/new-password'
      const url = dataOfOrder[0].productName

      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: data.email, // list of receivers
        subject: "Order mail", // Subject line
        text: "You have an order by our customer --==--  meail from order module", // plain text body
        html: "<h3>Your order is --==--  meail from order module: </h3> "+ `${url}`+"/"+`${userId}`, // html body
      });  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    
      main().catch(console.error);
      // ====================================
      
      return 'Order is mailed';
    //   return res.render('login', { title: 'PM-Hunarmand-Portal - Forget Password', success_msg:'Reset password link is emailed...', loginUser: undefined, })
    } else {
        return 'There is an error in mailing order';
        // return res.render('forget_password', { title: 'PM-Hunarmand-Portal - Forget Password', error:'Invalid email', loginUser: undefined, })          
      }
    })

    
  };