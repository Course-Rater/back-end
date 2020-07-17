let Course = require('../models/course');
let Review = require('../models/review');
let University = require('../models/university')
let Instructor = require('../models/instructor');
let async = require('async');

const { body, validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');

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
      res.render('course_rate', { course:  course});
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
    Course.find({school: req.params.university_id}).populate('instructors').populate('school').sort([['title', 'ascending']])
    .exec((err, courses) => {
        if (err) { return next(err); }

        res.render('course_list', { title: 'Course List', course_list: courses });
    
    })
};

// Display Courses in All universities
exports.course_list_all = function(req, res) {
    Course.find({}).populate('instructors').populate('school').sort([['title', 'ascending']])
    .exec((err, courses) => {
        if (err) { return next(err); }
        res.render('course_list', { title: 'Course List', course_list: courses });
    
    })
};

// Display detail page for a specific course, review property is temporarily excluded 
exports.course_detail = function(req, res, next) {
    async.parallel({
        course: function(callback) {

            Course.findById(req.params.course_id)
              .populate('instructor')
              .populate('unviersity')
              .exec(callback);
        },
        // review: function(callback) {

        //   Review.find({ 'course': req.params.id })
        //   .exec(callback);
        // },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.course==null) { // No results.
            var err = new Error('Course not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('course_detail', { title: results.course.title, course: results.course} );
    });
};

// Display course create form on GET.
exports.course_create_get = function(req, res, next) {
    // Get all unis and instructors, which we can use for adding to our course.
    async.parallel({
        instructors: function(callback) {
            Instructor.find(callback);
        },
        universities: function(callback) {
            University.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('course_form', { title: 'Create Course', authors: results.instructors,
         universities: results.universities});
    });
};

// // Handle course create on POST.
exports.course_create_post = [ (req, res, next) =>
    {
        res.send('huy');
    }

//     // Convert the genre to an array
//     (req, res, next) => {
//         if(!(req.body.genre instanceof Array)){
//             if(typeof req.body.genre==='undefined')
//             req.body.genre=[];
//             else
//             req.body.genre=new Array(req.body.genre);
//         }
//         next();
//     },
   
//     // Validate fields.
//     body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
//     body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
//     body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
//     body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),

//     // Sanitize fields.
//     sanitizeBody('title').escape(),
//     sanitizeBody('author').escape(),
//     sanitizeBody('summary').escape(),
//     sanitizeBody('isbn').escape(),
//     sanitizeBody('genre.*').escape(),

//     // Process request after validation and sanitization.
//     (req, res, next) => {

//         // Extract the validation errors from a request.
//         const errors = validationResult(req);

//         // Create a Book object with escaped/trimmed data and old id.
//         var book = new Book(
//           { title: req.body.title,
//             author: req.body.author,
//             summary: req.body.summary,
//             isbn: req.body.isbn,
//             genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
//             _id:req.params.id //This is required, or a new ID will be assigned!
//            });

//         if (!errors.isEmpty()) {
//             // There are errors. Render form again with sanitized values/error messages.

//             // Get all authors and genres for form.
//             async.parallel({
//                 authors: function(callback) {
//                     Author.find(callback);
//                 },
//                 genres: function(callback) {
//                     Genre.find(callback);
//                 },
//             }, function(err, results) {
//                 if (err) { return next(err); }

//                 // Mark our selected genres as checked.
//                 for (let i = 0; i < results.genres.length; i++) {
//                     if (book.genre.indexOf(results.genres[i]._id) > -1) {
//                         results.genres[i].checked='true';
//                     }
//                 }
//                 res.render('book_form', { title: 'Update Book',authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
//             });
//             return;
//         }
//         else {
//             // Data from form is valid. Update the record.
//             Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to book detail page.
//                    res.redirect(thebook.url);
//                 });
//         }
//     }
];

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