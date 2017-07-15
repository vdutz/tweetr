
$(document).ready(function() {
  $('.new-tweet').on('keyup', 'textarea', function() {
    charsLimit = 140;
    charsLeft = charsLimit - $(this).val().length;
    counter = $(this).siblings('.counter');
    counter.text(charsLeft);
    if (charsLeft < 0) {
      counter.addClass("color-danger");
    } else {
      counter.removeClass("color-danger");
    }
  })
})