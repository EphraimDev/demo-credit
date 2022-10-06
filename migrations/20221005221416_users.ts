import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("phone_number", 100).nullable();
    table.string("password", 100).nullable();
    table.string("token", 255).nullable();
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
