const express  = require('express')
const router  = express.Router();
const cartDataModel = require('../models/cart')
const productDataModel = require('../models/products')
const orderDataModel = require('../models/orders')
const { ensureAuthenticated } = require('../config/auth')
const {verifyProfile} = require('../middlewares/verifyProfile'); 
const {findProductDataForCart} = require('../middlewares/findProductDataForCart'); // this module is only for cart page

/* ---------------------------------- */
/*            Add to cart             */
/* ---------------------------------- */
router.post('/products/:id', ensureAuthenticated, verifyProfile, async(req, res) => {
    const productDetails = {
        productId  : req.params.id,
        quantity :  typeof req.body.quantity != 'undefined' ? req.body.quantity  : 1,
    }
    priceOfProduct = req.body.priceOfProduct;
    total = parseInt(priceOfProduct) * parseInt(productDetails.quantity)
    console.log('product details => 1 =>> ' + productDetails.productId)
    await cartDataModel.findOne( { userId: req.user._id }, async (err, data) => {
        if(err) res.send(err)
        if (data){
            console.log(' Data found in cart related to this user!!!  => 2 =>>> ' + data)
            await add_Product_In_Existing_Data_Of_Cart(data, total)
            // res.send('<h1> Data found in cart related to this user!!! </h1> <br> <p> ' + data + '</p>')            

        } else {
            console.log(' No data found in cart related to this user!!!')
                addToCart = new cartDataModel({
                    userId: req.user._id,
                    product: productDetails,
                    total: total,
                }).save()
                req.flash( 'success_msg', 'Product is added to cart.')
                res.redirect('/products/' + productDetails.productId)
                // res.send('No data found in cart related to this user!!!')
        }
    })
    
    async function add_Product_In_Existing_Data_Of_Cart(dataFromAddToCart, totalOfCart){
        
        //  Checking product is exist in cart or not which is trying to add in cart through pressing AddToCart button 
        let global_Data;
        price1 = parseInt(dataFromAddToCart.total) + parseInt(totalOfCart)
        await cartDataModel.find({ userId: req.user._id, product: {$elemMatch: { productId: productDetails.productId}} }, async (err, data) => {
            if (err) throw err;
            if(data != '' ){
                console.log('existing data found in findOne => 3 =>> ' + data[0].total)      
                // console.log('price1 ' + price1)

                //  Product is already added in cart so, increment in it's quantity.
                await cartDataModel.updateMany({ userId: req.user._id, "product.productId": productDetails.productId},{$inc:{"product.$.quantity": 1 }, $set:{ total : price1}}).exec( (err, data2) => {
                    if (err) throw err;
                    if (data2){
                        global_Data = data2
                        console.log('existing data quantity updated in update query => 4 =>> ' + data2)
                    } else {
                        global_Data = data2
                        console.log('Not existing data quantity updated in update query => ' + data2)
                    }
                    console.log('Result Of Return = 5 => ' + global_Data.n)

                    req.flash( 'success_msg', 'Product is added to cart.')
                    res.redirect('/products/' + productDetails.productId)        
                });                
            } else {
                console.log('No existing data found in  findOne => ' + productDetails)
                await cartDataModel.updateMany({"userId": req.user._id }, {"$push":{"product": productDetails},$set:{ total : price1} } ).exec( (err, data) => {
                    if (err) throw err;
                    if (data){
                        console.log('New product is push in user cart => ' + data)
                        // res.send(data)
                        req.flash( 'success_msg', 'Product is added to cart.')
                        res.redirect('/products/' + productDetails.productId)    
                    } else {
                        console.log('There is an error in pushing new product in user cart => ' + data.length)
                        req.flash( 'error_msg', 'There is an error in pushing new product in user cart')
                        res.redirect('/products/' + productDetails.productId)   
                    }
                });
            }
        })        
    }
})  //    end of router

/* ---------------------------------- */
/*                 Cart               */
/* ---------------------------------- */
router.get('/cart', ensureAuthenticated, verifyProfile, findProductDataForCart,  async(req, res) => {
    if (req.user) {
        cartDataModel.find({userId : req.user._id}, (err, data) => {              
            // console.log('findProductDataForCart => ' + res.locals.cart)
            res.render('cart', { title: 'Student Portal - Cart', data: data[0], productData: res.locals.cart, loginUser: req.user.fullname});
        })
    } else {
            // console.log( data )
            res.render('cart', { title: 'Student Portal - Cart', data: null, loginUser: undefined});
    }
})

/* ---------------------------------- */
/*        Update Cart Quantity        */        //    abhi yay kaam nahi kerra / not working 
/* ---------------------------------- */
router.post('/cart/update', ensureAuthenticated, verifyProfile, (req, res) => {
    // productId = req.params.id;
    console.log(req.body.hello)
    res.send(req.body)
    // cartDataModel.findOneAndUpdate({userId: req.user._id}, {}, function (err, data) {
    //     if (err) throw err;
    //     if (data) {
    //         req.flash('success_msg', 'product is removed')
    //         res.redirect('/cart')
    //     } else {
    //         req.flash('error', 'product is not removed due to some error.')
    //         res.redirect('/cart')
    //     }
    // })
} )


/* ---------------------------------- */
/*     Cart single product remove     */
/* ---------------------------------- */
router.get('/cart/remove/:id/:price/:quantity', ensureAuthenticated, verifyProfile, async(req, res) => {
    prod_Id =  req.params.id;
    prod_quantity =  req.params.quantity;
    prod_price =  req.params.price;
    total_Price_Of_A_Product = parseInt(prod_price) * parseInt(prod_quantity)
    updatedTotal = 0;
    // console.log(prod_Id)
    console.log(prod_quantity)
    console.log(prod_price)
    console.log(total_Price_Of_A_Product)
    await cartDataModel.find({userId: req.user._id, 'product.productId': prod_Id }, (err, data) => {
        if (err) throw err
        if (data) {
            updatedTotal = data[0].total
        }
    })
    console.log(updatedTotal)
    updatedTotal -= total_Price_Of_A_Product
    // console.log('remove product id' + prod_Id+'|' + prod_Id.length)
    await cartDataModel.updateMany({userId: req.user._id, product: {$elemMatch: { productId: prod_Id }}}, { $pull: { "product" : { "productId": prod_Id }}, $set:{ total : updatedTotal}} ).exec( (err, data) =>{
        if (err) throw err;   
        if (data) {
            console.log("cart remove one => " + data)
            req.flash('success_msg', 'product is removed')
            res.redirect('/cart')
            // res.send(data)
        } else {
            req.flash('error', 'Product is not removed due to some error.')
            res.redirect('/cart')
        }        
    });
})


/* ---------------------------------- */
/*        Remove All Products         */
/* ---------------------------------- */
router.get('/cart/remove_all', function(req, res){
   cartDataModel.remove({userId:req.user._id}, (err, data) => {
    // if (err) throw err;
    if (data) {
        req.flash('success_msg', 'Your cart is empty successfully.')
        res.redirect('/cart')
    } else {
        req.flash('error', 'Your cart is  not empty successfully due to some error.')
        res.redirect('/cart')
    }
}) 
})

/* ---------------------------------- */
/*              Checkout              */
/* ---------------------------------- */
router.get('/checkout',ensureAuthenticated, verifyProfile, findProductDataForCart,  async(req, res) => {
    if (req.user) {
        cartDataModel.find({userId : req.user._id}, (err, data) => {              
            console.log('findProductDataForCart => ' + (res.locals.cart).length)
            console.log(' <= data => ' + data.length)
            if((res.locals.cart).length > 0  ) {
                res.render('checkout', { title: 'Student Portal - Cart', data: data[0], productData: res.locals.cart, loginUser: req.user.fullname});
            } else {
                    req.flash('error', 'Your cart is empty so you cannot access this page.')
                    res.redirect('/cart')                
            }
            })
    } else {
            res.redirect('/')
            // res.render('cart', { title: 'Student Portal - Cart', data: null, loginUser: undefined});
    }
})



router.post('/checkout', ensureAuthenticated, verifyProfile, async (req, res) => { 
    if (req.user){
        let productData;
        await cartDataModel.find({userId: req.user._id}, (err, data)=>{
            if(err) throw err;
            if(data){
                productData = data
            }
        })
                                                            // console.log(productData[0].total)
        const order = await new orderDataModel({
            userId  : req.user._id,
            name    : req.body.name,
            email   : req.body.email,
            phone   : req.body.phone,
            address : req.body.address,
            city    : req.body.city,
            zip     : req.body.zip,
            product : productData[0].product,
            total   : productData[0].total,
        }).save().then( order => {
            console.log('order -- ' + order)

            res.json("Order place successfully.")
            // req.flash('success_msg', 'Order place successfully.')
            // res.redirect('/login');
          })               
          .catch(err => console.log(err) );
        
    } else {
        res.redirect('/')
    }
})


// - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = 


module.exports = router;