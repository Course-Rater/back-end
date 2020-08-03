var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {type: String, required: true, max: 130},
    fullname: {type: String, required: true, max: 130},
    password: {type: String, required: true, min: 6}
    
});

module.exports = mongoose.model('User', UserSchema);