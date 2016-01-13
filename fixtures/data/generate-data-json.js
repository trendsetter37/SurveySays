/* Use this script to generate answers.json for test data */
'use strict';
var fs = require('fs');
var path = require('path');
var randomWords = require('random-words');
var jsonfile = require('jsonfile');
var range = require('node-range');
var bcrypt = require('bcrypt-nodejs');
var pickedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/* Data to write */
var answers = [];  // Object to write
var questions = [];
var users = [];



var answerFile = path.resolve('fixtures/data', 'answers.json');
var questionFile = path.resolve('fixtures/data', 'questions.json');
var usersFile = path.resolve('fixtures/data', 'users.json');

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// Will need 40 answers associated with questions 1-10
var count = 1;
range(1, 41).map(function (key) {
  loadAnswer(key);
});

function loadAnswer(key) {
  var answer = {};
  answer['data'] = {};
  answer['data'] = {};
  answer['model'] = "Answer";
  answer.data['id'] = key;
  answer.data['picked'] = pickedValues.randomElement();
  answer.data['choice'] = randomWords();
  if (key % 4 === 0) {
    answer.data['question'] = count;
    loadQuestion(count);
    loadUser(count);
    count++;
  } else {
    answer.data['question'] = count;
  }
  answers.push(answer);

}

function loadQuestion(primaryID) {
  var question = {};
  question['model'] = 'Question';
  question['data'] = {};
  question.data['query'] = randomQuestion();
  question.data['id'] = primaryID;
  questions.push(question);
}

function loadUser(key) {
  // Need ten users
  var user = {};
  user['model'] = 'User';
  user['data'] = {};
  user.data['id'] = key;
  user.data['ident'] = bcrypt.hashSync(randomWords({ exactly: 5, join: '' }));
  users.push(user);
}

function randomQuestion() {
  return randomWords({min: 5, max: 10}).join(' ') + '?';
}
//console.log(questions);;
// Write to file

console.log(answers);
jsonfile.writeFileSync(answerFile, JSON.stringify(answers));
console.log(questions);
jsonfile.writeFileSync(questionFile, JSON.stringify(questions));
console.log(users);
jsonfile.writeFileSync(usersFile, JSON.stringify(users));
