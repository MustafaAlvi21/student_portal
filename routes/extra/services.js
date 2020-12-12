const express = require ('express');
const router =  express.Router();
const servicesDataModule = require('../models/service'); 
const { ensureAuthenticated } = require('../config/auth')
const {verifyProfile} = require('../middlewares/verifyProfile'); 


/*  ---------------------------------------------  */
/*                  Upload Form                    */
/*  ---------------------------------------------  */

router.get('/service-form', ensureAuthenticated, verifyProfile, (req, res, next)=>{
    if (req.user){
    return res.render('serviceForm', {
        title: 'Catchmango - Service form',
        name: req.user.fullname, 
        phone: req.user.phone, 
        loginUser: req.user.fullname 
    })
 } else {
    return res.render('serviceForm', {
        title: 'Catchmango - Service form',
        loginUser: undefined 
        })
    }
});

router.post('/service-form', ensureAuthenticated, verifyProfile, async function(req,res,next){

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var currentDate = date;

    const book = new servicesDataModule({
        serviceProviderID : req.user._id,
        status : 'active',
        phone : req.user.phone,
        serviceName : req.body.serviceName,
        serviceType : req.body.serviceType,
        city : req.body.city,
        area : req.body.area,
        description : req.body.description,
        date : currentDate,
    });

    saveCover(book, req.body.cover1)

     
    try {
      const newBook = await book.save()
      req.flash('success_msg', 'Service added successfully.')
      res.render('serviceForm', { title: 'Catchmango - Service form ', success_msg:"Added successfully",  loginUser: req.user.fullname,name: req.user.fullname, phone: req.user.phone,  });        
    } catch(error) {
      console.log(error)
      req.flash('error', 'There is an error, please try again.')
      return res.redirect('/service-form')
    }

    function saveCover(book, cover1Encoded, ) {
      if (cover1Encoded == null || cover1Encoded  == '') return
      const cover1 = JSON.parse(cover1Encoded)
      console.log('yes 1')
      if (cover1 != null ) {
          console.log('yes 2')
        book.cover1Image = new Buffer.from(cover1.data, 'base64')
        book.cover1ImageType = cover1.type
      }
    }
  }) 
  

/*  ---------------------------------------------  */
/*                  All Services                   */
/*  ---------------------------------------------  */
router.get('/services', (req, res)=>{
    let loginUser = req.user
      servicesDataModule.find({status: 'active'}, (err, data)=>  {
          if (err) throw err;
          if (data){
              console.log(data)
              console.log(data.coverImagePath)
              if (loginUser == undefined){
                  res.render('services', {title : 'Catchmango - Services', data: data, loginUser: undefined})
              } else  {
                  res.render('services', {title : 'Catchmango - Services', data: data, loginUser: req.user.fullname, })
              }
          }
      })
  })
  

/*  ---------------------------------------------  */
/*               Services Details                  */
/*  ---------------------------------------------  */
router.get('/services/:id', (req, res)=>{
    let serviceId = req.params.id
    let loginUser = req.user
      servicesDataModule.find({_id : serviceId, status: 'active'}, (err, data)=>  {
          if (err) throw err;
          if (data){
              console.log(data)
              console.log(data.coverImagePath)
              if (loginUser == undefined){
                  res.render('serviceProductsDetails', {title : 'Catchmango - Services Details', data: data, loginUser: undefined})
              } else  {
                  res.render('serviceProductsDetails', {title : 'Catchmango - Services Details', data: data, loginUser: req.user.fullname, })
              }
          }
      })
  })



module.exports = router