module.exports = function todosDataHelpers(db) {
  return {
    saveToDo: function(todo, cb) {
      db('todos').insert(
        { name: todo.name,
          category: todo.category,
          is_complete: false,
          user_id: todo.user_id,
        }
      ).asCallback(cb)
    },

    getTodosByUserId: function(userid, cb) {
      db.select().from('todos').where({user_id: userid})
        .asCallback(cb);
    }
  };
}
