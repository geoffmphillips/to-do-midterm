exports.up = function(knex, Promise) {
  return knex.schema.alterTable('todos', function(table) {
    table.string('category');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('todos', function(table) {
    table.dropColumn('category');
  });
};
