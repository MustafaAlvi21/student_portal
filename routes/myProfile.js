const express = require ('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
const userDataModel = require ('../models/users');
const { ensureAuthenticated } = require('../config/auth')
const { userRoleAuth } = require('../config/userRoleCheck')
const { verifyProfile } = require('../middlewares/verifyProfile')


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
                return res.render('my_settings', {
                    title: 'PM-Hunarmand-Portal - My Settings',
                    data: data,
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

router.post('/my-profile', ensureAuthenticated, userRoleAuth, (req, res)=>{
    const id = req.user._id;
    const fullname = req.body.fullname;
    const roll = req.body.roll;
    const git = req.body.git;
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


    let update = userDataModel.findByIdAndUpdate(id,
        {
            fullname : fullname,
            roll_no : roll,
            git : git,
            gender : gender,
        });

        update.exec(function(err, data){
            // console.log('3')
            if (err) throw err;
            // console.log('4')
            if (data){
                userDataModel.find({_id:id}, (err, data)=>{
                    if (err) throw err;
                    if (data){
                        console.log(data);
                        if (req.user){
                            return res.render('my_settings', {
                                title: 'PM-Hunarmand-Portal - My Profile Settings',
                                data: data,
                                loginUser: req.user,
                                success_msg: 'Profile updated.', 
                            })
                        } else {
                            return res.render('my_settings', {
                                title: 'PM-Hunarmand-Portal - My Profile Settings',
                                data: data,
                                loginUser: undefined 
                            })
                        }
                    }
                })
            }
        })
})



module.exports = router