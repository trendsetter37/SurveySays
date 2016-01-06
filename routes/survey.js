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
    console.log('User: ');
    console.log(userInstance);
    console.log('Created: ');
    console.log(created);
    models.Question.findOne({
      order: [
        Sequelize.fn('RAND'),
      ]
    }).then(function (question) {


      returnData['question'] = question;
      userInstance.addQuestion(question)
        .then(function () {
          console.log('done');
          returnData['status'] = 'done';
          res.json(returnData);
        });

    });

  });
  //res.json({status: 'skipped'});
});

module.exports = router;
