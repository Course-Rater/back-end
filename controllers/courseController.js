var Course = require('../models/course');

// Display the rating page for a course in a specific university.
exports.course_rate_get = function(req, res) {
    
    res.send('NOT IMPLEMENTED:' + req.params.id);
};

// Handle a new rating for a course in a specific university.
exports.course_rate_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Course detail: ' + req.params.id);
};


// Display list page for courses in a specific university.
exports.course_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Course detail: ' + req.params.id);
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