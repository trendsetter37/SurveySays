/* Use this script to generate answers.json for test data */
'use strict';
var fs = require('fs');
var path = require('path');
var randomWords = require('random-words');
var jsonfile = require('jsonfile');
var answers = [];  // Object to write
var answer = {};
answer['data'] = {};
var pickedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var file = path.resolve('fixtures/data', 'answers.js');

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// Will need 40 answers associated with questions 1-10
var count = 1;
for (var i = 1; i < 41; i++) {
  loadAnswer(i);
}

function loadAnswer(key) {
  var answer = {};
  answer['data'] = {};
  answer['model'] = "Answer";
  answer.data['id'] = key;
  answer.data['picked'] = pickedValues.randomElement();
  answer.data['choice'] = randomWords();
  if (key % 4 === 0) {
    answer.data['question'] = count;
    count++;
  } else {
    answer.data['question'] = count;
  }
  answers.push(answer);
}

function loadQuestion(key) {
  /* TODO */
}

function loadUser(key) {
  /* TODO */
}

// Write to file
jsonfile.writeFileSync(file, JSON.stringify(answers));
