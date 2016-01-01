var express = require('express');
var router = express.Router();
var models = require('../models');

/* Admin page */
router.get('/', function(req, res, next) {
    res.render('admin', {title: 'Admin page'});
});

router.post('/', function (req, res, next) {
  /* Receive a json with question data */
  /* json example:
    { question: "Some query",
      answers: ["First answer", "second", "third"]}
  */

  var data = req.body; // object


  var responseObject = {};


  // Enter question info into database

  models.Question.create({
      query: data.question
  }).then(function (newQuestion) {
    responseObject['question'] = newQuestion;
    responseObject['answers'] = [];

    for (var key in data) {
        if (key.indexOf('choice') !== -1) {
          newQuestion.createAnswer({choice: data[key]});
          responseObject['answers'].push(data[key]);
        }
    }
    res.json(jsonify(responseObject));
  });
});



var jsonify = function (result) {
  return JSON.stringify(result);
}

module.exports = router;
