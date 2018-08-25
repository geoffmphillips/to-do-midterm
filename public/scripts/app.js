$(function() {


  // Event delegation example. Needs to be replaced with delete/complete code
  $('ul.list-group').on('click', 'form', function(event) {
    var li = $(event.target);
    console.log(li[0]);
    $.ajax({
      action: 'todos/',
      method: 'delete',
    }).done(function() {

    });
  });
});
