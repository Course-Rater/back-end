var express = require('express');
var router = express.Router();

let course_controller = require('../controllers/courseController');
let instructor_controller = require('../controllers/instructorController');
let university_controller = require('../controllers/universityController');


// ADDING A NEW REVIEW
router.get('/:university_id/courses/:course_id/rate', course_controller.course_rate_get);

router.post('/:university_id/courses/:course_id/rate', course_controller.course_rate_post);


/// COURSE ROUTES ///
router.get('/:university_id/courses/create', course_controller.course_create_get);

router.post('/:university_id/courses/create', course_controller.course_create_post);

router.post('/:university_id/courses/:course_id/delete', course_controller.course_delete_post);

router.get('/:university_id/courses/:course_id/update', course_controller.course_update_get);

router.post('/:university_id/courses/:course_id/update', course_controller.course_update_post);

router.get('/:university_id/courses/:course_id', course_controller.course_detail);

router.get('/:university_id/courses', course_controller.course_list);



/// INSTRUCTOR ROUTES ///
// router.get('/:university_id/instructors/create', instructor_controller.instructor_create_get);

// router.post('/:university_id/instructors/create', instructor_controller.instructor_create_post);

// router.post('/:university_id/instructors/:instructor_id/delete', instructor_controller.course_delete_post);

router.get('/:university_id/instructors/:instructor_id/update', instructor_controller.instructor_update_get);

router.post('/:university_id/instructors/:instructor_id/update', instructor_controller.instructor_update_post);

router.get('/:university_id/instructors/:instructor_id', instructor_controller.instructor_detail);

router.get('/:university_id/instructors', instructor_controller.instructor_detail);


/// UNIVERSITY ROUTES /// 
router.get('/create', university_controller.university_create_get);

router.post('/create', university_controller.university_create_post);

router.post('/:university_id/delete', university_controller.university_delete_post);

router.get('/:university_id/update', university_controller.university_update_get);

router.post('/:university_id/update', university_controller.university_update_post);

router.get('/:university_id/', university_controller.university_detail);
 

// Universities page
router.get('/', university_controller.university_list);

module.exports = router;