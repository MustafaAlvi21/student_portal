const express = require('express')
const router  = express.Router()
const shopDataModel = require('../models/shop');
const productDataModel = require('../models/products');
const classifiedDataModel = require('../models/classified');
var math = require("../middlewares/sendMail");


// const math = require('../middlewares/sendMail')
// console.log('sendMail =>> ' + math.sendMail(2, 5) )


// router.post('/search', async (req, res) => {
//     let productData;

//     console.log('\n')
//     console.log('<<  S E A R C H  >> ')
//     console.log('search = ' + req.body.search)
//     await productDataModel.find({
//         $or:[
//             {"productName" :  { $regex: req.body.search, $options: "i" }},
//             {"price" :  { $regex: req.body.search, $options: "i" }},
//             {"brand" :  { $regex: req.body.search, $options: "i" }},
//             {"category" :  { $regex: req.body.search, $options: "i" }},
//         ]}, (err, data) => {
//             if (err) throw err;
//             if(data){
//                 console.log('\n')
//                 console.log('<<  P r o d u c t  >> ')
//                 console.log('data => ' + data.length)
//             }
//         })

//         await classifiedDataModel.find({
//             $or:[
//                 {"sellerName" :  { $regex: req.body.search, $options: "i" }},
//                 {"productName" :  { $regex: req.body.search, $options: "i" }},
//                 {"price" :  { $regex: req.body.search, $options: "i" }},
//                 {"brand" :  { $regex: req.body.search, $options: "i" }},
//                 {"condition" :  { $regex: req.body.search, $options: "i" }},
//                 {"phone" :  { $regex: req.body.search, $options: "i" }},
//                 {"city" :  { $regex: req.body.search, $options: "i" }},
//                 {"area" :  { $regex: req.body.search, $options: "i" }},
//         ]}, (err, data) => {
//             if (err) throw err;
//             if(data){
//                 console.log('\n')
//                 console.log('<<  C L A S S I F I E D  >> ')
//                 console.log('data => ' + data.length)
//             }
//         })

//         await shopDataModel.find({
//             $or:[
//                 {"shopname" :  { $regex: req.body.search, $options: "i" }},
//                 // {"category" :  { $regex: req.body.search, $options: "i" }},         // unable to search
//                 {"phone" :  { $regex: req.body.search, $options: "i" }},
//                 {"shopbased" :  { $regex: req.body.search, $options: "i" }},
//                 {"city" :  { $regex: req.body.search, $options: "i" }},
//                 {"area" :  { $regex: req.body.search, $options: "i" }},
//                 // {"" :  { $regex: req.body.search, $options: "i" }},
//                 // {"" :  { $regex: req.body.search, $options: "i" }},
//                 // {"" :  { $regex: req.body.search, $options: "i" }},
//         ]}, (err, data) => {
//             if (err) throw err;
//             if(data){
//                 console.log('\n')
//                 console.log('<<  S T O R E  >>')
//                 console.log('data => ' + data.length)
//             }
//         })

//     })

// -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
// -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
// -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

    const orderDataModel = require('../models/orders');

    router.get('/search/try', async (req, res) => {
        USER_ID = "5f6e271e29471e04bc9cf541";

        await orderDataModel.find( { userId: USER_ID }, { product: 1, _id: 0 } , async (err, data)=>{
            if (err) throw err;
            if (data){
                console.log('found')
                // console.log(data[0])
                // console.log(data[0].product[0].productId)
                await extracting_products(data[0])
            } else {
                console.log('Not found')
                console.log(data)

            }
        } )
    })


    async function extracting_products(data_to_be_extract){
        console.log('\n -=-=-= function extracting_products(data_to_be_extract) =-=-=-')

        array_of_extracted_products = [];

        for await (element of data_to_be_extract.product) {
            console.log('element => ' + element.productId)
            let data = await productDataModel.find({_id: element.productId}, (err, data)=> {
                if(err) throw err
                // if (data)  console.log(data[0])  
            })
            array_of_extracted_products.push(data[0])

        }   // for of ends here
        
        console.log('\n << array_of_extracted_products >> \n')
        // console.log(array_of_extracted_products)
        console.log(array_of_extracted_products.length)
        console.log(array_of_extracted_products[0].shopId)
        
        Shop_arrayOfProducts = []  // yay yahan is liay banaya hay takay (flow_of_functions main jb "filter_from_array_of_extracted_products") call hoga to us main 2 parameter honge is laiy yahan bhi banaya or parameter main pass kerna perha hay 
        filter_from_array_of_extracted_products(array_of_extracted_products, Shop_arrayOfProducts) // function calling
    }  //  function extracting_products ends here
    
    
    async function filter_from_array_of_extracted_products(array_of_extracted_products, Shop_arrayOfProducts){
        console.log('\n -=-=-= function filter_from_array_of_extracted_products(array_of_extracted_products, Shop_arrayOfProducts) =-=-=-')

        // Shop_arrayOfProducts = []
        result = await array_of_extracted_products.filter(product => product.shopId === array_of_extracted_products[0].shopId);
        // console.log('result =>> ' + result)
        console.log('result length  =>> ' + result.length)
        console.log('\n <<result ends here >> \n')
        console.log(array_of_extracted_products.length)
        console.log('(Shop_arrayOfProducts.length => ' + Shop_arrayOfProducts.length)
        Shop_arrayOfProducts.push(result)
        // console.log('\n Shop_arrayOfProducts =>> ' + Shop_arrayOfProducts[0][1].shopId)

        
        removing_filtered_products(Shop_arrayOfProducts, array_of_extracted_products) // function calling
    }  //       function filter_from_array_of_extracted_products ends here
    
    async function removing_filtered_products(Shop_arrayOfProducts, array_of_extracted_products){
        console.log('\n -=-=-= function removing_filtered_products(Shop_arrayOfProducts, array_of_extracted_products) =-=-=-')

        console.log('asdasdasdas = = = = ' + Shop_arrayOfProducts.length)



        for await (element of Shop_arrayOfProducts[Shop_arrayOfProducts.length - 1]){
            pos = array_of_extracted_products.map(function(e) { return e._id; }).indexOf(element._id);
            console.log('testing >' + pos)
            array_of_extracted_products.splice(pos, 1);

        }
        console.log('array_of_extracted_products => ' + array_of_extracted_products.length)
        // console.log('testing > ' + array_of_extracted_products.shopId.indexOf(Shop_arrayOfProducts[0][0].shopId))
        
        flow_of_functions(Shop_arrayOfProducts, array_of_extracted_products)  // function calling
    }  //       function removing_filtered_products ends here
    
    
    function flow_of_functions(Shop_arrayOfProducts, array_of_extracted_products){
        console.log('\n -=-=-= function flow_of_functions(Shop_arrayOfProducts, array_of_extracted_products) =-=-=-')
        
        // console.log('flow_of_functions > array_of_extracted_products => ' + array_of_extracted_products[0]._id)
        if (array_of_extracted_products.length > 0){
            console.log(' Shop_arrayOfProducts length => ' + Shop_arrayOfProducts.length)
            filter_from_array_of_extracted_products(array_of_extracted_products, Shop_arrayOfProducts)  // function calling
        } else {
            console.log(' Shop_arrayOfProducts length => ' + Shop_arrayOfProducts.length)
            console.log(' array_of_extracted_products length => ' + array_of_extracted_products.length)

            sendMail(Shop_arrayOfProducts)
        }
        
    }  //       function flow_of_functions ends here
    
    
   async function sendMail(Shop_arrayOfProducts){
        console.log('\n -=-=-= function sendMail(Shop_arrayOfProducts) =-=-=-')

        console.log('ashkl =' + Shop_arrayOfProducts.length)
        let temp_array = []
        var len = Shop_arrayOfProducts.length
        abort = false
        for(var i = 0; i < len; i++){
            temp_array = []
            abort = false
          for  (j=0; !abort; j++){
              if(typeof Shop_arrayOfProducts[i][j] == 'undefined'){
                abort = true
              } else {
                // console.log(Shop_arrayOfProducts[i][j])
                temp_array.push(Shop_arrayOfProducts[i][j])
              }
              
              
            }   //  i n n e r   l o o p
            
            console.log('--------------   Temp array   ----------------')
            // console.log(temp_array)
            abc = math.sendMail(temp_array);
            console.log( i  + " : " + abc)
            console.log('----------------------')
        
        }   //   o u t e r   l o o p  

    }

    console.log('\n << End of response >> \n')
    

    
    module.exports = router;