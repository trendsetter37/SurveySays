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
  }).spread(function (userInstance, created) {
    // created is a boolean. Was this instance just created?

    userInstance.getQuestions()
      .then(function (questions) {

        var questionIDs = questions.map(function (question) {
          return question.id;
        });

        return models.Question.findOne({
          where: {
            id: {
              not: questionIDs
            }
          },
          order: [ Sequelize.fn('RAND'), ]
        });
      })
      .then(function (rQuestion) {
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
  //res.json({status: 'skipped'});
});

router.post('/reset', function (req, res, next) {
  // TODO Acutally conduct the reset when answer question
  // are taking data

  var data = req.body;
  console.log('User to reset: ');
  console.log(data.fingerprint);
  User.find({
    where: {
      id: data.fingerprint
    }
  }).then(function (user) {
    // Remove results from all affected answers
    return models.User.getQuestions();
  }).then(function (questions) {
    // TODO
  });
  res.json({'status': 'done'});

});

module.exports = router;
