exports.up = function(knex, Promise) {
  return knex.schema.createTable('todos', function (table) {
    table.increments();
    table.string('name');
    table.boolean('is_complete');
    table.integer('user_id')
      .references('id')
      .inTable('users');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('todos');
};
