var express = require('express');
var Sequelize = require('sequelize');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');

/* Survey Page */

router.post('/random-question', function (req, res, next) {
  var data = req.body;
  var returnData = {};
  var gUser;
  var randomQ;

  models.User.findOrCreate({
    where: {
      ident: data.fingerprint
    },
    include: [{model: models.Question}]
  })
  .spread(function (userInstance, created) {
    // created is a boolean. Was this instance just created?
    if (!created) {
      gUser = userInstance;
      userInstance.getQuestions()
        .then(function (questions) {

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
            returnData['question'] = rQuestion;
            randomQ = rQuestion;
            if (rQuestion !== null) {
              rQuestion.getAnswers()
                .then(function (answers) {
                  returnData['answers'] = [];
                  return Promise.each(answers, function (answer) {
                    returnData['answers'].push({id: answer.id, choice: answer.choice});
                  });

                }).then(function () {
                  returnData['status'] = 'question loaded';
                  gUser.addQuestion(randomQ)
                    .then(function () {
                      res.json(returnData);
                    });
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

  var data = req.body;
  var affectedAnswers = [];
  var gUser;

  models.User.findOne({
    where: {
      ident: data.fingerprint
    }
  }).then(function (user) {
    gUser = user;
    user.setQuestions([])
      .then(function () {
        user.getAnswers()
          .then(function (answers) {
            return Promise.each(answers, function (answer) {
              // load answer instances into global
              affectedAnswers.push(answer);
              return answer.removeUser(gUser);
            });
          }).then(function () {
            gUser.setAnswers([])
              .then(function () {
                res.json({'status': 'done'});
              });
          });
      });
  });
});

router.post('/submit', function (req, res, next) {
  var data = req.body;
  models.User.findOne({
    where: {
      ident: data.user
    }
  }).then(function (user) {
    models.Answer.findById(data.answerID)
      .then(function (answer) {
        answer.increment('picked')
          .then(function (answer) {
            return user.addAnswer(answer);
          }).then(function () {
            res.json({'status': 'done'});
          });
      });
  });

});

module.exports = router;
