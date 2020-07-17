var University = require('../models/university');
var Course = require('../models/course');
var Instructor = require('../models/instructor');
var async = require('async');

// const { body, validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');

// Display list page for university in a specific university.
exports.university_list = function(req, res) {

    University.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_universities) {

        if (err) { return next(err); }
        //Successful, so render
        res.render('university_list', { title: 'University List', university_list: list_universities });
      });
};


// Display detail page for a specific university.
exports.university_detail = function(req, res, next) {
    async.parallel({
        university: function(callback){
            University.findById(req.params.university_id)
            .exec(callback)
        },
        university_courses: function(callback){
            Course.find({'course': req.params.university_id}, 'title')
            .exec(callback)
        }

    },function(err, results){
        if(err){ return next(err); }
        if(results.university == null){
            var err = new Error('University not found');
            err.status = 404;
            return next(err);
        }

        // TODO: Add Courses, professors in this university.

        res.render('university_detail', {title: 'University Detail', university: results.university,
        university_courses: results.university_courses});
    });
};

// Display university create form on GET.
exports.university_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: university create GET');
};

// Handle university create on POST.
exports.university_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: university create POST');
};

// Display university delete form on GET.
exports.university_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: university delete GET');
};

// Handle university delete on POST.
exports.university_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: university delete POST');
};

// Display university update form on GET.
exports.university_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: university update GET');
};

// Handle university update on POST.
exports.university_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: university update POST');
};