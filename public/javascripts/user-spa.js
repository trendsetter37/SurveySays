(function ($) {
  var app = $.sammy('#main-spa', function () {
    this.use('Template');
    this.use(Sammy.JSON);
    this.use('Storage');
    this.use('Session');
    // App shit
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

    this.post('#/survey', function (context) {
      var fingerprint = this.params['fingerprint'];
      context.session('fingerprint', fingerprint);
      // Send to DB for identification
      // TODO
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
