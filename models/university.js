var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

var UniversitySchema = new Schema(
  {
<<<<<<< Updated upstream
    country: {type: String, required: true, max: 130},
    title: {type: String, required: true, max: 130},  
=======
    title: {type: String, required: true, max: 130},
     
>>>>>>> Stashed changes
  }
);

 
// Virtual for university's URL
// TODO: make better links without the id. 
UniversitySchema
.virtual('url')
.get(function () {
  // name = this.title.toLowerCase();
  // name.replace(/\s/g, '');
  // name.replace('university', 'u');
  // name.replace('of','');
  // name.replace('of','');

  return '/universities/' + this._id;
});

//Export model
module.exports = mongoose.model('University', UniversitySchema);
