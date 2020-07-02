var express = require('express');
var router = express.Router();

let course_controller = require('../controllers/courseController');
let instructor_controller = require('../controllers/instructorController');
let university_controller = require('../controllers/universityController');


// ADDING A NEW REVIEW

router.get('/:university_id/courses/:course_id/rate', course_controller.course_rate_get);

router.post('/:university_id/courses/:course_id/rate', course_controller.course_rate_get);


/// COURSE ROUTES ///
router

/// INSTRUCTOR ROUTES ///


/// UNIVERSITY ROUTES /// 

// Main page


module.exports = router;