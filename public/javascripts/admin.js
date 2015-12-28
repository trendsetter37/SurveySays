// Testing template script additions
/* Working */

$(function () {
    var choiceCount = 2; // number of next/additional choice
    var fieldset = $('#qChoices');
    var prefix = '<div class="row collapse" id="wrapper">';
    var suffix = '</div>';

    $('body').on('click', '#add i', function () {
      var input = '<div class="small-10 columns">' +
      '<input type="text" placeholder="Choice ' + choiceCount + '">' +
      '</div>' + // Closes text input column
      '<div class="small-2 columns">' +
      '<span class="button secondary postfix" id="rmChoice">' +
      '<i class="fa fa-times"></i>' +
      '</span>' +
      '</div>'; // Closes postfix column
      var choiceAddition = prefix + input + suffix;
      $(choiceAddition).appendTo(fieldset);
      choiceCount++;
      return false;
    });

    $('body').on('click', '#rmChoice', function () {
        if (choiceCount > 2) {
          $(this).parents('#wrapper').remove();
          choiceCount--;
        }
        return false;
    });
});
