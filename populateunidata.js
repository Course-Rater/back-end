console.log('This script populates json file of uni data into db - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var UniversityData = require('./models/university_data')
var fs = require('fs');

var mongoose = require('mongoose');
//const university_data = require('./models/university_data');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//read json file async-ly 
fs.readFile('./world_universities_and_domains.json', 'utf8', (err, jsonString) => {
  if (err){
    console.log('There was error reading file: ' + err)
    return
  }
  try{
    const university_data = JSON.parse(jsonString);
    
    for(const datum of university_data){
        UniversityDataCreate(datum);
    }

  }catch(err){
      console.log('Error parsing JSON string: ' + err);
  }
  
});

function UniversityDataCreate(unidata){
    unidatadetail = {
        web_pages: unidata.web_pages,
        name: unidata.name,
        alpha_two_code: unidata.alpha_two_code,
        state_province: unidata["state-province"],
        domains: unidata["domains"],
        country: unidata["country"]
    }
    var universityData = new UniversityData(unidatadetail);
    universityData.save(err => {
        if(err){
            console.log('Error saving to db: ' + err);
            return;
        }
        console.log('New uni data: ' + universityData);

    });

}




// university_data.forEach(element => {
//     UniversityDataCreate(element)
// });

