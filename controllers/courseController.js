let Course = require('../models/course');
let Review = require('../models/review');
let University = require('../models/university')
let Instructor = require('../models/instructor');
let async = require('async');

const { body, validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator/filter');

const review = require('../models/review');



// Display the rating page for a course in a specific university.
exports.course_rate_get = function(req, res) {

    // finding course schema using course id
    Course.findById(req.params.course_id)
    .populate('school')
    .exec((err, course) => {
      if (err) { return next(err); }
      if (course==null) { // No results.
          var err = new Error('Course not found');
          err.status = 404;
          return next(err);
        }

      // Successful, so send course object
      res.render('courserate', { course:  course});
    })
 
};

// Handle a new rating for a course in a specific university.
exports.course_rate_post = [
    // Validate fields.
    body('quality', 'Quality must be specified and equal to a num').trim().isLength({ min: 1, max: 1 }).isNumeric({no_symbols: true}),
    body('difficulty', 'Difficulty must be specified and equal to a num').trim().isLength({ min: 1, max: 1 }).isNumeric({no_symbols: true}),
    body('tags', 'Tags must be specified').trim(),
    body('comments', 'Comments must be specified').trim().isLength({ min: 1 }),
    body('instructor', 'Instructor must be specified').trim().isLength({ min: 1 }),

    
    // Sanitize body.
    body('*').escape(),

    // Process request after validation
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            res.send("Tried to send invalid review")
        }
        else{ 
            // Check existence of an instructor
            let instructor_id;
            Instructor.exists({name: req.body.instructor, school: req.params.university_id}, (err, result) => {
                if(err){
                    res.send(err);
                }
                else{
                    if(!result){ // if no such instructor
                        let instructor = new Instructor({ // create document
                            name: req.body.instructor,
                            school: req.params.university_id
                        });
                        instructor.save((err) => {
                            if(err){
                                return next(err);
                            }
                        });
                        
                        // Add instructor to instructors list in the Course
                        Course.findById(req.params.course_id).exec((err, doc)=>{
                            if(err){
                                console.log("Error: " + err);
                            }
                            // push new instructor to the instructors array
                            doc.instructors.push(instructor._id);
                            doc.save((err) => {
                                if(err){
                                    next(err);
                                }
                            });
                        })

                    }

                    // find the document
                    Instructor.findOne({name: req.body.instructor, school: req.params.university_id})
                    .exec((err, doc)=>{
                        instructor_id = doc.id; // save instructor_id
                    })

                    
                }
            });
           

        
            // Add course review
            let review = new Review({
                course: req.params.course_id,
                quality: req.body.quality,
                difficulty: req.body.difficulty,
                tags: req.body.tags.split(","), // not sure about this one
                comments: req.body.comments,
                instructor: instructor_id,
            })
            
            Course.findById(req.params.course_id, 'url', (err, doc)=>{
                // find a course and redirect to its page
                if(err){
                    return next(err);
                }

                review.save((err) => {
                    if(err){
                        next(err);
                    }
                    res.redirect(doc.url);
                })

            });
            
        }
        
    }
]

// Display list page for courses in a specific university.
exports.course_list = function(req, res) {
    Course.find({}).populate('instructors').populate('school')
    .exec((err, courses) => {
        if (err) { return next(err); }

        University.findById(req.params.university_id)
        .exec((err, university) => {
            if (err) { return next(err); }
            res.render('course_list', { title: 'Course List', course_list: courses, university: university });
        });
    })
};

// Display detail page for a specific course.
exports.course_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Course detail: ' + req.params.id);
};

// Display course create form on GET.
exports.course_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: course create GET');
};

// Handle course create on POST.
exports.course_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: course create POST');
};

// Display course delete form on GET.
// exports.course_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: course delete GET');
// };

// Handle course delete on POST.
exports.course_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: course delete POST');
};

// Display course update form on GET.
exports.course_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: course update GET');
};

// Handle course update on POST.
exports.course_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: course update POST');
};