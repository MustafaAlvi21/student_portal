const express = require('express');
const router =  express.Router()
const userDataModel = require('../models/users')
const taskDataModel = require('../models/task')
const { B_Admin_RoleAuth } = require('../config/B_admin_stopLogin')
const { ensureAuthenticated } = require('../config/auth')


/*    -----------------------------------    */
/*             Admin User Dashboard          */
/*    -----------------------------------    */
router.get('/users', ensureAuthenticated,  (req, res) =>  {

if(req.user){
    console.log('admin => ' + req.user)
}
    userDataModel.find({role: 'user', course: req.user.course}, (err, data)=> {
        if (err) throw err;
        if (data){
            if(req.user){
                res.render('admin_userDashboard', { title: 'PM-Hunarmand-Portal - Users', data: data, loginUser: req.user })
            }  else {
                res.render('admin_userDashboard', { title: 'PM-Hunarmand-Portal - Admin Users', data: data, loginUser: undefined })
            }
        } else {
            res.render('admin_userDashboard', { title: 'PM-Hunarmand-Portal - Admin Users', data: undefined, })
        }
    })
})

/*    -----------------------------------    */
/*        Admin View All Task Of User        */
/*    -----------------------------------    */
router.get('/view-task/:id/:userName', ensureAuthenticated, async (req, res)=> {
    user = req.params.id;
    taskDataModel.find({studentId: user}).sort({timeStamp1: 'desc'}).exec((err, data) => {
        if(err) throw err;
        if(data){
            console.log('dash => ' + data)                                                            //userId means student id
            return res.render('admin_userView', { title: 'PM-Hunarmand-Portal - Dashboard', data: data, userId: user, userName: req.params.userName, msg: "", loginUser: req.user})
        } else {
            return res.render('admin_userView', { title: 'PM-Hunarmand-Portal - Dashboard', data: undefined, msg: "Something is wrong, can't find anything" , loginUser: req.user})
        }
    })
    // res.render('task', )
})


/**             Update Status              **/
router.post('/view-task/update-status/:id/:userId/:userName', ensureAuthenticated, B_Admin_RoleAuth, (req, res)=> {
    id = req.params.id;
    userId = req.params.userId;
    enteredStatus = req.body.status;
    enteredMarks = req.body.marks;
    let update = taskDataModel.findByIdAndUpdate( id , 
        { 
            marks : enteredMarks,
            status : enteredStatus,
        });
        update.exec (function (err, data) {
            if (err) throw err;
            asd = `/admin/view-task/${userId}/${req.params.userName}`          //    /admin/view-task/5fcbe3b66d14794ae810f70d
            if (data){                                                         //    /admin/view-task/5fcbe3b66d14794ae810f70d/test123
                req.flash('success_msg', 'Task is updated successfully.');
                res.redirect(asd)    
            } else {
                req.flash('error_msg', 'There is an error in updating status.');
                res.redirect(asd)    
            }
        }) 
})


// /*    -----------------------------------    */
// /*          Admin Service Dashboard          */
// /*    -----------------------------------    */

// router.get('/services', ensureAuthenticated, B_Admin_RoleAuth, (req, res) =>  {
//     if(req.user){
//         console.log('admin => ' + req.user)
//     }
//     serviceDataModel.find({}, (err, data)=> {
//         if (err) throw err;
//         if (data){
//             if(req.user){
//                 // res.send(data)
//                 res.render('admin_serviceDashboard', { title: 'PM-Hunarmand-Portal - Admin Service  Dashboard ', data: data, loginUser: req.user.fullname })
//             }  else {
//                 res.render('admin_serviceDashboard', { title: 'PM-Hunarmand-Portal - Admin Service  Dashboard ', data: data, loginUser: undefined })
//             }
//         } else {
//             res.render('admin_serviceDashboard', { title: 'PM-Hunarmand-Portal - Admin Service  Dashboard ', data: undefined, })
//         }
//     })
// })

// /**             Update service status              **/
// router.get('/services/:id/:enteredStatus', ensureAuthenticated, B_Admin_RoleAuth, (req, res)=> {
//     id = req.params.id;
//     enteredStatus = req.params.enteredStatus;
//     let update = serviceDataModel.findByIdAndUpdate( id , 
//         { 
//             status : enteredStatus,
//         });
//         update.exec (function (err, data) {
//             if (err) throw err;
//             if (data){
//                 req.flash('success_msg', 'Services "' + id + '" status is updated successfully.');
//                 res.redirect('/admin/services')    
//             } else {
//                 req.flash('error_msg', 'There is an error in updating status.');
//                 res.redirect('/admin/services')    
//             }
//         }) 
// })


// /*    -----------------------------------    */
// /*            Admin Shop Dashboard           */
// /*    -----------------------------------    */

// router.get('/shops', ensureAuthenticated, B_Admin_RoleAuth, (req, res) =>  {
//     if(req.user){
//         console.log('admin => ' + req.user)
//     }
//         shopDataModel.find({}, (err, data)=> {
//             if (err) throw err;
//             if (data){
//                 if(req.user){
//                     // res.send(data)
//                     res.render('admin_shopDashboard', { title: 'PM-Hunarmand-Portal - Admin Shop Dashboard ', data: data, loginUser: req.user.fullname })
//                 }  else {
//                     res.render('admin_shopDashboard', { title: 'PM-Hunarmand-Portal - Admin Shop Dashboard ', data: data, loginUser: undefined })
//                 }
//             } else {
//                 res.render('admin_shopDashboard', { title: 'PM-Hunarmand-Portal - Admin Shop Dashboard ', data: undefined, })
//             }
//         })
// })
// /*    -----------------------------------    */
// /*          Admin Products Dashboard         */
// /*    -----------------------------------    */

// router.get('/products', ensureAuthenticated, B_Admin_RoleAuth, (req, res) =>  {
//     if(req.user){
//         console.log('admin => ' + req.user)
//     }
//     productsDataModel.find({}, (err, data)=> {
//         if (err) throw err;
//         if (data){
//             // console.log(data)
//             if(req.user){
//                 // res.send(data)
//                 res.render('admin_ProductDashboard', { title: 'PM-Hunarmand-Portal - Admin Product Dashboard ', data: data, loginUser: req.user.fullname })
//             }  else {
//                 res.render('admin_ProductDashboard', { title: 'PM-Hunarmand-Portal - Admin Product Dashboard ', data: data, loginUser: undefined })
//             }
//         } else {
//             res.render('admin_ProductDashboard', { title: 'PM-Hunarmand-Portal - Admin Product Dashboard ', data: undefined, })
//         }
//     })
// })


module.exports = router;