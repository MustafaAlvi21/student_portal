const mongoose = require('mongoose');

var taskSchema  = new mongoose.Schema(
    {
        taskName : { type: String, required: true} ,
        isCompleted : { type: String, required: true, enum : ['Completed','In progress'],} ,
        status : { type: String, required: true, enum : ['checked','not checked'],} ,
        date_time : { type: String, require: true} ,
        studentId : { type: String, require: true} ,
        studentName : { type: String, require: true} ,
        studentEmail : { type: String, require: true} ,
        timeStamp1 : { type: String, require: true} ,
        fileType : { type: String, require: true} ,
        marks : { type: String, require: true} ,

        cover1Image: { type: Buffer, required: true },
        cover1ImageType: { type: String, required: true },
      
      }    
  );

  taskSchema.virtual('cover1ImagePath').get(function() {
    if (this.cover1Image != null && this.cover1ImageType != null) {
      return `data:${this.cover1ImageType};charset=utf-8;base64,${this.cover1Image.toString('base64')}`
    }
  });

  
  var taskDataModule = mongoose.model('tasks', taskSchema);
  module.exports =  taskDataModule;