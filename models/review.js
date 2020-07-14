let mongoose = require('mongoose');
let moment = require('moment');


let Schema = mongoose.Schema;

let ReviewSchema = new Schema(
    {
      course: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, //reference to the associated course
      quality: {type: Number, required: true, enum: [1, 2, 3, 4, 5], default: 5},
      difficulty: {type: Number, required: true, enum: [1, 2, 3, 4, 5], default: 5},
      tags: {type: String, enum: ['Easy A', 'Attendance Required', 'Test Heavy', 'Amazing Lectures'], default: 'Maintenance'},
      comments: {type: String, min: 1, max: 1000},
      date_added: {type: Date, default: Date.now},
      instructor: {type: Schema.Types.ObjectId, ref: 'Instructor', required: true}
    }
);
 

ReviewSchema
.virtual('date_added_formatted')
.get(function () {
  return moment(this.date_added).format('MMMM Do, YYYY');
});


ReviewSchema
.virtual('date_added_form')
.get(function () {
  return moment(this.date_added).format('YYYY-MM-DD');
});


// Export model
module.exports = mongoose.model('Review', ReviewSchema);