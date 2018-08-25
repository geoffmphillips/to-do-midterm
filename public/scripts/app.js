$(function() {

  // Event delegation example. Needs to be replaced with delete/complete code
  $('ul.list-group').on('click', 'li', function(event) {
    var li = $(event.target);
    li.remove();
    $.ajax('todos').done(function() {

    });
  });
})
