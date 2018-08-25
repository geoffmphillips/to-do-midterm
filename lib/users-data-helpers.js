module.exports = function usersDataHelpers(db) {
  return {

    saveUser: function (user, cb) {
      db('users').insert(
        {
          email: user.email,
          password: user.password,
        }
      ).asCallback(cb)
    },

    updateUser: function(email, cb) {
      db.select("id").from("users").where({email: `${email}`})
        .asCallback(cb);
    },

    getUserByEmail: function(email, cb) {
      db.first("id").from("users").where({email: email})
        .asCallback(cb);
    },

  };
}
