$(function() {

  function createForm() {
    var output = $('<form>')
      .attr('class', 'dropdown')
      .attr('method', 'POST')
      .attr('action', 'todos');

    // The dropdownButton is the button itself while the divDropdown is the container for the buttons that will drop down on click
    var dropdownButton = createDropdownButton();
    var divDropdown = createDivDropdown();

    output.append(dropdownButton);
    output.append(divDropdown);
    return output;
  }

  function createDropdownButton() {
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

  $.get('todos').done(function() {

  });


  $('ul.list-group').on('click', 'li', function(event) {
    var li = $(event.target);
    li.toggleClass('done');
    $.post('todos').done(function() {

    });
  });
});
