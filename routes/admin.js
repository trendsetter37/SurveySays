var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');


/* Admin page */

/*********************** DELETE *************************/
router.delete('/delete', function (req, res, next) {
  // Delete the question
  var data = req.body;
  var returnData = {};

  models.Question.findOne({
    where: {
      id: data.id
    },
    include: [{model: models.Answer}]
  }).then(function (result) {
    result.destroy().then(function (confirmation) {
      returnData['id'] = confirmation.id
      returnData['answer_ids'] = []; // may need this later?

      Promise.each(confirmation.answers, function (answer) {
        return answer.destroy()
          .then(function (answerConfirmation) {
            returnData['answer_ids'].push(answerConfirmation.id);
          });
      }).then(function () {
        returnData['status'] = 'done';
        res.json(returnData);
      });
    });
  }).catch(function (e) {
    // Something went wrong
    responseData['error'] = e;
    responseData['status'] = 'Error';
    res.json(responseData);
  });

}); // close delete post route

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

router.get('/find/all', function (req, res, next) {
  models.Question.findAll({})
    .then(function (questions) {
      console.log(questions);
    });
});
/********************* POST ******************************/
router.post('/new', function (req, res, next) {
  /* Receive a json with question data */
  /* json example:
    { question: "Some query",
      answers: ["First answer", "second", "third"]}
  */

  /** Output into the below form
   * (compatible with this.bind('update-table') function)
   * location: public/javascripts/admin-spa.js 42:5
   *
   * {
   *   answers: [ "Some answer", "Another" ]
   *   createdAt: "2016-01-08T20:27:22.000Z",
   *   id: 3,
   *   query: "A third question",
   *   updatedAt: "2016-01-08T20:27:22.000Z",
   * }
   */

  var data = req.body; // object
  var responseObject = {};
  // Enter question info into database

  models.Question.create({
      query: data.question
  }).then(function (newQuestion) {
    responseObject['id'] = newQuestion.id;
    responseObject['query'] = newQuestion.query;
    responseObject['answers'] = [];

    for (var key in data) {
        if (key.indexOf('choice') !== -1) {
          newQuestion.createAnswer({choice: data[key]});
          responseObject['answers'].push(data[key]);
        }
    }
    res.json(responseObject);
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
  console.log('Edit data:');
  console.log(data)
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

router.post('/results', function (req, res, next) {
  // {question: 3} = data
  var data = req.body;
  var returnData = {};
  models.Question.findOne({
    where: {
      id: data.question
    }
  }).then(function (question) {
    returnData['query'] = question.query;
    returnData['id'] = question.id;
    returnData['answers'] = [];
    return question.getAnswers();
  }).then(function (answers) {
    // everything should be loaded for D3 barchart now
    for (answer of answers) {
      returnData['answers'].push(answer.dataValues);
    }
  }).then(function () {
    /**
     * Returned answer data structure:
     * returnData['answers'] =
     * [
     *   { picked: 1,
     *     choice: 'fake answer',
     *     createdAt: Datetime object,
     *     updatedAt: Datetime object,
     *     questionId: 3
     *   },
     *   {
     *     picked: 1,
     *     choice: 'another answer',
     *     createdAt: Datetime object,
     *     updatedAt: Datetime object,
     *     questionId: 3
     *   }
     * ]
     */
    res.render('modal', {data: JSON.stringify(returnData)});
  });

});

/* Try this for tablesorter filters */
router.post('/table-results', function (req, res, next) {

});

module.exports = router;
