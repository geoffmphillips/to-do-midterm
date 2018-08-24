$(function() {

  function createForm() {
    var output = $('<form>')
      .attr('class', 'dropdown')
      .attr('method', 'POST')
      .attr('action', 'todos');

    var dropdownMenu = createDropdownMenu();
    var divDropdown = createDivDropdown();

    output.append(dropdownMenu);
    output.append(divDropdown);
    return output;
  }

  function createDropdownMenu() {
    var output = $('<button>')
      .attr('id', 'dropdownMenuButton')
      .attr('class', 'btn btn-secondary dropdown-toggle')
      .attr('type', 'button')
      .attr('data-toggle', 'dropdown')
      .attr('aria-haspopup', 'true')
      .attr('aria-expanded', 'false');

    var editIcon = createEditIcon()
    output.append(editIcon);
    return output;
  }

  function createEditIcon() {
    var output =$('<i>')
      .attr('class', 'far fa-edit');
    return output;
  }

  function createDivDropdown() {
    var output = $('div')
      .attr('class', 'dropdown-menu')
      .attr('aria-labelledby', 'dropdownMenuButton')

    var buttonToEat = createSubmitButton("Eat");
    var buttonToWatch = createSubmitButton("Watch");
    var buttonToRead = createSubmitButton("Read");
    var buttonToBuy = createSubmitButton("Buy");

    output.append(buttonToEat);
    output.append(buttonToWatch);
    output.append(buttonToRead);
    output.append(buttonToBuy);

    return output;
  }

  function createSubmitButton(category) {
    var output = $('<button>')
      .attr('class', 'dropdown-item')
      .attr('type', 'submit')
      .attr('name', category)
      .text("To " + category);
    return output;
  }

  function createListElement(todo) {
    var output = $('<li>')
    .attr('class', 'list-group-item')
    .text(todo);

    var form = createForm()
    output.append(form)
    return output;
  }


  `<li class="list-group-item">Cras justo odio
    <form class="dropdown" method="POST" action="todos">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button type="submit" class="dropdown-item" name="eat">To Eat</button>
        <button type="submit" class="dropdown-item" name="watch">To Watch</button>
        <button type="submit" class="dropdown-item" name="read">To Read</button>
        <button type="submit" class="dropdown-item" name="category">To Buy</button>
      </div>
    </form>
  </li>`

    // $.get('todos').done(function() {
    //
    // });

    // var tweetText = textArea.val();
    // var data = textArea.serialize();
    // var error = $(this).siblings(".error");
    // var counter = textArea.siblings(".counter");
    //
    // if (error.text() !== "") {
    //   error.slideUp("fast");
    // }
  $('form.form-container').on('submit', function(event) {
    event.preventDefault();

    var todoText = String($(this).children('input').val());
    console.log(todoText);

  });

  $('ul.list-group').on('click', 'li', function(event) {
    var li = $(event.target);
    li.toggleClass('done');
    $.post('todos').done(function() {

    });
  });
});
