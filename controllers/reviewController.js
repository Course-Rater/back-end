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

        University.findById(req.params.university_id)
        .exec((err, university) => {
            if (err) { return next(err); }
            res.render('review_list', { title: 'Review List', review_list: reviews, university: university });
        });
    })
};

// Display detail page for a specific course, review property is temporarily excluded 
exports.review_detail = function(req, res, next) {
    async.parallel({
        course: function(callback) {
            Review.findById(req.params.id).populate('course').populate('instructor').exec(callback);
        },
        // review: function(callback) {

        //   Review.find({ 'course': req.params.id })
        //   .exec(callback);
        // },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.review==null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('review_detail', { title: "Review detail", review: results.review} );
    });
};