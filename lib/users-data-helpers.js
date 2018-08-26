module.exports = function usersDataHelpers(db) {
  return {

    saveUser: function (user, cb) {
      db('users').insert(
        {
          email: user.email,
          password: user.password,
        }
      ).asCallback(cb);
    },

    getUserIdByEmail: function(email, cb) {
      db.first("id").from("users").where({email: email})
        .asCallback(cb);
    },

    getUserByEmail: function(email, cb) {
      db.select().from("users").where({email: email})
        .asCallback(cb);
    },

    updateUserByEmail: function(email, user, cb) {
      db("users").where({email: email}).update({
        avatar: user.avatar,
        name: user.name,
        password: user.password,
        favorite_food: user.favorite_food,
        description: user.description,
      }).asCallback(cb);
    }

  };
}
