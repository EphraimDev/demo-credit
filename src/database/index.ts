import dbConn from "./connect";

/**
 * @typedef {Object} User
 *
 * @returns {Knex.QueryBuilder<User, {}>}
 */
const User = () => dbConn("users");

/**
 * @typedef {Object} Account
 *
 * @returns {Knex.QueryBuilder<Account, {}>}
 */
const Account = () => dbConn("wallets");

/**
 * @typedef {Object} Transaction
 *
 * @returns {Knex.QueryBuilder<Transaction, {}>}
 */
const Transaction = () => dbConn("transactions");

export { User, Account, Transaction };
