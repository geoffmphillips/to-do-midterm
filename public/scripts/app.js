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

  function createListElement(todoText) {
    var output = $('<li>')
      .attr('class', 'list-group-item')
      .text(todoText);

    var form = createForm();
    output.append(form);
    return output;
  }

  function renderList(listName, todoText) {
    var listElement = createListElement(todoText);

    switch (listName) {
      case "To Eat":
        $('#to-eat').append(listElement);
        break;
      case "To Watch":
        $('#to-watch').append(listElement);
        break;
      case "To Read":
        $('#to-read').append(listElement);
        break;
      case: "To Buy":
        $('#to-buy').append(listElement);
        break;
      default:
        $('#uncategorized').append(listElement);
        break;
    }
  }

  $("form#new-list-item").on("submit", function(event) {
    event.preventDefault();

    var todoElement = $(this).children("input");
    var todoText = todoElement.val();

    /*
      API LOGIC HERE
    */

    var category;

    $.post('/todos').done(function() {
      todoText.val("");
      renderList("To Eat", todoText);
    });
  });

  // Event delegation example. Needs to be replaced with delete/complete code
  $('ul.list-group').on('click', 'li', function(event) {
    var li = $(event.target);
    li.toggleClass('done');
    $.post('todos').done(function() {

    });
  });
});
