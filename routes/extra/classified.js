const express = require ('express');
const router =  express.Router();
const classifiedDataModule = require('../models/classified'); 
const { ensureAuthenticated } = require('../config/auth')
// const { userRoleAuth } = require('../config/userRoleCheck')
const {verifyProfile} = require('../middlewares/verifyProfile'); 


/*  ---------------------------------------------  */
/*                  Upload Form                    */
/*  ---------------------------------------------  */

router.get('/classified-form', ensureAuthenticated, verifyProfile,  (req, res, next)=>{
    if (req.user){
      return res.render('classifiedForm', {
        title: 'Catchmango - Classified form',
        loginUser: req.user.fullname
      })
    } else {
      return res.render('classifiedForm', {
        title: 'Catchmango - Classified',
        loginUser: undefined
      })  
    }
})


router.post('/classified-form', ensureAuthenticated, verifyProfile, async function(req,res,next){


      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var currentDate = date;

      const book = new classifiedDataModule({
        publisherId : req.user._id ,          
        status : 'active' ,          
        sellerName : req.user.fullname ,          
        productName : req.body.productName ,          
        price : req.body.price ,
        brand :  req.body.brand ,        
        condition :  req.body.condition ,         
        phone : req.body.cell ,
        city :  req.body.city ,          
        area : req.body.area ,        
        description : req.body.description ,
        date: currentDate
      });  

      saveCover(book, req.body.cover1, req.body.cover2, req.body.cover3, req.body.cover4)

      try {
        const newBook = await book.save()
        req.flash('success_msg', 'Classified added successfully.')
        res.render('classifiedForm', { title: 'Catchmango - Classified form ', success_msg:"Added successfully",  loginUser: req.user.fullname, });        
      } catch(error) {
        console.log(error)
        req.flash('error', 'There is an error, please try again.')
        return res.redirect('/classified-form')
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
    

/*  ---------------------------------------------  */
/*                 All Classified                  */
/*  ---------------------------------------------  */

router.get('/classified-product', (req, res)=>{
  let loginUser = req.user
    classifiedDataModule.find({status: 'active'}, (err, data)=>  {
        if (err) throw err;
        if (data){
            // console.log(data)
            // console.log(data.coverImagePath)
            if (loginUser == undefined){
                res.render('classifiedProduct', {title : 'Catchmango - Classified Products', data: data, loginUser: undefined})
            } else  {
                res.render('classifiedProduct', {title : 'Catchmango - Classified Products', data: data, loginUser: req.user.fullname, })
            }
        }
    })
})

/*  ---------------------------------------------  */
/*               Classified Filter                 */
/*  ---------------------------------------------  */

router.post('/classified-product', (req, res)=>{
  let loginUser = req.user
//     classifiedDataModule.find({}, (err, data)=>  {
//         if (err) throw err;
//         if (data){
//             console.log(data)
//             console.log(data.coverImagePath)
//             if (loginUser == undefined){
//                 res.render('classifiedProduct', {title : 'Catchmango - Classified Products', data: data, loginUser: undefined})
//             } else  {
//                 res.render('classifiedProduct', {title : 'Catchmango - Classified Products', data: data, loginUser: req.user.fullname, })
//             }
//         }
//     })
// })

let filter = {}
    let form_type = req.body.type ;
    let form_city = 'Karachi' ;
    let form_area = req.body.area ;
    let form_from = req.body.from ;
    let form_to = req.body.to ;
    let form_productName  ;
    
    console.log('form_city = > ' + form_city)
    console.log('form_area = > ' + form_area)
    
    
    
    
    
    // if (type == 'newProduct'){
    //     filter.newProduct = type
    // }
    
    // if (type == 'usedProduct'){
    //     filter.usedProduct = type
    // }
    
    if (form_city != undefined){
        filter.city = form_city
    }
    
    // if (area != undefined){
    //     filter.area = area
    // }
    
    // if (from != undefined){
    //     filter.from = from
    // }
    
    // if (to != undefined){
    //     filter.to = to
    // }
    
    // if (productName != undefined){
    //     filter.productName = productName
    // }
    // filter = JSON.parse(filter)
    console.log(( ' filter') )
    console.log((  filter) )
  var a = classifiedDataModule.find({filter : { $type: 2 }},(function (err, data)
  {
      if (err) throw err;
      if (data){
          console.log(data)
          // console.log(data.coverImagePath)
          if (loginUser == undefined){
              res.render('classifiedProduct', {title : 'Catchmango - Classified Products', data: data, loginUser: undefined})
          } else  {
              res.render('classifiedProduct', {title : 'Catchmango - Classified Products', data: data, loginUser: req.user.fullname, })
          }
      }  
      // res.json(data)     
    }))
    console.log( 'a = > ' + a )        
    })

/*  ---------------------------------------------  */
/*                Classified Detail                */
/*  ---------------------------------------------  */
router.get('/classified-product/:id', (req, res)=>{
  let loginUser = req.user;
  let productId = req.params.id;
    classifiedDataModule.find({_id: productId}, (err, data)=>  {
        if (err) throw err;
        if (data){
            console.log(data)
            // console.log(data.coverImagePath)
            if (loginUser == undefined){
                res.render('classifiedProductsDetails', {title : 'Catchmango - Classified Product Detail', data: data, loginUser: undefined})
            } else  {
                res.render('classifiedProductsDetails', {title : 'Catchmango - Classified Product Detail', data: data, loginUser: req.user.fullname, })
            }
        }
    })
})


module.exports = router