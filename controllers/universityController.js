var University = require('../models/university');
var Course = require('../models/course');
var Instructor = require('../models/instructor');
var async = require('async');

 const validator = require('express-validator');
 const { sanitizeBody } = require('express-validator');

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
            Course.find({'school': req.params.university_id})
            .exec(callback)
        },
        university_instructors: function(callback){
            Instructor.find({'school': req.params.university_id})
            .exec(callback)
        }
    },function(err, results){
        if(err){ return next(err); }
        if(results.university == null){
            var err = new Error('University not found');
            err.status = 404;
            return next(err);
        }


        res.render('university_detail', {title: 'University Detail', university: results.university,
        university_courses: results.university_courses, university_instructors: results.university_instructors});
    });
};

// Display university create form on GET.
//Consider Monster University case
exports.university_create_get = function(req, res, next) {
    res.render('university_form', {title: 'Create university'});
};

// Handle university create on POST.
exports.university_create_post = [
   
    // Validate that the name field is not empty.
    validator.body('title', 'University name required').trim().isLength({ min: 1 }),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('title').escape(),

    // Validate that the name field is not empty.
    validator.body('country', 'Country required').trim().isLength({ min: 1 }),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('country').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var university = new University(
        { title: req.body.title, country: req.body.country }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('university_form', { title: 'Create University', errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        University.findOne({ 'title': req.body.name })
          .exec( function(err, found_uni) {
             if (err) { return next(err); }
  
             if (found_uni) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_uni.url);
             }
             else {
  
               university.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(university.url);
               });
  
             }
  
           });
      }
    }
  ];

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