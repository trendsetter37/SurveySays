/* Use this script to generate answers.json for test data */
'use strict';
var fs = require('fs');
var randomWords = require('random-words');
var jsonfile = require('jsonfile');
var answers = [];  // Object to write
var answer = {};
answer['data'] = {};
var pickedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var randomAnswers = randomWords(40);
var file = 'answers.json';


Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// Will need 40 answers associated with questions 1-10
var count = 1;
for (let i = 1; i < 41; i++) {
  console.log(i);
}

// Write to file

//jsonfile.writeFileSync(file, JSON.stringify(answers));
