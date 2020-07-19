var Instructor = require('../models/instructor');
var Course = require('../models/course');
// const { body,validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');
var async = require('async');

// Display list page for instructors in a specific university.
exports.instructor_list = function(req, res, next) {
    Instructor.find({})
      .populate('school')
      .sort([['name', 'ascending']])
      .exec(function (err, list_instructors) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('instructor_list', { title: 'Instructor List', instructor_list: list_instructors });
      });
};


// Display detail page for a specific instructor.
exports.instructor_detail = function(req, res, next) {
    async.parallel({
        instructor: function(callback) {
            Instructor.findById(req.params.instructor_id)
            .populate('school')
            .exec(callback)
        },
        courses: function(callback){
            Course.find({instructors: req.params.instructor_id})
            .populate('course')
            .exec(callback)
        }


    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.instructor==null) { // No results.
            var err = new Error('Instructor not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('instructor_detail', { title: 'Instructor Detail', instructor: results.instructor,
    instructor_courses: results.courses});
    });
};

// // Display instructor create form on GET.
// exports.instructor_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: instructor create GET');
// };

// // Handle instructor create on POST.
// exports.instructor_create_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: course create POST');
// };

// instructor will be created in the creating review process

// // Display instructor delete form on GET.
// exports.instructor_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: instructor delete GET');
// };

// // Handle course delete on POST.
// exports.instructor_delete_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: instructor delete POST');
// };

// Display course update form on GET.
exports.instructor_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: course update GET');
};

// Handle instructor update on POST.
exports.instructor_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: instructor update POST');
};