var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {type: String, required: true, max: 130},
    username: {type: String, required: true, max: 130},
    password: {type: String, required: true, min: 3}
    
});

module.exports = mongoose.model('User', UserSchema);
