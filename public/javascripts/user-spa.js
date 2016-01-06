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

      if (fingerprint !== 'none') {
        context.partial('templates/client/survey.template', {fingerprint: fingerprint});
      }
      else {
        context.partial('templates/client/survey.template', {fingerprint: 'none'});
      }
    });

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
          if (returnData.status !== 'error') {
            context.session('random-question', returnData);
            // TODO Trigger screen update with question
            context.log('Return data: ');
            context.log(returnData);
          } else {
            context.partial('templates/client/error.template');
          }
        },
        error: function (error) {
          context.log(error);
        }
      });

      // Go to survey question route with info in session
      context.redirect('#/survey-question');
    });



    this.notFound = function () {
      // SQ
    };
  });
  $(function () {
    app.run();
  });
})(jQuery);
