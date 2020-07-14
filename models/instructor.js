var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

var InstructorSchema = new Schema(
  {
<<<<<<< Updated upstream
    name: {type: String, required: true, max: 100},  
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true }, 
=======
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100}, 
    department: {type: String, required: true, max: 120},
    school: { type: Schema.Types.ObjectId, ref: 'University', required: true }, 
>>>>>>> Stashed changes
  }
);

// Virtual for author's full name
// InstructorSchema
// .virtual('name')
// .get(function () {

//   var fullname = '';
//   if (this.first_name && this.family_name) {
//     fullname = this.first_name + ' ' + this.family_name;
//   } 
  
//   return fullname;
// });
  

 
// Virtual for instructor's URL
InstructorSchema
.virtual('url')
.get(function () {
  return '/universities/' + school + "/instructors/" + this._id;
});

//Export model
module.exports = mongoose.model('Instructor', InstructorSchema);