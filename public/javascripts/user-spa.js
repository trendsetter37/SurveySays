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

      context.partial('templates/client/survey.template', {
        fingerprint: fingerprint,
        data: questionData
      });
    });

    /***************************** Post Routes *******************************/


    this.post('#/random-question', function (context) {
      var fingerprint = this.params['fingerprint'];
      context.session('fingerprint', fingerprint);
      // Send to DB for identification
      // TODO
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
      context.log('Fire Reset!');
      context.log('Current User: ');
      context.log(context.session('fingerprint'));

      $.ajax({
        url: '/survey/reset',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json({fingerprint: context.session('fingerprint')}),
        success: function (returnData) {
          context.log('Successful reset!');
        },
        error: function (error) {
          context.log(error);
        }
      });
      context.redirect('/');
    });

    this.post('#/submit-answer', function (context) {
      // Send Results to server then redirect to done screen

    });

    this.notFound = function () {
      // SQ
    };
  });
  $(function () {
    app.run();
  });
})(jQuery);
