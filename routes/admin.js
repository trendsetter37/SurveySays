var express = require('express');
var router = express.Router();
var models = require('../models');

/* Admin page */

/************************ GET ***************************/
router.get('/', function(req, res, next) {
    res.render('admin', {title: 'Admin page'});
});

router.get('/find/:id', function (req, res, next) {
  var id = parseInt(req.params['id'], 10);
  models.Question.findAll({
    where: {
      id: id
    },
    include: [{model: models.Answer}]
  })
    .then(function (results) {
      res.json(results);
    });
});

/********************* POST ******************************/
router.post('/new', function (req, res, next) {
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

router.post('/find', function (req, res, next) {
  var data = req.body;

  models.Question.findAll({
    where: {
      query: {
        $like: '%' + data.query + '%'
      }
    },
    include : [{model: models.Answer}]
  }).then(function (results) {
    if (results) {
      res.json(results);
    } else {
      res.json({'status': 'error'});
    }
  });
});

router.post('/edit', function (req, res, next) {
  var data = req.body;

  // Find question to edit
  models.Question.update({
    query: data.query
    },{
    where: {
      id: data['query_id']
    },
    include: [{model: models.Answer}]
  });
  for (answer of data['answer_id']) {
    var answer_id = parseInt(answer, 10);
    models.Answer.update({
      choice: data[answer_id]
    }, {
      where: {
        id: answer_id
      }
    });
  }
  res.json({'status': 'done'});
});


var jsonify = function (result) {
  return JSON.stringify(result);
}

module.exports = router;
