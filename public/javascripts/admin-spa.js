(function ($) {
    var SearchPlugin = function (app) {

      this.helpers({
        updateSearchResults: function (data, action) {
          // Action will determine what to do with the datas
          // action = 'delete', 'add', 'etc.'

          var tableResults = app.session('search-results', function () {
            return {};
          });

          if ('delete' === action) {

            if (tableResults.length !== 0) {
              tableResults = tableResults.filter(function (result) {
                return data.id !== result.id;
              });
            }
            app.session('search-results', tableResults);

          } else if ('add' === action) {
              app.log('Add was the action');
              tableResults.push(data);
              app.session('search-results', tableResults);
          }
        } // close updateSearchResults

      });
    };

    var app = $.sammy('#spa', function () {
    // plugins
    this.use('Template');
    this.use(Sammy.JSON);
    this.use('Storage');
    this.use('Session');
    this.use(SearchPlugin);

    /*********************** Events *****************************************/
    // Event cleanup check
    this.bind('update-table', function (context) {
      /** Structure of tableResults
       * {
       *   answers: [ "Some answer", "Another" ]
       *   createdAt: "2016-01-08T20:27:22.000Z",
       *   id: 3,
       *   query: "A third question",
       *   updatedAt: "2016-01-08T20:27:22.000Z",
       * }
       */
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

    this.bind('deletion-update', function () {
      app.log('Entered deletion update binding');
    });

    this.bind('back-to-find', function (context) {
      app.log('This is where you go back');
      context.partial('templates/client/find.template');
    });
    /*********************** Routes *****************************************/
    this.get('#/delete-question/:id', function (context) {
      // Delete question

      $.ajax({
        url: 'admin/delete',
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json(this.params),
        success: function (returnData) {
          context.updateSearchResults(returnData, 'delete');
          context.trigger('update-table');
          context.redirect('#/find-question');
        },
        error: function (error) {
          context.log(error);
        }
      });
    });

    this.get('#/edit-question/:id', function (context) {
      var id = this.params['id'];
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

    this.get('#/find-question', function (context) {
      var tableResults = context.session('search-results', function () {
        return {};
      });
      if (tableResults.length > 0) {
        context.partial('templates/client/find.template', {data: tableResults});
      } else {
        context.partial('templates/client/find.template', {data: 'empty'});
      }
    });

    this.get('#/new-question', function (context) {
      context.partial('templates/client/new.template');
    });

    /************************ POST Routes ***********************************/
    this.post('#/edit-question', function (context) {

      // Send to backend
      $.ajax({
        url: '/admin/edit',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json(this.params),
        success: function (returnData) {
          context.redirect('#/find-question');
        },
        error: function (error) {
          context.log(error);
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
        success: function (returnData) {
          // Persist Results
          context.session('search-results', returnData);
          // trigger dom update!
          context.trigger('update-table', context);
          //context.$element('table').trigger('update');
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
        success: function (returnData) {
          context.updateSearchResults(returnData, 'add');
          context.trigger('update-table', context);
          context.partial('templates/client/new.template');
        },
        error: function (error) {
          context.log(error);
        }
      });

    });

    this.post('#/question-results', function (context) {
      /* go get the results for said question id */
      context.log('Results for: ');
      context.log(this.params['id']);
      context.log('Modal hit');
      context.render('templates/client/results.template');
    });

    this.notFound = function () {
      // Sammy Quirk
    }
  });

  // DOM Ready
  $(function() {
    app.run();
  });
})(jQuery);
