(function ($) {

    var app = $.sammy('#spa', function () {
    // plugins
    this.use('Template');
    this.use(Sammy.JSON);

    // Events: Implent bindings and triggers to update templates
    this.bind('update-table', function (event, data) {
      var table = $('#tableData');
      app.log(data);
      // Load data into tableData
      if (data.length !== 0) {
        table.html('');
        this.renderEach('templates/client/table-rows.template', data)
          .appendTo(table);
      } else {
        table.html('<tr><td>None</td></tr>');
      }

    });

    /*********************** routes *****************************************/
    this.get('#/new-question', function (context) {
      context.partial('templates/client/new.template');
    });


    this.get('#/find-question', function (context) {
      context.partial('templates/client/find.template');
    });

    this.get('#/results', function (context) {
      context.partial('templates/client/results.template');
    });

    this.post('#/find-question', function (context) {
      context.log('Entered find-question post route');
      context.log(this.params);

      // go get the data from db
      $.ajax({
        url: '/admin/find',
        type: 'POST',
        data: this.json(this.params),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          context.log('Results: ' + data.length);
          //context.log(data);
          // trigger dom update!
          context.trigger('update-table', data);
        },
        error: function (e) {
          context.log(e);
        }

      });
    });

    this.post('#/new-question', function (context) {
      context.log('Entered new question post route');
      $.ajax({
        url: '/admin/new',
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

    this.notFound = function () {
      // Sammy Quirk
    }
    /************************ End Routes ***********************************/
  });

  $(function() {
    app.run();
  });
})(jQuery);
