import Knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../../knexfile";

dotenv.config();

const { NODE_ENV } = process.env;

const conn = Knex(knexConfig[NODE_ENV || "production"]);
export default conn;
