var University = require('../models/university');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list page for university in a specific university.
exports.university_list = function(req, res) {
    res.send('NOT IMPLEMENTED: University detail: ' + req.params.id);
};


// Display detail page for a specific university.
exports.university_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display university create form on GET.
exports.university_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: university create GET');
};

// Handle university create on POST.
exports.university_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: university create POST');
};

// Display university delete form on GET.
exports.university_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: university delete GET');
};

// Handle university delete on POST.
exports.university_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: university delete POST');
};

// Display university update form on GET.
exports.university_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: university update GET');
};

// Handle university update on POST.
exports.university_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: university update POST');
};