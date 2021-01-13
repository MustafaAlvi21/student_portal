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


// /*    ------------------------------------    */
// /*      Admin View All Task Of All Users      */
// /*    ------------------------------------    */
// router.get('/view-all-task', ensureAuthenticated, async (req, res)=> {
//     // user = req.params.id;
//     taskDataModel.find({}).sort({timeStamp1: 'desc'}).exec((err, data) => {
//         if(err) throw err;
//         if(data){
//             console.log('dash => ' + data)
//             return res.json('data found')                                                            //userId means student id
//             // return res.render('admin_userView', { title: 'PM-Hunarmand-Portal - Dashboard', data: data, userId: user, userName: req.params.userName, msg: "", loginUser: req.user})
//         } else {
//             return res.render('admin_userView', { title: 'PM-Hunarmand-Portal - Dashboard', data: undefined, msg: "Something is wrong, can't find anything" , loginUser: req.user})
//         }
//     })
//     // res.render('task', )
// })



module.exports = router;