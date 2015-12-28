// Testing template script additions
/* Working */

$(function () {
    var choiceCount = 2; // number of next/additional choice
    var fieldset = $('#qChoices');
    var prefix = '<div class="row" id="wrapper">' +
    '<div class="small-10 small-centered medium-10 medium-centered columns">';
    var suffix = '</div></div>';


    $('body').on('click', '#add i', function () {
        var input = '<div class="row collapse" id="wrapper">' +
        '<div class="small-8 meduium-8 columns">' +
        '<input type="text" placeholder="Choice '
        + choiceCount + '"></div>' +
        '<div class="small-4 medium-4 columns">' +
        '<a href="#" class="button postfix" id="rmChoice"><i class="fa fa-times-circle">' +
        '</i></a></div></div>';
        var choiceAddition = prefix + input + suffix;
        //var choiceAddition = input;
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
