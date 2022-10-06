import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
  TEST_DB_DIALECT,
  TEST_DB_HOST,
  TEST_DB_NAME,
  TEST_DB_PASSWORD,
  TEST_DB_USER,
  TEST_DB_PORT,
} = process.env;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: DB_DIALECT,
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
  },

  test: {
    client: TEST_DB_DIALECT,
    connection: {
      host: TEST_DB_HOST,
      port: Number(TEST_DB_PORT),
      user: TEST_DB_USER,
      password: TEST_DB_PASSWORD,
      database: TEST_DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: DB_DIALECT,
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
