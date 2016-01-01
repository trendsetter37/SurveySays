(function ($) {
    /*var NewQuestionPlugin = function(app) {
      this.helpers = {
        alert: function(divID) {
          this.log('Button was clicked!');
        }
      }
    }*/


    var app = $.sammy('#spa', function () {
    // plugins
    this.use('Template');
    this.use(Sammy.JSON);

    // routes
    this.get('#/new-question', function (context) {
      context.partial('templates/client/new.template');
    });

    this.post('#/new-question', function (context) {

      $.ajax({
        url: '/admin',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json(this.params),
        success: function (data) {
          context.log('Return data ', data);
        },
        error: function (e) {
          context.log(e);
        }
      });
      context.log('done');

    });

    this.get('#/find-question', function (context) {
      context.partial('templates/client/find.template');
    });

    this.get('#/results', function (context) {
      context.partial('templates/client/results.template');
    });

    this.notFound = function () {
      // Sammy Quirk
    }

  });

  $(function() {
    app.run();
  });
})(jQuery);
