exports.up = function(knex, Promise) {
  return knex.schema.alterTable('todos', function(table) {
    table.string('form_id', 6);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('todos', function(table) {
    table.dropColumn('form_id');
  });
};
