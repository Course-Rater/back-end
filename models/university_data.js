var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

var UniversityDataSchema = new Schema({
    web_pages: [{type: String, required: true, max: 130}],
    name: {type: String, required: true, max: 130},
    alpha_two_code: {type: String, required: true, max: 2},
    state_province: {type: String},
    domains: [{type: String, required: true, max: 130}],
    country: {type: String, required: true}

  }
);

module.exports = mongoose.model('UniversityData', UniversityDataSchema);