let Instructor = require('../models/instructor');
let Course = require('../models/course');
let University = require('../models/university');
let Review =  require('../models/review');

// const { body,validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');
const async = require('async');

// Display list page for instructors in a specific university.
exports.instructor_list = (req, res, next) => {
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
exports.instructor_detail = (req, res, next) => {
    async.parallel({
        instructor: (callback) => {
            Instructor.findById(req.params.instructor_id)
            .populate('school')
            .exec(callback)
        },
        courses: (callback) => {
            Course.find({instructors: req.params.instructor_id})
            .exec(callback)
        },

        reviews: (callback) => { 
            Review.find({instructor: req.params.instructor_id})
            .populate('course')
            .exec(callback);
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
    courses: results.courses, reviews: results.reviews });
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
exports.instructor_update_get = (req, res) => {
    async.parallel({
        instructor: (callback) => {
            Instructor.findById(req.params.instructor_id).exec(callback);
        },
        universities: (callback) => {
            University.find({}).exec(callback);
        }
    }, (err, results) => {
        if (err) {return next(err);}

        if (results.instructor==null){
            var err = new Error('Instructor is not found');
            err.status = 404;
            return next(err);
        }

        res.render('instructor_form', {title: 'Update instructor', instructor: results.instructor, universities: results.universities}); 
    });
};

// Handle instructor update on POST.
exports.instructor_update_post = (req, res) => {

    // Validate fields.
    body('name', 'Name should be specified').trim().isLength({ min: 1, max: 150 }).isAlpha({no_symbols: true}),
    body('school', 'School must be specified').trim(),

    // Sanitize fields.
    body('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var instructor = new Instructor(
            {
            name: req.body.name,
            school: req.body.school,
            _id: req.params.instructor_id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            University.find({}).exec((err, universities) => {
                if(err){next(err)}
                res.render('instructor_form', {title: 'Update instructor', instructor: instructor, universities: universities, errors: errors.array()});

            })
    
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Instructor.findByIdAndUpdate(req.params.instructor_id, instructor, {}, (err,theinstructor) => {
                if (err) { return next(err); }
                    // Successful - redirect to book detail page.
                    res.redirect(theinstructor.url);
                });
        }
    }
};