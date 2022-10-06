import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("accounts", function (table) {
    table.increments("id");
    table
      .integer("user_id")
      .unsigned()
      .index()
      .references("id")
      .inTable("users");
    table.float("available_balance", 2).defaultTo(0);
    table.float("book_balance", 2).defaultTo(0);
    table.float("total_credit", 2).defaultTo(0);
    table.float("total_debit", 2).defaultTo(0);
    table.boolean("isActive").defaultTo(true);
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("accounts");
}
