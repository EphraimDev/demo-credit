import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("accounts", function (table) {
    table.increments("id");
    table
      .integer("user_id")
      .unique()
      .unsigned()
      .index()
      .references("id")
      .inTable("users");
    table.string("available_balance", 255).defaultTo(0);
    table.string("book_balance", 255).defaultTo(0);
    table.string("total_credit", 255).defaultTo(0);
    table.string("total_debit", 255).defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("accounts");
}
