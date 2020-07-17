let Course = require('../models/course');
let Review = require('../models/review');
let University = require('../models/university')
let Instructor = require('../models/instructor');
let async = require('async');

const { body, validationResult } = require('express-validator');
// const { sanitizeBody } = require('express-validator');

// Display list page for reviews in a specific university.
exports.review_list = function(req, res) {
    Review.find({}).populate('course').populate('instructor').sort([['date_added', 'descending']])
    .exec((err, reviews) => {
        if (err) { return next(err); }

        University.findById(req.params.course_id)
        .exec((err, reviews) => {
            if (err) { return next(err); }
            res.render('course_detail', { title: 'Review List for course', review_list: reviews, university: university});
        });
    })
};

