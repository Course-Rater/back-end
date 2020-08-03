let User = require('../models/user');
const validator = require('express-validator');

exports.user_login_get = (req, res, next) => {
    res.render('login', {title: "Login"});
}
exports.user_register_get = (req, res, next) => {
    res.render('register', {title: "Register"});
}
exports.user_login_post = (req, res, next) => {
    //res.render('login', {title: "Login"});
}
exports.user_register_post = (req, res, next) => {
    //res.render('register', {title: "Register"});
}