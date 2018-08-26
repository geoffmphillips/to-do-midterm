const google_api = require('./google_api');

module.exports = function todosDataHelpers(db) {
  return {
    saveTodo: function(todo, cb) {
      db('todos').insert(
        { name: todo.name,
          category: todo.category,
          is_complete: false,
          user_id: todo.user_id,
        }
      ).asCallback(cb)
    },

    updateTodo: function(todo, cb) {
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

    createTodoObject: function(extendedTodo, userId, originalTodo) {
      const category = google_api.categorize(extendedTodo);

      // const category = createCategory(apiResult);
      const todo = {
        name: originalTodo,
        user_id: userId,
        category: category, // Change to category
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
      }
    },
  };
}
