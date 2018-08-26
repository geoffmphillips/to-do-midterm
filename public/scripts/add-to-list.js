$(function() {
  function createDropdownForm(id) {
    var output = $('<form>')
      .attr('class', 'dropdown')
      .attr('method', 'POST')

    // The dropdownButton is the button itself while the divDropdown is the container for the buttons that will drop down on click
    var dropdownButton = createDropdownButton();
    var divDropdown = createDivDropdown(id);

    output.append(dropdownButton);
    output.append(divDropdown);
    return output;
  }

  function createDeleteDiv (id, target) {
    var divOutput = $('<div>')

      //creates a unique event listener for every new div that gets made.
      //event listener deletes a specific li that was made earlier.
      divOutput.on("click", function(event) {
        event.preventDefault();

        $.post(`/todos/${id}/delete`).done(function(){});
        target.remove();
      })

    var deleteButton = createDeleteButton();

    divOutput.append(deleteButton);
    return divOutput;
  }

  function createDeleteButton() {
    var output = $('<button>')
      .attr('type', 'submit')
      .attr('class','btn btn-secondary delete')

    var trashIcon = createTrashIcon();

    output.append(trashIcon);
    return output;
  }

  function createTrashIcon() {
    var output = $('<i>')
      .attr('class', 'far fa-trash-alt');
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

  function createDivDropdown(id) {
    var output = $('<div>')
      .attr('class', 'dropdown-menu')
      .attr('aria-labelledby', 'dropdownMenuButton');

    var buttonToEat = createSubmitButton(id, "To Eat");
    var buttonToWatch = createSubmitButton(id, "To Watch");
    var buttonToRead = createSubmitButton(id, "To Read");
    var buttonToBuy = createSubmitButton(id, "To Buy");

    output.append(buttonToEat);
    output.append(buttonToWatch);
    output.append(buttonToRead);
    output.append(buttonToBuy);

    return output;
  }

  function createSubmitButton(id, category) {
    var output = $('<button>')
      .attr('class', 'dropdown-item')
      .attr('type', 'submit')
      .attr('name', 'category')
      .text(category)
      .attr('formaction', '/todos/'+ id + '/' + category)
      .attr("data-category", category)

    output.on("click", function(event) {
      event.preventDefault();
      var category = $(this).attr("data-category")
      var formattedCat = category.replace(" ", "-").toLowerCase()

      $(this).closest('li').appendTo(`#${formattedCat}`)

      $.post(`/todos/${id}/${category}`).done(function(){});

    })

    return output;
  }

  function createListElement(content, id) {
    var output = $("<li>");
    output.attr('class', 'list-group-item')
      .append($('<p>').text(content));

    var newEditForm = createDropdownForm(id);
    var newDeleteDiv = createDeleteDiv(id, output);
    output.append(newEditForm);
    output.append(newDeleteDiv);

    return output;
  }

  function addToList(todoList, todoContent, todoId) {
    var listElement = createListElement(todoContent, todoId);

    switch (todoList) {
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

  function renderLists(lists) {
    lists.forEach(function(todo) {
      addToList(todo.category, todo.name, todo.id);
    });
  }

  $.get("/todos").done(function(lists) {
    $("ul#to-eat").empty();
    $("ul#to-watch").empty();
    $("ul#to-read").empty();
    $("ul#to-buy").empty();
    $("ul#uncategorized").empty();
    renderLists(lists);
  });

  $("form#new-list-item").on("submit", function(event) {
    event.preventDefault();

    var input = $(this).children("input");
    var todoText = input.serialize();

    function fakeCategorize () {
      var categories = ["To Eat", "To Buy", "To Watch", "To Read", null];
      var functionCategory = categories[Math.floor(Math.random()*categories.length)]
      return functionCategory;
    }

    var category = fakeCategorize()

    $.post('/todos', todoText).done(function(lists) {
      addToList(category, input.val());
      input.val("");

    });
  });
});
