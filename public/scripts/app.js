$(function() {
  function createDropdownForm() {
    var uniqueId = generateUniqueId();
    var formOutput = $('<form>')
      .attr('class', 'dropdown')
      .attr('method', 'POST')
      .attr('name', uniqueId)
      .attr('action', 'todos');

    console.log("Form: ", formOutput[0]);

    // The dropdownButton is the button itself while the divDropdown is the container for the buttons that will drop down on click
    var dropdownButton = createDropdownButton();
    var divDropdown = createDivDropdown();

    formOutput.append(dropdownButton);
    formOutput.append(divDropdown);
    return formOutput;
  }

  function generateUniqueId() {
    var output = "";
    var alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++) {
      output += alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
    }

    return output;
  }

  function createDropdownButton() {
    var dropdownButtonOutput = $('<button>')
      .attr('id', 'dropdownMenuButton')
      .attr('class', 'btn btn-secondary dropdown-toggle')
      .attr('type', 'button')
      .attr('data-toggle', 'dropdown')
      .attr('aria-haspopup', 'true')
      .attr('aria-expanded', 'false');

    var editIcon = createEditIcon()

    dropdownButtonOutput.append(editIcon);
    return dropdownButtonOutput;
  }

  function createEditIcon() {
    var iconOutput =$('<i>')
      .attr('class', 'far fa-edit');
    return iconOutput;
  }

  function createDivDropdown() {
    var dropdownDivOutput = $('<div>')
      .attr('class', 'dropdown-menu')
      .attr('aria-labelledby', 'dropdownMenuButton');

    var buttonToEat = createSubmitButton("Eat");
    var buttonToWatch = createSubmitButton("Watch");
    var buttonToRead = createSubmitButton("Read");
    var buttonToBuy = createSubmitButton("Buy");

    dropdownDivOutput.append(buttonToEat);
    dropdownDivOutput.append(buttonToWatch);
    dropdownDivOutput.append(buttonToRead);
    dropdownDivOutput.append(buttonToBuy);

    return dropdownDivOutput;
  }

  function createSubmitButton(category) {
    var submitButtonOutput = $('<button>')
      .attr('class', 'dropdown-item')
      .attr('type', 'submit')
      .attr('name', category)
      .text("To " + category);
    return submitButtonOutput;
  }

  function createListElement(content) {
    var listElementOutput = $("<li>");
    listElementOutput.attr('class', 'list-group-item')
      .attr('name', uniqueId)
      .append($('<p>').text(content));

    var newForm = createDropdownForm();
    listElementOutput.append(newForm);
    return listElementOutput;
  }

  function addToList(listName, todoContent) {
    var listElement = createListElement(todoContent);

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
      case "To Buy":
        $('#to-buy').append(listElement);
        break;
      default:
        $('#uncategorized').append(listElement);
        break;
      }
  }


  $("form#new-list-item").on("submit", function(event) {
    event.preventDefault();

    var input = $(this).children("input");;

    /*
      API LOGIC HERE
    */

    var category = "To Read";
    addToList(category, input.val());

    $.post('/todos').done(function() {
      input.val("");
    });
  });

  // Event delegation example. Needs to be replaced with delete/complete code
  // $('ul.list-group').on('click', 'li', function(event) {
  //   var li = $(event.target);
  //   li.toggleClass('done');
  //   $.post('todos').done(function() {
  //
  //   });
  // });
});
