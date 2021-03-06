let Course = require('../models/course');
let Review = require('../models/review');
let University = require('../models/university')
let Instructor = require('../models/instructor');
let async = require('async');

const { body, validationResult } = require('express-validator'); 
const course = require('../models/course');


// Display the rating page for a course in a specific university.
exports.course_rate_get = function(req, res) {

    // finding course schema using course id
    Course.findById(req.params.course_id)
    .populate('school')
    .populate('instructors')
    .exec((err, course) => {
      if (err) { return next(err); }
      if (course==null) { // No results.
        var err = new Error('Course not found');
        err.status = 404;
        return next(err);
      }

      // Successful, so send course object
      res.render('course_rate', { title: "Rate a Course",  course:  course});
    })
 
};

// Handle a new rating for a course in a specific university.
exports.course_rate_post = [
    // Validate fields.
    body('quality', 'Quality must be specified and equal to a num').trim().isLength({ min: 1, max: 1 }).isNumeric({no_symbols: true}),
    body('difficulty', 'Difficulty must be specified and equal to a num').trim().isLength({ min: 1, max: 1 }).isNumeric({no_symbols: true}),
    // body('tags', 'Tags must be specified').trim(),
    // body('comments', 'Comments must be specified').trim(),
    // body('instructor', 'Instructor must be specified').trim().isLength({ min: 1 }),

    // Sanitize body.
    body('*').escape(),


    // Convert the tags to an array
    (req, res, next) => {
        if(!Array.isArray(req.body.tags)){
            if(typeof req.body.tags==='undefined')
            req.body.tags=[];
            else
            req.body.tags = [req.body.tags]; 
        }
        next();
    },
   

    // Process request after validation
    (req, res, next) => {

        let doAfterAddingProf = () => {
            // find the document
            Instructor.findOne({name: req.body.instructor, school: req.params.university_id})
            .exec((err, doc)=>{
                if(err){next(err);}
                
                console.log("Review started, instructor doc: "  + doc);
                console.log(doc._id);
        
                
                // Add course review
                let review = new Review({
                    course: req.params.course_id,
                    quality: req.body.quality,
                    difficulty: req.body.difficulty,
                    tags: req.body.tags, 
                    comments: req.body.comments,
                    instructor: doc._id,
                })
                
                Course.findById(req.params.course_id, (err, course)=>{

                    // find a course and redirect to its page
                    if(err){
                        return next(err);
                    }
                    course.populate('school');

                    review.save((err) => {
                        if(err){
                            next(err);
                        }
                        res.redirect(course.url);
                    })

                });

            });
        }




        // Extract the validation errors from a request.
        const errors = validationResult(req);
       

        if(!errors.isEmpty()){
            res.send("Tried to send invalid review")
        }  
 

        Instructor.exists({name: req.body.instructor, school: req.params.university_id}, (err, result) => {
            if(err){
                res.send("Error in checking if instructor exists: " + err);
                return next(err);
            }

            console.log("Finding instructor: " + result);

            // TODO: do I even check emptiness like this?
            if(!result){ // if no such instructor
                let instructor = new Instructor({ // create document
                    name: req.body.instructor,
                    school: req.params.university_id
                });

                console.log("Instructor created but not saved")

                instructor.save((err) => {
                    if(err){
                        return next(err);
                    }

                    // Add instructor to instructors list in the Course
                    Course.findById(req.params.course_id).exec((err, doc)=>{
                        if(err){
                            console.log("Error: " + err);
                        }


                        console.log("Instructor object: " +  instructor);
                        console.log(instructor._id);


                        // push new instructor to the instructors array
                        doc.instructors.push(instructor._id);
                        doc.save((err) => {
                            if(err){
                                next(err);
                            }
                            doAfterAddingProf();
                        });
                    })
                });
                
            }
            else{
                doAfterAddingProf();
            }

        });
   
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
              .populate('instructors')
              .populate('school')
              .exec(callback);
        },
        reviews: function(callback){
            Review.find({course: req.params.course_id})
                .populate('course')
                .populate('instructor')
                .exec(callback);
        }
        
        
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.course==null) { // No results.
            var err = new Error('Course not found');
            err.status = 404;
            return next(err);
        }
        // if (results.review==null) { // No results.
        //     var err = new Error('Review not found');
        //     err.status = 404;
        //     return next(err);
        // }
        // Successful, so render.
        console.log(results.review);
        res.render('course_detail', { title: 'Course Detail', course: results.course, reviews: results.reviews} );
    });
};

// Display course create form on GET.
exports.course_create_get = function(req, res, next) {
    res.render('course_form', { title: 'Create Course', university: req.params.university_id});
};

// // Handle course create on POST.
exports.course_create_post = [ 
    // (req, res, next) => {
    //     res.send('huy');}
    
    // Convert the genre to an array
    // (req, res, next) => {
    //     if(!(req.body.genre instanceof Array)){
    //         if(typeof req.body.genre==='undefined')
    //         req.body.genre=[];
    //         else
    //         req.body.genre=new Array(req.body.genre); 
    //     }
    //     next();
    // },
   
    // Validate fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('requirements', 'Title must not be empty.').trim(),

    // Sanitize fields.
    body('title').escape(),
    body('requirements').escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // separate by ,
        let requirements_arr = req.body.requirements.split(',');

        // Create a Book object with escaped/trimmed data and old id.
        var course = new Course(
          { title: req.body.title,
            school: req.params.university_id,
            instructors: [],
            requirements: requirements_arr,

          });

        console.log("Created a course object: " + course);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages            
           res.render('course_form', { title: 'Create Course', errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            course.save(err => {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(course.url);
                });
        }
    }
];

// Display course delete form on GET.
exports.course_delete_get = function(req, res) {
    async.parallel({
        reviews: function(callback){
            Review.find({course: req.params.course_id})
            .populate('instructor')
            .populate('course')
            .exec(callback);
        },
        course: function(callback){
            Course.findById(req.params.course_id)
            .exec(callback);
        }

    }, function(err, results){
        if(err){ next(err); }
        res.render('course_delete', { title: 'Delete Course', course: results.course, reviews: results.reviews} );
    });
};

// Handle course delete on POST.
//when we delete course we |delete all its ratings/make sure all its ratings are deleted|
exports.course_delete_post = function(req, res, next) {
    async.parallel({
        reviews: function(callback){
            Review.find({course: req.body.course_id})
            .populate('instructor')
            .populate('course')
            .exec(callback);
        },
        course: function(callback){
            Course.findById(req.body.course_id)
            .populate('instructors')
            .populate('school')
            .exec(callback);
        },
        university: function(callback){
            University.findById(req.params.university_id)
            .exec(callback);
        }

    }, (err, results) => {
        if(err){ return next(err); }
        if(results.reviews.length){
            // delete everything related to course first
            res.render('course_delete', { title: 'Delete Course', course: results.course, reviews: results.reviews} );
            return;
        }

        Course.findByIdAndRemove(req.body.course_id)
        .exec(err => {
            if(err){ return next(err);}
            res.redirect(results.university.url)
        });
        
    });
};
//when we rate a course, we add new instructor to the course, so course_update
// Display course update form on GET.
exports.course_update_get = function(req, res) {
       
    Course.findById(req.params.course_id)
    .populate('school')
    .exec((err, course) => {
        if(err){ return next(err);}
        if(course == null){
            var err = new Error('Course not found');
            err.status = 404;
            return next(err);
        }
        res.render('course_form', {title: 'Update Course', course: course});
    }
    );
    
};

// Handle course update on POST.
exports.course_update_post = [ 
    // (req, res, next) => {
    //     res.send('huy');}
    
    // Convert the genre to an array
    // (req, res, next) => {
    //     if(!(req.body.genre instanceof Array)){
    //         if(typeof req.body.genre==='undefined')
    //         req.body.genre=[];
    //         else
    //         req.body.genre=new Array(req.body.genre); 
    //     }
    //     next();
    // },
   
    // Validate fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('requirements', 'Title must not be empty.').trim(),

    // Sanitize fields.
    body('title').escape(),
    body('requirements').escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // separate by ,
        let requirements_arr = req.body.requirements.split(',');

        // Create a Book object with escaped/trimmed data and old id.
        var course = new Course({ 
            title: req.body.title,
            school: req.params.university_id,
            instructors: [],
            requirements: requirements_arr,
        });

        console.log("Created a course object: " + course);

        if (!errors.isEmpty()) {
            res.render('course_form', {title: 'Update Course', course: course});
            return;
        }

        Course.findByIdAndUpdate(req.params.course_id, course, {},  (err,thecourse) => {
            if (err) { return next(err); }
            // Successful - redirect to book detail page.
            res.redirect(thecourse.url);
          });

    }
];