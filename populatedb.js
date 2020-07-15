#! /usr/bin/env node

console.log('This script populates some courses, instructors, universities and reviews to our database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Course = require('./models/course')
var Instructor = require('./models/instructor')
var University = require('./models/university')
var Review = require('./models/review')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var instructors = []
var universities = []
var courses = []
var reviews = []

function instructorCreate(name, school, cb) {
  instructordetail = {name: name, school: school }
  var instructor = new Instructor(instructordetail);
       
  instructor.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Instructor: ' + instructor);
    instructors.push(instructor)
    cb(null, instructor)
  }  );
}

function universityCreate(title, country, cb) {
  var university = new University({ title: title, country: country });
       
  university.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New University: ' + university);
    universities.push(university)
    cb(null, university);
  }   );
}

function courseCreate(title, school, instructors, requirements, cb) {
  coursedetail = { 
    title: title,
    school: school
  }
  if (instructors != false) coursedetail.instructors = instructors
  if (requirements != false) coursedetail.requirements = requirements
    
  var course = new Course(coursedetail);    
  course.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Course: ' + course);
    courses.push(course)
    cb(null, course)
  }  );
}


function reviewCreate(course, quality, difficulty, tags, comments, date_added, instructor, cb) {
  reviewdetail = { 
    course: course,
    quality: quality,
    difficulty: difficulty
  }
  if (tags != false) reviewdetail.tags = tags    
  if (comments != false) reviewdetail.comments = comments
  if (date_added != false) reviewdetail.date_added = date_added
  if (instructor != false) reviewdetail.instructor = instructor
    
  var review = new Review(reviewdetail);    
  review.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Review: ' + review);
      cb(err, null)
      return
    }
    console.log('New Review: ' + review);
    reviews.push(review)
    cb(null, review)
  }  );
}


function createUniversityInstructors(cb) {
    async.series([

        function(callback) {
            universityCreate('Vanderbilt University', 'USA', callback);
        },
          function(callback) {
            universityCreate('Jacobs University', 'Germany', callback);
        },
        function(callback) {
          instructorCreate('Julie Johnson', universities[0], callback);
        },
        function(callback) {
          instructorCreate('Graham Hemingway', universities[0], callback);
        },
        function(callback) {
          instructorCreate('Soeren Petrat', universities[1], callback);
        },
        function(callback) {
          instructorCreate('Jurgen Schoenwaelder', universities[1], callback);
        },
        function(callback) {
          instructorCreate('Ivan Penkov', universities[1], callback);
        }
        ],
        // optional callback
        cb);
}


function createCourses(cb) {
    async.parallel([
        function(callback) {
          courseCreate('Algorithms', universities[0], [instructors[0], instructors[1],], ['CS Major/Minor Mandatory',],callback);
        },
        function(callback) {
            courseCreate('Data Structures', universities[0], [instructors[1],], ['CS Major/Minor Mandatory',],callback);
        },
        function(callback) {
            courseCreate('Linear Algebra', universities[1], [instructors[4],instructors[2],], ['Math Major/Minor Mandatory',],callback);
        },
        function(callback) {
            courseCreate('Introduction to Computer Science', universities[1], [instructors[3],], ['CS Major/Minor Mandatory',],callback);
        },
        function(callback) {
            courseCreate('Calculus and Linear Algebra', universities[1], [instructors[2],], ['Mobility Focus Area Mandatory',],callback);
        }
        ],
        // optional callback
        cb);
}


function createReviews(cb) {
    async.parallel([
        function(callback) {
          reviewCreate(courses[2], 3, 5, ['Attendance Required',], 'Zaebal with his proofs by isomorphisms. Proof explanations are sometimes confusing',
           false, instructors[4], callback)
        },
        function(callback) {
            reviewCreate(courses[4], 5, 3, ['Test Heavy',], 'Very structured course with interesting quizzes every two weeks',
            false, instructors[2], callback)
        },
        function(callback) {
            reviewCreate(courses[4], 4, 4, false, 'Interesting homework, loved haskell part',
            false, instructors[3], callback)
        },
        function(callback) {
            reviewCreate(courses[1], 3, 3, false, false,
            false, instructors[1], callback)
        },
        function(callback) {
            reviewCreate(courses[1], 3, 4, false, false,
                false, instructors[0], callback)
        },
        function(callback) {
            reviewCreate(courses[0], 4, 2, ['Easy A',], false,
                false, instructors[1], callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createUniversityInstructors,
    createCourses,
    createReviews
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Reviews: '+reviews);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});