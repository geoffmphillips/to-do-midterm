const google_api = require('./google_api');

module.exports = function todosDataHelpers(db) {
  return {
    saveTodo: async function(todo, cb) {
      let resolvedTodo = await todo;
      db('todos').insert(
        { name: resolvedTodo.name,
          category: resolvedTodo.category,
          is_complete: false,
          user_id: resolvedTodo.user_id,
        }
      ).asCallback(cb)
    },

    updateTodoById: function(todo, cb) {
      db('todos').where({id: todo.id}).update({
        category: todo.category
      }).asCallback(cb);
    },

    deleteTodoById: function(id, cb) {
      db('todos').where({id: id}).del()
      .asCallback(cb);
    },

    getTodosByUserId: function(userid, cb) {
      db.select().from('todos').where({user_id: userid})
        .asCallback(cb);
    },

    createCategory: async function(todo) {
      const category = await google_api.suggestCategory(todo);
      console.log(category);
      return category;
    },

    createTodoObject: async function(userId, todoText) {
      const multipliedText = this.multiplyWords(todoText);

      const todo = {
        name: todoText,
        user_id: userId,
        category: await this.createCategory(multipliedText),
        is_complete: false,
      }
      console.log("TODO OBJ: ", todo);
      console.log("TODO CATEGORY: ", todo.category);
      return todo;
    },

    fakeCategorize: function(todoText) {
      let output = "";
      let firstWord = todoText.toLowerCase().split(' ')[0];
      if (todoText.toLowerCase().split(' ')[0] = "the") {
        firstWord = todoText.toLowerCase().split(' ')[1];
      }
      switch (firstWord) {
        case "watch":
        case "hunger":
        case "godfather":
        case "casablanca":
        case "avengers":
          output = "To Watch";
          break;
        case "eat":
        case "taqueria":
        case "tacofino":
        case "pizza":
        case "burger":
        case "chiptole":
        case "mcdonald\'s":
        case "tim":
        case "timmy\'s":
          output = "To Eat";
          break;
        case "read":
        case "slaughterhouse":
        case "bible":
        case "coding":
          output = "To Read";
          break;
        case "buy":
        case "groceries":
        case "dog":
          output = "To Buy";
          break;
        default:
          output = null;
          break;
      }
      return output;
    },

    multiplyWords: function(todo) {
      let extendedTodoString;
      let splitString = todo.split(' ');
      let originalTodoLength = splitString.length;

      if (splitString.length < 20) {
        let wordsRemaining = 20 - splitString.length;

        for (var i = 0; i < wordsRemaining; i++) {
          splitString.push(splitString[i]);

          if (splitString.length === 20) {
            extendedTodoString = splitString.join(' ');
            return extendedTodoString;
          } else if (i === originalTodoLength - 1) {
            i = -1;
          }
        }
      } else {
        return todo;
      }
    }

  };
}
