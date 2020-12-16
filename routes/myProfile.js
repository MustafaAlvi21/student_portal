const express = require ('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
const userDataModel = require ('../models/users');
const { ensureAuthenticated } = require('../config/auth')
const { userRoleAuth } = require('../config/userRoleCheck')
const { verifyProfile } = require('../middlewares/verifyProfile')

//  roll_no, gender
/*------------------------------------------ */
/*              My Profile Mian              */
/*------------------------------------------ */

router.get('/my-profile', ensureAuthenticated, userRoleAuth, (req, res)=>{
    id = req.user._id;
    // id = '5fcbe3b66d14794ae810f70d';
    userDataModel.find({_id: id}, (err, data)=>{
        if (err) throw err;
        if( data ){
            console.log(data);
            if (req.user){
                let profileCompleted = false
                if(data[0].gender && data[0].roll_no){
                    profileCompleted = true
                }
                console.log('profileCompleted' +profileCompleted)
                console.log(data[0].gender)
                return res.render('my_settings', {
                    title: 'PM-Hunarmand-Portal - My Settings',
                    data: data,
                    profileCompleted: profileCompleted,
                    loginUser: req.user 
                })
            } else {
                return res.render('my_settings', {
                    title: 'PM-Hunarmand-Portal - My Settings',
                    data: data,
                    loginUser: undefined 
                })
            }
        }
    })
})

router.post('/my-profile', ensureAuthenticated, userRoleAuth, async (req, res)=>{
    const id = req.user._id;
    const fullname = req.body.fullname;
    const roll = req.body.roll;
    const gender = req.body.gender;
    
    let errors = [];
    if ( !fullname || !roll ){
        errors.push({ msg: 'Please fill in all fields'});
    }
    
    if(errors.length > 0) {
        userDataModel.find({_id:id}, (err, data)=>{
            if (err) throw err;
            if (data){
                res.render('my_settings', { title : 'PM-Hunarmand-Portal - My Profile Settings', data: data, errors, loginUser: req.user} )
            } else {
                res.render('my_settings', { title : 'PM-Hunarmand-Portal - My Profile Settings', error: 'There must be server error please try again letter', loginUser: req.user} )
            }
        })
      }
    
      
      array1=[];

      if( req.body.banner1.length > 100){
          saveCover(req.body.banner1)
      }

function saveCover(banner1Encoded) {
    console.log(' = > save cover access ')
    if (banner1Encoded == null || banner1Encoded  == '') return
    console.log(' = > if runs 1')
    var banner1 = JSON.parse(banner1Encoded)
    console.log('banner1Encoded => ' + banner1)

    console.log('yes 1')
    if (banner1 != null || banner1Encoded  != '') {
        console.log(' = > if runs 2')
        console.log('yes 2')
        banner1 = new Buffer.from(banner1.data, 'base64')
        banner1Type = banner1.type
        
        if(banner1 !== undefined){
            array1.push(banner1)
            array1.push(banner1Type)
        }
    }
  }      
            
    data={};
    if(array1.length  > 0){
      data = {
          fullname : fullname,
          roll_no : roll,
          gender : gender,
          banner1 : array1[0],
          banner1Type : array1[1]
      }
    } else {
        data = {
          fullname : fullname,
          roll_no : roll,
          gender : gender,
      }
    }

    let update = userDataModel.findByIdAndUpdate(id, data);
        
                    
    try {
        const newBook = await update.exec( (err, data) => {
            if(err) throw err;
            if(data){
                if(req.user){
                    req.flash('success_msg', 'Profile updated.')
                    return res.redirect('/my-profile')
                } else {
                    req.flash('error', 'Server not responding.')
                    return res.redirect('/my-profile')  
                }
            } else {
                return res.redirect('/my-profile')
            }
        })
    } catch(error) {
        console.log(error)
        req.flash('error', 'There is an error, please try again.')
        return res.redirect('my-profile')
    }
  
})
    
    
    
    module.exports = router