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
      return todo;
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
