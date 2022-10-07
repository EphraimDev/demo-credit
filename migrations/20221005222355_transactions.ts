import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", function (table) {
    table.increments("id");
    table
      .integer("from_account")
      .unsigned()
      .index()
      .references("id")
      .inTable("accounts")
      .nullable();
    table
      .integer("to_account")
      .unsigned()
      .index()
      .references("id")
      .inTable("accounts");
    table.string("amount", 255).notNullable();
    table
      .enu("status", ["PENDING", "COMPLETED", "FAILED"])
      .defaultTo("PENDING");
    table
      .enu("type", ["FUNDING", "TRANSFER"]);
    table.string("ref", 255).notNullable();
    table.string("comment", 255).nullable();
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}