var fieldsetTag = $('#qChoices');
var i = $('#qChoices p').size() + 1;

$('body').on('click', '#add p', function() {
        alert('Clicked');
        $('<p><input type="text" id="pChoice" name="p_choice_' + i +'" value="" placeholder="Choice" /><a href="#" id="remScnt">Remove</a></p>')
            .appendTo(fieldsetTag);
        i++;
        return false;
});

$('body').on('click', '#remScnt', function() {
        if( i > 2 ) {
                $(this).parents('p').remove();
                i--;
        }
        return false;
});
