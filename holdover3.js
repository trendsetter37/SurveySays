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
    if (created) {

      model.Question.findOne({
        order: [Sequelize.fn('RAND')]
      })
      .then(function (question) {
        userInstance.addQuestion(question);
        returnData['question'] = question;
        res.json(returnData);
      });
    } else {

      userInstance.getQuestions()
        .then(function (questions) {
          console.log('seen questions are: ');
          console.log(questions);
          var questionIDs = questions.map(function (question) {
            return question.id;
          });
          return questionIDs;
        })
        .then(function (questionIDs) {

          models.Question.findOne({
            where: {
              id: {
                not: questionIDs
              }
            },
            order: [ Sequelize.fn('RAND'), ]
          })
          .then(function (rQuestion) {
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

            }); // close rQuestion

        }); // close questionIDs then

    }); // close userInstance spread
  }); // close spread
