const express = require ('express')
const router = express.Router()
const shopDataModel = require('../models/shop')
const productDataModel = require('../models/products')
const { ensureAuthenticated } = require('../config/auth')
const { userHaveShop } = require('../middlewares/userHaveShop')

/* ------------------------------------------ */
/*                 Shop Form                  */
/* ------------------------------------------ */

router.get('/shop-form', ensureAuthenticated, userHaveShop, (req, res, next)=>{
  if(req.user) {
    res.render('shopForm', { title: 'Catchmango - Shop registration form', loginUser: req.user.fullname} )
  } else {
    res.render('shopForm', { title: 'Catchmango - Shop registration form', loginUser: undefined} )
  }
})

router.post('/shop-form', ensureAuthenticated, userHaveShop, async (req, res)=>{
    let errors= [];

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const currentDate = date;

    const shopOwnerId = req.user._id
    const shopOwneremail = req.user.email
    const shopStatus = 'non-active'
    const shopname = req.body.shopname
    const category = req.body.category
    const phone = req.body.phone
    const nic = req.body.nic
    const shopbased = req.body.shopbased
    const city = req.body.city
    const area = req.body.area
    const address = req.body.address

    if(!shopname || !category || !phone || !nic || !shopbased || !city || !area ){
        errors.push({ msg: 'Please fill in all fields'});
    }

    // if (req.body.shopbased == 'shop' ){
    //     errors.push( { msg: 'Please enter address of your business location' } )
    // }
    if (phone.length != 13){
        errors.push( { msg: 'Phone number must be 13 digits' } )
    }

    if (nic.length != 13){
        errors.push( { msg: 'Invalid NIC number' } )
    }

    if (!req.body.cover1){
        errors.push( { msg: 'Upload your own pic' } )
    }
    
    if (!req.body.cover2){
        errors.push( { msg: 'Upload nic front pic' } )
    }
    
    if (!req.body.cover1){
        errors.push( { msg: 'Upload nic back pic' } )
    }
    
    if(errors.length > 0){
      return res.render('shopForm', { title: 'Catchmango - Shop registration form', errors, shopname, category, phone, nic, shopbased, city, area, address, loginUser: undefined})
    }


    const book = new shopDataModel({
        shopOwnerId : shopOwnerId ,
        shopStatus : shopStatus ,
        shopname : shopname ,
        category : category ,
        phone : phone ,
        nic : nic ,
        shopbased : shopbased ,
        city : city ,
        area : area ,
        address : address ,
        date : currentDate,
      });  

      saveCover(book, req.body.cover1, req.body.cover2, req.body.cover3)


      try {
        const newBook = await book.save()
        res.render('sell_with_us', { title: 'Catchmango - Sell With Us', success_msg:"Your request is send to Admin, please wait for the response.",  loginUser: req.user.fullname, });        
      } catch(error) {
        console.log(error)
        req.flash('error', 'There is an error, please try again.')
        return res.redirect('/shop-form')
      }

      function saveCover(book, cover1Encoded, cover2Encoded, cover3Encoded, cover4Encoded) {
        if (cover1Encoded == null || cover1Encoded  == '') return
        const cover1 = JSON.parse(cover1Encoded)
        console.log('yes 1')
        if (cover1 != null ) {
            console.log('yes 2')
          book.profilePic = new Buffer.from(cover1.data, 'base64')
          book.profilePicType = cover1.type
        }

        if (cover2Encoded == null  || cover2Encoded  == '') return
        const cover2 = JSON.parse(cover2Encoded)
        console.log('yes 11')
        if (cover2 != null ) {
            console.log('yes 22')
          book.nicFront = new Buffer.from(cover2.data, 'base64')
          book.nicFrontType = cover2.type
        }

        if (cover3Encoded == null || cover3Encoded  == '') return
        const cover3 = JSON.parse(cover3Encoded)
        console.log('yes 111')
        if (cover3 != null ) {
            console.log('yes 222')
          book.nicBack = new Buffer.from(cover3.data, 'base64')
          book.nicBackType = cover3.type
        }
      }
})


/* ------------------------------------------ */
/*                  All Shop                  */
/* ------------------------------------------ */

router.get('/shops', (req, res)=> {
  shopDataModel.find({shopStatus: 'active'}, (err, data)=>{
    console.log(data)
    if(req.user){
      return res.render('shops', { title: 'Catchmango - Stores', data: data, loginUser: req.user.fullname})
    } else {
      return res.render('shops', { title: 'Catchmango - Stores', data: data, loginUser: undefined})
    }
  })
})

/* ------------------------------------------ */
/*                Shop Details                */
/* ------------------------------------------ */

router.get('/shops/:id', async (req, res)=> {
  const shopId = req.params.id;
  console.log("id=> " + shopId)

  let products = productDataModel.find({shopId: shopId});
  products = await products.exec();

  console.log('products => ' + products)

  shopDataModel.find({_id: shopId}, (err, data)=>{
    console.log(data)
    if(data){
      if(req.user){
        return res.render('shop', { title: "Catchmango - Shop", data: data, products: products, loginUser: req.user.fullname })
      }  else {
        return res.render('shop', { title: "Catchmango - Shop", data: data, products: products, loginUser: undefined })
      }
    } else {
      if(req.user){
        return res.render('shop', { title: "Catchmango - Shop", data: data, products: products, loginUser: req.user.fullname })
      }  else {
        return res.render('shop', { title: "Catchmango - Shop", data: data, products: products, loginUser: undefined })
      }
    }
  })
})
module.exports = router