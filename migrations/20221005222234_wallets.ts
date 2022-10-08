import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("wallets", function (table) {
    table.increments("id");
    table
      .integer("user_id")
      .unsigned()
      .index()
      .references("id")
      .inTable("users")
      .nullable();
    table.string("nuban", 255).unique().notNullable();
    table.string("available_balance", 255).defaultTo(0);
    table.string("book_balance", 255).defaultTo(0);
    table.enum("status", ["ACTIVE", "INACTIVE", "PND", "PNC"]).defaultTo("ACTIVE");
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("accounts");
}
