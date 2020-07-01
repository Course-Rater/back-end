var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

var UniversitySchema = new Schema(
  {
    title: {type: String, required: true, max: 130},  
  }
);

 
// Virtual for university's URL
// TODO: make better links without the id. 
UniversitySchema
.virtual('url')
.get(function () {
  return '/universities/' + this._id;
});

//Export model
module.exports = mongoose.model('University', UniversitySchema);
