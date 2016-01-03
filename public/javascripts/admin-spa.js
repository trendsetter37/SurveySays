(function ($) {

    var app = $.sammy('#spa', function () {
    // plugins
    this.use('Template');
    this.use(Sammy.JSON);
    this.use('Storage');
    this.use('Session');

    // Events: Implent bindings and triggers to update templates
    /*********************** Events *****************************************/
    this.bind('update-table', function () {
      var tableResults = app.session('search-results', function () {
        return {};
      });
      var table = app.$element('#tableData');
      // Load data into tableData
      if (tableResults.length !== 0) {
        table.html('');
        this.renderEach('templates/client/table-rows.template', tableResults)
          .appendTo(table);
      } else {
        table.html('<tr><td colspan="4">No Results</td></tr>');
      }
    });

    /*********************** Routes *****************************************/
    this.get('#/new-question', function (context) {
      context.partial('templates/client/new.template');
    });
    this.get('#/find-question', function (context) {
      var tableResults = context.session('search-results', function () {
        return {};
      });
      context.partial('templates/client/find.template');
    });

    this.get('#/results', function (context) {

    });

    this.get('#/edit-question/:id', function (context) {

      var id = this.params['id'];
      // hit database
      $.ajax({
        url: '/admin/find/' + id,
        type: 'GET',
        success: function (data) {
          context.partial('templates/client/question.template', {
            data: data
          });
        },
        error: function (e) {
          context.log(e);
        }
      });
    });
    /************************ POST Routes ***********************************/
    this.post('#/edit-question', function (context) {
      // Check the datas
      context.log(this.params);

      // Send to backend
      $.ajax({
        url: '/admin/edit',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json(this.params),
        success: function (data) {
          context.log('new question');
          context.log(data);
        },
        error: function (e) {
          context.log(e);
        }
      });
    });

    this.post('#/find-question', function (context) {

      // go get the data from db
      $.ajax({
        url: '/admin/find',
        type: 'POST',
        data: this.json(this.params),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          // Persist Results
          context.session('search-results', data);
          // trigger dom update!
          context.trigger('update-table');

        },
        error: function (e) {
          context.log(e);
        }

      });
    });

    this.post('#/new-question', function (context) {

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
  // DOM Ready
  $(function() {
    app.run();
  });
})(jQuery);
