import Knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../../knexfile";

dotenv.config();

const { NODE_ENV } = process.env;

// const initializeDB = () => {
//   if(!NODE_ENV) throw new Error("NODE_ENV is not set")
//   const knex = Knex(knexConfig[NODE_ENV]);
//   try {
//     knex.raw("SELECT now()");
//     console.log(`⚡️[Database]: Database successfully connected`);
//     return knex;
//   } catch (error:any) {
//     console.log(error.message);
//   }
// };
const conn = Knex(knexConfig[NODE_ENV || "production"]);
export default conn;
