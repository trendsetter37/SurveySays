/* Use this script to generate answers.json for test data */
'use strict';
var fs = require('fs');
var path = require('path');
var randomWords = require('random-words');
var jsonfile = require('jsonfile');
var range = require('node-range');
var bcrypt = require('bcrypt-nodejs');
var pickedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

var answers = [];
var questions = [];
var users = [];

var answerFile = path.resolve('fixtures/', 'answers.json');
var questionFile = path.resolve('fixtures/', 'questions.json');
var usersFile = path.resolve('fixtures/', 'users.json');

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
  answer.data['createdAt'] = Date.now();
  answer.data['updatedAt'] = Date.now();
  if (key % 4 === 0) {
    answer.data['questionId'] = count;
    loadQuestion(count);
    loadUser(count);
    count++;
  } else {
    answer.data['questionId'] = count;
  }
  answers.push(answer.data);
}

function loadQuestion(primaryID) {
  var question = {};
  question['model'] = 'Question';
  question['data'] = {};
  question.data['query'] = randomQuestion();
  question.data['id'] = primaryID;
  question.data['createdAt'] = Date.now();
  question.data['updatedAt'] = Date.now();
  questions.push(question.data);
}

function loadUser(primaryID) {
  var user = {};
  user['model'] = 'User';
  user['data'] = {};
  user.data['id'] = primaryID;
  user.data['ident'] = bcrypt.hashSync(randomWords({ exactly: 5, join: '' }));
  user.data['createdAt'] = Date.now();
  user.data['updatedAt'] = Date.now();
  users.push(user.data);
}

function randomQuestion() {
  return randomWords({min: 5, max: 10}).join(' ') + '?';
}

jsonfile.writeFileSync(answerFile, answers);
jsonfile.writeFileSync(questionFile, questions);
jsonfile.writeFileSync(usersFile, users);
