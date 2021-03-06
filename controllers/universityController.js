var University = require('../models/university');
var Course = require('../models/course');
var Instructor = require('../models/instructor');
var async = require('async');

const { body,validationResult } = require('express-validator');
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
exports.university_detail = (req, res, next) => {
    async.parallel({
        university: function(callback){
            University.findById(req.params.university_id)
            .exec(callback)
        },
        courses: function(callback){
            Course.find({school: req.params.university_id})
            .exec(callback)
        },
        instructors: function(callback){
            Instructor.find({school: req.params.university_id})
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
        courses: results.courses, instructors: results.instructors});
    });
};

// Display university create form on GET.
//Consider Monster University case
exports.university_create_get = (req, res, next) => {
    res.render('university_form', {title: 'Create university'});
};

// Handle university create on POST.
exports.university_create_post = [
   
    // Validate that the name field is not empty.
    body('title', 'University name required').trim().isLength({ min: 1 }),
    
    // Sanitize (escape) the name field.
    body('title').escape(),

    // Validate that the name field is not empty.
    body('country', 'Country required').trim().isLength({ min: 1 }),
    
    // Sanitize (escape) the name field.
    body('country').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
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
exports.university_delete_get = (req, res, next) => {
  async.parallel({
    university: (callback) => {
      University.findById(req.params.university_id)
      .exec(callback)
    },
    instructors: (callback) => {
      Instructor.find({'school': req.params.university_id})
      .exec(callback)
    },
    courses: (callback) => {
      Course.find({'course': req.params.university_id})
      .exec(callback)
    }
  },function(err, results){
    if(err) { return next(err); }
    if(results.courses.length){
      var err = new Error('Unable to delete. University has courses');
      err.status = 500;
      return next(err);
    }
    if(results.instructors.length){
      var err = new Error('Unable to delete. University has instructors');
      err.status = 500;
      return next(err);
    }
    res.render('university_delete_form', { title: "Delete University", university: results.university });
      
  });
  //res.send('NOT IMPLEMENTED: university delete GET');
};

// Handle university delete on POST.
exports.university_delete_post = (req, res, next) => {
    University.findByIdAndRemove(req.params.university_id, (err) => {
      if(err){ return next(err); }
      res.redirect('/universities');
    })
};

// Display university update form on GET.
exports.university_update_get = (req, res) => {
    res.render('university_form', {title: 'Update university'});
};

// Handle university update on POST.
exports.university_update_post = [
   
  // Validate that the name field is not empty.
  body('title', 'University name required').trim().isLength({ min: 1 }),
  
  // Sanitize (escape) the name field.
  body('title').escape(),

  // Validate that the name field is not empty.
  body('country', 'Country required').trim().isLength({ min: 1 }),
  
  // Sanitize (escape) the name field.
  body('country').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var university = new University(
      { title: req.body.title,
        country: req.body.country,
        _id: req.params.university_id }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('university_form', { title: 'Update University', errors: errors.array()});
      return;
    }
    else {
      //update university
      University.findByIdAndUpdate(req.params.university_id, university, {}, (err, theuni) => {
          if(err){ return next(err); }
          res.redirect(theuni.url);

      });
    
    }

  }
];