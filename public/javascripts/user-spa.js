(function ($) {
  var app = $.sammy('#main-spa', function () {
    this.use('Template');
    this.use(Sammy.JSON);
    this.use('Storage');
    this.use('Session');

    /**************************** Bound Events *****************************/
    this.bind('show-question', function () {
      // render the random question received from server
      // using the value stored in the session
    });

    /**************************** Routes ***********************************/
    this.get('#/survey-question', function (context) {
      context.log('Enter survey area!');
      var fingerprint = context.session('fingerprint', function () {
        return 'none';
      });
      var questionData = context.session('random-question');
      context.log('Question Data: ');
      context.log(questionData);
      if (questionData !== null) {
        context.partial('templates/client/survey.template', {
          fingerprint: fingerprint,
          data: questionData
        });
      } else {
        context.partial('template/client/empty.template');
      }
    });

    /***************************** Post Routes *******************************/

    this.post('#/random-question', function (context) {
      var fingerprint = this.params['fingerprint'];
      context.session('fingerprint', fingerprint);
      context.log('Sending: ');
      context.log(fingerprint);
      $.ajax({
        url: '/survey/random-question',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json({fingerprint: fingerprint}),
        success: function (returnData) {
          /* { question: 'some random question',
               answers: ['answer1', 'answer2', 'answer3']
             }
           */
           context.log('return data from ajax: ');
           context.log(returnData);
          if (returnData.status === 'question loaded') {
            context.session('random-question', returnData);
            // TODO Trigger screen update with question
            context.log('Return data: ');
            context.log(returnData);
            // Go to survey question route with info in session
            context.redirect('#/survey-question');
          } else {
            context.partial('templates/client/empty.template');
          }
        },
        error: function (error) {
          context.log(error);
        }
      });
    });

    this.post('#/reset-survey', function(context) {
      // fire reset for the current user in the in the db
      context.log(context.session('fingerprint'));

      $.ajax({
        url: '/survey/reset',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json({fingerprint: context.session('fingerprint')}),
        success: function (returnData) {
          context.clearSession();
          context.partial('templates/client/done.template');
        },
        error: function (error) {
          context.log(error);
        }
      });
    });

    this.post('#/submit-answer', function (context) {
      // Send Results to server then redirect to done screen
      var chosenAnswerID = this.params['choice'];

      $.ajax({
        url: '/survey/submit',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json({
          answerID: chosenAnswerID,
          user: context.session('fingerprint')
        }),
        success: function (returnData) {
          context.log('Answer submitted!');
          context.log(returnData);
          context.partial('templates/client/done.template');
        },
        error: function (error) {
          context.log(error);
          context.partial('templates/client/error.template', {error: error});
        }
      });
    });

    this.notFound = function () {
      // SQ
    };
  });
  $(function () {
    app.run();
  });
})(jQuery);
