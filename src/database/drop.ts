import conn from "./connect";

const dropTables = async () => {
  try {
    await conn.schema.dropTableIfExists("transactions");
    await conn.schema.dropTableIfExists("wallets");
    await conn.schema.dropTableIfExists("users");
    await conn.schema.dropTableIfExists("knex_migrations");
    await conn.schema.dropTableIfExists("knex_migrations_lock");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

dropTables();
