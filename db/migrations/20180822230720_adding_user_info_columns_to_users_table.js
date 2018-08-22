exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    table.string('email');
    table.string('password');
    table.string('avatar');
    table.string('favorite_food');
    table.string('description');
  });
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('email');
    table.dropColumn('password');
    table.dropColumn('avatar');
    table.dropColumn('favorite_food');
    table.dropColumn('description');
  });
}
