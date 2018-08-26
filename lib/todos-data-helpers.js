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

    createTodoObject: function(todoName, userId) {
      // const apiResult = getApiResult();
      const category = google_api.categorize(todoName);

      // const category = createCategory(apiResult);
      const todo = {
        name: todoName,
        user_id: userId,
        category: category, // Change to category
        is_complete: false,
      }
      return todo;
    }
  };
}
