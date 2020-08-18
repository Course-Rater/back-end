let Review = require('../models/review');
let University = require('../models/university') 
 
let async = require('async');
const { body, validationResult } = require('express-validator');

const { course_detail } = require('./courseController');
const Course = require('../models/course');
// const { sanitizeBody } = require('express-validator');

// Display list page for reviews in a specific university.
exports.review_list = (req, res) => {
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

exports.review_like = (req, res) => {
    async.parallel({
        course: (callback) => {
            Course.findById(req.params.course_id)
            .exec(callback);
        },
        review: (callback) => {
            Review.findById(req.body.reviewid)
            .exec(callback);
        }
    }, (err, results) => {
        if(err){ return next(err); } 

        Review.findByIdAndUpdate(req.body.reviewid, {likes: results.review.likes + 1}, {}, (err, thereview) => {
            if(err) { return next(err); }
            res.redirect(results.course.url);
            
        });   

    });   
    
};

exports.review_dislike = (req, res) => {
    async.parallel({
        course: (callback) => {
            Course.findById(req.params.course_id)
            .exec(callback);
        },
        review: (callback) => {
            Review.findById(req.body.reviewid)
            .exec(callback);
        }
    }, (err, results) => {
        if(err){ return next(err); } 

        Review.findByIdAndUpdate(req.body.reviewid, {dislikes: results.review.dislikes + 1}, {}, (err, thereview) => {
            if(err) { return next(err); }
            res.redirect(results.course.url);
            
        });   

    });   

};

