const express = require ('express');
const router =  express.Router();
const taskDataModel = require('../models/task'); 
const userDataModel = require('../models/users'); 
const { ensureAuthenticated } = require('../config/auth')
const { verifyProfile } = require('../middlewares/verifyProfile'); 


/*  ---------------------------------------------  */
/*                  Dashboard                      */
/*  ---------------------------------------------  */

router.get('/dashboard', ensureAuthenticated, verifyProfile, async (req, res)=> {
    user = req.user;
    data = 1
    taskDataModel.find({studentId: req.user._id}, 'taskName isCompleted status marks date_time cover1ImageType fileType ').sort({timeStamp1: 'desc'}).exec((err, data) => {
        if(err) throw err;
        if(data){
            console.log('dash => ' + data)
            return res.render('dashboard', { title: 'Student Portal - Dashboard', data: data, msg: "", loginUser: req.user})
            // return res.json({ title: 'Student Portal - Dashboard', data: data, msg: "", loginUser: req.user})
        } else {
            return res.render('dashboard', { title: 'Student Portal - Dashboard', data: undefined, msg: "Something is wrong, can't find anything" , loginUser: req.user})
        }
    })
    // res.render('task', )
})


router.post('/upload-task', ensureAuthenticated, verifyProfile, async(req, res)=> {
    function timeIn_am_pm() { 
      let options = {
        timeZone: 'Asia/Karachi',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
      formatter = new Intl.DateTimeFormat([], options);
    
    console.log(formatter.format(new Date()));

    return (formatter.format(new Date()))
} 

console.log(req.body.isCompleted)

        var today = new Date();
        // var date = today.getDate() +'-'+(today.getMonth()+1)+'-'+ today.getFullYear();
        // var currentDate = date + ' / ' + timeIn_am_pm();
        var currentDate =  timeIn_am_pm();
    
        const book = new taskDataModel({
            isCompleted: req.body.isCompleted,
            status : "not checked",
            taskName : req.body.taskName,
            studentId : req.user._id,
            studentName : req.user.fullname,
            studentEmail : req.user.email,
            date_time : currentDate,
            timeStamp1: today,
            fileType: req.body.fileExtension,
        })
    
      saveCover(book, req.body.taskFile)
      
        try {
          const newBook = await book.save()
          req.flash('success_msg', 'Uploaded successfully');
          res.redirect('/dashboard');
        //   res.render('dashboard', { title: 'Student Portal - Dashboard', success_msg:"Uploaded successfully",  loginUser: req.user.fullname, });        
        } catch(error) {
          console.log(error)
          req.flash('error', 'There is an error, please try again.')
          return res.redirect('/dashboard')
        }
    
        function saveCover(book, cover1Encoded) {
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
/*                  View task file                 */
/*  ---------------------------------------------  */
    
router.get('/view-file/:fileId', async (req, res) => {
    fileId = req.params.fileId

    await taskDataModel.find({_id: fileId}, (err, data) => {
        if(err) throw err;
        if(data){
            console.log('view data = ' + data)
        }
        res.render('view_file', {title: 'Student Portal - View file', data: data,  loginUser: req.user, layout: 'taskViewLayout'})
    })
})


/*  ---------------------------------------------  */
/*               download task file                */
/*  ---------------------------------------------  */
router.get('/download/:fileId', async (req, res) => {
    fileId = req.params.fileId

    await taskDataModel.find({_id: fileId}, (err, data) => {
        if(err) throw err;
        if(data){
            console.log('view data = ' + data)
        }
        res.render('download', {title: 'Student Portal - View file', data: data,  loginUser: req.user, layout: 'taskViewLayout'})
    })
})


/*  ---------------------------------------------  */
/*                Remove task file                 */
/*  ---------------------------------------------  */

router.get('/remove/:fileId', ensureAuthenticated, verifyProfile, function(req, res){
    const fileId = req.params.fileId
    console.log('doctorId remove: ' + fileId)
    let delete1 = taskDataModel.findByIdAndDelete(fileId);
    delete1.exec(async function (err, data1){
      if (err) throw err;
      if(data1){
          const id = req.user._id;
          req.flash('success_msg', 'Removed successfully');
          res.redirect('/dashboard');
      }
      // res.render('view_file', {title: 'Student Portal - View file',success_msg: 'Removed successfully', data: data,  loginUser: req.user.fullname, layout: 'taskViewLayout'})
    })
})


module.exports = router;