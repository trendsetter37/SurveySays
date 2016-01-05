(function ($) {
    var SearchPlugin = function (app) {

      this.helpers({
        updateSearchResults: function (data, action) {
          // Action will determine what to do with datas
          // action = 'delete', 'etc.'
          if ('delete' === action) {
            // query_id should be contained within data as a key
            var tableResults = app.session('search-results', function () {
              return {};
            });
            if (tableResults.length !== 0) {
              tableResults = tableResults.filter(function (result) {
                return data.query_id !== result.id;
              });
            }
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
        // store table html for back button
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
    this.get('#/new-question', function (context) {
      context.partial('templates/client/new.template');
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

    this.get('#/results', function (context) {
      // Place holder for results page route
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

    this.get('#/delete-question/:id', function (context) {
      // Delete question
      
      $.ajax({
        url: 'admin/delete',
        type: 'POST',
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
    /************************ POST Routes ***********************************/
    this.post('#/edit-question', function (context) {
      // Check the datas
      //context.log(this.params);

      // Send to backend
      $.ajax({
        url: '/admin/edit',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: this.json(this.params),
        success: function (data) {
          context.partial('templates/client/find.template');
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
          context.trigger('update-table', context);
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
          context.partial('templates/client/new.template');
        },
        error: function (e) {
          context.log(e);
        }
      });

    });


    this.notFound = function () {
      // Sammy Quirk
    }
  });

  /**************************    DRY     ***********************************/

/*
  function postHelper(context, data, url, verb, template) {
    // Check optional template variable
    var template = (typeof template === 'undefined')? '' : template;
    $.ajax({
      url: url,
      type: verb,
      dataType: 'json',
      contentType: 'application/json',
      data: data,
      success: function (returnData) {
        context.partial(template, returnData);
      },
      error: function (error) {
        context.partial('templates/client/error.template', error);
      }
    });
  }

  var updateSearchResults = function (context, data, action) {
    // action will delete or something else
    // determines what to do with the data
    context.log('Entered into update search function');
    if ('delete' === data) {
      // deletion data
      var searchResults = context.session('search-results');
      context.log(searchResults);
      for (result in searchResults) {
        context.log(result);
      }
    }
  }
  */

  /******************************* Plugins *****************************/


  // DOM Ready
  $(function() {
    app.run();
  });
})(jQuery);
