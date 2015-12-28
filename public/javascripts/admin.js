// Testing template script additions
/* Working */

$(function () {

    /* Question Entering stuff */
    var choiceCount = 2; // number of next/additional choice
    var fieldset = $('#qChoices');
    var prefix = '<div class="row collapse" id="wrapper">';
    var suffix = '</div>';

    $('body').on('click', '#add i', function (event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        var input = '<div class="small-10 medium-10 columns">' +
        '<input type="text" class="pChoice" placeholder="Choice ' + choiceCount + '">' +
        '</div>' + // Closes text input column
        '<div class="small-2 medium-10 columns">' +
        '<span class="button secondary postfix" id="rmChoice">' +
        '<i class="fa fa-times"></i>' +
        '</span>' +
        '</div>'; // Closes postfix column
        var choiceAddition = prefix + input + suffix;
        $(choiceAddition).appendTo(fieldset);
        choiceCount++;
    });

    $('body').on('click', '#rmChoice', function () {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        if (choiceCount > 2) {
          $(this).parents('#wrapper').remove();
          choiceCount--;
        }
    });

    $('body').on('click', '#submit', function (event) {
      event.preventDefault();
      /* Run some validation blah blah */

      /* Create json object and then stringify */
      var queryData = {};
      queryData['question'] = $('#query').val();
      queryData['answers'] = [];

      $('#qChoices *').filter(':input').each(function () {
        queryData.answers.push($(this).val());
      });
      //console.log(queryData); // Checks out

      $.ajax({

          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(queryData),
          dataType: "json",
          success: function (data) {
            console.log(data); // json string
          },
          error: function (e) {
            console.log(e);
          }
      });
    });


});
