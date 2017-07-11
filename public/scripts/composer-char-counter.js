
$(document).ready(function() {
  $('.new-tweet').on('keyup', 'textarea', function() {
    charsLimit = 140
    charsLeft = charsLimit - $(this).val().length
    //counter = $(this).parent().children('.counter')
    counter = $(this).siblings('.counter')
    counter.text(charsLeft)
    if (charsLeft < 0) {
      counter.css({'color': 'red'})
    } else {
      counter.css({'color': 'black'})
    }
  })
})