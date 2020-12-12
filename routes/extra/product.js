const express = require('express');
const router = express.Router();
const productDataModel = require('../models/products');
const shopDataModel = require('../models/shop');
const { ensureAuthenticated } = require('../config/auth')
const { verifyProfile } = require('../middlewares/verifyProfile'); 
const { checkProductUpload } = require('../middlewares/checkProductUpload'); 



/*   ------------------------------------   */
/*              Product Form                */
/*   ------------------------------------   */

router.get('/product-form', ensureAuthenticated, verifyProfile, checkProductUpload, async(req, res)=> {
  
  if(req.user){
    return res.render('productForm', { title: 'Catchmango - Product Form', loginUser: req.user.fullname})
  }
})

router.post('/product-form', ensureAuthenticated, verifyProfile, checkProductUpload, async(req, res)=> {

let result = shopDataModel.find({shopOwnerId: req.user._id})
result1 = await result.exec()
console.log('result1 => ' + result1[0]._id)   
    

var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var currentDate = date;

    const book = new productDataModel({
    shopId : result1[0]._id,
    status : "active",
    productName : req.body.productName,
    price : req.body.price,
    brand : req.body.brand,
    category : req.body.category,
    description : req.body.description,
    date : currentDate,
  })

  saveCover(book, req.body.cover1, req.body.cover2, req.body.cover3, req.body.cover4)
  
    try {
      const newBook = await book.save()
      res.render('productForm', { title: 'Catchmango - Product Form ', success_msg:"Added successfully",  loginUser: req.user.fullname, });        
    } catch(error) {
      console.log(error)
      req.flash('error', 'There is an error, please try again.')
      return res.redirect('/product-form')
    }

    function saveCover(book, cover1Encoded, cover2Encoded, cover3Encoded, cover4Encoded) {
      if (cover1Encoded == null || cover1Encoded  == '') return
      const cover1 = JSON.parse(cover1Encoded)
      console.log('yes 1')
      if (cover1 != null ) {
        console.log('yes 2')
        book.cover1Image = new Buffer.from(cover1.data, 'base64')
        book.cover1ImageType = cover1.type
      }
      
      if (cover2Encoded == null  || cover2Encoded  == '') return
      const cover2 = JSON.parse(cover2Encoded)
      console.log('yes 11')
      if (cover2 != null ) {
        console.log('yes 22')
        book.cover2Image = new Buffer.from(cover2.data, 'base64')
        book.cover2ImageType = cover2.type
      }

      if (cover3Encoded == null || cover3Encoded  == '') return
      const cover3 = JSON.parse(cover3Encoded)
      console.log('yes 111')
      if (cover3 != null ) {
        console.log('yes 222')
        book.cover3Image = new Buffer.from(cover3.data, 'base64')
        book.cover3ImageType = cover3.type
      }

      if (cover4Encoded == null ||  cover4Encoded  == '') return
      const cover4 = JSON.parse(cover4Encoded)
      console.log('yes 1111')
      if (cover4 != null ) {
        console.log('yes 2222')
        book.cover4Image = new Buffer.from(cover4.data, 'base64')
        book.cover4ImageType = cover4.type
      }
    }
  }) 
  
  
  /*   ------------------------------------   */
  /*                Product                   */
  /*   ------------------------------------   */
  router.get('/products', (req, res) => {
    productDataModel.find({}, (err, data) => {
        if(err) throw err;
        if(data){
            return res.render('products', { title: 'Catchmango - Products', data: data, loginUser: req.user != undefined ? req.user.fullname : undefined ,})
        }
    })
  })
  
  /*   ------------------------------------   */
  /*             Product Details              */
  /*   ------------------------------------   */
  router.get('/products/:id', (req, res) => {
    productDataModel.find({_id: req.params.id}, (err, data) => {
      if(err) throw err;
      if(data){
          shopDataModel.findById( data[0].shopId, (err, data1) => {
            if(err) throw err;
            if (data1){
              // console.log('heoo')
              // console.log( 'console1 => ' + data1)
              return res.render('productsDetails', { title: 'Catchmango - Products', data: data, data1 : data1, loginUser: req.user != undefined ? req.user.fullname : undefined ,})
            } else {
              return res.render('productsDetails', { title: 'Catchmango - Products', data: data, data1 : undefined, loginUser: req.user != undefined ? req.user.fullname : undefined ,})
            }          
          })

        } else {
            return res.render('productsDetails', { title: 'Catchmango - Products', data: data, loginUser: req.user != undefined ? req.user.fullname : undefined ,})
        }
    })
  })
  
  

  module.exports = router;