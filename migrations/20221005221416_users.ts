import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("phone_number", 255).notNullable().unique();
    table.string("password", 255).nullable();
    table.boolean("is_verified").defaultTo(true);
    table.boolean("is_blocked").defaultTo(false);
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
