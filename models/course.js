var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema(
  {
    title: {type: String, required: true, min: 1, max: 120}, 
    school: {type: Schema.Types.ObjectId, ref: 'University', required: true},
    instructors: [{type: Schema.Types.ObjectId, ref: 'Instructor'}],
    requirements: [{type: String}]
  }
);


 

// Virtual for book's URL
CourseSchema
.virtual('url')
.get(function () {
    return '/universities/' + this.school._id + '/courses/' + this._id;
}); 


//Export model
module.exports = mongoose.model('Course', CourseSchema);