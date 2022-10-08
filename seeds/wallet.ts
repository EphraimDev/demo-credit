import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("wallets").insert([{ nuban: "0000000001" }]);
};
