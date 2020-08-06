let User = require('../models/user');
const {body, validationResult, check} = require('express-validator');

exports.user_login_get = (req, res, next) => {
    res.render('login', {title: "Login"});
}
exports.user_register_get = (req, res, next) => {
    res.render('register', {title: "Register"});
}


exports.user_login_post = (req, res, next) => {
    // validator.body('email', 'Email is required').trim().isLength({min: 1}),
    // //validator.body('password', 'Password is required').trim().isLength({min: 1}),
    // /validator.body('*').escape()

    //res.render('login', {title: "Login"});
}

// exports.verifyPasswordsMatch = (req, res, next) => {
//     const {confirmPassword} = req.body

//     return check('password')
//       .isLength({ min: 4 })
//       .withMessage('password must be at least 4 characters')
//       .equals(confirmPassword)
// }
exports.user_register_post = [
    body('email', 'Email is required').trim().isEmail().normalizeEmail(),
    body('fullname', 'Full name is required').trim().isLength({min: 1, max: 130}).isAlpha().escape(),
    //check if passwords match
    body('password', 'Password is required')
        .isLength({min: 3})
        .custom((value, { req }) => {
            if (value !== req.body.password2) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return true;
            }
        })
    //validator.body('password', 'Password is required').trim().isLength({min: 1}),
    ], (req, res, next) => {
        const errors = validationResult(req);
       
        var user = new User({
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password            
        });
        
        if(!errors.isEmpty()){
            res.render('register', {title: "Register", errors: errors.array()});
            return;
        }
        res.render('register', {title: "Register", errors: errors.array()});

    //res.render('login', {title: "Login"});
    }
   //res.render('register', {title: "Register"}) 
