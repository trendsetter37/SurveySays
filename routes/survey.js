var express = require('express');
var Sequelize = require('sequelize');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');

/* Survey Page */

router.post('/random-question', function (req, res, next) {
  var data = req.body;
  var returnData = {};
  console.log('The input data is: ', data.fingerprint);

  // findorcreate fingerprint in database

  models.User.findOrCreate({
    where: {
      ident: data.fingerprint
    },
    include: [{model: models.Question}]
  })
  .spread(function (userInstance, created) {
    // created is a boolean. Was this instance just created?
    if (!created) {
      console.log('entered into not created clause');
      userInstance.getQuestions()
        .then(function (questions) {
          console.log('Questions answered by user');
          console.log(questions);
          var questionIDs = questions.map(function (question) {
            return question.id;
          });

          // return random question
          models.Question.findOne({
            where: {
              id: {
                // Array cannot have a length of 0 without breaking shit
                // in mysql ie NOT IN (NULL) doesn't work
                // NOT IN (0) will work
                notIn: (questionIDs.length > 0)? questionIDs : [0]
              }
            },
            order: [ Sequelize.fn('RAND'), ]
          }).then(function (rQuestion) {
            console.log('Random Question: ');
            console.log(rQuestion);
            if (rQuestion !== null) {
              returnData['question'] = rQuestion;
              returnData['status'] = 'question loaded';

              userInstance.addQuestion(rQuestion)
                .then(function () {
                  res.json(returnData);
                });
            } else {
              returnData['status'] = 'empty';
              res.json(returnData);
            }
          });
        });
    } else {
      models.Question.findOne({
        order: [Sequelize.fn('RAND'),]
      })
      .then(function (question) {
        returnData['question'] = question;
        return userInstance.addQuestion(question);
      })
      .then(function () {
        returnData['status'] = 'question loaded';
        res.json(returnData);
      });
    } // close if/else statement
  }); // close .spread
}); // close post route

router.post('/reset', function (req, res, next) {
  // TODO Fix this endpoint!
  // are taking data

  var data = req.body;
  var affectedAnswers = [];
  var gUser;
  console.log('User to reset: ');
  console.log(data.fingerprint);
  User.findOne({
    where: {
      ident: data.fingerprint
    }
  }).then(function (user) {
    gUser = user;
    user.setQuestions([]); // clear all associated questions
    // Remove results from all affected answers
    return user.getAnswers()
      .then(function (answers) {
        console.log('The answers affected: ');
        console.log(answers);
        Promise.each(answers, function (answer) {
          // load answer instances into global
          affectedAnswers.push(answer);
          return answer.remove(gUser);
        });
        gUser.setAnswers([]);
      });
  }).then(function () {
    // fire response
    res.json({'status': 'done'});

  });

});

router.post('/submit', function (req, res, next) {
  var data = req.body;
  console.log(data);
  res.json({status: 'done'});
});
module.exports = router;
